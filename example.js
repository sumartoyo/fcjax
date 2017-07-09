fcjax('#my-form', '.fcjaxify', {
  onSubmit: function(xhrEvent, formElement) {
    document.body.style.filter = 'blur(2px)';
  },
  onAlways: function() {
    document.body.style.filter = '';
  },
});
