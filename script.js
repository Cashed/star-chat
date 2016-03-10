'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var profilePic;
    var messagePic;
    var messageRef = new Firebase('https://star-chat.firebaseio.com/');
    var board = $('#board');
    var pics = ['media/profilePics/709.jpg', 'media/profilePics/archer.jpg', 'media/profilePics/cardassian.jpg', 'media/profilePics/data.jpg', 'media/profilePics/deanna.jpg', 'media/profilePics/doctor.jpg', 'media/profilePics/ferengi.jpg', 'media/profilePics/geordi.jpg', 'media/profilePics/janeway.jpg', 'media/profilePics/locutus.jpg', 'media/profilePics/neelix.jpg', 'media/profilePics/phlox.jpg', 'media/profilePics/picard.jpg', 'media/profilePics/q.jpg', 'media/profilePics/riker.jpg', 'media/profilePics/tpol.jpg', 'media/profilePics/wesley.jpg', 'media/profilePics/worf.jpg'];

    $('#chatID').keypress(function(e) {
      if(e.keyCode === 13) {
        if(validate()){
          var loginPic = $('<img>');

          profilePic = pics[Math.floor(Math.random() * 18)];
          loginPic.attr('src', profilePic);
          $('#login-success :first-child').after(loginPic);

          chatID = $('#chatID').val();
          $('#welcome').text('Welcome, ' + chatID + '.');

          $('.id-prompt').fadeOut('fast');
          $('#login-success').fadeIn(3000);
          $('#login-success').addClass('animate');

          setInterval(function() {
            $('.login').fadeOut('slow');
          }, 5000);

          board[0].scrollTop = board[0].scrollHeight;
        }
        else {
          $('#id-fail').css('display', 'flex');
          $('#chatID').val('');
        }
      }
    });

    $('.emo').on('click', function() {
      $('#'+ $(this).attr('id') + '-pics').animate({height: '500px'}, 500);

      $(this).css('color', '#FF9900');
    });

    $('.emote-menu').mouseleave(function() {
      $(this).animate({height: '-500px'}, 500);

      $('#positive').css('color', 'white');
      $('#negative').css('color', 'white');
      $('#middle').css('color', 'white');
    });

    $('.emote-menu img').on('click', function() {
      var postPic = $(this);

      messagePic = $(this).attr('src');
      $('#message').append(postPic);
      $('#message')[0].scrollTop = $('#message')[0].scrollHeight;

    });

    function validate() {
      var tempID = $('#chatID').val();
      return /^[a-zA-Z\s]{2,10}$/.test(tempID);
    }

    function chatListen() {
      var message = $('#message');
      var isMessage = false;

      message.on('input', function() {
        isMessage = true;
      });

      message.keypress(function(e) {
        if(e.keyCode === 13 && isMessage) {
          e.preventDefault();
          isMessage = false;

          if(messagePic == undefined) {
            messageRef.push({name:chatID, text:message.text(), pic:profilePic});
          }
          else {
            messageRef.push({name:chatID, text:message.text(), pic:profilePic, messPic:messagePic});
          }

          message.text('');
        }
      });

      messageRef.on('child_added', postMessages);
    }

    function postMessages(snapshot) {
      var messagePost = $('<div id="messagePost">');
      var name = $('<a>');
      var picture = $('<img>');
      var data = snapshot.val();
      var message = data.text;
      var messPicInfo = data.messPic;

      if(messPicInfo != undefined) {
        var user = messageRef.key();
        var postPic = $('<img id="posted">');

        messagePic = undefined;

        postPic.attr('src', data.messPic);

        name.text(data.name + ': ');
        name.attr('href', 'http://google.com');

        picture.attr('src', data.pic);

        messagePost.text(' ' + message);
        messagePost.prepend(postPic);
        messagePost.prepend(name);
        messagePost.prepend(picture);

        board.append(messagePost);
      }
      else {
        name.text(data.name + ': ');
        name.attr('href', 'http://google.com');

        picture.attr('src', data.pic);

        messagePost.text(' ' + message);
        messagePost.prepend(name);
        messagePost.prepend(picture);

        board.append(messagePost);
      }

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
