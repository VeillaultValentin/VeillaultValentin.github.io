// Classe BodyPart //-----------------------------------------------------------------------------
class BodyPart extends Sprite {
    //-------------------------------------------------------------------------------------Attributs
    public id_: string;
    //----------------------------------------------------------------------------------Constructeur
    public constructor(id: string, hauteur: number, largeur: number) {
        super(document.createElement("img"));
        this.id_ = id
        this.setImage("assets/" + id + ".svg", largeur, hauteur);
        this.getBalise().classList.add("BodyPart");
        this.getBalise().classList.add(this.id_);
    }
}
