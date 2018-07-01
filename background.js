var regex = /mercurymessagesCountValue".(\d+)<\/span/

function getNofiticationCount(html) {
	var match = regex.exec(html);

	if (match && match[1]) {
		return match[1];
	}

	return null
}

function updateBadge() {
	fetch('https://facebook.com', {credentials: "same-origin"})
		.then(res => res.text())
		.then(html => {
			var count = getNofiticationCount(html);

			if (count == null) {
				chrome.browserAction.setBadgeBackgroundColor({color:[150, 150, 150, 230]});
    			chrome.browserAction.setBadgeText({text:"?"});
    			chrome.browserAction.setTitle({title: 'Bạn chưa đăng nhập facebook'});

    			return;
			}

			var text = count > 9 ? '9+' : count;
			var title = 'Bạn có ' + count + ' tin nhắn mới';

			if (count == 0) {
				text = '';
				title = 'Không có tin nhắn mới'
			}

			chrome.browserAction.setBadgeBackgroundColor({color:[255, 44, 51, 255]});
			chrome.browserAction.setBadgeText({text});	
			chrome.browserAction.setTitle({title});
		})
		.catch((e) => {
			chrome.browserAction.setBadgeBackgroundColor({color:[255, 87, 34, 255]});
			chrome.browserAction.setBadgeText({text: 'Err'});	
			chrome.browserAction.setTitle({title: 'Không thể kết nối đến Facebook'});	
		});;
}

chrome.browserAction.setTitle({title: 'Bạn chưa đăng nhập facebook'});
chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.create({url: 'https://messenger.com'}, function(tab) {});
});

chrome.contextMenus.create({
	"title": "Cập nhật",
	"contexts": ["browser_action"],
	"onclick": function (info, tab) {
		updateBadge();
	}
});

updateBadge();

setInterval(() => {
	updateBadge();
}, 30000)
