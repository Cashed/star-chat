'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var profilePic;
    var messagePic;
    var currentStatus;
    var roomRef = new Firebase('https://star-chat.firebaseio.com/');
    var userRef = new Firebase('https://star-chat.firebaseio.com/users');
    var user = userRef.child('temp');
    var messageRef = new Firebase('https://star-chat.firebaseio.com/messages');
    var board = $('#board');
    var pics = ['media/profilePics/709.jpg', 'media/profilePics/archer.jpg', 'media/profilePics/cardassian.jpg', 'media/profilePics/data.jpg', 'media/profilePics/deanna.jpg', 'media/profilePics/doctor.jpg', 'media/profilePics/ferengi.jpg', 'media/profilePics/geordi.jpg', 'media/profilePics/janeway.jpg', 'media/profilePics/locutus.jpg', 'media/profilePics/neelix.jpg', 'media/profilePics/phlox.jpg', 'media/profilePics/picard.jpg', 'media/profilePics/q.jpg', 'media/profilePics/riker.jpg', 'media/profilePics/tpol.jpg', 'media/profilePics/wesley.jpg', 'media/profilePics/worf.jpg'];

    $('#chatID').keypress(function(e) {
      if (e.keyCode === 13) {
        if (isValidName()){

          createUser();

          $('#welcome').text('Welcome, ' + chatID + '.');

          $('.id-prompt').fadeOut('fast');
          $('#login-success').fadeIn(3000);
          $('#login-success').addClass('animate');

          setTimeout(function() {
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

    function isValidName() {
      var tempID = $('#chatID').val();
      var hasValidChars = /^[a-zA-Z\s]{2,10}$/.test(tempID);
      var isUnique = true;

      userRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var usedName = childSnapshot.key();

          if (tempID === usedName) {
            isUnique = false;
          }
        });
      });

      return hasValidChars && isUnique;
    }

    function createUser() {
      var loginPic = $('<img>');

      profilePic = pics[Math.floor(Math.random() * 18)];
      loginPic.attr('src', profilePic);
      $('#login-success :first-child').after(loginPic);

      chatID = $('#chatID').val();

      user = userRef.child(chatID);
      user.set({name:chatID, rank:'Captain', profile:profilePic});
    }

    userRef.on('child_added', function(snapshot) {
      var listUser = $('<li class="profile-link">');
      var user = snapshot.val();

      listUser.attr('id', user.name);
      listUser.text(user.name);
      listUser.append('<i class="fa-li fa fa-crosshairs">');

      $('.chat-users').append(listUser);
    });

    window.onbeforeunload = function() {
      user.remove();
    };

    userRef.on('child_removed', function(snapshot) {
      var user = snapshot.val();

      $('#' + user.name).remove();
    });

    function chatListen() {
      var message = $('#message');
      var isMessage = false;

      message.on('input', function() {
        isMessage = true;
      });

      message.keypress(function(e) {
        if (e.keyCode === 13 && isMessage) {
          e.preventDefault();
          isMessage = false;

          if (messagePic == undefined) {
            messageRef.push({name:chatID, text:message.text(), pic:profilePic});
          }
          else {
            messageRef.push({name:chatID, text:message.text(), pic:profilePic, messPic:messagePic});
          }

          message.text('');
        }
      });

      messageRef.limitToLast(10).on('child_added', postMessages);
    }

    function postMessages(chatMessage) {
      var data = chatMessage.val();
      var textMessage = data.text;
      var emotePicPath = data.messPic;
      var profPicPath = data.pic;
      var userName = data.name;
      var messagePost = $('<div class="messagePost" id="' + userName + '"/>');
      var emoticonPic = $('<img id="posted">');
      var name = $('<a class="profile-link">');
      var profPicture = $('<img>');

      if (emotePicPath) {
        messagePic = undefined;

        emoticonPic.attr('src', emotePicPath);

        console.log(emoticonPic);

        messagePost.prepend(emoticonPic);

        console.log(messagePost);
      }
      name.text(userName + ': ');

      profPicture.attr('src', profPicPath);

      messagePost.text(' ' + textMessage);
      messagePost.prepend(name);
      messagePost.prepend(profPicture);

      board.append(messagePost);

      board[0].scrollTop = board[0].scrollHeight;
    }

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
      var postPic = $('<img>').attr('src', $(this).attr('src'));

      messagePic = $(this).attr('src');

      $('#message').append(postPic);
      $('#message')[0].scrollTop = $('#message')[0].scrollHeight;
    });

    $('body').on('click', '.profile-link', function() {
      if ($('.profile').css('display') != 'flex') {
        var clickedUser = $(this).text().replace(/[^a-zA-Z\s]+/g, '');

        userRef.once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var user = childSnapshot.key();

            if (clickedUser === user) {
              var userData = childSnapshot.val();
              var rank = $('#profile-top-name p').text();

              $('#bio-pic').attr('src', userData.profile);
              $('#profile-top-name h1').text(userData.name);
              $('#profile-top-name p').text(rank + userData.rank);

              $('.profile').css('display', 'flex');

              return true;
            }
          });
        });
      }
    });

    $('.profile').on('click', function() {
      $(this).css('display', 'none');

      $('#bio-pic').attr('src', '');
      $('#profile-top-name h1').text('');
      $('#profile-top-name p').text('Rank: ');
    });

    chatListen();
  });
})();
