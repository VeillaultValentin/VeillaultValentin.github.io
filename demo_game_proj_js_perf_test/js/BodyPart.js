// Classe BodyPart //-----------------------------------------------------------------------------
class BodyPart extends Sprite {
    //----------------------------------------------------------------------------------Constructeur
    constructor(id, hauteur, largeur) {
        super(document.createElement("img"));
        this.id_ = id;
        this.setImage("assets/" + id + ".svg", largeur, hauteur);
        this.getBalise().classList.add("BodyPart");
        this.getBalise().classList.add(this.id_);
    }
}
//# sourceMappingURL=BodyPart.js.map