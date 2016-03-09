'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var profilePic;
    var messageRef = new Firebase('https://star-chat.firebaseio.com/');
    var pics = ['media/profilePics/709.jpg', 'media/profilePics/archer.jpg', 'media/profilePics/cardassian.jpg', 'media/profilePics/data.jpg', 'media/profilePics/deanna.jpg', 'media/profilePics/doctor.jpg', 'media/profilePics/ferengi.jpg', 'media/profilePics/geordi.jpg', 'media/profilePics/janeway.jpg', 'media/profilePics/locutus.jpg', 'media/profilePics/neelix.jpg', 'media/profilePics/phlox.jpg', 'media/profilePics/picard.jpg', 'media/profilePics/q.jpg', 'media/profilePics/riker.jpg', 'media/profilePics/tpol.jpg', 'media/profilePics/wesley.jpg', 'media/profilePics/worf.jpg'];

    $('#chatID').keypress(function(e) {
      if(e.keyCode === 13) {
        //var loginPic = $('<img>');
        chatID = $('#chatID').val();
        profilePic = pics[Math.floor(Math.random() * 18)];
        //loginPic.attr('src', profilePic);

        $('.login').hide();

        //$('.login-success').append(loginPic);

        //$('.login-success').css('display', 'flex');
      }
    });

    function chatListen() {
      var message = $('#message');

      message.keypress(function(e) {
        if(e.keyCode === 13) {
          messageRef.push({name:chatID, text:message.val(), pic:profilePic});
          message.val('');
        }
      });

      messageRef.on('child_added', postMessages);
    }

    function postMessages(snapshot) {
      var board = $('#board');
      var messagePost = $('<div id="messagePost">');
      var name = $('<a id="slide">');
      var picture = $('<img>');
      var data = snapshot.val();
      var message = data.text;

      name.text(data.name + ': ');
      name.attr('href', 'http://google.com');

      picture.attr('src', data.pic);

      messagePost.text(' ' + message);
      messagePost.prepend(name);
      messagePost.prepend(picture);
      //messagePost.animate({'width':'100%'}, 1000);

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
