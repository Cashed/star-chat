'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var profilePic;
    var currentStatus;
    var roomRef = new Firebase('https://star-chat.firebaseio.com/');
    var messageRef = roomRef.child('messages');
    var userRef = roomRef.child('users');
    var user = userRef.child('temp');
    var board = $('#board');
    var messagePic = '';
    var resources = 35;
    var shields = 0;
    var weapons = 0;
    var warp = 0;
    var pics = ['media/profilePics/709.jpg', 'media/profilePics/archer.jpg', 'media/profilePics/cardassian.jpg', 'media/profilePics/data.jpg', 'media/profilePics/deanna.jpg', 'media/profilePics/doctor.jpg', 'media/profilePics/ferengi.jpg', 'media/profilePics/geordi.jpg', 'media/profilePics/janeway.jpg', 'media/profilePics/locutus.jpg', 'media/profilePics/neelix.jpg', 'media/profilePics/phlox.jpg', 'media/profilePics/picard.jpg', 'media/profilePics/q.jpg', 'media/profilePics/riker.jpg', 'media/profilePics/tpol.jpg', 'media/profilePics/wesley.jpg', 'media/profilePics/worf.jpg'];

    $('#chatID').keypress(function(e) {
      if (e.keyCode === 13) {
        if (isValidName()){

          createUser();

          welcomeScreen();

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
      var isUnique = !Boolean(returnUser(tempID));  //so terrible

      return hasValidChars && isUnique;
    }

    function createUser() {
      var loginPic = $('<img>');

      profilePic = pics[Math.floor(Math.random() * 18)];
      loginPic.attr('src', profilePic);
      $('#login-success :first-child').after(loginPic);

      chatID = $('#chatID').val();

      user = userRef.child(chatID);
      user.set({name: chatID, rank: 'Captain', profile: profilePic});
    }

    function welcomeScreen() {
      $('#welcome').text('Welcome, ' + chatID + '.');

      $('.id-prompt').fadeOut('fast');
      $('#login-success').fadeIn(3000);
      $('#login-success').addClass('animate');

      setTimeout(function() {
        $('.login').fadeOut('slow');
      }, 5000);
    }

    function chatListen() {
      var message = $('#message');
      var isMessage = false;

      message.on('input', function() {
        isMessage = true;
      });

      message.keypress(function(e) {
        if (e.keyCode === 13 && isMessage) {
          isMessage = false;
          e.preventDefault();

          messageRef.push({name: chatID, text: message.text(), pic: profilePic, messPic: messagePic});

          messagePic = '';
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
      var emoticonPic = $('<img class="posted">');
      var name = $('<a class="profile-link">');
      var profPicture = $('<img>');

      emoticonPic.attr('src', emotePicPath);
      profPicture.attr('src', profPicPath);

      name.text(userName + ': ');

      messagePost.text(' ' + textMessage);
      messagePost.prepend(emoticonPic);
      messagePost.prepend(name);
      messagePost.prepend(profPicture);

      board.append(messagePost);

      board[0].scrollTop = board[0].scrollHeight;
    }

    function returnUser(desiredUser) {
      var user = false;

      userRef.once('value', function(allUsers) {
        allUsers.forEach(function(specificUser) {
          if (desiredUser === specificUser.key()) {
            user = specificUser;

            return true;
          }
        });
      });

      return user;
    }

    userRef.on('child_added', function(userJoining) {
      var listUser = $('<li class="profile-link">');
      var user = userJoining.val();

      listUser.attr('id', user.name);
      listUser.text(user.name);
      listUser.append('<i class="fa-li fa fa-crosshairs">');

      $('.chat-users').append(listUser);
    });

    window.onbeforeunload = function() {
      user.remove();
    };

    userRef.on('child_removed', function(userLeaving) {
      var user = userLeaving.val();

      $('#' + user.name).remove();
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
      var postPic = $('<img>').attr('src', $(this).attr('src'));

      $('#message').append(postPic);
      $('#message')[0].scrollTop = $('#message')[0].scrollHeight;

      messagePic = $(this).attr('src');
    });

    $('body').on('click', '.profile-link', function() {
      if ($('.profile').css('display') != 'flex') {
        var clickedUser = $(this).text().replace(/[^a-zA-Z\s]+/g, '');
        var userData = returnUser(clickedUser).val();
        var rank = $('#profile-top-name p').text();

        if (clickedUser === chatID) {
          $('#edit-bio').css('display', 'block');
          $('#profPic-select').css('display', 'block');
        }
        else {
          $('#edit-bio').css('display', 'none');
          $('#profPic-select').css('display', 'none');
        }

        $('#bio-pic').attr('src', userData.profile);
        $('#profile-top-name h1').text(userData.name);
        $('#profile-top-name p').text(rank + userData.rank);
        $('#bio').text(userData.bio);

        $('.profile').css('display', 'flex');
      }
    });

    $('#exit-profile').on('click', function() {
      $('.profile').css('display', 'none');

      $('#bio-pic').attr('src', '');
      $('#profile-top-name h1').text('');
      $('#profile-top-name p').text('Rank: ');
      $('#bio').text('');
    });

    $('#edit-bio').on('click', function() {
      if ($('#bio').attr('contenteditable') === 'false') {
        $('#bio').attr('contenteditable', 'true');
        $(this).text('Save');
      }
      else {
        $('#bio').attr('contenteditable', 'false');
        $(this).text('Edit');
        userRef.child($('#profile-top-name h1').text()).update({bio: $('#bio').text()});
      }
    });

    $('#bio').keypress(function(){
      return this.innerHTML.length < $(this).attr('max');
    });

    $('#profPic-select').on('click', function() {
      $('#profile-menu').animate({height: '305px'}, 500)
      .mouseleave(function() {
        $(this).animate({height: '0'}, 500);
      });
    });

    $('#profile-menu img').on('click', function() {
      userRef.child(chatID).update({profile: $(this).attr('src')});
      $('#bio-pic').attr('src', $(this).attr('src'));
      profilePic = $(this).attr('src');
    });

    $('#shield-down').on('click', function() {
      if (shields > 0) {
        $('.shields .status-bar:last-child').remove();

        resources += 1;
        shields -= 1;

        $('#resource-pool').text(resources);
        $('#shield-value').text(shields);
      }
    });

    $('#shield-up').on('click', function() {
      if (resources > 0) {
        var statusBar = $('<div class="status-bar">');

        $('.shields').append(statusBar);

        resources -= 1;
        shields += 1;

        $('#resource-pool').text(resources);
        $('#shield-value').text(shields);
      }
    });

    $('#weapons-down').on('click', function() {
      if (weapons > 0){
        $('.weapons .status-bar:last-child').remove();

        resources += 1;
        weapons -= 1;

        $('#resource-pool').text(resources);
        $('#weapons-value').text(weapons);
      }
    });

    $('#weapons-up').on('click', function() {
      if (resources > 0) {
        var statusBar = $('<div class="status-bar">');

        $('.weapons').append(statusBar);

        resources -= 1;
        weapons += 1;

        $('#resource-pool').text(resources);
        $('#weapons-value').text(weapons);
      }
    });

    $('#warp-down').on('click', function() {
      if (warp > 0) {
        $('.warp .status-bar:last-child').remove();

        resources += 1;
        warp -= 1;

        $('#resource-pool').text(resources);
        $('#warp-value').text(warp);
      }
    });

    $('#warp-up').on('click', function() {
      if (resources > 0) {
        var statusBar = $('<div class="status-bar">');

        $('.warp').append(statusBar);

        resources -= 1;
        warp += 1;

        $('#resource-pool').text(resources);
        $('#warp-value').text(warp);
      }
    });


    chatListen();
  });
}());
