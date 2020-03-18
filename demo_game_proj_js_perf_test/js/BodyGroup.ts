// Classe BodyGroup //-----------------------------------------------------------------------------
class BodyGroup extends Sprite {
    //-------------------------------------------------------------------------------------Attributs
    public id_: string;
    private parts_: Sprite[];
    //----------------------------------------------------------------------------------Constructeur
    public constructor(id: string, part_1: BodyPart, part_2: BodyPart|BodyGroup) {
        super(document.createElement("div"));
        this.id_ = id;
        this.parts_ = [part_1, part_2];
        this.getBalise().classList.add("BodyGroup");
        this.getBalise().classList.add(this.id_);
    }
    public spawn() {
        //this.parts_[0].getBalise().style.position = "relative";
        this.ajouter(this.parts_[0]);
        this.ajouter(this.parts_[1]);
        if (this.parts_[1] instanceof BodyGroup) {
            (this.parts_[1] as BodyGroup).spawn();
        }
        //this.parts_[1].getBalise().style.position = "relative";
    }
    public getPart(index: number) {
        if (this.parts_[index] instanceof BodyGroup) {
            return this.parts_[index] as BodyGroup;
        } else {
            return this.parts_[index] as BodyPart;
        }
    }
}
