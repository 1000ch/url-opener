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

    data = items[dataKey];

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

        if (!openedUrls.some(function (openedUrl) {

          var protocol = /^[^:]+(?=:\/\/)/;
          var isOpened = openedUrl.indexOf(item.url.replace(protocol, '')) !== -1;
          var tabId = openedTabs[openedUrl];

          if (isOpened) {
            chrome.tabs.update(tabId, {
              pinned: item.pinned
            });

            chrome.tabs.move(tabId, {
              index: item.index
            });
          }

          return isOpened;

        })) {
          chrome.tabs.create({
            url: item.url,
            pinned: item.pinned,
            index: item.index
          });
        }
      });
    });
  });
});