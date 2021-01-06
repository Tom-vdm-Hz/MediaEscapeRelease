/// <reference path="View.ts"/>

class Room extends View {


    private _questions: Question[]
    private _clickableItems: collisionObj[]


    public constructor(room: HTMLImageElement, questions: Question[], clickableItems: collisionObj[]) {
        super(room)
        this._questions = questions
        this._clickableItems = clickableItems
    };

    public checkClick(x: number, y: number, type: string): Question {
        let question: Question;
        if (type === 'hover') {
            document.getElementById('canvas').style.cursor = 'default'
        }
        this._clickableItems.forEach(obj => {
            if ((x >= obj.minX) && (x <= obj.maxX) && (y >= obj.minY) && (y <= obj.maxY)) {
                switch (type) {
                    case 'click':
                        question = this._questions[Math.floor(Math.random() * this._questions.length)]
                        break;
                    case 'hover':
                        document.getElementById('canvas').style.cursor = 'zoom-in'
                        break;
                }
            }
        })
        return question
    }


    get questions(): Question[] {
        return this._questions;
    }

    set questions(value: Question[]) {
        this._questions = value;
    }

   
}



