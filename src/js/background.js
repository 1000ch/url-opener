// launch options.html on installation
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install'){
    chrome.tabs.create({'url': '/html/options.html'});
  }
});

// open urls on icon clicked
chrome.browserAction.onClicked.addListener(() => {
  const chromeStorage = chrome.storage.sync;
  const dataKey = 'urlopener_data';
  const protocol = /^[^:]+(?=:\/\/)/;

  chromeStorage.get(dataKey, items => {
    let array = items[dataKey];

    if (!Array.isArray(array)) {
      array = [];
    }

    chrome.tabs.query({}, tabs => {
      let openedTabs = {};
      let openedUrls = [];

      tabs.forEach(tab => {
        let url = tab.url.replace(protocol, '');
        openedTabs[url] = tab.id;
        openedUrls.push(url);
      });

      array.forEach(item => {
        let url = item.url.replace(protocol, '');
        let target;

        if (openedUrls.some(openedUrl => {
          if (openedUrl.indexOf(url) !== -1) {
            target = openedUrl;
            return true;
          } else {
            return false;
          }
        })) {
          //　item.url is already opened
          console.log(target, item.index);

          let tabId = openedTabs[target];
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
