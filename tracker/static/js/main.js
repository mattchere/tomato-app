$(document).ready(function() {
  var min = 25;
  var sec = 0;
  var pomolen = 25;
  var breaklen = 5;
  var pause = true;
  var pomo = true;
//   var audio = new Audio('transition.wav');

  function showTimer() {
      var strSec = sec.toString();
      var strMin = min.toString();
      if (sec < 10) {
          strSec = "0" + sec.toString();
      }
      if (min < 10) {
          strMin = "0" + min.toString();
      }
      $(".timer p").text(strMin + ":" + strSec);
  }

  function showPomoLen() {
      $(".pomo-len").text(pomolen.toString());
  }
  function showBreakLen() {
      $(".break-len").text(breaklen.toString());
  }

  function changeTimer() {
    //   audio.play()
      if (pomo) {
          pomo = false;
          min = breaklen;
          sec = 0;
          $(".timer").css("background-color", "#44477F");
      }
      else {
          pomo = true;
          min = pomolen;
          sec = 0;
          $(".timer").css("background-color", "#CC293A")
      }
  }

  function decTimer() {
      if (sec == 0) {
          sec = 59;
          min--;
          if (min < 0) {
              changeTimer();
          }
      }
      else {
          sec--;
      }
  }

  showPomoLen();
  showBreakLen();

  $("#p-plus").click(function(event) {
      if (pause) {
          pomolen++;
          showPomoLen();
          if (pomo) {
              min = pomolen;
              sec = 0;
              showTimer();
          }
      }
      
  });
  $("#p-minus").click(function(event) {
      if (pause && pomolen > 1) {
          pomolen--;
          showPomoLen();
          if (pomo) {
              min = pomolen;
              sec = 0;
              showTimer();
          }
      }
  });
  $("#b-plus").click(function(event) {
      if (pause) {
          breaklen++;
          showBreakLen();
          if (!pomo) {
              min = breaklen;
              sec = 0;
              showTimer();
          }
      }
      
  })
  $("#b-minus").click(function(event) {
      if (pause && breaklen > 1) {
          breaklen--;
          showBreakLen();
          if (!pomo) {
              min = breaklen;
              sec = 0;
              showTimer();
          }
      }
  })

  $(".timer").click(function(event) {
      if (pause) {
          pause = false;
      }
      else {
          pause = true;
      }  
  });

  setInterval(function() {
      if (!pause){
          decTimer();
          showTimer();
      }
  }, 1000)
});