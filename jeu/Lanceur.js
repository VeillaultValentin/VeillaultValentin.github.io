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
// Classe  L a n c e u r //-------------------------------------------------------------------------
var Lanceur = /** @class */ (function (_super) {
    __extends(Lanceur, _super);
    //----------------------------------------------------------------------------------Constructeur
    function Lanceur(balise) {
        var _this = _super.call(this, balise) || this;
        _this.actionSouris_ = null;
        return _this;
    }
    //----------------------------------------------------------------------------------------animer
    Lanceur.prototype.animer = function () {
        var _this = this;
        this.actionSouris_ = function (e) { _this.suivre(e); };
        window.addEventListener("mousemove", this.actionSouris_);
    };
    //-----------------------------------------------------------------------------------------figer
    Lanceur.prototype.figer = function () {
        if (this.actionSouris_ != null)
            this.removeEventListener("mousemove", this.actionSouris_);
        this.actionSouris_ = null;
    };
    //----------------------------------------------------------------------------------------suivre
    Lanceur.prototype.suivre = function (e) {
        // Coordonnees souris (sur scene) //
        var sx = e.clientX - this.getParent().getX();
        var sy = e.clientY - this.getParent().getY();
        // Coordonnes pivot (sur scene) //
        var px = this.getX();
        var py = this.getCentreY();
        // Calcul direction //
        var dx = sx - px;
        var dy = sy - py;
        var d = Math.sqrt(dx * dx + dy * dy);
        // Calcul angle rotation //
        var angle = Math.acos(dx / d) / Math.PI * 180;
        if (dy < 0)
            angle = -angle;
        // Point pivot sprite //
        this.setPivotRotation(this.getLargeur() / 2 /*rectifie longeur canon*/ - (this.getLargeur() / 2 - ((this.getLargeur() * 64) / 2) / 89), this.getHauteur() / 2);
        // Angle rotation sprite //
        this.setRotation(angle);
    };
    return Lanceur;
}(Sprite));
//# sourceMappingURL=Lanceur.js.map