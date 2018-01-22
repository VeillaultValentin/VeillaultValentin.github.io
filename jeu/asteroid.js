var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Asteroid = /** @class */ (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid(balise, scene) {
        var _this = _super.call(this, balise) || this;
        _this.scene_ = scene;
        _this.rota_ = 0;
        return _this;
    }
    Asteroid.prototype.target = function () {
        var dx = this.scene_.perso_.getCentreX() - this.getCentreX();
        var dy = this.scene_.perso_.getCentreY() - this.getCentreY();
        var d = Math.sqrt(dx * dx + dy * dy);
        dx = dx / d;
        dy = dy / d;
        var a = Math.acos(dx);
        if (dy < 0)
            a = -a;
        this.puissance_ = 1;
        this.angle_ = a;
    };
    Asteroid.prototype.bouger = function () {
        _super.prototype.bouger.call(this);
        //si sorti trop loin
        if (this.getX() < -100 || this.getX() > this.scene_.getLargeur() + 100 || this.getY() < -100 || this.getY() > this.scene_.getHauteur() + 100) {
            this.figer();
            this.scene_.retirer(this);
        }
        //destruction si projectile touché par perso
        if (Sprite.collision(this.getCercle(), this.scene_.perso_.getCercle())) {
            this.figer();
            this.scene_.retirer(this);
            if (this.scene_.perso_.vie_ > 1 * (this.taille_ / 10)) {
                this.scene_.perso_.diminuerVie(1 * (this.taille_ / 10));
            }
            else {
                this.scene_.perso_.diminuerVie(this.scene_.perso_.vie_);
            }
        }
        //destruc si touché par missile
        for (var i = 0; i < this.scene_.bullets_.length; i++) {
            if (Sprite.collision(this.getCercle(), this.scene_.bullets_[i].getCercle())) {
                this.figer();
                this.scene_.retirer(this);
                this.scene_.score_ += Math.round(this.taille_);
            }
        }
        //rotation sur lui même
        this.rota_ = this.rota_ + 2;
        this.setRotation(this.rota_);
    };
    return Asteroid;
}(Projectile));
//# sourceMappingURL=Asteroid.js.map