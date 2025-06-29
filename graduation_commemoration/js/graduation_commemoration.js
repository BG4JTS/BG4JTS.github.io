$(document).ready(function () {
  // 毕业赠言生成器
  var wishes = [
    "愿你们像颗种子，勇敢地冲破泥沙，将嫩绿的幼芽伸出地面，指向天空。",
    "带着稚气，带着自信，带着理想上路吧！去迎接人生最美好的青春时光。",
    "六年的时光是生命中一段美好的乐章，愿这成为你们未来成功的序曲！",
    "知识是升天的羽翼，是恐惧的解毒药，愿你们紧握这把钥匙，开启成功的大门。",
    "明天，这是个美丽灿烂、辉映着五光十色的迷人的字眼。愿你们的明天无限美丽、无限灿烂、无限迷人！",
    "还记得那一天的摄影留念吗？我的瞬间意识连同闪光灯一起亮了：你们的倩影留在底片上，同时也深深地烙在我的心灵里。",
    "竖起理想的桅，扬起信仰的帆，把好前进的舵，划起自强的桨――启航吧，青春的船！",
    "假如生活是一条河流，愿你是一叶执著向前的小舟；假如生活是一叶小舟，愿你是个风雨无阻的水手。",
    "希望是坚韧的拐杖，忍耐是旅行袋，带上他们，你可以登上永恒之旅，走遍全世界。",
    "不要学花儿只把春天等待，要学燕子把春天衔来。"
  ];
  $('#generate-wish').on('click', function () {
    var $wishElement = $('#wish-text');
    var randomIndex = Math.floor(Math.random() * wishes.length);
    $wishElement.text(wishes[randomIndex]).addClass('pulse');
    setTimeout(function () {
      $wishElement.removeClass('pulse');
    }, 1000);
  });

  // --- 导航至留言板 ---
  function setupRedirect() {
    var redirectUrl = 'https://bg4jts.dpdns.org/';
    var $button = $('#agree-and-redirect');

    function redirect() {
      window.location.href = redirectUrl;
    }

    if ($button.length) {
      $button.on('click', function () {
        redirect();
      });
    }
  }
  setupRedirect();


  // --- 毕业记忆翻牌小游戏 ---
  var symbols = ['🎓', '📚', '✏️', '🎒', '🏫', '⭐', '❤️', '🎉'];
  var cards = symbols.concat(symbols); // ES5 compliant way to merge arrays
  var flippedCards = [];
  var matchedPairs = 0;
  var moves = 0;
  var timer = 60;
  var gameInterval;

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function initGame() {
    var $gameContainer = $('.memory-game');
    var $movesElement = $('#moves');
    var $timerElement = $('#timer');
    var $matchesElement = $('#matches');

    if (!$gameContainer.length) return;

    // 显示游戏区域
    $('#start-game-btn').hide();
    $('.memory-game').css('display', 'grid');
    $('.game-stats').css('display', 'flex');

    $gameContainer.empty();
    var shuffledCards = shuffle(cards.slice()); // Use slice to create a copy

    shuffledCards.forEach(function (symbol) {
      var $card = $('<div>', {
        'class': 'memory-card',
        'data-symbol': symbol
      });

      var $front = $('<div>', { class: 'card-front' }).text(symbol);
      var $back = $('<div>', { class: 'card-back' }).html('<i class="fas fa-question"></i>');

      $card.append($front).append($back);
      $card.on('click', flipCard);
      $gameContainer.append($card);
    });

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 60;

    $movesElement.text(moves);
    $timerElement.text(timer);
    $matchesElement.text(matchedPairs);

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(function () {
      timer--;
      $timerElement.text(timer);
      if (timer <= 0) {
        clearInterval(gameInterval);
        alert('时间到！游戏结束');
        // 游戏结束后显示开始按钮
        $('#start-game-btn').show();
        $('.memory-game').css('display', 'none');
        $('.game-stats').css('display', 'none');
      }
    }, 1000);
  }

  function flipCard() {
    var $card = $(this);
    if (flippedCards.length < 2 && !$card.hasClass('flipped')) {
      $card.addClass('flipped');
      flippedCards.push($card);

      if (flippedCards.length === 2) {
        moves++;
        $('#moves').text(moves);
        checkForMatch();
      }
    }
  }

  function checkForMatch() {
    var $card1 = flippedCards[0];
    var $card2 = flippedCards[1];

    if ($card1.data('symbol') === $card2.data('symbol')) {
      matchedPairs++;
      $('#matches').text(matchedPairs);
      flippedCards = [];

      if (matchedPairs === symbols.length) {
        clearInterval(gameInterval);
        setTimeout(function () {
          alert('恭喜！你赢了！用时' + (60 - timer) + '秒，共' + moves + '步');
          // 游戏结束后显示开始按钮
          $('#start-game-btn').show();
          $('.memory-game').css('display', 'none');
          $('.game-stats').css('display', 'none');
        }, 500);
      }
    } else {
      setTimeout(function () {
        $card1.removeClass('flipped');
        $card2.removeClass('flipped');
        flippedCards = [];
      }, 1000);
    }
  }

  // 点击开始按钮初始化游戏
  $('#start-game-btn').on('click', initGame);

  // 根据URL参数动态设置用户ID
  function getQueryParam(param) {
    var href = window.location.href;
    var reg = new RegExp('[?&]' + param + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
  }

  function setupUserId() {
    var idDisplay = document.getElementById('user-id-display');
    if (!idDisplay) return;

    var id = getQueryParam('id');
    var displayText = '© 2025 小学毕业纪念';

    if (id) {
      var numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        var paddedId = id.length < 2 ? '0' + id : id;
        if (numericId >= 1 && numericId <= 3) {
          displayText += ' | 编号: TEACHER-' + paddedId;
        } else {
          displayText += ' | 编号: STUDENT-' + paddedId;
        }
      }
    }
    idDisplay.textContent = displayText;
  }
  setupUserId();
});
