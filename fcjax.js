var noop = function() {};

var fcjax = function(formSelector, blockSelector, handlers) {
  handlers = handlers instanceof Object ? handlers : {};

  var replaceBlocks = function(html) {
    var bodyMatches = /<body[^>]*>([\s\S.]*)<\/body>/i.exec(html);
    if (!(bodyMatches)) {
      return;
    }

    var title;
    // get title
    var headMatches = /<head[^>]*>([\s\S.]*)<\/head>/i.exec(html);
    if (headMatches) {
      var headNode = document.createElement('head');
      headNode.innerHTML = headMatches[1];
      var titleNode = headNode.querySelector('title');
      if (titleNode) {
        title = titleNode.textContent.trim();
      }
    }
    title = title || document.title;

    // Set page title as new page title
    document.title = title;

    var bodyNode = document.createElement('body');
    bodyNode.innerHTML = bodyMatches[1];
    var newBlocks = bodyNode.querySelectorAll(blockSelector);
    newBlocks.forEach(function(newBlock) {
      var id = newBlock.getAttribute('id');
      if (!(id)) return;

      var oldBlock = document.getElementById(id);
      if (!(oldBlock)) return;

      var newScripts = newBlock.querySelectorAll('script');
      // detach scripts
      newScripts.forEach(function(script) {
        script.parentNode.removeChild(script);
      });
      // replace with new block
      oldBlock.parentNode.replaceChild(newBlock, oldBlock);
      // reattach scripts
      newScripts.forEach(function(script) {
        var ns = document.createElement('script');
        for (var att, i = 0, atts = script.attributes, n = atts.length; i < n; i++) {
          att = atts[i];
          ns.setAttribute(att.nodeName, att.nodeValue);
        }
        ns.textContent = script.textContent;
        newBlock.appendChild(ns);
      });
    });
  };

  var submitForm = function(form) {
    var method = form.method.toUpperCase();
    var url = form.action;
    var formData = new FormData(form);

    if (method == 'GET') {
      var parameters = []
      for (var pair of formData.entries()) {
        parameters.push(
          encodeURIComponent(pair[0]) + '=' +
          encodeURIComponent(pair[1])
        );
      }
      url += (url.indexOf('?') == -1 ? '?' : '&') + parameters.join('&');
    }

    form.xhr.abort();
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onprogress = function(xhrEvent) {
      if (handlers.onProgress instanceof Function) {
        handlers.onProgress(xhrEvent, xhr);
      }
      if (handlers.onAlways instanceof Function) {
        handlers.onAlways();
      }
    };

    xhr.onload = function(xhrEvent) {
      var isContinue = true;
      if (handlers.onLoaded instanceof Function) {
        isContinue = handlers.onLoaded(xhr) !== false;
      }
      if (isContinue) {
        replaceBlocks(xhr.responseText);
        if (handlers.onDone instanceof Function) {
          handlers.onDone(xhr);
        }
        if (handlers.onAlways instanceof Function) {
          handlers.onAlways();
        }
      }
    };

    xhr.onerror = function(xhrEvent) {
      if (handlers.onError instanceof Function) {
        handlers.onError(xhr);
      }
      if (handlers.onAlways instanceof Function) {
        handlers.onAlways();
      }
    };

    if (method == 'GET') {
      xhr.send();
    } else {
      xhr.send(formData);
    }
    form.xhr = xhr;
  };



  var forms = document.querySelectorAll(formSelector);
  forms.forEach(function(form) {
    form.xhr = { abort: noop };
    form.onsubmit = function(submitEvent) {
      submitEvent.preventDefault();
      setTimeout(function() {
        if (handlers.onSubmit instanceof Function) {
          if (handlers.onSubmit(submitEvent, form) === false) {
            return;
          }
        }
        submitForm(form);
      }, 1);
      return false;
    };
  });
};
