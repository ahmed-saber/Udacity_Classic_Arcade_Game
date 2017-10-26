// GLOBAL VARS
let gems = [];
let allEnemies = [];
let timer;
let startTimer = null;
// Gems rows and columns
let numRows = 5,
    numCols = 5,
    row, col,
    lastRow = 50,
    lastCol = 0;
const positions = [];
// Loop through the number of rows and columns we've defined above
for (row = 0; row <= numRows; row++) {
    for (col = 0; col < numCols; col++) {
        if (!positions[row]) {
            positions[row] = [];
        }
        if (col == 0) {
            lastCol = 0;
        } else {
            lastCol += 101;
        }

        positions[row].push({
            'x': lastCol,
            'y': lastRow
        });
    }
    lastRow += 84;
}

// Get random item from an array function from https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
function shuffleItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// convert milliseconds to minutes
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// update time
function setTime(elapsed){
    // END TIME
    var currentTime = new Date();
    if(elapsed == undefined){
        elapsed = currentTime.getTime() - startTimer.getTime();
    }
    var inMinutes = millisToMinutesAndSeconds(elapsed);
    $('.elapsed-time').text(inMinutes);
}

// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // SAVE INSTANCE DIMENSIONS
    this.width = 101;
    this.height = 75;
    this.transArea = 76;
    // CHANGE THE SPEED
    this.updateSpeed();
    // X position
    this.x = -100;
    // RANDOM Y POSITION
    this.randYPos();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    let movement = this.speed;
    this.x += movement;
    // RESET THE POSITION IF THE X POSITION IS LARGER THAN THE CANVAS WIDTH
    if (this.x > ctx.canvas.width) {
        // START POSITION OUTSIDE THE SCREEN
        this.x = -100;
        // CHANGE THE SPEED
        this.updateSpeed();
        // RANDOM Y POSITION
        this.randYPos();
    }
};

// UPDATE ENEMY SPEED
Enemy.prototype.updateSpeed = function () {
    // RANDOM NUMBER
    this.randNum = Math.random();
    this.speed = Math.round(this.randNum * 5);
};

// RANDOM Y POSITION
Enemy.prototype.randYPos = function () {
    var randArr = positions.slice(1, positions.length - 2);
    let randPos = shuffleItem(shuffleItem(randArr));
    this.y = randPos.y;
};

function initEnemies() {
    allEnemies = [
        new Enemy(),
        new Enemy(),
        new Enemy(),
        new Enemy()
    ];
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), 0, this.transArea, this.width, this.height, this.x, this.y, this.width, this.height);
};

// GEMS
var Gems = function () {
    // VARS
    this.width = 80;
    this.height = 80;
    this.transArea = 56;
    this.randNum = Math.random();
    this.sprites = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ];
    this.sprite = shuffleItem(this.sprites);
    // RANDOM POSITIONS
    var randArr = positions.slice(2, positions.length - 2);
    let randPos = shuffleItem(shuffleItem(randArr));
    // CHECK IF THE GEM TOOK THE SAME POSITION OTHER GEM HAS
    Gems.gemsPositions.forEach(function (gemPos) {
        if (gemPos.x == randPos.x && gemPos.y == randPos.y) {
            randPos = shuffleItem(shuffleItem(randArr));
        }
    });
    Gems.gemsPositions.push(randPos);
    this.x = randPos.x + 10;
    this.y = randPos.y;

};
Gems.gemsPositions = [];

Gems.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), 0, this.transArea, 100, 120, this.x, this.y, this.width, this.height);
};

// START NEW GEMS
function initGems() {
    gems = [
        new Gems(),
        new Gems(),
        new Gems()
    ];
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    // SAVE INSTANCE DIMENSIONS
    this.width = 99;
    this.height = 80;
    this.transArea = 63;
    this.positions = {
        'x': 2,
        'y': 5
    };
    // VARS
    this.x = 0;
    this.y = 0;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function () {
    if(gems.length == 0 && player.positions.y == 0){
        // END TIME
        clearInterval(timer);
        // OPEN THE MODAL
        $('#gameFinished').modal('show');
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), 0, this.transArea, this.width, this.height, this.x, this.y, this.width, this.height);
};

Player.prototype.handleInput = function (s) {
    let x = this.positions.x,
        y = this.positions.y;
    switch (s) {
        case 'left':
            x--;
            break;
        case 'right':
            x++;
            break;
        case 'up':
            y--;
            break;
        case 'down':
            y++;
            break;
    }
    // CHANGE POSITION
    if (positions[y] && positions[y][x]) {
        this.positions = {
            'x': x,
            'y': y
        };
        let pos = positions[player.positions.y][player.positions.x];
        player.x = pos.x;
        player.y = pos.y;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
initEnemies();
initGems();
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // ONLY ALLOWED KEYS
    if (allowedKeys[e.keyCode]) {
        player.handleInput(allowedKeys[e.keyCode]);
        // SAVE THE TIMER
        if (startTimer == null) {
            startTimer = new Date();
            timer = setInterval(function(){
                setTime();
            });
        }
    }
});

// CHANGE PLAYER
$('#changePlayer img').click(function(e){
    // VARS
    let $this = $(this);
    let src = $this.attr('src');
    // CHANGE PLAYER
    player.sprite = src;
    // CLOSE MODAL
    $('#changePlayer').modal('hide');
});

// RESTART BUTTON
$('.restart').click(function(){
    reset();
});