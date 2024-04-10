const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--vallue")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const upBtn = document.querySelector(".up-btn")
const downBtn = document.querySelector(".down-btn")
const leftBtn = document.querySelector(".left-btn")
const rightBtn = document.querySelector(".right-btn")



const audio = new Audio ('../assets/audio.mp3')

const size = 30

let checkGameOver = true

const initialPosition = { x: 270, y: 240 }

let snake = [
    { x: 270, y: 240 }
]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction
let loopId

const drawFood = () => {

    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    

    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })

}

const moveSnake = () => {
if (!direction) return
if (!checkGameOver) return


    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }


    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()

        
    }

    
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

       let x = randomPosition()
       let y = randomPosition()

       while (snake.find((position)=> position.x == x && position.y == y)) {
       x = randomPosition()
       y = randomPosition()
       }

       food.x = x 
       food.y = y
       food.color = randomColor()
    }

}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit


    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    } 
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(4px)"
    upBtn.style.filter = "blur(4px)"
    downBtn.style.filter = "blur(4px)"
    leftBtn.style.filter = "blur(4px)"
    rightBtn.style.filter = "blur(4px)"
    checkGameOver = false
    


}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawFood()
    drawGrid()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout (() => {
        gameLoop()
    }, 200)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (!checkGameOver) return

    if (key == "ArrowRight" || key == "d" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" || key == "a" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" || key == "s" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" || key == "w" && direction != "down") {
        direction = "up"
    }
})

upBtn.addEventListener("click", () => {
    if (direction != "down") {
        direction = "up"
    }
})

downBtn.addEventListener("click", () => {
    if (direction != "up") {
        direction = "down"
    }
})

rightBtn.addEventListener("click", () => {
    if (direction != "left") {
        direction = "right"
    }
})

leftBtn.addEventListener("click", () => {
    if (direction != "right"){
        direction = "left"
    }
})

buttonPlay.addEventListener("click", () => {
    location.reload()
})

