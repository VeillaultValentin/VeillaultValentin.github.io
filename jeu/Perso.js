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
var Perso = /** @class */ (function (_super) {
    __extends(Perso, _super);
    function Perso(balise, scene) {
        var _this = _super.call(this, balise) || this;
        _this.scene_ = scene;
        _this.setX(50);
        _this.setY(50);
        _this.timerAnimation_ = 1;
        _this.vie_ = 100;
        _this.charge_ = 0;
        return _this;
    }
    Perso.prototype.gauche = function (distance) {
        this.angle_ = Math.PI;
        this.puissance_ = distance;
        this.bouger();
    };
    Perso.prototype.droite = function (distance) {
        this.angle_ = 0;
        this.puissance_ = distance;
        this.bouger();
    };
    Perso.prototype.haut = function (distance) {
        this.angle_ = -Math.PI / 2;
        this.puissance_ = distance;
        this.bouger();
    };
    Perso.prototype.bas = function (distance) {
        this.angle_ = Math.PI / 2;
        this.puissance_ = distance;
        this.bouger();
    };
    Perso.prototype.bouger = function () {
        var vx = Math.cos(this.angle_) * this.puissance_;
        var vy = Math.sin(this.angle_) * this.puissance_;
        var x = this.getX() + vx;
        var y = this.getY() + vy;
        this.setXY(x, y);
        //empeche de sortir de la scène
        if (this.getX() < this.xmin_) {
            this.setX(0);
        }
        else if (this.getX() > this.xmax_) {
            this.setX(this.scene_.getLargeur() - this.getLargeur());
        }
        ;
        if (this.getY() < this.ymin_) {
            this.setY(0);
        }
        else if (this.getY() > this.ymax_) {
            this.setY(this.scene_.getHauteur() - this.getHauteur());
        }
        //repositionne l'arme
        this.scene_.arme_.setXY(this.getLargeur() / 2 + this.getX() - this.scene_.arme_.getLargeur() / 2 /*rectifie longeur canon*/ + (this.scene_.arme_.getLargeur() / 2 - ((this.scene_.arme_.getLargeur() * 64) / 2) / 89), this.getHauteur() / 2 + this.getY() - this.scene_.arme_.getHauteur() / 2);
        if (this.puissance_ > 0) {
            this.puissance_ = this.puissance_ - 1;
        }
        else if (this.puissance_ < 0) {
            this.puissance_ = this.puissance_ + 1;
        }
        ;
        this.charge_ = 0;
    };
    Perso.prototype.diminuerVie = function (vie) {
        this.vie_ = this.vie_ - vie;
        this.scene_.vie_.setProgress(this.vie_);
    };
    Perso.prototype.setLimites = function () {
        this.xmin_ = 0;
        this.xmax_ = this.scene_.getLargeur() - this.getLargeur();
        this.ymin_ = 0;
        this.ymax_ = this.scene_.getHauteur() - this.getHauteur();
    };
    return Perso;
}(Projectile));
//# sourceMappingURL=Perso.js.map