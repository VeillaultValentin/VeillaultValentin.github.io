// This class is written in french since it has been imported from another project as a base class
// Classe  S p r i t e //---------------------------------------------------------------------------
class Sprite {
    //----------------------------------------------------------------------------------Constructeur
    constructor(balise) {
        this.balise_ = balise;
        this.parent_ = null;
        this.enfants_ = new Array();
        try {
            let rectangle = balise.getBoundingClientRect();
            this.x_ = rectangle.left;
            this.y_ = rectangle.right;
            this.largeur_ = rectangle.width;
            this.hauteur_ = rectangle.height;
        }
        catch (e) {
            this.x_ = 0;
            this.y_ = 0;
            this.largeur_ = 0;
            this.hauteur_ = 0;
            console.log("erreur");
        }
        this.setRotation(0);
        this.setOpacite(1);
        this.balise_.style.position = "absolute";
        this.balise_.setAttribute("draggable", "false");
    }
    //----------------------------------------------------------------------------------------Balise
    getBalise() { return this.balise_; }
    setBalise(balise) { this.balise_ = balise; }
    //----------------------------------------------------------------------------------------Parent
    getParent() { return this.parent_; }
    //-------------------------------------------------------------------------------------Enfant(s)
    getEnfants() { return this.enfants_; }
    ajouter(sprite) {
        if (sprite instanceof Sprite) {
            this.getBalise().appendChild(sprite.getBalise());
            sprite.parent_ = this;
            this.enfants_.push(sprite);
        }
        else if (sprite instanceof HTMLElement)
            this.getBalise().appendChild(sprite);
    }
    retirer(sprite) {
        if (sprite instanceof Sprite) {
            this.getBalise().removeChild(sprite.getBalise());
            sprite.parent_ = null;
            for (let i = 0; i < this.enfants_.length; ++i) {
                if (this.enfants_[i] == sprite) {
                    let dernier = this.enfants_.pop();
                    if (i < this.enfants_.length)
                        this.enfants_[i] = dernier;
                    i = this.enfants_.length;
                }
            }
        }
        else if (sprite instanceof HTMLElement)
            this.getBalise().removeChild(sprite);
    }
    //--------------------------------------------------------------------------------------Position
    getX() { return this.x_; }
    getY() { return this.y_; }
    setX(x) {
        this.balise_.style.left = x + "px";
        this.x_ = x;
    }
    setY(y) {
        this.balise_.style.top = y + "px";
        this.y_ = y;
    }
    setXY(x, y) {
        this.balise_.style.left = x + "px";
        this.balise_.style.top = y + "px";
        this.x_ = x;
        this.y_ = y;
    }
    //-------------------------------------------------------------------------------------Dimension
    getLargeur() { return this.largeur_; }
    getHauteur() { return this.hauteur_; }
    setLargeur(largeur) {
        this.balise_.style.width = largeur + "px";
        this.largeur_ = largeur;
        if (this.balise_ instanceof HTMLCanvasElement)
            (this.balise_).width = largeur;
    }
    setHauteur(hauteur) {
        this.balise_.style.height = hauteur + "px";
        this.hauteur_ = hauteur;
        if (this.balise_ instanceof HTMLCanvasElement)
            (this.balise_).height = hauteur;
    }
    setDimension(largeur, hauteur) {
        this.balise_.style.width = largeur + "px";
        this.balise_.style.height = hauteur + "px";
        this.largeur_ = largeur;
        this.hauteur_ = hauteur;
        if (this.balise_ instanceof HTMLCanvasElement) {
            (this.balise_).width = largeur;
            (this.balise_).height = hauteur;
        }
    }
    //-------------------------------------------------------------------------------------Geometrie
    getCentreX() { return (this.x_ + this.largeur_ / 2); }
    getCentreY() { return (this.y_ + this.hauteur_ / 2); }
    getGauche() { return this.x_; }
    getDroit() { return (this.x_ + this.largeur_); }
    getHaut() { return this.y_; }
    getBas() { return (this.y_ + this.hauteur_); }
    getPoint() {
        return new Sprite.Point(this.x_ + this.largeur_ / 2, this.y_ + this.hauteur_ / 2);
    }
    getRectangle() {
        return new Sprite.Rectangle(this.x_, this.y_, this.largeur_, this.hauteur_);
    }
    getCercle(ratio = 1) {
        return new Sprite.Cercle(this.x_ + this.largeur_ / 2, this.y_ + this.hauteur_ / 2, ratio * this.largeur_ / 2);
    }
    //-----------------------------------------------------------------------------------------Image
    setImage(url, largeur, hauteur) {
        if (this.balise_ instanceof HTMLImageElement) {
            this.balise_.src = url;
            this.setLargeur(largeur);
            this.setHauteur(hauteur);
        }
    }
    // custom shortcut
    changeImage(url) {
        if (this.balise_ instanceof HTMLImageElement) {
            this.balise_.src = url;
        }
    }
    //---------------------------------------------------------------------------------------Pinceau
    getPinceau() {
        if (this.getBalise() instanceof HTMLCanvasElement)
            return (this.getBalise()).getContext("2d");
        return null;
    }
    //------------------------------------------------------------------------------------Visibilite
    masquer() { this.balise_.style.display = "none"; }
    montrer() { if (!this.estVisible())
        this.balise_.style.display = "block"; }
    estVisible() { return (this.balise_.style.display != "none"); }
    //--------------------------------------------------------------------------------------Rotation
    getRotation() { return this.rotation_; }
    setRotation(angle) {
        this.rotation_ = angle;
        this.balise_.style.transform = "rotate(" + angle + "deg)";
    }
    setPivotRotation(x, y) {
        this.balise_.style.transformOrigin = x + "px " + y + "px";
    }
    //---------------------------------------------------------------------------------------Opacite
    getOpacite() { return this.opacite_; }
    setOpacite(coef) {
        this.opacite_ = coef;
        this.balise_.style.opacity = "" + this.opacite_;
    }
    //------------------------------------------------------------------------------------Evenements
    addEventListener(type, action) {
        this.balise_.addEventListener(type, action);
    }
    removeEventListener(type, action) {
        this.balise_.removeEventListener(type, action);
    }
}
// Tests de collision //----------------------------------------------------------------------------
(function (Sprite) {
    //-------------------------------------------------------------------------------------Collision
    function collision(a, b) {
        if (a instanceof Cercle) {
            if (b instanceof Cercle)
                return collisionCercleCercle(a, b);
            else if (b instanceof Rectangle)
                return collisionCercleRectangle(a, b);
            else if (b instanceof Point)
                return collisionCerclePoint(a, b);
        }
        else if (a instanceof Rectangle) {
            if (b instanceof Cercle)
                return collisionCercleRectangle(b, a);
            else if (b instanceof Rectangle)
                return collisionRectangleRectangle(a, b);
            else if (b instanceof Point)
                return collisionRectanglePoint(a, b);
        }
        else if (a instanceof Point) {
            if (b instanceof Cercle)
                return collisionCerclePoint(b, a);
            else if (b instanceof Rectangle)
                return collisionRectanglePoint(b, a);
            else if (b instanceof Point)
                return collisionPointPoint(a, b);
        }
    }
    Sprite.collision = collision;
    //----------------------------------------------------------------------------------Classe Point
    class Point {
        constructor(x, y) {
            this.x_ = x;
            this.y_ = y;
        }
    }
    Sprite.Point = Point;
    //---------------------------------------------------------------------------------Classe Cercle
    class Cercle {
        constructor(cx, cy, rayon) {
            this.cx_ = cx;
            this.cy_ = cy;
            this.rayon_ = rayon;
        }
    }
    Sprite.Cercle = Cercle;
    //------------------------------------------------------------------------------Classe Rectangle
    class Rectangle {
        constructor(x, y, largeur, hauteur) {
            this.x_ = x;
            this.y_ = y;
            this.largeur_ = largeur;
            this.hauteur_ = hauteur;
        }
    }
    Sprite.Rectangle = Rectangle;
    //----------------------------------------------------------------------collisionCercleRectangle
    function collisionCercleRectangle(cercle, rectangle) {
        let px = Math.max(rectangle.x_, Math.min(cercle.cx_, rectangle.x_ + rectangle.largeur_));
        let py = Math.max(rectangle.y_, Math.min(cercle.cy_, rectangle.y_ + rectangle.hauteur_));
        let dx = px - cercle.cx_;
        let dy = py - cercle.cy_;
        let distance = dx * dx + dy * dy;
        let rayon = cercle.rayon_ * cercle.rayon_;
        return (distance < rayon);
    }
    //-------------------------------------------------------------------------collisionCercleCercle
    function collisionCercleCercle(cercle1, cercle2) {
        let dx = cercle1.cx_ - cercle2.cx_;
        let dy = cercle1.cy_ - cercle2.cy_;
        let distance = dx * dx + dy * dy;
        let rayon = cercle1.rayon_ + cercle2.rayon_;
        return (distance < rayon * rayon);
    }
    //--------------------------------------------------------------------------collisionCerclePoint
    function collisionCerclePoint(cercle, point) {
        let dx = point.x_ - cercle.cx_;
        let dy = point.y_ - cercle.cy_;
        let distance = dx * dx + dy * dy;
        let rayon = cercle.rayon_ * cercle.rayon_;
        return (distance < rayon);
    }
    //-------------------------------------------------------------------collisionRectangleRectangle
    function collisionRectangleRectangle(rectangle1, rectangle2) {
        return (rectangle1.x_ < rectangle2.x_ + rectangle2.largeur_
            && rectangle1.x_ + rectangle1.largeur_ > rectangle2.x_
            && rectangle1.y_ < rectangle2.y_ + rectangle2.hauteur_
            && rectangle1.y_ + rectangle1.hauteur_ > rectangle2.y_);
    }
    //-----------------------------------------------------------------------collisionRectanglePoint
    function collisionRectanglePoint(rectangle, point) {
        return (point.x_ >= rectangle.x_ && point.x_ <= rectangle.x_ + rectangle.largeur_
            && point.y_ >= rectangle.y_ && point.y_ <= rectangle.y_ + rectangle.hauteur_);
    }
    //---------------------------------------------------------------------------collisionPointPoint
    function collisionPointPoint(point1, point2) {
        let dx = point1.x_ - point2.x_;
        let dy = point1.y_ - point2.y_;
        let distance = dx * dx + dy * dy;
        return (distance < 1);
    }
})(Sprite || (Sprite = {}));
//# sourceMappingURL=Sprite.js.map