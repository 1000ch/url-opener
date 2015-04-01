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
  var protocol = /^[^:]+(?=:\/\/)/;

  chromeStorage.get(dataKey, function(items) {

    var array = items[dataKey];

    if (!Array.isArray(array)) {
      array = [];
    }

    chrome.tabs.query({}, function (tabs) {

      var openedTabs = {};
      var openedUrls = [];

      tabs.forEach(function (tab) {
        var url = tab.url.replace(protocol, '');
        openedTabs[url] = tab.id;
        openedUrls.push(url);
      });

      array.forEach(function (item) {

        var url = item.url.replace(protocol, '');
        var target;

        if (openedUrls.some(function (openedUrl) {

          if (openedUrl.indexOf(url) !== -1) {
            target = openedUrl;
            return true;
          } else {
            return false;
          }

        })) {
          //　item.url is already opened
          console.log(target, item.index);

          var tabId = openedTabs[target];

          chrome.tabs.update(tabId, {
            pinned: item.pinned
          });

          if (Number.isInteger(item.index)) {
            chrome.tabs.move(tabId, {
              index: item.index
            });
          }

        } else {
          // item.url is not opened yet

          if (Number.isInteger(item.index)) {

            chrome.tabs.create({
              url: item.url,
              pinned: item.pinned,
              index: item.index
            });

          } else {

            chrome.tabs.create({
              url: item.url,
              pinned: item.pinned
            });

          }

          openedUrls.push(item.url.replace(protocol, ''));
        }
      });
    });
  });
});