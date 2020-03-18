class Level extends Sprite{
    private scene_: Scene;
    private tileSize_: number;
    private tileSet_: object = null;
    public tiles_: Tile[][] = new Array<Array<Tile>>();
    public loaded_: boolean = false;

    public constructor(which: string, scene: Scene) {
        super(document.createElement("div"));
        this.scene_ = scene
        this.setDimension(this.scene_.getLargeur(), this.scene_.getHauteur());
        this.getBalise().id = which;
        this.getBalise().classList.add("level");
        this.tileSize_ = this.scene_.getLargeur() / 24;
        
        let request = new XMLHttpRequest();
        request.addEventListener("load", () => { this.tileSet_ = JSON.parse(request.responseText); this.drawLevel(); });
        request.addEventListener("error", () => { throw new Error("A game level has failed to load ! Ref : " + which); });
        request.open("get", "levels/"+ which +".json", true);
        request.send();
    }
    private drawLevel() {
        if (!this.tileSet_["name"]) {
            console.error("Error: A game level has failed to load !")
            return;
        }
        for (let i: number = 0; i < 24; i += 1) {
            let tileColumn: Tile[] = new Array<Tile>();
            for (let j: number = 0; j < 16; j += 1) {
                let tile: Tile = new Tile(this.tileSet_["tileset"][i][j], this.tileSize_);
                tile.setXY(this.tileSize_ * i, this.tileSize_ * j);
                tileColumn.push(tile);
                this.ajouter(tile);
            }
            this.tiles_.push(tileColumn);
        }
        this.loaded_ = true;
    }
}