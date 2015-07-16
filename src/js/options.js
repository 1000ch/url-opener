$(function () {

  var chromeStorage = chrome.storage.sync;
  var dataKey = 'urlopener_data';
  var data = [];

  var $url = $('#js-url');
  var $pinned = $('#js-pinned');
  var $save = $('#js-save');
  var $form = $('#js-form');
  var $urls = $('#js-urls');

  new Slip($urls.get(0));

  $urls.on('slip:swipe', function(e) {

    var $li = $(e.originalEvent.target);
    var url = $li.attr('data-url');

    data = data.filter(function (item) {
      return (item.url !== url);
    });

    chromeStorage.set({'urlopener_data': data}, function () {
      e.target.parentNode.removeChild(e.originalEvent.target);
    });
  });

  $urls.on('slip:reorder', function(e) {

    e.target.parentNode.insertBefore(e.originalEvent.target, e.originalEvent.detail.insertBefore);

    var url = $(e.originalEvent.target).attr('data-url');
    var order = e.originalEvent.detail.spliceIndex;
    var $list = $urls.find('li');

    data.forEach(function (item) {
      if (url === item.url) {
        item.order = order;
      } else {
        item.order = $list.index($list.filter('[data-url="' + item.url + '"]').get(0));
      }
    });

    chromeStorage.set({'urlopener_data': data});
  });

  $save.on('click', function () {
    $form.trigger('submit');
  });

  $form.on('submit', function (e) {

    if (!Array.isArray(data)) {
      data = [];
    }

    data.push({
      url: $url.val(),
      pinned: $pinned.prop('checked'),
      order: data.length
    });

    chromeStorage.set({'urlopener_data': data}, function () {
      renderItem(data);
      $url.val('');
      $pinned.prop('checked', false);
    });
  });

  $urls.on('click', '.js-pin', function () {

    var $li = $(this).toggleClass('is-pinned').closest('li');
    var url = $li.attr('data-url');

    data.forEach(function (item) {
      if (url === item.url) {
        item.pinned = !item.pinned;
      }
    });

    chromeStorage.set({'urlopener_data': data});
  });

  $urls.on('click', '.js-del', function () {
    var $li = $(this).closest('li');
    var url = $li.attr('data-url');

    data = data.filter(function (item) {
      return (item.url !== url);
    });

    chromeStorage.set({'urlopener_data': data}, function () {
      $li.remove();
    });
  });

  function renderItem(items) {

    items = items.sort(function (a, b) {
      return (a.order || 0) > (b.order || 0);
    });

    var list = [];
    items.forEach(function (item) {
      var li =
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

  chromeStorage.get(dataKey, function(items) {

    data = items[dataKey];

    if (!Array.isArray(data)) {
      data = [];
    }

    renderItem(data);
  });
});
