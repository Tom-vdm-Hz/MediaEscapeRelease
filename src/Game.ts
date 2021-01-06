class Game {

    private player: Player;
    private view: View;
    private activeRoom: Room;
    private activeQuestion: Question
    private rooms: Room[] = []
    private readonly canvas: HTMLCanvasElement;
    private doorLocationsLobbyA: collisionObj[];
    private doorLocationsLobbyB: collisionObj[];
    private lobbies: collisionObj[]

    public constructor(canvas: HTMLElement, playerName: string, characterName: string, windowHeight: number, windowWidth: number) {
        this.canvas = <HTMLCanvasElement>canvas;
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;

        this.player = new Player(playerName, characterName, Game.loadNewImage(`assets/img/players/char${characterName}back.png`), this.canvas.width, this.canvas.height, 'hallwaya.png')
        this.view = new View(Game.loadNewImage('assets/img/backgrounds/hallwaya.png'))

        this.fillLists()
        this.createRooms()
        requestAnimationFrame(this.step);
    }


    /**
     * This MUST be an arrow method in order to keep the `this` variable
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    step = () => {
        this.update()
        this.render()
        requestAnimationFrame(this.step);
    }


    public update() {
        this.player.update(this.canvas.width, this.canvas.height)

        if (this.getImgName(this.view.img).includes('a')) {
            this.doorAndLobbyDetection(this.doorLocationsLobbyA)
        } else if (this.getImgName(this.view.img).includes('b')) {
            this.doorAndLobbyDetection(this.doorLocationsLobbyB)
        }

        this.doorAndLobbyDetection(this.lobbies)
        this.returnToLobby()
    }


    public getCursorPosition(x: number, y: number, type: string) {
        if (this.activeRoom != null && this.activeQuestion === undefined) {
            let question = this.activeRoom.checkClick(x, y, type)
            if (question != null) {
                this.activeQuestion = question
            }
        }
        if (this.activeQuestion != undefined) {
            switch (this.activeQuestion.checkAnswer(x, y, type)) {
                case true:
                    Game.removeItem(this.activeRoom.questions, this.activeQuestion)
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


    public render() {
        // Render the items on the canvas
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.view.draw(ctx, this.canvas.width, this.canvas.height)
        this.player.draw(ctx)

        ctx.beginPath();
        ctx.rect(this.canvas.width / 1.12, this.canvas.height / 1.4, 10, 10);
        ctx.stroke();

        if (this.activeQuestion != undefined) {
            this.activeQuestion.draw(ctx, this.canvas.width, this.canvas.height)
        }
    }

    public doorAndLobbyDetection(list: collisionObj[]) {
        let playerX: number = this.player.x + (this.player.baseImg.width / 2)
        let playerY: number = this.player.y + (this.player.baseImg.height / 2)
        list.forEach((obj: collisionObj) => {
                if ((playerX >= obj.minX) && (playerX <= obj.maxX) && (playerY >= obj.minY) && (playerY <= obj.maxY)) {
                    switch (obj.name) {
                        case 'lobby':
                            switch (obj.img) {
                                case 'A':

                                    if (this.getImgName(this.view.img).includes('B')) {
                                        this.player.x = this.player.baseImg.width - (this.player.baseImg.width / 2)
                                        this.view = new View(Game.loadNewImage(`assets/img/backgrounds/hallway${obj.img}.png`))
                                        this.player.lobby = this.getImgName(this.view.img)
                                    }
                                    break
                                case 'B':
                                    if (this.getImgName(this.view.img).includes('A')) {
                                        this.player.x = this.canvas.width - (this.player.baseImg.width * 1.1)
                                        this.view = new View(Game.loadNewImage(`assets/img/backgrounds/hallway${obj.img}.png`))
                                        this.player.lobby = this.getImgName(this.view.img)
                                    }
                                    break
                            }
                            break;
                        case 'door':
                            if (this.player.keyListener.isKeyDown(13)) {
                                this.rooms.forEach(room => {
                                    if (this.getImgName(room.img) === `${obj.img}.jpg`) {
                                        this.view = room
                                        this.activeRoom = room
                                        this.player.inRoom = true;
                                    }
                                })
                            }
                            break;
                    }

                }
            }
        )
    }


    public returnToLobby() {
        if (this.player.keyListener.isKeyDown(27) && this.activeQuestion === undefined) {
            this.view = new View(Game.loadNewImage(`assets/img/backgrounds/${this.player.lobby}`))
            this.activeRoom = null;
            this.player.inRoom = false;
        }
    }

    /**
     * Writes text to the canvas
     * @param ctx
     * @param {string} text - Text to write
     * @param {number} fontSize - Font size in pixels
     * @param {number} xCoordinate - Horizontal coordinate in pixels
     * @param {number} yCoordinate - Vertical coordinate in pixels
     * @param {string} alignment - Where to align the text
     * @param {string} color - The color of the text
     */
    public static writeTextToCanvas(
        ctx: CanvasRenderingContext2D,
        text: string,
        xCoordinate: number,
        yCoordinate: number,
        fontSize: number = 30,
        color: string = "black",
        alignment: CanvasTextAlign = "center"
    ) {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, xCoordinate, yCoordinate);
    }

    public static removeItem(list: any, obj: any) {
        // @ts-ignore
        list.slice(list.indexOf(obj), 1);
    }


    /**
     * Loads an image in such a way that the screen doesn't constantly flicker
     * @param {HTMLImageElement} source
     * @return HTMLImageElement - returns an image
     */
    public static loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }

    public getImgName(img: HTMLImageElement): string {
        let fullPath = img.src;
        return fullPath.replace(/^.*[\\\/]/, '')
    }


    private createRooms() {
        let basic1: Room = new RoomBasic303(Game.loadNewImage('assets/img/rooms/room3.jpg'), this.canvas.width, this.canvas.height)
        let basic2: Room = new RoomSky403(Game.loadNewImage('assets/img/rooms/room7.jpg'), this.canvas.width, this.canvas.height)
        let bath: Room = new RoomBath401(Game.loadNewImage('assets/img/rooms/room4.jpg'), this.canvas.width, this.canvas.height)
        let beach: Room = new RoomBeach402(Game.loadNewImage('assets/img/rooms/room6.jpg'), this.canvas.width, this.canvas.height)
        let chinese: Room = new RoomChinese400(Game.loadNewImage('assets/img/rooms/room5.jpg'), this.canvas.width, this.canvas.height)
        let future: Room = new RoomFuture301(Game.loadNewImage('assets/img/rooms/room1.jpg'), this.canvas.width, this.canvas.height)
        let penthouse: Room = new RoomPenthouse302(Game.loadNewImage('assets/img/rooms/room2.jpg'), this.canvas.width, this.canvas.height)
        this.rooms.push(basic1, basic2, bath, beach, chinese, future, penthouse)
    }

    private fillLists() {
        this.lobbies = [
            {
                name: 'lobby',
                minX: 0,
                minY: 0,
                maxX: this.player.baseImg.width / 2,
                maxY: this.canvas.height,
                img: 'B'
            },
            {
                name: 'lobby',
                minX: this.canvas.width - (this.player.baseImg.width / 2),
                minY: 0,
                maxX: this.canvas.width,
                maxY: this.canvas.height,
                img: 'A'
            }
        ]
        this.doorLocationsLobbyA = [
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
        ]
        this.doorLocationsLobbyB = [
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

        ]
    }

}

type collisionObj = {
    name: string,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    img?: string
}
