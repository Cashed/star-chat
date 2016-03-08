'use strict';

$(document).ready(function() {

var messageRef = new Firebase('https://star-chat.firebaseio.com/');

function chatListen() {
  var message = $('#message');

  message.keypress(function(e) {
    if(e.keyCode === 13) {
      messageRef.push(message.val());
      message.val('');
    }
  });

  messageRef.on('child_added', postMessages);
}

function postMessages(snapshot) {
  var board = $('#board');
  var message = snapshot.val();

  var messagePost = $('<div id="messagePost">');

  messagePost.text(message);

  board.append(messagePost);
}





function fancyNums() {
  var numList = $('#header-console-numbers');

  for(var i = 0; i < 50; i++) {
    var randomNum = Math.floor(Math.random() * 9999) + ' ';
    var nums = $('<li>');
    nums.text(randomNum);
    numList.append(nums);
  }

}
chatListen();
fancyNums();
});
