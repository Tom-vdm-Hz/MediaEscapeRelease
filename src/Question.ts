class Question {

    private readonly _question: string
    private readonly _extraInfo: string
    private readonly _goodAnswer: string;
    private goodAnswerCoordinates: coordinates;
    private readonly _badAnswer: string
    private badAnswerCoordinates: coordinates;
    private readonly _img: HTMLImageElement

    public constructor(question: string, extraInfo: string, goodAnswer: string, badAnswer: string, img?: HTMLImageElement) {
        this._badAnswer = badAnswer
        this._goodAnswer = goodAnswer
        this._extraInfo = extraInfo
        this._question = question
        this._img = img
    }


    public draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        let goodAnswerSize = ctx.measureText(this.question)
        let badAnswerSize = ctx.measureText(this.question)
        this.goodAnswerCoordinates = {
            minX: canvasWidth / 2 + (goodAnswerSize.width / 4),
            minY: canvasHeight / 1.2 - 30,
            maxX: canvasWidth / 2 + (goodAnswerSize.width / 2),
            maxY: canvasHeight / 1.2
        }
        this.badAnswerCoordinates = {
            minX: canvasWidth / 2 - (badAnswerSize.width / 2),
            minY: canvasHeight / 1.2 - 30,
            maxX: canvasWidth / 2 - (goodAnswerSize.width / 4),
            maxY: canvasHeight / 1.2
        }
        Game.writeTextToCanvas(ctx, this.question, canvasWidth / 2, canvasHeight / 4)
        Game.writeTextToCanvas(ctx, this.goodAnswer, canvasWidth / 1.8, canvasHeight / 1.2)
        Game.writeTextToCanvas(ctx, this.badAnswer, canvasWidth / 2.2, canvasHeight / 1.2)
        if (this.img != undefined) {
            ctx.drawImage(this.img, canvasWidth / 2 - (this.img.width / 2), canvasHeight / 2 - (this.img.height / 2))
        }
    }

    public checkAnswer(x: number, y: number, type: string): boolean {
        if ((x >= this.badAnswerCoordinates.minX) && (x <= this.badAnswerCoordinates.maxX) && (y >= this.badAnswerCoordinates.minY) && (y <= this.badAnswerCoordinates.maxY)) {
            if (type === 'click') {
                alert('Verkeerd Antwoord')
                return false
            } else {
                document.getElementById('canvas').style.cursor = 'pointer'
            }
        } else if ((x >= this.goodAnswerCoordinates.minX) && (x <= this.goodAnswerCoordinates.maxX) && (y >= this.goodAnswerCoordinates.minY) && (y <= this.goodAnswerCoordinates.maxY)) {
            if (type === 'click') {
                alert('Goed Antwoord')
                return true
            } else {
                document.getElementById('canvas').style.cursor = 'pointer'
            }
        } else {
            document.getElementById('canvas').style.cursor = 'default'
        }
        return null
    }


    get question(): string {
        return this._question;
    }

    get extraInfo(): string {
        return this._extraInfo;
    }


    get goodAnswer(): string {
        return this._goodAnswer;
    }

    get badAnswer(): string {
        return this._badAnswer;
    }

    get img(): HTMLImageElement {
        return this._img;
    }
}

type coordinates = {
    minX: number
    minY: number
    maxX: number
    maxY: number
}
