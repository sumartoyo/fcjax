fcjax('#my-form', '.fcjaxify', {
  onSubmit: function(xhrEvent, form) {
    document.body.style.filter = 'blur(2px)';
  },
  onAlways: function() {
    setTimeout(function() {
      document.body.style.filter = '';
    }, 500);
  },
});
