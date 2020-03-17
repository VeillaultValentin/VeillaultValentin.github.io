// Classe BodyGroup //-----------------------------------------------------------------------------
class BodyGroup extends Sprite {
    //----------------------------------------------------------------------------------Constructeur
    constructor(id, part_1, part_2) {
        super(document.createElement("div"));
        this.id_ = id;
        this.parts_ = [part_1, part_2];
        this.getBalise().classList.add("BodyGroup");
        this.getBalise().classList.add(this.id_);
    }
    spawn() {
        //this.parts_[0].getBalise().style.position = "relative";
        this.ajouter(this.parts_[0]);
        this.ajouter(this.parts_[1]);
        if (this.parts_[1] instanceof BodyGroup) {
            this.parts_[1].spawn();
        }
        //this.parts_[1].getBalise().style.position = "relative";
    }
    getPart(index) {
        if (this.parts_[index] instanceof BodyGroup) {
            return this.parts_[index];
        }
        else {
            return this.parts_[index];
        }
    }
}
//# sourceMappingURL=BodyGroup.js.map