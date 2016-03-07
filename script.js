'use strict';

$(document).ready(function() {


function fancyNums() {
  var numList = $('#header-console-numbers');

  for(var i = 0; i < 50; i++) {
    var randomNum = Math.floor(Math.random() * 9999) + ' ';
    var nums = $('<li>');
    nums.text(randomNum);
    numList.append(nums);
  }

}

fancyNums();
});
