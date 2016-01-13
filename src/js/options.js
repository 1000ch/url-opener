$(() => {
  const chromeStorage = chrome.storage.sync;
  const dataKey = 'urlopener_data';
  let data = [];

  const $url = $('#js-url');
  const $pinned = $('#js-pinned');
  const $save = $('#js-save');
  const $form = $('#js-form');
  const $urls = $('#js-urls');

  new Slip($urls.get(0));

  $urls.on('slip:swipe', e => {
    const $li = $(e.originalEvent.target);
    const url = $li.attr('data-url');

    data = data.filter(item => item.url !== url);

    chromeStorage.set({'urlopener_data': data}, () => {
      e.target.parentNode.removeChild(e.originalEvent.target);
    });
  });

  $urls.on('slip:reorder', e => {
    e.target.parentNode.insertBefore(
      e.originalEvent.target,
      e.originalEvent.detail.insertBefore
    );

    const url = $(e.originalEvent.target).attr('data-url');
    const order = e.originalEvent.detail.spliceIndex;
    const $list = $urls.find('li');

    data.forEach(item => {
      if (url === item.url) {
        item.order = order;
      } else {
        item.order = $list.index($list.filter('[data-url="' + item.url + '"]').get(0));
      }
    });

    chromeStorage.set({'urlopener_data': data});
  });

  $save.on('click', () => {
    $form.trigger('submit');
  });

  $form.on('submit', e => {
    if (!Array.isArray(data)) {
      data = [];
    }

    data.push({
      url: $url.val(),
      pinned: $pinned.prop('checked'),
      order: data.length
    });

    chromeStorage.set({'urlopener_data': data}, () => {
      renderItem(data);
      $url.val('');
      $pinned.prop('checked', false);
    });
  });

  $urls.on('click', '.js-pin', e => {
    const $li = $(e.originalEvent.target).toggleClass('is-pinned').closest('li');
    const url = $li.attr('data-url');

    data.forEach(item => {
      if (url === item.url) {
        item.pinned = !item.pinned;
      }
    });

    chromeStorage.set({'urlopener_data': data});
  });

  $urls.on('click', '.js-del', e => {
    const $li = $(e.originalEvent.target).closest('li');
    const url = $li.attr('data-url');

    data = data.filter(item => item.url !== url);
    chromeStorage.set({'urlopener_data': data}, () => {
      $li.remove();
    });
  });

  function renderItem(items) {
    const list = [];

    items = items.sort((a, b) => (a.order || 0) > (b.order || 0));
    items.forEach(item => {
      const li =
        '<li class="list-group-item" data-url="' + item.url + '">' +
          '<span class="js-pin glyphicon glyphicon-pushpin' + (item.pinned ? ' is-pinned' : '') + '"></span>' +
          '<a style="margin-left: 10px;" href="' + item.url + '">' + item.url + '</a>' +
          '<span class="js-del glyphicon glyphicon-bars pull-right"></span>' +
          '<span class="js-del glyphicon glyphicon-trash pull-right"></span>' +
        '</li>';
      list.push(li);
    });
    $urls.html(list);
  }

  chromeStorage.get(dataKey, items => {
    data = items[dataKey];
    if (!Array.isArray(data)) {
      data = [];
    }
    renderItem(data);
  });
});
