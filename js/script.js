// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions

      // Reading File from a Server
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(xmlhttp.responseText);
          //document.getElementById("player").innerHTML = data[0];
          console.log(data.PlayerData);
        }
      };
      xmlhttp.open("GET", "./data/derulo.json", true);
      xmlhttp.send();

function GameObject(name, img, health,x,y) {
    this.name = name;
    this.img = img;
    this.health = health;
    this.x = x;
    this.y = y;
}

function drawTimer(timeLeft) {
    var width = 912;
    var height = 20;
    var max = 400;
    var value = timeLeft;

    //drawing the timer bar background
    context.fillStyle = "#000000";
    context.fillRect(0,0,width,height);

    //draw the time bar value
    context.fillStyle = "#800080";
    var fillValue = Math.min(Math.max(value/max,0),1);
    context.fillRect(0,0,fillValue*width,height);
}

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input

// Default Player
var sprite = new Image();
sprite.src = "./img/player.png";

//determines whether or not game can continue
var gameInProgress = true;

var graveSprite = new Image();
graveSprite.src = "./img/grave.png";

var gravebg = new Image();
gravebg.src = "./img/gloomybg.png";

var bgSprite = new Image();
bgSprite.src = "./img/bg.png";

var nameGrave = new Image();
nameGrave.src = "./img/NamelessGrave.png";

//used when calculating the time left
var counter = 0;

var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var uname = params.get("username");

var bossFight = true;

var player = new GameObject("Player", sprite, 100,0,0);
var graveOne = new GameObject("GraveOne", graveSprite , 100,155,250);
var graveTwo = new GameObject("GraveTwo", graveSprite , 100,355,250);
var graveThree = new GameObject("GraveThree", graveSprite , 100,555,250);
var graveFour = new GameObject("GraveFour", graveSprite , 100,755,250);
var userGrave = new GameObject("NamelessGrave",nameGrave,100,625,80);
var bg = new GameObject("Graveyard", gravebg , 100,0,0);
var endScreen = new GameObject("End",bgSprite,100,0,0);
var buttonSound = document.getElementById("buttonSound");

// Gameobjects is a collection of the Actors within the game
var gameobjects = [graveOne,graveTwo,graveThree];

// which graves are empty
var alive = [true,true,true,true];

//checks if player wants to dig
var dig = false;
//checks if player is close enough to grave for prompt to pop up
var showE = false;
//stores which weapon was randomised
var weapon;
var healthStuff = ["A","B","C"];
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
    // Take Input from the Player
    if (event.type === "keydown") {
        switch (event.keyCode) {
            case 37:
                gamerInput = new GamerInput("Left");
                direction = 1;
                break; //Left key
            case 38:
                gamerInput = new GamerInput("Up");
                direction = 2;
                break; //Up key
            case 39:
                gamerInput = new GamerInput("Right");
                direction = 3;
                break; //Right key
            case 40:
                gamerInput = new GamerInput("Down");
                direction = 4;
                break; //Down key
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

function update() {
    switch (direction)
    {
        case 0:
        player.x = player.x;
        player.y = player.y;
        break;
        case 1:
            player.x -= 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
        break;
        case 2:
            player.y -= 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
        break;
        case 3:
            player.x += 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
        break;
        case 4:
            player.y += 1;
            showAnnouncement = false;
            showHealthAnnounce = false;
        break;
    }
    boundaryCheck();
    checkIntersect();

    if(counter === 4000)
    {
        console.log("Time is up");
        gameInProgress = false;
    }
    else
    {
        counter++
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
    if(direction != 0)
  {  current = new Date().getTime(); // update current
    if (current - initial >= 300) { // check is greater that 500 ms
        currentFrame = (currentFrame + 1) % frames; // update frame
        initial = current; // reset initial
    } 
}
    // Draw sprite frame
   context.clearRect(0, 0, canvas.width, canvas.height);
   context.drawImage(bg.img, bg.x, bg.y, 912, 512);
   if(alive[0] == true){
       context.drawImage(graveOne.img, graveOne.x, graveOne.y, 141.3333333333333, 170.6666666666667);
    }
       if(alive[1] == true){
   context.drawImage(graveTwo.img, graveTwo.x, graveTwo.y, 141.3333333333333, 170.6666666666667);
       }
       if(alive[2] == true){
   context.drawImage(graveThree.img, graveThree.x, graveThree.y, 141.3333333333333, 170.6666666666667);
       }
       if(alive[3] == true){
   context.drawImage(graveFour.img, graveFour.x, graveFour.y, 141.3333333333333, 170.6666666666667);
       }
    context.drawImage(player.img, (player.img.width / 4) * currentFrame, 0, 214, 368, player.x, player.y, 107, 184);

    context.drawImage(userGrave.img, userGrave.x, userGrave.y, 106, 128);


    context.font = "10px Verdana";
    context.fillStyle = "black";
    context.fillText(uname, 655,120);

    if(showE == true)
    {context.font = "30px Verdana";
    context.fillStyle = "white";
    context.fillText("E", player.x +(player.img.width / 16) ,player.y - 10);
    }
    if(showAnnouncement == true || showHealthAnnounce == true)
    {
        context.fillStyle = '#CEB6DD';
        context.fillRect(256, 181, 400, 100);
    }
    if(weapon == "Sword" && showAnnouncement == true)
    {
        context.font = "30px Verdana";
        context.fillStyle = "black";
        context.fillText("Sword Found!", 346,246);
        console.log(healthStuff);
    }
    else if(weapon == "Dagger" && showAnnouncement == true)
    {
        context.font = "30px Verdana";
        context.fillStyle = "black";
        context.fillText("Dagger Found!", 346,246);
        console.log(healthStuff);
    }
    if(chosenHealth == "Health Potion" && showHealthAnnounce == true)
    {
        context.font = "30px Verdana";
        context.fillStyle = "black";
        context.fillText("Health Potion Found!", 306,246);
        console.log(healthStuff);
    }
    else if(chosenHealth == "Food" && showHealthAnnounce == true)
    {
        context.font = "30px Verdana";
        context.fillStyle = "black";
        context.fillText("Food Found!", 366,246);
        console.log(healthStuff);
    }
    //timer
   drawTimer(counter/10);
}

//boundary checking
function boundaryCheck() {
    if(player.x < 0 - 20)
    {
        player.x = 0 - 20;
    }

    else if(player.x > (canvas.width - (player.img.width / 8)))
    {
         player.x = (canvas.width - (player.img.width / 8));
    }

    if(player.y < 250)
    {
        player.y = 250;
    }


    else if(player.y > (canvas.height - 180))
    {
        player.y = (canvas.height - 180);
    }

}


//checks if player is close enough to dig
function checkIntersect(){
    if(player.x >= graveOne.x - 30 && player.x <= graveOne.x + 30)
    {
        if(alive[0] == true)
        {showE = true;
        if(dig == true)
        {
            alive[0]= false;
            console.log(freeInv);
            generateHealth();
            freeInv = freeInv + 1;
            dig = false;
        }
        }
    }
    else if(player.x >= graveTwo.x - 30 && player.x <= graveTwo.x + 30)
    {
        if(alive[1] == true)
       { showE = true;
        if(dig == true)
        {
            alive[1]= false;
            console.log(freeInv);
            generateHealth();
            freeInv = freeInv + 1
            dig = false;
        }}
    }
    else if(player.x >= graveThree.x - 30 && player.x <= graveThree.x + 30)
    {
        if(alive[2] == true)
       {showE = true;
        if(dig == true)
        {
            alive[2]= false;
            console.log(freeInv);
            generateHealth();
             freeInv = freeInv + 1
            dig = false;
        }}
    }
    else if(player.x >= graveFour.x -30 && player.x <= graveFour.x + 30)
    {
        if(alive[3] == true)
        {showE = true;
        if(dig == true)
        {
            alive[3]= false;
            generateWeapon();
            dig = false;
        }}
    }
    else{
        showE = false;
        dig = false;
    }

}
function gameloop() {
    if(gameInProgress) {
        update();
        draw();
        window.requestAnimationFrame(gameloop);
    }
    else{
        gameOver();
    }
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

// Handle Keypressed
window.addEventListener('keyup', input);
window.addEventListener('keydown', input);

document.getElementById("buttonUp").onmouseup = function() {noInput()};
document.getElementById("buttonLeft").onmouseup = function() {noInput()};
document.getElementById("buttonRight").onmouseup = function() {noInput()};
document.getElementById("buttonDown").onmouseup = function() {noInput()};

function buttonOnClickW(){
    gamerInput = new GamerInput("Up");
    direction = 2;
}

function buttonOnClickA(){
    gamerInput = new GamerInput("Left");
    direction = 1;
}

function buttonOnClickD(){
    gamerInput = new GamerInput("Right");
    direction = 3;
}

function buttonOnClickS(){
    gamerInput = new GamerInput("Down");
    direction = 4;
}

function noInput(){
    gamerInput = new GamerInput("None");
    direction = 0;
}

function useButton(){
    dig = true;
}

function generateWeapon(){
    var randWeapon =(Math.random() * 8);
    if(randWeapon >= 1 && randWeapon < 2)
    {
        showAnnouncement = true;
        weapon = "Sword";
        console.log(weapon);
        console.log(randWeapon);
    }
    else
    {
        showAnnouncement = true;
        weapon = "Dagger";
        console.log(weapon);
        console.log(randWeapon);
    }
}

function generateHealth(){
    var randHealth =(Math.random() * 4);
    if(randHealth >= 1 && randHealth < 2)
    {
        showHealthAnnounce = true;
        healthStuff[freeInv] = "Health Potion";
        chosenHealth = "Health Potion";
        console.log(healthStuff);
        console.log(randHealth);
    }
    else
    {
        showHealthAnnounce = true;
        healthStuff[freeInv]  = "Food";
        chosenHealth = "Food";
        console.log(healthStuff);
        console.log(randHealth);
    }
}


//determines what happens when timer runs out
function gameOver(){
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
  } else{
    localStorage.setItem('score', parseInt(current_score) + 1);
    document.getElementById("SCORE").innerHTML = " Score:  [" + current_score + " ] ";
  }

}

