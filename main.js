// Vide, a simple "stay between the lines" game

// constants
const DEBUG = true  // show debugging information
const CENTER = 1000/2
const SQUARE_SIZE = 10
const BIAS_RANGE = 20
const LOOP_PERIOD = 25  // milliseconds
const DIFFICULTY = 5  // difficulty proportional to square root of DIFFICULTY
const BOUNDRY_LEFT = 50+Math.floor(50*Math.sqrt(DIFFICULTY))
const BOUNDRY_RIGHT = 950 - Math.floor(50*Math.sqrt(DIFFICULTY))
const LEFT_KEYS = ["ArrowLeft", "a"]
const RIGHT_KEYS = ["ArrowRight", "d"]

let bias = BIAS_RANGE/2  // left bias is 0-BIAS_RANGE to 1, right (BIAS_RANGE/2)+1 to BIAS_RANGE, BIAS_RANGE/2 is neutral
let last_bias_update = new Date().getTime()
var pos = CENTER
let oldPos
let heldLenL = 0
let heldLenR = 0
let bias_update_period = 100*LOOP_PERIOD
let goLeft = true  // tracks current movement direction

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "red"
ctx.fillRect(0, 0, BOUNDRY_LEFT, 400)
ctx.fillRect(BOUNDRY_RIGHT, 0, 500, 400)  // using 500 for when boundry moves


// extension of console.log that only prints if debug mode is on
printDebug = function() {
    if (DEBUG)
        console.log.apply(console, Array.from(arguments))
}

document.addEventListener("keydown", async function(e) {
    if (LEFT_KEYS.includes(e.key)) {
        printDebug("pressing left")
        heldLenR = 0
        isKeyDownL = true
        goLeft = true;
    }
    if (RIGHT_KEYS.includes(e.key)) {
        printDebug("pressing right")
        heldLenL = 0
        goLeft = false;
    }
})

document.addEventListener("keyup", async function(e) {
    if (e.key == 'a') {
        printDebug("releasing left")
        isKeyDownL = false
    }
    if (e.key == 'd') {
        printDebug("releasing right")
    }
})

function getPos() {
    return pos
}

function setPos(x) {
    printDebug(`setting to ${x}`)
    pos = x
}

function update_bias() {
    bias = Math.floor(Math.random()*(BIAS_RANGE+1))
    last_bias_update = new Date().getTime()
    bias_update_period = Math.floor(60+Math.random()*60)*LOOP_PERIOD;
}

async function main(pos) {
    while (true) {

        pos = getPos()

        // places square on screen
        ctx.fillStyle = "black"
        ctx.fillRect(pos, 200, SQUARE_SIZE, SQUARE_SIZE)
        oldPos = pos

        // end condition
        if (pos < BOUNDRY_LEFT || pos > BOUNDRY_RIGHT-SQUARE_SIZE) {
            printDebug("lost");
            return;
        }

        if (goLeft) {
            heldLenL += LOOP_PERIOD*8
            pos = Math.floor(pos - (heldLenL/1000)**2)
            setPos(pos)
            printDebug(`Changing by ${heldLenL/100}`)
        }
        else {
            heldLenR += LOOP_PERIOD*8
            pos = Math.floor(pos + (heldLenR/1000)**2)
            setPos(pos)
            printDebug(`Changing by ${heldLenR/100}`)
        }

        printDebug(new Date().getTime());
        if (new Date().getTime() - last_bias_update > bias_update_period) {
            update_bias();
        }

        printDebug(((pos-CENTER)/100))
        pos = pos + (bias-BIAS_RANGE/2)  // add bias
        pos += Math.floor(((pos-CENTER)/100))  // add quadratic pull for edge
        setPos(pos)

        await new Promise(r => setTimeout(r, LOOP_PERIOD));
        
        // removes square from screen
        ctx.fillStyle = "white"
        ctx.fillRect(oldPos, 200, SQUARE_SIZE, SQUARE_SIZE)
    }
}

main(pos)
