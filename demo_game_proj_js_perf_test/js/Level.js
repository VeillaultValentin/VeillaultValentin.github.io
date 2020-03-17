class Level extends Sprite {
    constructor(which, scene) {
        super(document.createElement("div"));
        this.tileSet_ = null;
        this.tiles_ = new Array();
        this.loaded_ = false;
        this.scene_ = scene;
        this.setDimension(this.scene_.getLargeur(), this.scene_.getHauteur());
        this.getBalise().id = which;
        this.getBalise().classList.add("level");
        this.tileSize_ = this.scene_.getLargeur() / 24;
        let request = new XMLHttpRequest();
        request.addEventListener("load", () => { this.tileSet_ = JSON.parse(request.responseText); this.drawLevel(); });
        request.addEventListener("error", () => { throw new Error("A game level has failed to load ! Ref : " + which); });
        request.open("get", "levels/" + which + ".json", true);
        request.send();
    }
    drawLevel() {
        if (!this.tileSet_["name"]) {
            console.error("Error: A game level has failed to load !");
            return;
        }
        for (let i = 0; i < 24; i += 1) {
            let tileColumn = new Array();
            for (let j = 0; j < 16; j += 1) {
                let tile = new Tile(this.tileSet_["tileset"][i][j], this.tileSize_);
                tile.setXY(this.tileSize_ * i, this.tileSize_ * j);
                tileColumn.push(tile);
                this.ajouter(tile);
            }
            this.tiles_.push(tileColumn);
        }
        this.loaded_ = true;
    }
}
//# sourceMappingURL=Level.js.map