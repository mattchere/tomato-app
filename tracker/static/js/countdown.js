$(document).ready(function() {
  
  $.get(
    '/api/v1/countdowns/',
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

  $('#add-countdown').submit(function(e) {
    
    e.preventDefault();

    setCSRFToken();

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: createCountdown($(this).serializeArray()),
      success: function(data) {
        location.reload();
      }
    });

  })
  

  function daysUntil(date) {
    var today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
    return Math.floor((date-today) / (1000*60*60*24));
  }

  
  function createCountdown(array) {
    var obj = {};
    array.forEach(function(item) {
      obj[item.name] = item.value;
    });
    return obj;
  }


  function setCSRFToken() {
    // using jQuery
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
  }

  
});