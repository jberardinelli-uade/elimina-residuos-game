document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game');
    const gameOverlay = document.getElementById('game-overlay');
    const startButton = document.getElementById('start-button');
    const messageContainer = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const totalItems = 15;
    let itemsRemoved = 0;
    let timeLeft = 30;
    let timer;

    function startGame() {
        gameOverlay.style.display = 'none';
        initializeGame();
        startTimer();
    }

    function createRandomPosition() {
        const x = Math.floor(Math.random() * (gameContainer.clientWidth - 20));
        const yUpperLimit = gameContainer.clientHeight / 2 + 60;
        const y = Math.floor(Math.random() * (gameContainer.clientHeight - yUpperLimit) + yUpperLimit);
        return { x, y };
    }
    
    function initializeGame() {
        const elementTypes = ['botella.png', 'papel.png', 'caja.png', 'pizza.png'];
        for (let i = 0; i < totalItems; i++) {
            const randomIndex = Math.floor(Math.random() * elementTypes.length);
            const elementType = elementTypes[randomIndex];

            const item = document.createElement('img');
            item.src = `./assets/img/juego1/${elementType}`; 
            item.classList.add('item');
            const position = createRandomPosition();
            item.style.left = `${position.x}px`;
            item.style.top = `${position.y}px`;

            item.addEventListener('click', () => {
                shrinkItem(item);
            });

            gameContainer.appendChild(item);
        }

        setTimeout(() => {
            if (itemsRemoved < totalItems) {
                showMessage('Perdiste. Inténtalo de nuevo.', 'lose');
                clearInterval(timer);
            }
        }, timeLeft * 1000);
    }

    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = `Tiempo: ${timeLeft}s`;
            } else {
                clearInterval(timer);
                showMessage('Perdiste. Inténtalo de nuevo.', 'lose');
            }
        }, 1000);
    }

    function shrinkItem(item) {
        let shrinkCount = 0;
        const shrinkInterval = setInterval(() => {
            if (shrinkCount < 5) {
                const newSize = item.clientWidth / 2;
                item.style.width = `${newSize}px`;
                item.style.height = `${newSize}px`;
                shrinkCount++;
            } else {
                clearInterval(shrinkInterval);
                item.remove();
                itemsRemoved++;
                if (itemsRemoved === totalItems) {
                    clearInterval(timer);
                    showMessage('¡Felicitaciones! Has ganado.', 'win');
                }
            }
        }, 100);
    }

    function showMessage(text, result) {
        const buttonClass = result === 'win' ? 'win' : 'lose';
        messageContainer.innerHTML = `
            <p>${text}</p>
            <a id="reset-button" class="${buttonClass}" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-restore">
                    <path stroke="none" d="M0 0h24v24H0z" fill="fff" />
                    <path d="M3.06 13a9 9 0 1 0 .49 -4.087" />
                    <path d="M3 4.001v5h5" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
                Reiniciar
            </a>
        `;
        messageContainer.classList.remove('hidden');
        document.getElementById('reset-button').addEventListener('click', () => {
            location.reload();
        });
    }

    startButton.addEventListener('click', startGame);
});
