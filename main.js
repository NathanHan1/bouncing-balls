// setup canvas

var canvas = document.querySelector('canvas'); //importance
var ctx = canvas.getContext('2d');//importance
var modelChange = document.querySelector('button')
var ballCount = document.getElementsByClassName('count')


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

var balls = []

modelChange.onclick = function () {
    loopA()
}

//balls property
function Shape(x, y, velX, velY, exists) {
    this.x = x
    this.y = y
    this.velX = velX
    this.velY = velY
    this.exists = exists
}
function EvilCircle(x, y, velX, velY) {
    Shape.call(this, x, y, velX, velY)
    this.color = 'red'
    this.size = 15
}
function Ball(x, y, velX, velY, color, size, exists) {
    Shape.call(this, x, y, velX, velY, exists)
    this.color = color
    this.size = size
}
//小球继承
//Ball的原型是Shape
Ball.prototype = Object.create(Shape.prototype)
Ball.prototype.constructor = Ball

EvilCircle.prototype = Object.create(Shape.prototype)
EvilCircle.prototype.constructor = EvilCircle

EvilCircle.prototype.draw = function () {
    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.strokeStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.stroke()
}
EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x = width - this.size
    }
    if ((this.x - this.size) <= 0) {
        this.x = this.size
    }
    if ((this.y + this.size) >= height) {
        this.y = height - this.size
    }
    if ((this.y - this.size) <= 0) {
        this.y = this.size
    }
}
EvilCircle.prototype.setControls = function () {
    let _this = this
    window.onkeydown = function (e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX
        } else if (e.keyCode === 68) {
            _this.x += _this.velX
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY
        } else if (e.keyCode === 83) {
            _this.y += _this.velY
        }
    }
}
EvilCircle.prototype.collisionDetect = function () {
    for (let i = 0; i < balls.length; i++) {
        let x = balls[i].x - this.x
        let y = balls[i].y - this.y
        let diff = Math.sqrt(x * x + y * y)
        if (diff < this.size + balls[i].size) {
            if (balls[i].exists) {
                ballsLength--
                ballCount[0].innerHTML = `Ball Count:&nbsp&nbsp${ballsLength}`
            }
            balls[i].exists = false
        }
    }
}
Shape.prototype.draw = function () {
    //importance 画出小球
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
}
Shape.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -this.velX
    }
    if ((this.x - this.size) <= 0) {
        this.velX = -this.velX
    }
    if ((this.y + this.size) >= height) {
        this.velY = -this.velY
    }
    if ((this.y - this.size) <= 0) {
        this.velY = -this.velY
    }
    //importance   每一帧的位置，通过累加达到
    this.x += this.velX
    this.y += this.velY
}
Shape.prototype.collisionDetect = function () {
    for (let i = 0; i < balls.length; i++) {
        if (this !== balls[i]) {
            let x = balls[i].x - this.x
            let y = balls[i].y - this.y
            let diff = Math.sqrt(x * x + y * y)
            if (diff < this.size + balls[i].size) {
                this.color = balls[i].color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
                // this.velX = -this.velX
                // this.velY = -this.velY
                // balls[i].velX = -balls[i].velX
                // balls[i].velY = -balls[i].velY
            }
        }
    }
}





// moving-loop
var evilCircle = new EvilCircle(
    random(0, width),
    random(0, height),
    20,
    20
)
evilCircle.setControls()

let time = 1
let color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
let numberOfBalls = 2

function loopA() {
    // if (time % 500 === 0) {
    //     color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
    //     numberOfBalls += 3
    // }
    ctx.fillStyle = 'rgba(0,0,0,0.8)'
    ctx.fillRect(0, 0, width, height)
    while (balls.length < 20) {
        //importance   实例化小球  一共25个
        var ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            random(10, 30),
            true
        )
        balls.push(ball)
    }
    //importance   调用方法
    evilCircle.draw()
    evilCircle.checkBounds()
    evilCircle.collisionDetect()
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw()
            balls[i].update()
            balls[i].collisionDetect()
        }
    }
    time++
    //importance  运动循环
    requestAnimationFrame(arguments.callee)
}

//moving  开始
loopA()

let ballsLength = balls.length
ballCount[0].innerHTML += `&nbsp&nbsp${ballsLength}`
