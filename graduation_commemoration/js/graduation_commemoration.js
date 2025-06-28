window.addEventListener('DOMContentLoaded', () => {
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
  document.getElementById('generate-wish').addEventListener('click', function () {
    const wishElement = document.getElementById('wish-text');
    const randomIndex = Math.floor(Math.random() * wishes.length);
    wishElement.textContent = wishes[randomIndex];
    wishElement.classList.add('pulse');
    setTimeout(() => {
      wishElement.classList.remove('pulse');
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

  const gameContainer = document.querySelector('.memory-game');
  const movesElement = document.getElementById('moves');
  const timerElement = document.getElementById('timer');
  const matchesElement = document.getElementById('matches');

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function initGame() {
    if (!gameContainer) return;

    gameContainer.innerHTML = '';
    const shuffledCards = shuffle([...cards]);

    shuffledCards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.symbol = symbol;
      card.dataset.index = index;

      const front = document.createElement('div');
      front.classList.add('card-front');
      front.textContent = symbol;

      const back = document.createElement('div');
      back.classList.add('card-back');
      back.innerHTML = '<i class="fas fa-question"></i>';

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener('click', flipCard);
      gameContainer.appendChild(card);
    });

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 60;

    movesElement.textContent = moves;
    timerElement.textContent = timer;
    matchesElement.textContent = matchedPairs;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      timer--;
      timerElement.textContent = timer;
      if (timer <= 0) {
        clearInterval(gameInterval);
        alert('时间到！游戏结束');
        initGame();
      }
    }, 1000);
  }

  function flipCard() {
    // `this` refers to the clicked card element
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        checkForMatch();
      }
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;

    if (symbol1 === symbol2) {
      matchedPairs++;
      matchesElement.textContent = matchedPairs;
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
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
      }, 1000);
    }
  }

  // Initialize the game when the DOM is ready
  initGame();

  // --- 聊天室 & 动态ID显示逻辑 (从 student.html 迁移过来) ---

  // 聊天室本地存储
  function renderChat() {
    const chatBox = document.getElementById('chatMessages');
    // 如果找不到聊天框，直接返回，避免错误
    if (!chatBox) return;

    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

    // 清空现有消息
    chatBox.innerHTML = '';

    // 安全地渲染消息
    chatMessages.forEach(m => {
      const messageWrapper = document.createElement('div');
      messageWrapper.className = 'message sent';

      const senderDiv = document.createElement('div');
      senderDiv.className = 'message-sender';
      // 安全地设置昵称
      senderDiv.textContent = m.nickname || '匿名';

      const messageDiv = document.createElement('div');
      // 安全地设置消息内容
      messageDiv.textContent = m.message;

      messageWrapper.appendChild(senderDiv);
      messageWrapper.appendChild(messageDiv);
      chatBox.appendChild(messageWrapper);
    });

    // 自动滚动到底部
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function setupChat() {
    const sendBtn = document.getElementById('chatSendBtn');
    const messageInput = document.getElementById('chatInput');
    const nicknameInput = document.getElementById('nicknameInput');

    if (!sendBtn || !messageInput || !nicknameInput) return;

    const sendMessage = () => {
      const message = messageInput.value.trim();
      const nickname = nicknameInput.value.trim() || '匿名'; // 默认 '匿名'
      if (message) {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push({ nickname, message });
        // 添加try-catch以应对localStorage可能写满或禁用的情况
        try {
          localStorage.setItem('chatMessages', JSON.stringify(messages));
        } catch (e) {
          console.error("无法保存消息到 localStorage:", e);
          alert("无法保存新消息，存储可能已满或被禁用。");
        }
        messageInput.value = '';
        renderChat();
      }
    };

    sendBtn.onclick = sendMessage;
    messageInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // 页面加载时渲染一次
    renderChat();
  }
  setupChat();


  // 根据URL参数动态设置用户ID
  function setupUserId() {
    const idDisplay = document.getElementById('user-id-display');
    if (!idDisplay) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let displayText = '© 2023 小学毕业纪念';

    if (id) {
      const numericId = parseInt(id, 10);
      // 检查id是否为有效数字
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
