var months = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
var dates = [];
var counts;

$('.date-month').text(months[new Date().getMonth()]);
$('.date-year').text(new Date().getFullYear());
// Switch month when pressing arrows
$('#prev').click(function() {
  var month = months.indexOf($('.date-month').text());
  var year = $('.date-year').text();
  if (month === 0) {
    month = 11;
    year--;
  }
  else {
    month--;
  }
  switchDatesTo(month, year);
});

$('#next').click(function() {
  var month = months.indexOf($('.date-month').text());
  var year = $('.date-year').text();
  if (month === 11) {
    month = 0;
    year++;
  }
  else {
    month++;
  }
  switchDatesTo(month, year);
});

function switchDatesTo(month, year) {
  $('.date-month').text(months[month]);
  $('.date-year').text(year);
  reset();
  addDates();
}

// Reset to default
function reset() {
  for (var i=0; i<35; i++) {
    var row = Math.trunc(i/7) + 1
    var day = i % 7;
    addShade(row, day);
    removeDate(row, day);
    removeCount(row, day);
  }
}

// Programmatically add dates for the month.

function addDates() {
  var month = months.indexOf($('.date-month').text());
  var year = parseInt($('.date-year').text());
  var day = new Date(year, month, 1).getDay();
  var maxDays = new Date(year, month+1, 0).getDate();
  var row = 1;
  dates = [];
  counts = new Array(maxDays).fill(0);
  
  for (var i=1; i<=maxDays; i++) {
    dates.push([row, day]);
    addDate(row, day, i);
    removeShade(row, day);
    if (day === 6) {
      day = 0;
      row++;
    }
    else {
      day++;
    }
  }
  addTomatoCounts();
}

function getDateText(row, day) {
  return $(`.month-row:eq(${row}) .month-cell:eq(${day}) .date-text`);
}
function getCountText(row, day) {
  return $(`.month-row:eq(${row}) .month-cell:eq(${day}) .tomato-count`);
}

function addDate(row, day, n) {
  getDateText(row, day).text(n);
}
function removeDate(row, day) {
  getDateText(row, day).text('');
}

function addCount(row, day, n) {
  getCountText(row, day).text(n);
}
function removeCount(row, day, n) {
  getCountText(row, day).text('');
}

function addShade(row, day) {
  $(`.month-row:eq(${row}) .month-cell:eq(${day})`).addClass('shaded');    
}
function removeShade(row, day) {
  $(`.month-row:eq(${row}) .month-cell:eq(${day})`).removeClass('shaded');
}

addDates();

// Get tomatoes from the server
function addTomatoCounts() {
  $.get('/api/v1/tomatoes/', function(data) {
    var currMonth = months.indexOf($('.date-month').text());    
    data
      .map(function(tomato) {
        return Object.assign(
          {},
          tomato,
          {
            completed: new Date(tomato.completed)
          }
        )
      })
      .filter(function(tomato) {
        return tomato.completed.getMonth() == currMonth;
      })
      .forEach(function(tomato) {
        counts[tomato.completed.getDate()-1]++;
      });
    for (var i=0; i<dates.length; i++) {
      addCount(...dates[i], counts[i]);
    }
  });
}
