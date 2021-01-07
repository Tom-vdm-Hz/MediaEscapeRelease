class Game {
    constructor(canvas, playerName, characterName, windowHeight, windowWidth) {
        this.rooms = [];
        this.step = () => {
            this.update();
            this.render();
            requestAnimationFrame(this.step);
        };
        this.canvas = canvas;
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        this.player = new Player(playerName, characterName, Game.loadNewImage(`assets/img/players/char${characterName}back.png`), this.canvas.width, this.canvas.height, 'hallway1.png');
        this.view = new View(Game.loadNewImage('assets/img/backgrounds/hallway1.png'));
        this.fillLists();
        this.createRooms();
        requestAnimationFrame(this.step);
    }
    update() {
        this.player.update(this.canvas.width, this.canvas.height);
        if (this.getImgName(this.view.img).includes('1')) {
            this.doorAndLobbyDetection(this.doorLocationsLobby1);
        }
        else if (this.getImgName(this.view.img).includes('2')) {
            this.doorAndLobbyDetection(this.doorLocationsLobby2);
        }
        this.doorAndLobbyDetection(this.lobbies);
        this.returnToLobby();
    }
    getCursorPosition(x, y, type) {
        if (this.activeRoom != null && this.activeQuestion === undefined) {
            let question = this.activeRoom.checkClick(x, y, type);
            if (question != null) {
                this.activeQuestion = question;
            }
        }
        if (this.activeQuestion != undefined) {
            switch (this.activeQuestion.checkAnswer(x, y, type)) {
                case true:
                    Game.removeItem(this.activeRoom.questions, this.activeQuestion);
                    this.activeQuestion = undefined;
                    break;
                case false:
                    this.activeQuestion = undefined;
                    break;
                default:
                    break;
            }
        }
    }
    render() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.view.draw(ctx, this.canvas.width, this.canvas.height);
        this.player.draw(ctx);
        if (this.activeQuestion != undefined) {
            this.activeQuestion.draw(ctx, this.canvas.width, this.canvas.height);
        }
    }
    doorAndLobbyDetection(list) {
        let playerX = this.player.x + (this.player.baseImg.width / 2);
        let playerY = this.player.y + (this.player.baseImg.height / 2);
        list.forEach((obj) => {
            if ((playerX >= obj.minX) && (playerX <= obj.maxX) && (playerY >= obj.minY) && (playerY <= obj.maxY)) {
                switch (obj.name) {
                    case 'lobby':
                        switch (obj.img) {
                            case '1':
                                if (this.getImgName(this.view.img).includes('2')) {
                                    this.player.x = this.player.baseImg.width - (this.player.baseImg.width / 2);
                                    this.view = new View(Game.loadNewImage(`assets/img/backgrounds/hallway${obj.img}.png`));
                                    this.player.lobby = this.getImgName(this.view.img);
                                }
                                break;
                            case '2':
                                if (this.getImgName(this.view.img).includes('1')) {
                                    this.player.x = this.canvas.width - (this.player.baseImg.width * 1.1);
                                    this.view = new View(Game.loadNewImage(`assets/img/backgrounds/hallway${obj.img}.png`));
                                    this.player.lobby = this.getImgName(this.view.img);
                                }
                                break;
                        }
                        break;
                    case 'door':
                        if (this.player.keyListener.isKeyDown(13)) {
                            this.rooms.forEach(room => {
                                if (this.getImgName(room.img) === `${obj.img}.jpg`) {
                                    this.view = room;
                                    this.activeRoom = room;
                                    this.player.inRoom = true;
                                }
                            });
                        }
                        break;
                }
            }
        });
    }
    returnToLobby() {
        if (this.player.keyListener.isKeyDown(27) && this.activeQuestion === undefined) {
            this.view = new View(Game.loadNewImage(`assets/img/backgrounds/${this.player.lobby}`));
            this.activeRoom = null;
            this.player.inRoom = false;
        }
    }
    static writeTextToCanvas(ctx, text, xCoordinate, yCoordinate, fontSize = 30, color = "black", alignment = "center") {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, xCoordinate, yCoordinate);
    }
    static removeItem(list, obj) {
        list.slice(list.indexOf(obj), 1);
    }
    static loadNewImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
    getImgName(img) {
        let fullPath = img.src;
        return fullPath.replace(/^.*[\\\/]/, '');
    }
    createRooms() {
        let basic1 = new RoomBasic303(Game.loadNewImage('assets/img/rooms/room3.jpg'), this.canvas.width, this.canvas.height);
        let basic2 = new RoomSky403(Game.loadNewImage('assets/img/rooms/room7.jpg'), this.canvas.width, this.canvas.height);
        let bath = new RoomBath401(Game.loadNewImage('assets/img/rooms/room4.jpg'), this.canvas.width, this.canvas.height);
        let beach = new RoomBeach402(Game.loadNewImage('assets/img/rooms/room6.jpg'), this.canvas.width, this.canvas.height);
        let chinese = new RoomChinese400(Game.loadNewImage('assets/img/rooms/room5.jpg'), this.canvas.width, this.canvas.height);
        let future = new RoomFuture301(Game.loadNewImage('assets/img/rooms/room1.jpg'), this.canvas.width, this.canvas.height);
        let penthouse = new RoomPenthouse302(Game.loadNewImage('assets/img/rooms/room2.jpg'), this.canvas.width, this.canvas.height);
        this.rooms.push(basic1, basic2, bath, beach, chinese, future, penthouse);
    }
    fillLists() {
        this.lobbies = [
            {
                name: 'lobby',
                minX: 0,
                minY: 0,
                maxX: this.player.baseImg.width / 2,
                maxY: this.canvas.height,
                img: '2'
            },
            {
                name: 'lobby',
                minX: this.canvas.width - (this.player.baseImg.width / 2),
                minY: 0,
                maxX: this.canvas.width,
                maxY: this.canvas.height,
                img: '1'
            }
        ];
        this.doorLocationsLobby1 = [
            {
                name: 'door',
                minX: this.canvas.width / 35,
                minY: this.canvas.height / 1.7,
                maxX: this.canvas.width / 6,
                maxY: this.canvas.height / 1.1,
                img: 'room1'
            },
            {
                name: 'door',
                minX: this.canvas.width / 3.4,
                minY: this.canvas.height / 1.7,
                maxX: this.canvas.width / 2.25,
                maxY: this.canvas.height / 1.1,
                img: 'room2'
            },
            {
                name: 'door',
                minX: this.canvas.width / 1.85,
                minY: this.canvas.height / 1.7,
                maxX: this.canvas.width / 1.45,
                maxY: this.canvas.height / 1.1,
                img: 'room3'
            },
            {
                name: 'door',
                minX: this.canvas.width / 6,
                minY: this.canvas.height / 5,
                maxX: this.canvas.width / 3.2,
                maxY: this.canvas.height / 2,
                img: 'room4'
            },
            {
                name: 'door',
                minX: this.canvas.width / 2.3,
                minY: this.canvas.height / 5,
                maxX: this.canvas.width / 1.76,
                maxY: this.canvas.height / 2,
                img: 'room5'
            },
        ];
        this.doorLocationsLobby2 = [
            {
                name: 'door',
                minX: this.canvas.width / 1.45,
                minY: this.canvas.height / 5,
                maxX: this.canvas.width / 1.2,
                maxY: this.canvas.height / 2,
                img: 'room6'
            },
            {
                name: 'door',
                minX: this.canvas.width / 2.3,
                minY: this.canvas.height / 5,
                maxX: this.canvas.width / 1.76,
                maxY: this.canvas.height / 2,
                img: 'room7'
            },
            {
                name: 'vault',
                minX: this.canvas.width / 1.7,
                minY: this.canvas.height / 1.7,
                maxX: this.canvas.width / 1.3,
                maxY: this.canvas.height / 1.1,
                img: 'room6'
            },
            {
                name: 'keypad',
                minX: this.canvas.width / 2.05,
                minY: this.canvas.height / 1.7,
                maxX: this.canvas.width / 1.85,
                maxY: this.canvas.height / 1.1,
                img: 'room6'
            },
        ];
    }
}
class KeyListener {
    constructor() {
        this.keyCodeStates = new Array();
        this.keyCodeTyped = new Array();
        this.previousState = new Array();
        window.addEventListener("keydown", (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        });
    }
    onFrameStart() {
        this.keyCodeTyped = new Array();
        this.keyCodeStates.forEach((val, key) => {
            if (this.previousState[key] != val && !this.keyCodeStates[key]) {
                this.keyCodeTyped[key] = true;
                this.previousState[key] = val;
            }
        });
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] == true;
    }
    isKeyTyped(keyCode) {
        return this.keyCodeTyped[keyCode] == true;
    }
}
KeyListener.KEY_ENTER = 13;
KeyListener.KEY_ESC = 27;
KeyListener.KEY_SPACE = 32;
KeyListener.KEY_LEFT = 37;
KeyListener.KEY_UP = 38;
KeyListener.KEY_RIGHT = 39;
KeyListener.KEY_DOWN = 40;
KeyListener.KEY_1 = 49;
KeyListener.KEY_2 = 50;
KeyListener.KEY_3 = 51;
KeyListener.KEY_4 = 52;
KeyListener.KEY_5 = 53;
KeyListener.KEY_6 = 54;
KeyListener.KEY_7 = 55;
KeyListener.KEY_8 = 56;
KeyListener.KEY_9 = 57;
KeyListener.KEY_0 = 58;
KeyListener.KEY_A = 65;
KeyListener.KEY_D = 68;
KeyListener.KEY_S = 83;
KeyListener.KEY_W = 87;
class Player {
    constructor(name, characterName, img, canvasWidth, canvasHeight, lobby) {
        this._baseImg = Game.loadNewImage(`assets/img/players/charaback.png`);
        this.speed = 3;
        this._inRoom = false;
        this._lastWalkImg = 1;
        this._playerName = name;
        this._characterName = characterName;
        this._img = img;
        this._x = canvasWidth / 2;
        this._y = canvasHeight - 231;
        this.keyListener = new KeyListener;
        this._lobby = lobby;
    }
    update(canvasWidth, canvasHeight) {
        this.img = Game.loadNewImage(`assets/img/players/char${this.playerName}back.png`);
        this.move(canvasWidth, canvasHeight);
    }
    move(canvasWidth, canvasHeight) {
        let floorDivider = canvasHeight / 2.07;
        let feetLocation = this.y + this.img.height;
        if (this.inRoom === false) {
            if (this.keyListener.isKeyDown(65)) {
                if (this.x >= 0) {
                    this.x -= this.speed;
                }
                this.walk('left');
            }
            if (this.keyListener.isKeyDown(68)) {
                if (canvasWidth >= this.x + this._img.width) {
                    this.x += this.speed;
                }
                this.walk('right');
            }
            if (this.keyListener.isKeyDown(87)) {
                switch (this.lobby) {
                    case 'hallway1.png':
                        if (this.x > canvasWidth / 1.15 && this.x < canvasWidth && this.y > floorDivider) {
                            this._x = canvasWidth / 1.15 - (this.img.width * 2);
                            this._y = canvasHeight / 2.07 - this.img.height;
                        }
                        break;
                    case 'hallway2.png':
                        if (this.x > 0 && this.x < canvasWidth / 8 && this.y > floorDivider) {
                            this._x = canvasWidth / 4.5 - this.img.width;
                            this._y = canvasHeight / 2.07 - this.img.height;
                        }
                        break;
                }
                this.img = Game.loadNewImage(`assets/img/players/char${this.playerName}back.png`);
            }
            if (this.keyListener.isKeyDown(83)) {
                switch (this.lobby) {
                    case 'hallway1.png':
                        if (this.x > canvasWidth / 1.3 && this.x < canvasWidth / 1.15 && this.y < floorDivider) {
                            this._x = canvasWidth / 1.1;
                            this._y = canvasHeight - this.img.height;
                        }
                        break;
                    case 'hallway2.png':
                        if (this.x > canvasWidth / 8 && this.x < canvasWidth / 4.5 && this.y < floorDivider) {
                            this._x = canvasWidth / 8 - (this.img.width * 2);
                            this._y = canvasHeight - this.img.height;
                        }
                        break;
                }
                this.img = Game.loadNewImage(`assets/img/players/char${this.playerName}front.png`);
            }
            this.applySimpleGravity(canvasHeight, feetLocation, floorDivider);
        }
    }
    walk(direction) {
        let walkNum = this.walkNumCalculation();
        switch (direction) {
            case 'right':
                this.img = Game.loadNewImage(`assets/img/players/walkcycle${this.playerName}/right/char${this.playerName}${walkNum}right.png`);
                break;
            case 'left':
                this.img = Game.loadNewImage(`assets/img/players/walkcycle${this.playerName}/left/char${this.playerName}${walkNum}left.png`);
                break;
        }
        this.lastWalkImg++;
    }
    applySimpleGravity(canvasHeight, feetLocation, floorDivider) {
        if (feetLocation > floorDivider + 5 && feetLocation < canvasHeight) {
            this.y += 2;
        }
        if (feetLocation < floorDivider && feetLocation < floorDivider - 5) {
            this.y += 2;
        }
    }
    draw(ctx) {
        if (this._inRoom === false) {
            ctx.drawImage(this._img, this._x, this._y);
        }
    }
    walkNumCalculation() {
        if (this.lastWalkImg >= 80) {
            this.lastWalkImg = 0;
        }
        if (this.lastWalkImg < 10) {
            return 10;
        }
        else if (this.lastWalkImg > 10 && this.lastWalkImg < 20) {
            return 20;
        }
        else if (this.lastWalkImg > 20 && this.lastWalkImg < 30) {
            return 30;
        }
        else if (this.lastWalkImg > 30 && this.lastWalkImg < 40) {
            return 40;
        }
        else if (this.lastWalkImg > 40 && this.lastWalkImg < 50) {
            return 50;
        }
        else if (this.lastWalkImg > 50 && this.lastWalkImg < 60) {
            return 60;
        }
        else if (this.lastWalkImg > 60 && this.lastWalkImg < 70) {
            return 70;
        }
        else if (this.lastWalkImg > 70 && this.lastWalkImg < 80) {
            return 80;
        }
        return null;
    }
    get lastWalkImg() {
        return this._lastWalkImg;
    }
    set lastWalkImg(value) {
        this._lastWalkImg = value;
    }
    get playerName() {
        return this._playerName;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get img() {
        return this._img;
    }
    set img(value) {
        this._img = value;
    }
    get characterName() {
        return this._characterName;
    }
    set characterName(value) {
        this._characterName = value;
    }
    get inRoom() {
        return this._inRoom;
    }
    set inRoom(value) {
        this._inRoom = value;
    }
    get lobby() {
        return this._lobby;
    }
    set lobby(value) {
        this._lobby = value;
    }
    get baseImg() {
        return this._baseImg;
    }
}
class Question {
    constructor(question, extraInfo, goodAnswer, badAnswer, img) {
        this._badAnswer = badAnswer;
        this._goodAnswer = goodAnswer;
        this._extraInfo = extraInfo;
        this._question = question;
        this._img = img;
    }
    draw(ctx, canvasWidth, canvasHeight) {
        let goodAnswerSize = ctx.measureText(this.question);
        let badAnswerSize = ctx.measureText(this.question);
        this.goodAnswerCoordinates = {
            minX: canvasWidth / 2 + (goodAnswerSize.width / 4),
            minY: canvasHeight / 1.2 - 30,
            maxX: canvasWidth / 2 + (goodAnswerSize.width / 2),
            maxY: canvasHeight / 1.2
        };
        this.badAnswerCoordinates = {
            minX: canvasWidth / 2 - (badAnswerSize.width / 2),
            minY: canvasHeight / 1.2 - 30,
            maxX: canvasWidth / 2 - (goodAnswerSize.width / 4),
            maxY: canvasHeight / 1.2
        };
        Game.writeTextToCanvas(ctx, this.question, canvasWidth / 2, canvasHeight / 4);
        Game.writeTextToCanvas(ctx, this.goodAnswer, canvasWidth / 1.8, canvasHeight / 1.2);
        Game.writeTextToCanvas(ctx, this.badAnswer, canvasWidth / 2.2, canvasHeight / 1.2);
        if (this.img != undefined) {
            ctx.drawImage(this.img, canvasWidth / 2 - (this.img.width / 2), canvasHeight / 2 - (this.img.height / 2));
        }
    }
    checkAnswer(x, y, type) {
        if ((x >= this.badAnswerCoordinates.minX) && (x <= this.badAnswerCoordinates.maxX) && (y >= this.badAnswerCoordinates.minY) && (y <= this.badAnswerCoordinates.maxY)) {
            if (type === 'click') {
                alert('Verkeerd Antwoord');
                return false;
            }
            else {
                document.getElementById('canvas').style.cursor = 'pointer';
            }
        }
        else if ((x >= this.goodAnswerCoordinates.minX) && (x <= this.goodAnswerCoordinates.maxX) && (y >= this.goodAnswerCoordinates.minY) && (y <= this.goodAnswerCoordinates.maxY)) {
            if (type === 'click') {
                alert('Goed Antwoord');
                return true;
            }
            else {
                document.getElementById('canvas').style.cursor = 'pointer';
            }
        }
        else {
            document.getElementById('canvas').style.cursor = 'default';
        }
        return null;
    }
    get question() {
        return this._question;
    }
    get extraInfo() {
        return this._extraInfo;
    }
    get goodAnswer() {
        return this._goodAnswer;
    }
    get badAnswer() {
        return this._badAnswer;
    }
    get img() {
        return this._img;
    }
}
class View {
    constructor(img) {
        this._img = img;
    }
    draw(ctx, cWidth, cHeight) {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, cWidth, cHeight);
    }
    get img() {
        return this._img;
    }
}
class Room extends View {
    constructor(room, questions, clickableItems) {
        super(room);
        this._questions = questions;
        this._clickableItems = clickableItems;
    }
    ;
    checkClick(x, y, type) {
        let question;
        if (type === 'hover') {
            document.getElementById('canvas').style.cursor = 'default';
        }
        this._clickableItems.forEach(obj => {
            if ((x >= obj.minX) && (x <= obj.maxX) && (y >= obj.minY) && (y <= obj.maxY)) {
                switch (type) {
                    case 'click':
                        question = this._questions[Math.floor(Math.random() * this._questions.length)];
                        break;
                    case 'hover':
                        document.getElementById('canvas').style.cursor = 'zoom-in';
                        break;
                }
            }
        });
        return question;
    }
    get questions() {
        return this._questions;
    }
    set questions(value) {
        this._questions = value;
    }
}
class RoomBasic303 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
class RoomBath401 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
class RoomBeach402 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
class RoomChinese400 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
class RoomFuture301 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
class RoomPenthouse302 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('Is deze man echt of nep?', 'Donald Trump was de president van amerika', 'Echt', 'Nep', Game.loadNewImage('assets/img/questionImages/trump.jpg')), new Question('Is deze man echt of nep?', 'Donald Trump was de president van amerika', 'Echt', 'Nep', Game.loadNewImage('assets/img/questionImages/trump.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 3.18,
            minY: canvasHeight / 1.25,
            maxX: canvasWidth / 2.8,
            maxY: canvasHeight / 1.17,
        }, {
            name: 'question',
            minX: canvasWidth / 1.12,
            minY: canvasHeight / 1.4,
            maxX: canvasWidth / 1.06,
            maxY: canvasHeight / 1.31,
        });
        super(room, questions, clickableItems);
    }
}
class RoomSky403 extends Room {
    constructor(room, canvasWidth, canvasHeight) {
        let questions = [];
        questions.push(new Question('test', 'test', 'test', 'test'), new Question('test', 'test', 'test', 'test', Game.loadNewImage('assets/img/questionImages/imgName.jpg')));
        let clickableItems = [];
        clickableItems.push({
            name: 'question',
            minX: canvasWidth / 35,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 6,
            maxY: canvasHeight / 1.1,
        }, {
            name: 'question',
            minX: canvasWidth / 3.4,
            minY: canvasHeight / 1.7,
            maxX: canvasWidth / 2.25,
            maxY: canvasHeight / 1.1,
        });
        super(room, questions, clickableItems);
    }
}
console.log("Javascript is working!");
document.getElementById("canvas").classList.add("hidden");
let myStartButton = document.getElementById("startButton");
let game;
myStartButton.addEventListener('click', () => {
    console.log("starting game!");
    document.getElementById("canvas").classList.remove("hidden");
    document.getElementById("canvas").classList.add("block");
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("visible");
    game = new Game(document.getElementById('canvas'), 'a', 'a', window.innerHeight, window.innerWidth);
});
function getMousePosition(canvas, event, type) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    game.getCursorPosition(x, y, type);
}
let canvasElem = document.querySelector("canvas");
canvasElem.addEventListener("mousedown", function (e) {
    getMousePosition(canvasElem, e, 'click');
});
canvasElem.addEventListener("mousemove", function (e) {
    getMousePosition(canvasElem, e, 'hover');
});
//# sourceMappingURL=app.js.map