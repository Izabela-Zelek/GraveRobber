// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions

function GameObject(name, img, health, x, y) {
    this.name = name;
    this.img = img;
    this.health = health;
    this.x = x;
    this.y = y;
}

function drawTimer(timeLeft) {
    var width = 304;
    var height = 5;
    var max = 400;
    var value = timeLeft;

    //drawing the timer bar background
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);

    //draw the time bar value
    context.fillStyle = "#800080";
    var fillValue = Math.min(Math.max(value / max, 0), 1);
    context.fillRect(0, 0, fillValue * width, height);
}

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input


//determines whether or not game can continue
var gameInProgress = true;

// Loading in sprites used in game
var sprite = new Image();
sprite.src = "./img/player.png";

var graveSprite = new Image();
graveSprite.src = "./img/grave.png";

var gravebg = new Image();
gravebg.src = "./img/gloomybg.png";

var bgSprite = new Image();
bgSprite.src = "./img/bg.png";

var nameGrave = new Image();
nameGrave.src = "./img/NamelessGrave.png";

var bossSprite = new Image();
bossSprite.src = "./img/motor.png";

var fogSprite = new Image();
fogSprite.src = "./img/fog.png";


//used when calculating the time left
var counter = 0;

var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var uname = params.get("username");

var bossFight = false;
var canFight = false;

var player = new GameObject("Player", sprite, 100, 0, 0);
var boss = new GameObject("Boss", bossSprite, 100, -700, 180);
var graveOne = new GameObject("GraveOne", graveSprite, 100, 40, 80);
var graveTwo = new GameObject("GraveTwo", graveSprite, 100, 100, 80);
var graveThree = new GameObject("GraveThree", graveSprite, 100, 160, 80);
var graveFour = new GameObject("GraveFour", graveSprite, 100, 220, 80);
var userGrave = new GameObject("NamelessGrave", nameGrave, 100, 198, 40);
var bg = new GameObject("Graveyard", gravebg, 100, 0, 0);
var fog = new GameObject("Fog", fogSprite, 100, 0, 500);
var endScreen = new GameObject("End", bgSprite, 100, 0, 0);
var buttonSound = document.getElementById("buttonSound");

// Gameobjects is a collection of the Actors within the game
var gameobjects = [graveOne, graveTwo, graveThree];

// which graves are empty
var alive = [true, true, true, true];

//checks if player wants to dig
var dig = false;
//checks if player is close enough to grave for prompt to pop up
var showE = false;
//stores which weapon was randomised
var weapon;
var healthStuff = ["A", "B", "C"];
var freeInv = 0;
var chosenHealth;

var showAnnouncement = false;
var showHealthAnnounce = false;

// get a handle to the canvas context
var canvas = document.getElementById("game");

// get 2D context for this canvas
var context = canvas.getContext("2d");

//get font for on screen text
context.font = "30px Arial";

//the direction that the player is moving
var direction = 0;

// Setup image
// Total Frames
var frames = 4;

// Current Frame
var currentFrame = 0;

// Initial time set
var initial = new Date().getTime();
var current; // current time


// Process keyboard input event
function input(event) {
    if (bossFight == false) {// Take Input from the Player
        if (event.type === "keydown") {
            switch (event.keyCode) {
                case 37:
                    gamerInput = new GamerInput("Left");
                    direction = 1;
                    break; //Left key
                case 39:
                    gamerInput = new GamerInput("Right");
                    direction = 3;
                    break; //Right key
                case 69:
                    dig = true;
                    break;
                default:
                    gamerInput = new GamerInput("None"); //No Input
                    direction = 0;

            }
        } else {
            gamerInput = new GamerInput("None"); //No Input
            direction = 0;
            dig = false;
        }
        console.log("Gamer Input :" + gamerInput.action);
    }
}

function update() {
    switch (direction) {
        case 0:
            player.x = player.x;
            player.y = player.y;
            break;
        case 1:
            player.x -= 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
            player.img.src = "./img/playerBack.png";
            break;
        case 3:
            player.x += 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
            player.img.src = "./img/player.png";
            break;
    }
    if (bossFight == false) {
        boundaryCheck();
        checkIntersect();

        if (counter === 4000) {
            console.log("Time is up");
            // gameInProgress = false;
            bossFight = true;
        }
        else {
            counter++
        }
    }
    else {
        centreCharacter();
    }

}

// Draw GameObjects to Console
// Modify to Draw to Screen
function draw() {
    // Clear Canvas
    // Iterate through all GameObjects
    // Draw each GameObject
    // console.log("Draw");
    for (i = 0; i < gameobjects.length; i++) {
        if (gameobjects[i].health > 0) {
            console.log("Image :" + gameobjects[i].img);
        }
    }
    animate();
}



function animate() {
    if (direction != 0) {
        current = new Date().getTime(); // update current
        if (current - initial >= 300) { // check is greater that 500 ms
            currentFrame = (currentFrame + 1) % frames; // update frame
            initial = current; // reset initial
        }
    }
    // Draw sprite frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bg.img, bg.x, bg.y, 304, 171);
    context.drawImage(userGrave.img, userGrave.x, userGrave.y, 37, 47);
    if (alive[0] == true) {
        context.drawImage(graveOne.img, graveOne.x, graveOne.y, 47, 57);
    }
    if (alive[1] == true) {
        context.drawImage(graveTwo.img, graveTwo.x, graveTwo.y, 47, 57);
    }
    if (alive[2] == true) {
        context.drawImage(graveThree.img, graveThree.x, graveThree.y, 47, 57);
    }
    if (alive[3] == true) {
        context.drawImage(graveFour.img, graveFour.x, graveFour.y, 47, 57);
    }
    if (bossFight == true) {
        context.drawImage(fog.img, fog.x, fog.y, 912, 512);
    }
    context.drawImage(player.img, (player.img.width / 4) * currentFrame, 0, 71.34, 122.67, player.x, player.y, 35.67, 61.34);

    if (bossFight == true) {
        context.drawImage(boss.img, boss.x, boss.y, boss.img.width / 1.5, boss.img.height / 1.5);
    }

    showText();

    //timer
    drawTimer(counter / 10);
}

function showText() {

    if(!bossFight)
    {
        context.font = "5px Verdana";
        context.fillStyle = "black";
        context.fillText(uname, userGrave.x + 10, userGrave.y + 15);

        if (showE == true) {
        context.font = "10px Verdana";
        context.fillStyle = "white";
        context.fillText("E", player.x + (player.img.width / 16), player.y - 10);
        }
    if (showAnnouncement == true || showHealthAnnounce == true) {
        context.fillStyle = '#CEB6DD';
        context.fillRect(85.34, 60.34, 133.34, 33.34);
    }
    if (weapon == "Sword" && showAnnouncement == true) {
        context.font = "10px Verdana";
        context.fillStyle = "black";
        context.fillText("Sword Found!", 115.34, 82);
        console.log(healthStuff);
    }
    else if (weapon == "Dagger" && showAnnouncement == true) {
        context.font = "10px Verdana";
        context.fillStyle = "black";
        context.fillText("Dagger Found!", 115.34, 82);
        console.log(healthStuff);
    }
    if (chosenHealth == "Health Potion" && showHealthAnnounce == true) {
        context.font = "10px Verdana";
        context.fillStyle = "black";
        context.fillText("Health Potion Found!", 102, 82);
        console.log(healthStuff);
    }
    else if (chosenHealth == "Food" && showHealthAnnounce == true) {
        context.font = "10px Verdana";
        context.fillStyle = "black";
        context.fillText("Food Found!", 122, 82);
        console.log(healthStuff);
    }
    }
    if (bossFight == true) {
        itemSelect();
    }
}


//boundary checking
function boundaryCheck() {
    if (player.x < 0 ) {
        player.x = 0 ;
    }

    else if (player.x > (canvas.width - (player.img.width / 8))) {
        player.x = (canvas.width - (player.img.width / 8));
    }

    if (player.y < 250) {
        player.y = 250;
    }


    else if (player.y > (canvas.height - 60)) {
        player.y = (canvas.height - 60);
    }

}


//checks if player is close enough to dig
function checkIntersect() {
    if (player.x >= graveOne.x - 30 && player.x <= graveOne.x + 30) {
        if (alive[0] == true) {
            showE = true;
            if (dig == true) {
                alive[0] = false;
                console.log(freeInv);
                generateHealth();
                freeInv = freeInv + 1;
                dig = false;
            }
        }
    }
    else if (player.x >= graveTwo.x - 30 && player.x <= graveTwo.x + 30) {
        if (alive[1] == true) {
            showE = true;
            if (dig == true) {
                alive[1] = false;
                console.log(freeInv);
                generateHealth();
                freeInv = freeInv + 1
                dig = false;
            }
        }
    }
    else if (player.x >= graveThree.x - 30 && player.x <= graveThree.x + 30) {
        if (alive[2] == true) {
            showE = true;
            if (dig == true) {
                alive[2] = false;
                console.log(freeInv);
                generateHealth();
                freeInv = freeInv + 1
                dig = false;
            }
        }
    }
    else if (player.x >= graveFour.x - 30 && player.x <= graveFour.x + 30) {
        if (alive[3] == true) {
            showE = true;
            if (dig == true) {
                alive[3] = false;
                generateWeapon();
                dig = false;
            }
        }
    }
    else {
        showE = false;
        dig = false;
    }

}
function gameloop() {
    if (gameInProgress) {
        update();
        draw();
        window.requestAnimationFrame(gameloop);
    }
    else {

        // gameOver();
    }
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

// Handle Keypressed
window.addEventListener('keyup', input);
window.addEventListener('keydown', input);

document.getElementById("buttonUp").onmouseup = function () { noInput() };
document.getElementById("buttonLeft").onmouseup = function () { noInput() };
document.getElementById("buttonRight").onmouseup = function () { noInput() };
document.getElementById("buttonDown").onmouseup = function () { noInput() };

function buttonOnClickW() {
    if (bossFight == false) {
        gamerInput = new GamerInput("Up");
        direction = 2;
    }
}

function buttonOnClickA() {
    if (bossFight == false) {
        gamerInput = new GamerInput("Left");
        direction = 1;
    }
}

function buttonOnClickD() {
    if (bossFight == false) {
        gamerInput = new GamerInput("Right");
        direction = 3;
    }
}


function buttonOnClickS() {
    if (bossFight == false) {
        gamerInput = new GamerInput("Down");
        direction = 4;
    }
}

function noInput() {
    if (bossFight == false) {
        gamerInput = new GamerInput("None");
        direction = 0;
    }
}

function useButton() {
    dig = true;
    if(bossFight)
    {
        canFight = true;
    }
}

function generateWeapon() {
    var randWeapon = (Math.random() * 8);
    if (randWeapon >= 1 && randWeapon < 2) {
        showAnnouncement = true;
        weapon = "Sword";
        console.log(weapon);
        console.log(randWeapon);
    }
    else {
        showAnnouncement = true;
        weapon = "Dagger";
        console.log(weapon);
        console.log(randWeapon);
    }
}

function generateHealth() {
    var randHealth = (Math.random() * 4);
    if (randHealth >= 1 && randHealth < 2) {
        showHealthAnnounce = true;
        healthStuff[freeInv] = "Health Potion";
        chosenHealth = "Health Potion";
        console.log(healthStuff);
        console.log(randHealth);
    }
    else {
        showHealthAnnounce = true;
        healthStuff[freeInv] = "Food";
        chosenHealth = "Food";
        console.log(healthStuff);
        console.log(randHealth);
    }
}


//determines what happens when timer runs out
function gameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(endScreen.img, endScreen.x, endScreen.y, 912, 512);
    localStorage.setItem('score', 1);
}


// Update the player score
function updateScore() {
    var current_score = localStorage.getItem('score');

    if (isNaN(current_score)) {
        localStorage.setItem('score', 0);
        document.getElementById("SCORE").innerHTML = " Score:  [ " + current_score + " ] ";
    } else {
        localStorage.setItem('score', parseInt(current_score) + 1);
        document.getElementById("SCORE").innerHTML = " Score:  [" + current_score + " ] ";
    }

}

function centreCharacter() {

    if (player.x > 550) {
        direction = 1;
    }
    else if (player.x < 550) {
        direction = 3;
    }
    else if (player.y < (canvas.height - 180)) {
        direction = 4;
    }
    else {
        direction = 0;
    }

    if (boss.x < -50) {
        boss.x = boss.x + 1;
    }

    if (player.x == 550 && player.y == (canvas.height - 180)) {
        player.img.src = "./img/playerBack.png";
    }
    if (fog.y > 0) {
        fog.y = fog.y - 1;
    }
}

function itemSelect() {

    drawHealthbars();
    var e = document.getElementById("item-select");
    var strUser = e.options[e.selectedIndex].value;
    console.log(strUser);

    if (strUser != weapon && strUser != chosenHealth && strUser != "None") {
        showAnnouncement = true;
        context.font = "30px Verdana";
        context.fillStyle = "black";
        context.fillText("Item Unavailable", 340, 246);
        console.log(healthStuff);
    }

    else if( canFight == true && (strUser == weapon || strUser == chosenHealth))
    {
        showAnnouncement = false;
        player.x = 100;
    }


}

function drawHealthbars() 
{
  var width = 200;
  var height = 30;
  context.font = "30px Arial";
  
  context.fillStyle = "#978697";

  // player health bar
  context.fillRect(player.x - 55, player.y - 35, width, height);
  // Draw the filled portion of the bar
  context.fillStyle = "#16A416";
  var fillVal = player.health * 2
  context.fillRect(player.x - 55, player.y - 35, fillVal, height);
  
  // enemy health bar
  context.fillRect(boss.x + 100, boss.y - 25, width, height);
  // Draw the filled portion of the bar
  context.fillStyle = "#16A416";
  
  fillVal = boss.health * 2;
  context.fillRect(boss.x + 100, boss.y - 25, fillVal, height);
  
}