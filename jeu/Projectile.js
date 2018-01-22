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
// Classe  P r o j e c t i l e //-------------------------------------------------------------------
var Projectile = /** @class */ (function (_super) {
    __extends(Projectile, _super);
    //----------------------------------------------------------------------------------Constructeur
    function Projectile(balise) {
        var _this = _super.call(this, balise) || this;
        _this.angle_ = 0;
        _this.puissance_ = 0;
        _this.timerAnimation_ = 0;
        return _this;
    }
    //----------------------------------------------------------------------------------------animer
    Projectile.prototype.animer = function () {
        var _this = this;
        this.timerAnimation_ = setInterval(function () { _this.bouger(); }, 1000 / 120);
    };
    //-----------------------------------------------------------------------------------------figer
    Projectile.prototype.figer = function () {
        if (this.timerAnimation_ != 0)
            clearInterval(this.timerAnimation_);
        this.timerAnimation_ = 0;
    };
    //----------------------------------------------------------------------------------------bouger
    Projectile.prototype.bouger = function () {
        var vx = Math.cos(this.angle_) * this.puissance_;
        var vy = Math.sin(this.angle_) * this.puissance_;
        var x = this.getX() + vx;
        var y = this.getY() + vy;
        this.setXY(x, y);
    };
    return Projectile;
}(Sprite));
//# sourceMappingURL=Projectile.js.map