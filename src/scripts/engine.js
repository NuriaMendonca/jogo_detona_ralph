const state ={ //sentido semantico para o objeto que armazena o estado do jogo
    view:{
        squares: document.querySelectorAll(".square"),//guarda o quadrado que será clicado
        enemy: document.querySelector(".enemy"),//guarda o inimigo que será clicado
        timeLeft: document.querySelector("#time-left"), //id do elemento h2 que exibe o tempo restante
        score: document.querySelector("#score"),//id do elemento h2 que exibe o placar
    },

    values:{//guarda os valores do jogo
        gameVelocity: 1000, //velocidade do jogo em milissegundos
        hitPosition: 0, //posição do quadrado sorteado
        result: 0, //resultado do jogo
        currentTime: 60, //tempo restante do jogo em segundos
        lives: 3, //vidas do jogador
        isGameActive: false,


    },
    actions: { //guarda as ações do jogo
        timerId: null, //id do temporizador
        countDownTimerId: null, //inicia o temporizador que chama a função countDown a cada segundo
    },

};

// ======= SONS =======

const sounds = {
  hit: new Audio('./src/audios/hit.mp3'),
  miss: new Audio('./src/audios/miss.mp3'),
  bgm: new Audio('./src/audios/bgm.mp3'),
};

sounds.hit.volume = 0.7;
sounds.miss.volume = 0.7;
sounds.bgm.volume = 0.3;
sounds.bgm.loop = true;

function playSound(audioName) {
  const sound = sounds[audioName];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// ======= LÓGICA DO JOGO =======

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  const randomNumber = Math.floor(Math.random() * 9);
  const selectedSquare = state.view.squares[randomNumber];
  selectedSquare.classList.add("enemy");
  state.values.hitPosition = selectedSquare.id;
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    endGame(`⏰ Tempo esgotado! Sua pontuação foi: ${state.values.result}`);
  }
}

function updateLivesDisplay() {
  const livesText = document.querySelector(".menu-lives h2");
  livesText.textContent = `x${state.values.lives}`;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (!state.values.isGameActive) return;

      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.lives--;
        if (state.values.lives < 0) state.values.lives = 0;

        updateLivesDisplay();
        playSound("miss");

        if (state.values.lives === 0) {
          endGame("💀 Game Over! Você perdeu todas as vidas.");
        }
      }
    });
  });
}

function startGame() {
  // Reinicia estado
  state.values.currentTime = 60;
  state.values.result = 0;
  state.values.lives = 3;
  state.values.isGameActive = true; // ATIVA o jogo!

  state.view.score.textContent = 0;
  state.view.timeLeft.textContent = 60;
  updateLivesDisplay();

  // Inicia temporizadores
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);

  // Música de fundo
  sounds.bgm.currentTime = 0;
  sounds.bgm.play();

  document.querySelector("#start-button").disabled = true;
}

function endGame(message) {
  clearInterval(state.actions.timerId);
  clearInterval(state.actions.countDownTimerId);
  state.values.isGameActive = false;

  sounds.bgm.pause();
  alert(message);
  document.querySelector("#start-button").disabled = false;
}

// ======= INICIALIZAÇÃO =======

function init() {
  addListenerHitBox();

  const btn = document.querySelector("#start-button");
  btn.addEventListener("click", startGame);
}

init();