if (!String.prototype.contains) {
  String.prototype.contains = function (value, index) {
    return (this.indexOf(value, index | 0) !== -1);
  };
}

// launch options.html on installation
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install'){
    chrome.tabs.create({'url': '/html/options.html'});
  }
});

// open urls on icon clicked
chrome.browserAction.onClicked.addListener(function () {

  var chromeStorage = chrome.storage.sync;
  var dataKey = 'urlopener_data';

  chromeStorage.get(dataKey, function(items) {

    data = items[dataKey] || {};
    if (!Array.isArray(data)) {
      data = [];
    }

    chrome.tabs.query({}, function (result) {
      var openedTabs = {};
      var openedUrls = [];
      result.forEach(function (tab) {
        openedTabs[tab.url] = tab.id;
        openedUrls.push(tab.url);
      });
      data.forEach(function (item) {
        if (openedUrls.every(function (openedUrl) {
          return !openedUrl.contains(item.url)
        })) {
          chrome.tabs.create({
            url: item.url,
            pinned: item.pinned
          });
        } else {
          var tabId = openedTabs[item.url];
          chrome.tabs.update(tabId, {
            pinned: item.pinned
          });
        }
      });
    });
  });

});