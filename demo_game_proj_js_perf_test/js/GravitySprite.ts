/* 
 * GravitySprite should not be instanciated directly
 * 
 * this class purpose is only to add Gravity methods to an entity
 * 
 * fall() & getObstacle() should be set up in a method instead of using them directly
 */
abstract class GravitySprite extends Sprite {
    private level_: Level;
    protected fallingInstance_: number;

    constructor(node: HTMLElement, level: Level) {
        super(node);
        this.level_ = level;
    }

    protected setLevel(level: Level) {
        this.level_ = level;
    }
    private getTilesByProxymity(): Tile[] {
        let feetX: number = this.getX() + this.getLargeur() / 2;
        let feetY: number = this.getY() + this.getHauteur();
        let tilesByProxymity: Tile[] = [];
        for (let i: number = 0; i < 24; i += 1) {
            for (let j: number = 0; j < 16; j += 1) {
                //order tiles by proximity
                // distance
                let distanceX: number = (feetX - this.level_.tiles_[i][j].getX()) * (feetX - this.level_.tiles_[i][j].getX());
                let distanceY: number = (feetY - this.level_.tiles_[i][j].getY()) * (feetY - this.level_.tiles_[i][j].getY());
                let distance: number = Math.sqrt(distanceX + distanceY);

                // prevent from losing tiles
                if (tilesByProxymity[Math.round(distance)] != null) {
                    tilesByProxymity.splice(Math.round(distance), 0, this.level_.tiles_[i][j]);
                } else {
                    tilesByProxymity[Math.round(distance)] = this.level_.tiles_[i][j];
                }
            }
        }
        return tilesByProxymity.filter(function (element) { return element != null; });
    }
    protected getXYByTile(): { x_: number, y_: number } {
        let x: number, y: number;
        let charX: number = this.getX() + this.getLargeur() / 2;
        let charY: number = this.getY() + this.getHauteur();
        let tileSize: number = this.level_.tiles_[0][0].getLargeur();
        x = Math.floor(charX / tileSize);
        y = Math.floor(charY / tileSize);
        return { "x_": x, "y_": y };
    }
    protected targetFall(): Tile {
        let tilesChecker = this.getTilesByProxymity();
        let charX: number = this.getX() + this.getLargeur() / 2;
        for (let i: number = 0; i < tilesChecker.length; i += 1) {
            if (tilesChecker[i].type_ == "ground") {
                if ((charX >= tilesChecker[i].getX()) && (charX < tilesChecker[i].getX() + tilesChecker[i].getLargeur())) {
                    return tilesChecker[i];
                }
            }
        }
    }
    protected fall(target: Tile, increment: number, yOffSet: number, endAnimation: Function, noFallClear?: Function) {
        if (target == undefined || (this.getY() + this.getHauteur()) == target.getY()) {
            window.clearInterval(this.fallingInstance_);
            noFallClear();
        } else {
            if (this.getY() + this.getHauteur() + increment > target.getY()) {
                window.clearInterval(this.fallingInstance_);
                this.setY(target.getY() - this.getHauteur() + yOffSet);
                endAnimation();
            } else {
                this.setY(this.getY() + increment);
            }
        }
    }
    protected getObstacle(direction: string, offset: number): Tile {
        let tiles: Tile[] = this.getTilesByProxymity();
        for (let i: number = 0; i < tiles.length; i += 1) {
            if ((tiles[i].type_ == "ground" || tiles[i].type_ == "wall") && (tiles[i].getY() + tiles[i].getHauteur() >= this.getY() + this.getHauteur() - offset) && (tiles[i].getY() < this.getY() + this.getHauteur() - offset)) {
                if (direction == "left") {
                    if (tiles[i].getX() + tiles[i].getLargeur() < this.getX()) {
                        return tiles[i];
                    }
                } else if (direction == "right") {
                    if (tiles[i].getX() > this.getX() + this.getLargeur()) {
                        return tiles[i];
                    }
                } else {
                    return;
                }
            }
        }
    }
}