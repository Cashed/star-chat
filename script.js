'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var pic = 'media/biking.jpg';
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
      var messagePost = $('<div id="messagePost">');
      var name = $('<a>');
      var data = snapshot.val();
      var message = data.text;
      name.text(data.name);
      name.attr('href', 'http://google.com');

      messagePost.text(': ' + message);
      messagePost.prepend(name);

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
})();
