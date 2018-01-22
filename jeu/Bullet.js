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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(balise, TTL, scene) {
        var _this = _super.call(this, balise) || this;
        _this.scene_ = scene;
        _this.TimeToLive_ = TTL;
        return _this;
    }
    Bullet.prototype.bouger = function () {
        if (this.TimeToLive_ < 0) {
            this.figer();
            this.scene_.retirer(this);
        }
        else {
            _super.prototype.bouger.call(this);
        }
        ;
        this.TimeToLive_--;
    };
    return Bullet;
}(Projectile));
//# sourceMappingURL=Bullet.js.map