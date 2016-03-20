'use strict';
(function() {
  $(document).ready(function() {
    var chatID;
    var profilePic;
    var status;
    var roomRef = new Firebase('https://star-chat.firebaseio.com/');
    var messageRef = roomRef.child('messages');
    var userRef = roomRef.child('users');
    var shipRef = roomRef.child('ships')
    var user = userRef.child('temp');
    var ship = shipRef.child('temp');
    var board = $('#board');
    var messagePic = '';
    var shipName = '';
    var resources = 30;
    var energyMax = 15;
    var shields = 0;
    var weapons = 0;
    var warp = 0;
    var pics = ['media/profilePics/709.jpg', 'media/profilePics/archer.jpg', 'media/profilePics/cardassian.jpg', 'media/profilePics/data.jpg', 'media/profilePics/deanna.jpg', 'media/profilePics/doctor.jpg', 'media/profilePics/ferengi.jpg', 'media/profilePics/geordi.jpg', 'media/profilePics/janeway.jpg', 'media/profilePics/locutus.jpg', 'media/profilePics/neelix.jpg', 'media/profilePics/phlox.jpg', 'media/profilePics/picard.jpg', 'media/profilePics/q.jpg', 'media/profilePics/riker.jpg', 'media/profilePics/tpol.jpg', 'media/profilePics/wesley.jpg', 'media/profilePics/worf.jpg'];

    $('#chatID').keypress(function(e) {
      if (e.keyCode === 13) {
          createUser();
        }
    });

    $('#ship-name').keypress(function(e) {
      if (e.keyCode === 13) {
          createShip();
      }
    });

    function createUser() {
      var tempID = $('#chatID').val();
      var hasValidChars = /^[a-zA-Z\s]{2,10}$/.test(tempID);

      userRef.child(tempID).transaction(function(currentData) {
        if(currentData === null && hasValidChars) {
          var loginPic = $('<img>');

          profilePic = pics[Math.floor(Math.random() * 18)];
          loginPic.attr('src', profilePic);
          $('#login-success :first-child').after(loginPic);

          chatID = tempID;
          user = userRef.child(chatID);

          status = 'spectate';

          welcomeScreen();

          return {name: chatID, status: status, rank: 'Captain', profile: profilePic};
        }
        else {
          $('#id-fail').css('display', 'flex');
          $('#chatID').val('');

          return;
        }
      });
    }

    function createShip() {
      var tempID = $('#ship-name').val();
      var hasValidChars = /^[a-zA-Z\s]{2,16}$/.test(tempID);

      shipRef.child(tempID).transaction(function(currentData) {
        if(currentData === null && hasValidChars) {
          shipName = tempID;
          ship = shipRef.child(shipName);

          user.update({ship: shipName});
          $('#ship-id').text(shipName);

          $('#ship-name').css('border', 'none').attr('readonly', 'readonly');
          $('#ship-name').css('width', '345px');
          $('.ship-intro').animate({'margin-top': '0px'}, 1000);
          setTimeout(function() {
            $('#ship-explain').fadeIn('slow');
          }, 1500);

          return {name: shipName, command: chatID, model: 'Constitution-Class Heavy Cruiser', shields: shields, weapons: weapons, warp: warp, resources: resources};
        }
        else {
          $('#ship-name').val('');
          $('#invalid-ship').css('display', 'block');
          return;
        }
      });
    }

    function welcomeScreen() {
      $('#welcome').text('Welcome, ' + chatID + '.');

      $('.id-prompt').fadeOut('fast');
      $('#login-success').fadeIn(3000);
      $('#login-success').addClass('animate');

      board[0].scrollTop = board[0].scrollHeight;

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

    userRef.on('child_added', function(userJoining) {
      var listUser = $('<li class="profile-link">');
      var newUser = userJoining.val();

      listUser.attr('id', newUser.name);
      listUser.text(newUser.name);

      $('.chat-users').append(listUser);
    });

    window.onbeforeunload = function() {
      ship.remove();
      user.remove();
    };

    userRef.on('child_removed', function(userLeaving) {
      var departingUser = userLeaving.val();

      $('#' + departingUser.name).remove();
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
        var userData;
        var shipData;
        var clickedUser = $(this).text().replace(/[^a-zA-Z\s]+/g, '');
        var rank = $('#profile-top-name p').text();

        userRef.once('value').then(function(snapshot) {
          snapshot.forEach(function(specificUser) {
            if(clickedUser === specificUser.key()) {
              userData = specificUser.val();
            }
          });
        }).then(function() {
          if (clickedUser === chatID) {
            $('#edit-bio').css('display', 'block');
            $('#profPic-select').css('display', 'block');

            $('#profile-bottom').css('height', 'auto');
          }
          else {
            if (userData.status === 'explore' && status === 'explore') {

              console.log('in conditional');
              $('#trade').css('display', 'block');
              $('#battle').css('display', 'block');

              $('#profile-bottom').css('height', '140px');
            }

            $('#edit-bio').css('display', 'none');
            $('#profPic-select').css('display', 'none');
          }

          $('#bio-pic').attr('src', userData.profile);
          $('#profile-top-name h1').text(userData.name);
          $('#profile-top-name p').text(rank + userData.rank);
          $('#bio').text(userData.bio);
        }, function(error) {
          console.error(error);
        });

        shipRef.once('value').then(function(allShips) {
          allShips.forEach(function(specificShip) {
            if(userData.ship === specificShip.key()) {
              shipData = specificShip.val();
            }
          });
        }).then(function() {
          var span = $('<span>');

          span.text(shipData.name);

          $('#profile-ship').css('display', 'block');

          $('#profile-ship').text(shipData.model + ':')
          .append('<br>')
          .append(span);
        }, function(error) {
          return;
        });

        $('.profile').css('display', 'flex');
      }
    });

    $('#exit-profile').on('click', function() {
      $('.profile').css('display', 'none');

      $('#bio-pic').attr('src', '');
      $('#profile-top-name h1').text('');
      $('#profile-top-name p').text('Rank: ');
      $('#bio').text('');
      $('#profile-ship').css('display', 'none');

      $('#trade').css('display', 'none');
      $('#battle').css('display', 'none');
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

    $('#explorer-mode').on ('click', function() {
      $('.play-options').fadeOut('slow');
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

    $('#instr-read').on('click', function() {
      $('.explore-intro').fadeOut('slow');

      status = 'explore';
      user.update({status: status});

      $('<i class="fa-li fa fa-crosshairs">').appendTo('#' + chatID);
    });

    $('#shield-up').on('click', function() {
      if (resources > 0 && shields < energyMax) {
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
      if (resources > 0 && weapons < energyMax) {
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
      if (resources > 0 && warp < energyMax) {
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
