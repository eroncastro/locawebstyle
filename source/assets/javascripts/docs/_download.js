var locastyle = locastyle || {};

locastyle.download = (function() {
  'use strict';

  function init(){
    $('[data-ls-module="download"]').on('click', function(e){
      e.preventDefault();
      if($('input[type="checkbox"]').is(':checked')){
        var fileName = $('input[type="checkbox"]').val().match(/_?([^\/]+)\.[\w]+$/)[1];
        createGist($('input[type="checkbox"]').map(function(){ return this.value }).toArray(), '')
      }
    })
  }

  function createGist(configJson, callback) {
    var configData = getCustomizerData()
    configJson = JSON.stringify(configData, null, 2);
    var data, i;
    for(i = 0; i < configData.js.length; i++){
      var fileJSName = configData.js[i].split('/').pop();

      $.get(configData.js[i], function(data){
        var filesObj = {};
        filesObj.files = {};
        filesObj.files[fileJSName] = {content: data}

        // sendToGist(filesObj)
      })

    }

  }

  function sendToGist(data){
    $.ajax({
      url: 'https://api.github.com/gists',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data)
    })
    .success(function (result) {
      var origin = window.location.protocol + '//' + window.location.host
      var newUrl = origin + window.location.pathname + '?id=' + result.id
      history.replaceState(false, document.title, newUrl)
      $(".download-done").html(
        '<a class="ls-btn ls-btn-lg ls-btn-block" href="https://gist.github.com/anonymous/'
          + result.id +
        '/download">download</a>'
      )
    })
  }

  function getCustomizerData(){
    var data = {
      css: $('.css-modules input:checked').map(function(){
        return this.value
      }).toArray(),
      js : $('.js-modules input:checked').map(function(){
        return this.value
      }).toArray()
    }

    if ($.isEmptyObject(data.vars) && !data.css.length && !data.js.length) return
      return data
  }

  return {
    init: init
  }

}());