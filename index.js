// Selección de elementos del DOM
const playBoard = document.querySelector(".play-board"); // Tablero de juego
const scoreElement = document.querySelector(".score"); // Elemento que muestra la puntuación
const highScoreElement = document.querySelector(".high-score"); // Elemento que muestra la puntuación más alta
const controls = document.querySelectorAll(".controls i"); // Botones de control para el juego (izquierda, derecha, arriba, abajo)

// Variables de estado del juego
let gameOver = false; // Estado que indica si el juego ha terminado
let foodX, foodY; // Posición de la comida
let snakeX = 5, snakeY = 5; // Posición inicial de la cabeza de la serpiente
let velocityX = 0, velocityY = 0; // Velocidades de la serpiente en el eje X y Y
let snakeBody = []; // Cuerpo de la serpiente (array de coordenadas)
let setIntervalId; // ID del intervalo para la actualización del juego
let score = 0; // Puntuación actual del juego

// Obtener la puntuación más alta almacenada en el almacenamiento local (localStorage)
let highScore = localStorage.getItem("high-score") || 0; // Si no hay puntuación alta guardada, se inicializa en 0
highScoreElement.innerText = `High Score: ${highScore}`; // Muestra la puntuación más alta

// Función para actualizar la posición de la comida (en una posición aleatoria)
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1; // Genera un número aleatorio entre 1 y 30 para la posición X de la comida
    foodY = Math.floor(Math.random() * 30) + 1; // Genera un número aleatorio entre 1 y 30 para la posición Y de la comida
}

// Función que maneja el final del juego (cuando la serpiente choca con el borde o consigo misma)
const handleGameOver = () => {
    clearInterval(setIntervalId); // Detiene el intervalo del juego
    alert("Game Over! Press OK to replay..."); // Muestra un mensaje de fin de juego
    location.reload(); // Recarga la página para reiniciar el juego
}

// Función para cambiar la dirección de la serpiente según la tecla presionada
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) { // Si se presiona la tecla de flecha arriba y la serpiente no va hacia abajo
        velocityX = 0;
        velocityY = -1; // Cambia la dirección hacia arriba
    } else if (e.key === "ArrowDown" && velocityY != -1) { // Si se presiona la tecla de flecha abajo y la serpiente no va hacia arriba
        velocityX = 0;
        velocityY = 1; // Cambia la dirección hacia abajo
    } else if (e.key === "ArrowLeft" && velocityX != 1) { // Si se presiona la tecla de flecha izquierda y la serpiente no va hacia la derecha
        velocityX = -1;
        velocityY = 0; // Cambia la dirección hacia izquierda
    } else if (e.key === "ArrowRight" && velocityX != -1) { // Si se presiona la tecla de flecha derecha y la serpiente no va hacia la izquierda
        velocityX = 1;
        velocityY = 0; // Cambia la dirección hacia derecha
    }
}

// Función que maneja los eventos de cambio de dirección al hacer clic en los controles
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Función que inicializa y actualiza el estado del juego
const initGame = () => {
    if (gameOver) return handleGameOver(); // Si el juego ha terminado, se maneja el fin del juego

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // Crea el HTML para la comida en la nueva posición

    // Cuando la serpiente come la comida, se actualiza la posición de la comida y se agrega al cuerpo de la serpiente
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition(); // Actualiza la posición de la comida
        snakeBody.push([foodY, foodX]); // Añade una nueva parte al cuerpo de la serpiente
        score++; // Aumenta la puntuación
        highScore = score >= highScore ? score : highScore; // Si la puntuación actual es mayor que la puntuación más alta, actualiza la puntuación más alta

        localStorage.setItem("high-score", highScore); // Guarda la nueva puntuación más alta en el almacenamiento local
        scoreElement.innerText = `Score: ${score}`; // Muestra la puntuación actual
        highScoreElement.innerText = `High Score: ${highScore}`; // Muestra la puntuación más alta
    }

    // Actualiza la posición de la cabeza de la serpiente
    snakeX += velocityX;
    snakeY += velocityY;

    // Desplaza el cuerpo de la serpiente, moviendo cada segmento una posición hacia adelante
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]; // Cada parte del cuerpo toma la posición de la parte anterior
    }

    snakeBody[0] = [snakeX, snakeY]; // La cabeza de la serpiente toma la nueva posición

    // Verifica si la cabeza de la serpiente ha chocado con las paredes (fuera de los límites)
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true; // Si la serpiente choca con una pared, el juego termina
    }

    // Añade un div para cada parte del cuerpo de la serpiente
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verifica si la cabeza de la serpiente choca con alguna parte de su cuerpo
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true; // Si la cabeza choca con el cuerpo, el juego termina
        }
    }

    playBoard.innerHTML = html; // Actualiza el tablero de juego con el nuevo HTML
}

// Inicializa la posición de la comida y comienza el intervalo del juego
updateFoodPosition();
setIntervalId = setInterval(initGame, 100); // El juego se actualiza cada 100 ms

// Agrega un event listener para los cambios de dirección mediante las teclas del teclado
document.addEventListener("keyup", changeDirection);
