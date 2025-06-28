$(document).ready(function () {
  // 毕业赠言生成器
  const wishes = [
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
    const $wishElement = $('#wish-text');
    const randomIndex = Math.floor(Math.random() * wishes.length);
    $wishElement.text(wishes[randomIndex]).addClass('pulse');
    setTimeout(() => {
      $wishElement.removeClass('pulse');
    }, 1000);
  });

  // 毕业记忆翻牌小游戏
  const symbols = ['🎓', '📚', '✏️', '🎒', '🏫', '⭐', '❤️', '🎉'];
  const cards = [...symbols, ...symbols];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let timer = 60;
  let gameInterval;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function initGame() {
    const $gameContainer = $('.memory-game');
    const $movesElement = $('#moves');
    const $timerElement = $('#timer');
    const $matchesElement = $('#matches');

    if (!$gameContainer.length) return;

    $gameContainer.empty();
    const shuffledCards = shuffle([...cards]);

    shuffledCards.forEach(symbol => {
      const $card = $('<div>', {
        'class': 'memory-card',
        'data-symbol': symbol
      });

      const $front = $('<div>', { class: 'card-front' }).text(symbol);
      const $back = $('<div>', { class: 'card-back' }).html('<i class="fas fa-question"></i>');

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
    gameInterval = setInterval(() => {
      timer--;
      $timerElement.text(timer);
      if (timer <= 0) {
        clearInterval(gameInterval);
        alert('时间到！游戏结束');
        initGame();
      }
    }, 1000);
  }

  function flipCard() {
    const $card = $(this);
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
    const [$card1, $card2] = flippedCards;

    if ($card1.data('symbol') === $card2.data('symbol')) {
      matchedPairs++;
      $('#matches').text(matchedPairs);
      flippedCards = [];

      if (matchedPairs === symbols.length) {
        clearInterval(gameInterval);
        setTimeout(() => {
          alert(`恭喜！你赢了！用时${60 - timer}秒，共${moves}步`);
          initGame();
        }, 500);
      }
    } else {
      setTimeout(() => {
        $card1.removeClass('flipped');
        $card2.removeClass('flipped');
        flippedCards = [];
      }, 1000);
    }
  }

  // DOM加载完毕后初始化游戏
  initGame();

  // 根据URL参数动态设置用户ID
  function setupUserId() {
    const idDisplay = document.getElementById('user-id-display');
    if (!idDisplay) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let displayText = '© 2025 小学毕业纪念';

    if (id) {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        const paddedId = id.padStart(2, '0');
        if (numericId >= 1 && numericId <= 3) {
          displayText += ` | 编号: TEACHER-${paddedId}`;
        } else {
          displayText += ` | 编号: STUDENT-${paddedId}`;
        }
      }
    }
    idDisplay.textContent = displayText;
  }
  setupUserId();
});
