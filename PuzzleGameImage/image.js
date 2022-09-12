let source;
let tiles = [];
let cols= 3;
let rows = 3;
let w,h;
let board = [];
let start = 0;
let difficulty = 10;
let level = document.getElementsByClassName(".difficulty_button");



function preload(){
    source = loadImage("https://images.pexels.com/photos/1500610/pexels-photo-1500610.jpeg?auto=compress&cs=tinysrgb&w=600"); // Load the image
}

function setup() {
    createCanvas(300, 300);
    w= floor(width/rows);
    h= floor(height/cols);
    // let t = 0;


    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * w;
            let y = j * h;
            let img = createImage(w,h);
            // img.loadPixels();
            img.copy(source, x, y, w, h, 0, 0, w, h);
            // img.updatePixels();
            let index = i+j*cols;
            // let index = t++;
            let tile = new Tile(index,img);
            tiles.push(tile);
            board.push(index);
        } 
    }
    tiles.pop();
    board.pop();
    board.push(-1);

    console.log(board);
    // shuffle(board,true);
    simpleShuffle(board);
    // Move();   
}

function randomMove(arr) {
    let r1 = floor(random(cols));
    let r2 = floor(random(rows));
    Move(r1,r2,arr);
}

function simpleShuffle(arr) {
    for (let i = 0; i < difficulty; i++) {
        randomMove(arr);
        // start++;
    }
}

function swap(i,j,arr) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function Move(i, j,arr) {
    let blank = findBlank();
    let blankCol = blank % cols;
    let blankRow = floor(blank / rows);

    if (isNeighbor(i,j,blankCol,blankRow) == true) {
        swap(blank, i + j * cols, arr);
    }
}


function isNeighbor(i,j,x,y){
    if(i !== x && j !== y) {return false;}
    if (abs(i-x) ==1 || abs(j - y) == 1) {return true;}
    return false;
}

function findBlank() {
    for (let i = 0; i < board.length; i++) {
       if (board[i] == -1) {
         return i;
       } 
    }
}


function mousePressed() {
    let i  =floor(mouseX/w);
    let j  =floor(mouseY/h);
    console.log(i,j);
    Move(i,j,board);
}
  
function draw() {
  // Displays the image at its actual size at point (0,0)
    //   image(source, 0, 0);
    background(0);
    // let t = 0;
    // randoMove(board);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * w; 
            let y = j * h;
            let index = i+j*cols;
            // let index = t++;
            let tileIndex = board[index];
            if (tileIndex !== -1) {
                let img = tiles[tileIndex].img;
                image(img,x,y);
            }
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = i * w;
            let y = j * h;
            strokeWeight(2);
            noFill();
            rect(x, y, w, h);
        }
    }   
    console.log(board);
    // randomMove(board);
    
    if (isSolved() === true) {
        alert("You resolved this part");
    }
}

function isSolved() {
    for (let i = 0; i < board.length-1; i++) {
        if (board[i] !== tiles[i].index) {
            // noLoop();
            return false;
        }
    }
    // start=100;
    noLoop();
    return true;
}

class Tile{
    constructor(i,img){
        this.index = i;
        this.img = img;
    }
}