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
var Arme = /** @class */ (function (_super) {
    __extends(Arme, _super);
    function Arme(balise, bulletSize, speed, range, magazine, scene) {
        var _this = _super.call(this, balise) || this;
        _this.bulletSize_ = bulletSize;
        _this.speed_ = speed;
        _this.range_ = range;
        _this.scene_ = scene;
        _this.magazine_ = magazine;
        _this.recharger();
        return _this;
    }
    Arme.prototype.tirer = function () {
        if (this.bulletLeft_ > 0) {
            this.bulletLeft_--;
            document.getElementById((this.bulletLeft_).toString()).remove();
            var projectile = new Bullet(document.createElement("img"), this.range_, this.scene_);
            projectile.setImage("projectile.svg", this.bulletSize_, this.bulletSize_);
            projectile.puissance_ = this.speed_;
            projectile.setXY(this.scene_.perso_.getCentreX() - projectile.getCentreX() /*éloignement du centre du perso*/ - this.getLargeur() / 2, this.scene_.perso_.getCentreY() - projectile.getCentreY());
            projectile.setPivotRotation(projectile.getLargeur() / 2 /*éloignement du centre du perso*/ + this.getLargeur() / 2, projectile.getHauteur() / 2);
            projectile.setRotation(this.getRotation() + 180);
            projectile.getBalise().setAttribute("class", "projectile");
            this.scene_.ajouter(projectile);
            projectile.angle_ = (projectile.getRotation() + 180) * (Math.PI / 180);
            projectile.animer();
            this.scene_.bullets_.push(projectile);
        }
        ;
    };
    Arme.prototype.recharger = function () {
        this.bulletLeft_ = this.magazine_;
        for (var i = 0; i < this.bulletLeft_; i++) {
            if (document.getElementById((i).toString()))
                document.getElementById((i).toString()).remove();
            var bullet = new Sprite(document.createElement("img"));
            bullet.setImage("magazine.svg", 12, 12);
            bullet.setX(i * 14);
            bullet.getBalise().setAttribute("ID", i.toString());
            this.scene_.chargeur_.ajouter(bullet);
        }
        ;
    };
    return Arme;
}(Lanceur));
//# sourceMappingURL=Arme.js.map