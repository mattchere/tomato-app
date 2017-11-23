$(document).ready(function() {
  var tomatoTime = 25;
  var breakTime = 5;
  var currMin = tomatoTime;
  var currSec = 0;
  var tomato = true;
  var pause = true;
  var interval;

  /**
   * Formats the timer to have the correct background color
   * and show the correct text based on the given minutes
   * and seconds.
   * @param {number} min - The number of minutes to show
   * @param {number} sec - The number of seconds to show
   * @param {boolean} tomato - True if currently a tomato
   */
  function showTimer(min, sec, tomato) {
    if (tomato) {
      $(".timer").css("background-color", "#fff");
    }
    else {
      $(".timer").css("background-color", "#44477F");
    }
    $('.timer p').text(formatDigit(min) + ":" + formatDigit(sec));
  }

  // Shows the initial timer
  showTimer(currMin, currSec, tomato);
  
  /**
   * Returns the new min and sec after decrementing,
   * accounting for changes in minutes, and for switching to/from
   * a break.
   * @param {number} min - The current minute of the timer
   * @param {number} sec - The current second of the timer
   */
  function decTimer(min, sec) {
    if (sec == 0) {
      if (min == 0) {
        return changeTimer(min, sec);
      }
      return [min-1, 59];
    }
    return [min, sec-1];
  }

  /**
   * Takes the minutes and seconds to change, and toggles
   * to/from a break, adjusting the tomato switch and
   * returning the new minutes and seconds. If a tomato
   * has been completed, calls addTomato to update the
   * back-end.
   * @param {number} min - The current minutes to change
   * @param {number} sec - The current seconds to change
   */
  function changeTimer(min, sec) {
    if (tomato) {
      tomato = false;

      addTomato();

      return [breakTime-1, 59];
    }
    else {
      tomato = true;
      return [tomatoTime-1, 59];
    }
  }

  /**
   * Returns a JavaScript object used to post data to the
   * server when creating a tomato.
   */
  function createTomato() {
    return {
      task: ''
    }
  }

  /**
   * Decrements the timer once per call.
   */
  function timer() {
    [currMin, currSec] = decTimer(currMin, currSec);
    showTimer(currMin, currSec, tomato);
  }

  /**
   * Returns the given number as a string, formatted to be two digits.
   * @param {number} n - The number to be formatted
   */
  function formatDigit(n) {
    return n > 9 ? '' + n : '0' + n;
  }

  /**
   * Sets a click handler for the timer that toggles pause
   * on the timer.
   */
  $('.timer').on('click', function() {
    if (pause) {
      pause = false;
      interval = setInterval(timer, 1000);
    }
    else {
      pause = true;
      clearInterval(interval);
    }
  });

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

  function addTomato() {
    setCSRFToken();
    $.ajax({
      type: 'POST',
      url: '/api/v1/tomatoes/', 
      data: createTomato()
    });
  }

});