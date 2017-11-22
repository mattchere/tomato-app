$(document).ready(function() {
  var countdowns;
  $.get(
    '/api/v1/countdowns',
    function(data) {
      data.forEach(function(countdown) {
        var splitDate = countdown.due.split('-');
        var dateDue = new Date(
          splitDate[0], 
          splitDate[1]-1, 
          splitDate[2]
        );
        $('.countdown-list').append(
          '<p class="countdown-item">' +
          countdown.title +
          ' ' +
          daysUntil(dateDue) +
          '</p>'
        )
      })
    }
  )
  
  function daysUntil(date) {
    var today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
    return Math.floor((date-today) / (1000*60*60*24));
  }
  
});