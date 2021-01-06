class View {
    private readonly _img: HTMLImageElement;


    constructor(img: HTMLImageElement) {
        this._img = img;
    }

    public draw(ctx: CanvasRenderingContext2D, cWidth: number, cHeight: number) {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height,
            0, 0, cWidth, cHeight);
    }


    get img(): HTMLImageElement {
        return this._img;
    }
}
