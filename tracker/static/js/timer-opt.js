Rx.Observable
  .fromEvent($('#play'), 'click')
  .subscribe(startTimer);

function startTimer() {
  Rx.Observable.create(timer)
    .subscribe(startTimes(1,10))
  
  function timer(observer) {
    var start = new Date().getTime();
  
    var interval = setInterval(function() {
      var delta = new Date().getTime() - start;
      observer.next(Math.floor(delta/1000));
    }, 100)
  
    $('#pause').click(function() {
      clearInterval(interval);
    })
  }
}

function startTimes(startMins, startSecs) {
  var startSecs = startSecs === 0 ? 60 : startSecs;
  return function(elapsed)  {
    var mins = startMins - Math.floor((elapsed + (59-startSecs)) / 60)
    var secs = 59 - (elapsed + (59-startSecs)) % 60;
    $('#timer').text(`${mins}:${secs}`);
  }
}