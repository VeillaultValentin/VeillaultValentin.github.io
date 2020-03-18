// Classe Gun //-----------------------------------------------------------------------------
class Ammo extends Sprite {
    private scale_: number;

    public constructor(hauteur: number, largeur: number, scale: number) {
        super(document.createElement("img"));
        this.setImage("assets/ammo.svg", largeur, hauteur);
        this.scale_ = scale;
    }
    public move(distance: number) {
        let origin: number[] = [this.getX(), this.getY()];
        let angle: number = this.getRotation() + 90;
        let vector: number[] = [- Math.cos(angle * (Math.PI / 180)), - Math.sin(angle * (Math.PI / 180))];
        let i: number = 0;
        let int = window.setInterval(() => {
            if (i > 1) {
                window.clearInterval(int);
                this.getParent().retirer(this);
            }
            this.setXY(origin[0] + distance * vector[0] * i, origin[1] + distance * vector[1] * i);
            i += 0.005;
        }, 1);
    }
    public getAbsoluteX(): number {
        if (this.getParent().getBalise().style.transform.split(" ")[1] == "scaleX(-1)") {
            return -this.getX() + this.getParent().getX() + 304 * this.scale_;
        } else {
            return this.getX() + this.getParent().getX();
        }
    }
    public getAbsoluteY(): number {
        return (this.getY() + this.getParent().getY());
    }
}
