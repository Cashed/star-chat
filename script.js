'use strict';

$(document).ready(function() {
var chatID = '';
var messageRef = new Firebase('https://star-chat.firebaseio.com/');
$('#chatID').keypress(function(e) {
  if(e.keyCode === 13) {
    chatID = $('#chatID').val();
    $('.login').hide();
  }
});

function chatListen() {
  var message = $('#message');

  message.keypress(function(e) {
    if(e.keyCode === 13) {
      messageRef.push({name:chatID, text:message.val()});
      message.val('');
    }
  });

  messageRef.on('child_added', postMessages);
}

function postMessages(snapshot) {
  var board = $('#board');
  var name = $('<p>');
  name.css('color', 'darkblue');
  var data = snapshot.val();
  var message = data.text;
  name.text(data.name);

  var messagePost = $('<div id="messagePost">');

  messagePost.append(name);
  messagePost.text(': ' + message);

  board.append(messagePost);

  board[0].scrollTop = board[0].scrollHeight;
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
