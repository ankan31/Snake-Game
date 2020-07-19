var c=document.getElementById("board");
var ctx=c.getContext("2d");

const scale=10;
const width=50;
const height=50;

function snake_body(x,y) {
    this.x=x;
    this.y=y;
    this.dir="left";
    this.draw=function () {
        ctx.fillStyle="green";
        ctx.fillRect(this.x*scale,this.y*scale,scale,scale);
    }
    this.move=function () {
        switch (this.dir) {
            case "left":
                this.x--;
                if (this.x<0) {
                    this.x=width-1;
                }
                break;
            case "right":
                this.x++;
                if (this.x>width-1) {
                    this.x=0;
                }
                break;
            case "up":
                this.y--;
                if (this.y<0) {
                    this.y=width-1;
                }
                break;
            case "down":
                this.y++;
                if(this.y>width-1) {
                    this.y=0;
                }
                break;
            default:
                break;
        }
    }
}



function snake() {
    var structure=initial_snake(5);

    this.respond=function () {
        document.addEventListener("keydown",function(event) {
            switch (event.keyCode) {
                case 37:
                    if (structure[0].dir!="right") {
                        structure[0].dir="left";
                    }
                    break;
                case 38:
                    if (structure[0].dir!="down") {
                        structure[0].dir="up";
                    }
                    break;
                case 39:
                    if (structure[0].dir!="left") {
                        structure[0].dir="right";
                    }
                    break;
                case 40:
                    if (structure[0].dir!="up") {
                        structure[0].dir="down";
                    }
                    break;
                default:
                    break;
            }
        });
    }

    this.move=function() {
        for (let i = 0; i < structure.length; i++) {
            structure[i].move();
        }
        for (let i = structure.length-1; i > 0; i--) {
            structure[i].dir=structure[i-1].dir;
        }
    }

    this.draw=function() {
        ctx.clearRect(0,0,scale*width,scale*height);
        for (let i = 0; i < structure.length; i++) {
            structure[i].draw();
        }
    }

    this.eat=function (x,y) {
        if (x==structure[0].x && y==structure[0].y) {
            return true;
        } else {
            return false;
        }
    }

    this.extend=function() {
        var tail=structure[structure.length-1];
        switch (tail.dir) {
            case "left":
                structure.push(new snake_body(tail.x+1,tail.y));
                structure[structure.length-1].dir=tail.dir;
                break;
            case "right":
                structure.push(new snake_body(tail.x-1,tail.y));
                structure[structure.length-1].dir=tail.dir;
                break;
            case "up":
                structure.push(new snake_body(tail.x,tail.y+1));
                structure[structure.length-1].dir=tail.dir;
                break;
            case "down":
                structure.push(new snake_body(tail.x,tail.y-1));
                structure[structure.length-1].dir=tail.dir;
                break;
            default:
                break;
        }
    }

    this.check=function (x,y) {
        for (let i = 0; i < structure.length; i++) {
            if (structure[i].x==x && structure[i].y==y) {
                return false;
            }
        }
        return true;
    }

    this.end=function () {
        for (let i = 1; i < structure.length; i++) {
            if (structure[i].x==structure[0].x && structure[i].y==structure[0].y) {
                return true;
            }
        }
        return false;
    }
}

function initial_snake(k) {
    var structure=[new snake_body(Math.floor(Math.random()*(width-1)),Math.floor(Math.random()*(height-1)))];
    for (let i = 1; i <= k; i++) {
        structure.push(new snake_body(structure[0].x+i,structure[0].y))
    }
    return structure;
}

function food() {
    this.x=Math.floor(Math.random()*(width-1));
    this.y=Math.floor(Math.random()*(height-1));

    this.draw= function () {
        ctx.fillStyle="red";
        ctx.fillRect(this.x*scale,this.y*scale,scale,scale);
    }
}

function game() {
    var score=0;
    s=new snake();
    f=new food();
    id=setInterval(() => {
        s.draw();
        document.getElementById("score-board").innerHTML="Score :"+score;
        f.draw();
        s.respond();
        s.move();
        if (s.eat(f.x,f.y)==true) {
            score++;
            f=new food();
            while (s.check(f.x,f.y)==false) {
                f=new food();
            }
            s.extend();
        }
        if (s.end()==true) {
            document.getElementById("game-end").style.visibility="visible";
            clearInterval(id);
            return false;
        }
    }, 200);
}