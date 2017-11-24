$(document).ready(function() {
  var mins = 1;
  var seconds = 0;
  var elapsed = 0;
  var interval;
  var play = true;
  var timers = [1];
  
  $('.timer').click(function() {
    if (play) {
      play = false;
      timer();
    }
    else {
      clearInterval(interval);
      seconds = elapsed;
      play = true;
    }
  });

  $('.timer p').text(`${mins}:00`)

  $('.schedule-add').on('keyup', function(e) {
    if (e.keyCode == 13) {
      var value = Number($('.schedule-add').val());
      if (value > 0 && value <= 120 && Number.isInteger(value)) {
        $('.schedule').append(
          `<div class="schedule-time">${value}</div>`
        )
        timers.push(value);
      }
    }
  });

  function timer() {
    var start = new Date().getTime();
    var change = true;
    
    
    interval = setInterval(function() {
      var time = new Date().getTime() - start;
      
      elapsed = (Math.floor(time / 1000) + seconds) % 60;
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
        timers.shift();
        $('.schedule-time:eq(0)').remove();
        if (timers.length > 0) {
          mins = timers[0];
          secs = 0;
          interval = timer();
        }
      }
      else {
        $('.timer p').text(mins + ':' + secs);
      }
    })
  }

  


  
  
});
