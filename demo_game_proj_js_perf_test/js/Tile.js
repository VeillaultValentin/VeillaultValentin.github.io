class Tile extends Sprite {
    constructor(description, size) {
        if (description["overlay"]) {
            /* group tile & overlay */
            super(document.createElement("div"));
            this.setDimension(size, size);
            /* set tile in itself since it's a div group now */
            let tile = new Sprite(document.createElement("img"));
            tile.setImage("assets/levels/" + description["image"], size, size);
            this.ajouter(tile);
            /* set overlay */
            this.setOverlay(description["overlay"]);
        }
        else if (description["image"]) {
            /* set only tile */
            super(document.createElement("img"));
            this.setImage("assets/levels/" + description["image"], size, size);
        }
        else {
            /* set tile as an empty div */
            super(document.createElement("div"));
            this.setDimension(size, size);
        }
        this.type_ = description["type"];
        this.getBalise().classList.add("tile");
        this.getBalise().classList.add(this.type_);
    }
    checkLimits(NewX) {
        if (NewX <= this.getX() || NewX >= this.getX() + this.getLargeur()) {
            return true;
        }
        else {
            return false;
        }
    }
    setOverlay(img) {
        let overlay = new Sprite(document.createElement("img"));
        overlay.setImage("assets/levels/" + img, this.getLargeur(), this.getHauteur());
        overlay.setXY(0, -this.getHauteur());
        this.ajouter(overlay);
    }
}
//# sourceMappingURL=Tile.js.map