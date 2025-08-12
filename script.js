let gameState = {
        scores: { wins: 0, losses: 0, draws: 0 },
        player: null,
        cpu: null,
        result: null,
        gameOver: false
    };
    const LS_KEY = "rpsScores_v1";
    const CHOICES = ["rock", "paper", "scissors"];
    const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };

    const winsCount = document.getElementById('winsCount');
    const lossesCount = document.getElementById('lossesCount');
    const drawsCount = document.getElementById('drawsCount');
    const statusText = document.getElementById('statusText');
    const playerChoice = document.getElementById('playerChoice');
    const cpuChoice = document.getElementById('cpuChoice');
    const resetRoundBtn = document.getElementById('resetRoundBtn');
    const resetScoresBtn = document.getElementById('resetScoresBtn');
    const choiceBtns = document.querySelectorAll('.choice-button');

    function loadScores() {
        try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : { wins: 0, losses: 0, draws: 0 };
        } catch {
        return { wins: 0, losses: 0, draws: 0 };
        }
    }
    function saveScores(scores) {
        try {
        localStorage.setItem(LS_KEY, JSON.stringify(scores));
        } catch {}
    }
    function pickRandom() {
        return CHOICES[Math.floor(Math.random() * CHOICES.length)];
    }
    function getResult(player, cpu) {
        if (player === cpu) return "draw";
        if (
        (player === "rock" && cpu === "scissors") ||
        (player === "scissors" && cpu === "paper") ||
        (player === "paper" && cpu === "rock")
        ) {
        return "win";
        }
        return "lose";
    }
    function updateScoreDisplay() {
        winsCount.textContent = gameState.scores.wins;
        lossesCount.textContent = gameState.scores.losses;
        drawsCount.textContent = gameState.scores.draws;
    }
    function updateStatusText() {
        const { player, cpu, result } = gameState;
        statusText.className = "status-text";
        if (player && cpu && result) {
        if (result === "win") {
            statusText.textContent = "You win!";
            statusText.classList.add("status-win");
        } else if (result === "lose") {
            statusText.textContent = "You lose!";
            statusText.classList.add("status-lose");
        } else {
            statusText.textContent = "It's a draw.";
        }
        } else {
        statusText.textContent = "Choose your hand";
        }
    }
    function updateChoiceDisplay() {
        playerChoice.textContent = gameState.player ? EMOJI[gameState.player] : "—";
        cpuChoice.textContent = gameState.cpu ? EMOJI[gameState.cpu] : "—";
    }
    function updateButtonStates() {
        const { player, result } = gameState;
        choiceBtns.forEach(btn => {
        const choice = btn.dataset.choice;
        btn.classList.toggle('active', player === choice);
        btn.disabled = !!result;
        });
        resetRoundBtn.disabled = !gameState.player && !gameState.cpu && !gameState.result;
    }
    function updateUI() {
        updateScoreDisplay();
        updateStatusText();
        updateChoiceDisplay();
        updateButtonStates();
    }
    function onPick(choice) {
        if (gameState.gameOver) return;
        const cpuPick = pickRandom();
        const result = getResult(choice, cpuPick);
        gameState.player = choice;
        gameState.cpu = cpuPick;
        gameState.result = result;
        gameState.gameOver = true;
        if (result === "win") gameState.scores.wins += 1;
        else if (result === "lose") gameState.scores.losses += 1;
        else gameState.scores.draws += 1;
        saveScores(gameState.scores);
        updateUI();
        setTimeout(resetRound, 1500);
    }
    function resetRound() {
        gameState.player = null;
        gameState.cpu = null;
        gameState.result = null;
        gameState.gameOver = false;
        updateUI();
    }
    function resetScores() {
        gameState.scores = { wins: 0, losses: 0, draws: 0 };
        saveScores(gameState.scores);
        updateUI();
    }
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => onPick(btn.dataset.choice));
    });
    resetRoundBtn.addEventListener('click', resetRound);
    resetScoresBtn.addEventListener('click', resetScores);
    function init() {
        gameState.scores = loadScores();
        updateUI();
    }
    init();