var animation = {
   "run" : function ()
   {
      $("#div1").fadeToggle();
   },
   "load" : function () {
      document.getElementById("grid").innerHTML = createGrid();
   }
};

var NUM_ROWS = 50;
var NUM_COLUMNS = 50;
var createGrid = function () {
   var i, j, result = "";
   for (i = 0; i < NUM_COLUMNS; i++) {
      result += "<div>";
      for (j = 0; j < NUM_ROWS; j++) {
         result += '<div class="square" onmouseenter="onSquareEnter($(this));" onmouseleave="onSquareLeave($(this));"></div>\n';
      }
      result += "</div>";
   }
   return result;
};

var onSquareEnter = function (button) {
   button.css('background-color', 'blue');
};

var onSquareLeave = function (button) {
   button.css('background-color', 'red');
};
