(function timerMain() {
  var tomatoTime = 25;
  var breakTime = 5;
  var longBreakTime = 30;
  var longDelay = 4;
  var currDuration = tomatoTime;
  var mins = tomatoTime;
  var secs = 60;
  var isTomato = true;
  var isStart = true;
  var compTomatoes = 0;
  var audio = new Audio('solemn.mp3')

  var interval$ = Rx.Observable
    .interval(100)
    .timeInterval()
    .map(function(obj) { return obj.interval })
    .scan(function(x, y) { return x + y })
    .map(function(x) { return Math.floor(x / 1000) })
    .distinctUntilChanged()

  var play$ = Rx.Observable
    .fromEvent($('.timer'), 'click')
    .map(function(x) { return true })
    .scan(function(x, y) { return !x })

  var playSubscription = play$
    .subscribe(function(val) {
      var text = isTomato ? 'Tomato Time!' : 'Break Time!';
      $('.heading').text(text);
      if (isStart) {
        isStart = false;
        currDuration = tomatoTime;
      }
      if (val) {
        interval$
          .takeUntil(Rx.Observable.fromEvent($('.timer'), 'click'))
          .subscribe(runTimer)
      }
    })
  
  $('#tomato-duration').on('change', function(e) {
    tomatoTime = $(this).val();
    if (isStart) {
      mins = tomatoTime;
      $('.timer p').text(`${formatDigit(mins)}:00`)
    }
  });
  
  $('#break-duration').on('change', function(e) {
    breakTime = $(this).val();
  });
  
  $('#long-break-duration').on('change', function(e) {
    longBreakTime = $(this).val();
  });
  
  $('#long-delay').on('change', function(e) {
    longDelay = $(this).val();
  });
  
  function runTimer() {
    showTime();
    decTimer();
  }

  function decTimer() {
    if (secs === 0 || secs === 60) {
      mins--;
      secs = 59;
    }
    else {
      secs--;
    }
    if (mins < 0) {
      completeTimer();
    }
  }

  function showTime() {
    var currTime = `${formatDigit(mins)}:${formatDigit(secs === 60 ? 0 : secs)}`;
    $('.timer p').text(currTime);
  }

  function completeTimer() {
    audio.play();
    if (isTomato) {
      compTomatoes++;
      postTomato(getTomatoData());
    }
    isTomato = !isTomato;
    mins = isTomato ?
           tomatoTime-1 :
           (compTomatoes % longDelay === 0 ? longBreakTime-1 : breakTime-1);
    secs = 59;
    currDuration = mins;
  }
  
  function addTimeOptions() {
    for (var i=1; i<=120; i++) {
      $('.setting').append(
        `<option value="${i}">${i}</option>`
      )
    }
    $('#tomato-duration option[value="25"]').prop('selected', true)
    $('#break-duration option[value="5"]').prop('selected', true)
    $('#long-break-duration option[value="30"]').prop('selected', true)
    $('#tomato-set option[value="4"]').prop('selected', true)
  }
  
  addTimeOptions();
  
  /**
   * Returns the given number as a string, formatted to be two digits.
   * @param {number} n - The number to be formatted
   */
  function formatDigit(n) {
    return n > 9 ? '' + n : '0' + n;
  }
  
  function getTomatoData() {
    return {
      title: '',
      duration: `${currDuration}:00`
    }
  }
  
  function postTomato(tomato) {
    setCSRFToken();
    $.ajax({
      type: 'POST',
      url: '/api/v1/tomatoes/', 
      data: tomato,
    });
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
  
  
})();