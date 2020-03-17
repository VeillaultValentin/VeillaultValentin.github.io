// Classe Gun //-----------------------------------------------------------------------------
class Ammo extends Sprite {
    constructor(hauteur, largeur, scale) {
        super(document.createElement("img"));
        this.setImage("assets/ammo.svg", largeur, hauteur);
        this.scale_ = scale;
    }
    move(distance) {
        let origin = [this.getX(), this.getY()];
        let angle = this.getRotation() + 90;
        let vector = [-Math.cos(angle * (Math.PI / 180)), -Math.sin(angle * (Math.PI / 180))];
        let i = 0;
        let int = window.setInterval(() => {
            if (i > 1) {
                window.clearInterval(int);
                this.getParent().retirer(this);
            }
            this.setXY(origin[0] + distance * vector[0] * i, origin[1] + distance * vector[1] * i);
            i += 0.005;
        }, 1);
    }
    getAbsoluteX() {
        if (this.getParent().getBalise().style.transform.split(" ")[1] == "scaleX(-1)") {
            return -this.getX() + this.getParent().getX() + 304 * this.scale_;
        }
        else {
            return this.getX() + this.getParent().getX();
        }
    }
    getAbsoluteY() {
        return (this.getY() + this.getParent().getY());
    }
}
//# sourceMappingURL=Ammo.js.map