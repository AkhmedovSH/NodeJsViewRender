$(function() {
  var i = !0;
  $('.switch-button').on('click', function(o) {
    o.preventDefault(),
      i
        ? ((i = !1), $('.register').show('slow'), $('.login').hide())
        : ((i = !0), $('.login').show('slow'), $('.register').hide());
  });

  var editor = new MediumEditor('#post-body', {
    placeholder: {
      text: '',
      hideOnClick: true
    }
  });
});
