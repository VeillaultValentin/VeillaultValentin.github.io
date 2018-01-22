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
var Barre = /** @class */ (function (_super) {
    __extends(Barre, _super);
    function Barre(balise) {
        return _super.call(this, balise) || this;
    }
    Barre.prototype.setProgress = function (progress) {
        this.balise_.style.width = progress + "%";
        this.largeur_ = progress;
        if (this.balise_ instanceof HTMLCanvasElement)
            (this.balise_).width = progress;
    };
    return Barre;
}(Sprite));
//# sourceMappingURL=Barre.js.map