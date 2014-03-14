document.addEventListener('DOMContentLoaded', function () {

  var chromeStorage = chrome.storage.sync;
  var dataKey = 'urlopener_data';
  var data = [];

  var $url = $('#js-url');
  var $pinned = $('#js-pinned');
  var $save = $('#js-save');
  var $urls = $('#js-urls');

  $save.on('click', function () {
    if (!Array.isArray(data)) {
      data = [];
    }
    data.push({
      url: $url.val(),
      pinned: $pinned.prop('checked')
    });
    chromeStorage.set({'urlopener_data': data}, function () {
      console.log(data);
      renderItem(data);
    });
  });

  $urls.on('click', '.btn-danger', function () {
    var $this = $(this);
    var $tr = $this.parents('tr');
    var url = $tr.find('.js-url').text();

    data = data.filter(function (item) {
      return (item.url !== url);
    });

    chromeStorage.set({'urlopener_data': data}, function () {
      $tr.remove();
    });
  });
  
  function renderItem(args) {
    args = Array.isArray(args) ? args : [];
    var list = [];
    args.forEach(function (item) {
      var tr =
        '<tr class="js-item">' +
          '<td style="vertical-align: middle;" class="js-url"><a href="' + item.url + '" target="_blank">' + item.url + '</a></td>' +
          '<td style="vertical-align: middle;"><input type="checkbox" disabled ' + (item.pinned ? 'checked' : '') + '></td>' +
          '<td style="vertical-align: middle;">' +
            '<button class="btn btn-danger btn-lg pull-right"><i class="glyphicon glyphicon-remove"></i> Delete</button>' +
          '</td>' +
        '</tr>';
      list.push(tr);
    });
    $urls.find('tr').filter('.js-item').remove();
    $urls.append(list);
  }

  chromeStorage.get(dataKey, function(items) {
    data = Array.isArray(items[dataKey]) ? items[dataKey] : [];
    renderItem(data);
  });
});