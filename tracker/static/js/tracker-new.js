$(document).ready(function() {
  var mins = 25;
  var pausedSecs = 0;
  var tomatoTime = 25;
  var breakTime = 5;
  var tomatoSet = 4;
  var elapsed = 0;
  var interval;
  var isPaused = true;
  var isStart = true;
  var tomatoNum = 1;
  var isTomato = true;
  
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

  $('#tomato-set').on('change', function(e) {
    tomatoSet = $(this).val();
  });

  $('.timer').click(function() {
    isStart = false;
    if (isPaused) {
      isPaused = false;
      timer();
    }
    else {
      clearInterval(interval);
      pausedSecs = elapsed;
      isPaused = true;
    }
  });

  function timer() {
    var start = new Date().getTime();
    var change = true;
    
    
    interval = setInterval(function() {
      var time = new Date().getTime() - start;
      
      elapsed = (Math.floor(time / 1000) + pausedSecs) % 60;
      secs = 59 - elapsed;
      if (secs === 59) {
        if (change) {
          change = false;
          mins--;
        }
      }
      else {
        change = true;
      }
      
      if (mins < 0) {
        clearInterval(interval);
        mins = isTomato ? breakTime : tomatoTime;
        secs = 0;
        pausedSecs = 0;
        isTomato = !isTomato;
        timer();
      }
      else {
        $('.timer p').text(`${formatDigit(mins)}:${formatDigit(secs)}`);
      }
    })
  }

  function addTimeOptions() {
    for (var i=1; i<=120; i++) {
      $('.setting').append(
        `<option value="${i}">${i}</option>`
      )
    }
    $('#tomato-duration option[value="25"]').prop('selected', true)
    $('#break-duration option[value="5"]').prop('selected', true)
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

});
