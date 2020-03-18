// This class is written in french since it has been imported from another project as a base class

// Classe  S p r i t e //---------------------------------------------------------------------------
class Sprite {
    //-------------------------------------------------------------------------------------Attributs
    private balise_ : HTMLElement;
    private parent_ : Sprite;
    private enfants_ : Array<Sprite>;

    private x_ : number;
    private y_ : number;
    private largeur_ : number;
    private hauteur_ : number;

    private rotation_ : number;
    private opacite_ : number;

    //----------------------------------------------------------------------------------Constructeur
    public constructor(balise : HTMLElement) {
        this.balise_ = balise;
        this.parent_ = null;
        this.enfants_ = new Array<Sprite>();

        try {
            let rectangle : ClientRect = balise.getBoundingClientRect();

            this.x_ = rectangle.left;
            this.y_ = rectangle.right;
            this.largeur_ = rectangle.width;
            this.hauteur_ = rectangle.height;
        }

        catch(e) {
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
    public getBalise() : HTMLElement { return this.balise_; }
    public setBalise(balise : HTMLElement) { this.balise_ = balise; }

    //----------------------------------------------------------------------------------------Parent
    public getParent() : Sprite { return this.parent_; }

    //-------------------------------------------------------------------------------------Enfant(s)
    public getEnfants() : Array<Sprite> { return this.enfants_; }
    
    public ajouter(sprite : Sprite|HTMLElement) {
        if (sprite instanceof Sprite) {
            this.getBalise().appendChild(sprite.getBalise());
            sprite.parent_ = this;
            this.enfants_.push(sprite);
        }
        else if (sprite instanceof HTMLElement) this.getBalise().appendChild(sprite);
    }

    public retirer(sprite : Sprite|HTMLElement) {
        if (sprite instanceof Sprite) {
            this.getBalise().removeChild(sprite.getBalise());
            sprite.parent_ = null;

            for (let i : number = 0; i < this.enfants_.length; ++i) {
                if (this.enfants_[i] == sprite) {
                    let dernier : Sprite = this.enfants_.pop();
                    if (i < this.enfants_.length) this.enfants_[i] = dernier;
                    i = this.enfants_.length;
                }
            }
        }
        else if (sprite instanceof HTMLElement) this.getBalise().removeChild(sprite);
    }

    //--------------------------------------------------------------------------------------Position
    public getX() : number { return this.x_; }
    public getY() : number { return this.y_; }

    public setX(x : number) {
        this.balise_.style.left = x+"px";
        this.x_ = x;
    }

    public setY(y : number) {
        this.balise_.style.top = y+"px";
        this.y_ = y;
    }

    public setXY(x : number, y : number) {
        this.balise_.style.left = x+"px";
        this.balise_.style.top = y+"px";
        this.x_ = x;
        this.y_ = y;
    }

    //-------------------------------------------------------------------------------------Dimension
    public getLargeur() : number { return this.largeur_; }
    public getHauteur() : number { return this.hauteur_; }

    public setLargeur(largeur : number) {
        this.balise_.style.width = largeur+"px";
        this.largeur_ = largeur;

        if (this.balise_ instanceof HTMLCanvasElement)
            (<HTMLCanvasElement>(this.balise_)).width = largeur;
    }

    public setHauteur(hauteur : number) {
        this.balise_.style.height = hauteur+"px";
        this.hauteur_ = hauteur;

        if (this.balise_ instanceof HTMLCanvasElement)
            (<HTMLCanvasElement>(this.balise_)).height = hauteur;
    }

    public setDimension(largeur : number, hauteur : number) {
        this.balise_.style.width = largeur+"px";
        this.balise_.style.height = hauteur+"px";
        this.largeur_ = largeur;
        this.hauteur_ = hauteur;

        if (this.balise_ instanceof HTMLCanvasElement) {
            (<HTMLCanvasElement>(this.balise_)).width = largeur;
            (<HTMLCanvasElement>(this.balise_)).height = hauteur;
        }
    }

    //-------------------------------------------------------------------------------------Geometrie
    public getCentreX() : number { return (this.x_ + this.largeur_/2); }
    public getCentreY() : number { return (this.y_ + this.hauteur_/2); }
    public getGauche() : number { return this.x_; }
    public getDroit() : number { return (this.x_ + this.largeur_); }
    public getHaut() : number { return this.y_; }
    public getBas() : number { return (this.y_ + this.hauteur_); }

    public getPoint() : Sprite.Point {
        return new Sprite.Point(this.x_ + this.largeur_/2,
                                this.y_ + this.hauteur_/2);
    }

    public getRectangle() : Sprite.Rectangle {
        return new Sprite.Rectangle(this.x_, this.y_,
                                    this.largeur_, this.hauteur_);
    }

    public getCercle(ratio : number = 1) : Sprite.Cercle {
        return new Sprite.Cercle(this.x_ + this.largeur_/2,
                                 this.y_ + this.hauteur_/2,
                                 ratio*this.largeur_/2);
    }

    //-----------------------------------------------------------------------------------------Image
    public setImage(url : string, largeur : number, hauteur : number) {
        if (this.balise_ instanceof HTMLImageElement) {
            (<HTMLImageElement>this.balise_).src = url;
            this.setLargeur(largeur);
            this.setHauteur(hauteur);
        }
    }
    // custom shortcut
    public changeImage(url: string) {
        if (this.balise_ instanceof HTMLImageElement) {
            (<HTMLImageElement>this.balise_).src = url;
        }
    }

    //---------------------------------------------------------------------------------------Pinceau
    public getPinceau() : Sprite.Pinceau {
        if (this.getBalise() instanceof HTMLCanvasElement)
            return (<HTMLCanvasElement>(this.getBalise())).getContext("2d");

        return null;
    }

    //------------------------------------------------------------------------------------Visibilite
    public masquer() { this.balise_.style.display = "none"; }
    public montrer() { if (!this.estVisible()) this.balise_.style.display = "block"; }
    public estVisible() : boolean { return (this.balise_.style.display != "none"); }

    //--------------------------------------------------------------------------------------Rotation
    public getRotation() : number { return this.rotation_; }

    public setRotation(angle : number) {
        this.rotation_ = angle;
        this.balise_.style.transform = "rotate("+angle+"deg)";
    }

    public setPivotRotation(x : number, y : number) {
        this.balise_.style.transformOrigin = x+"px "+y+"px";
    }

    //---------------------------------------------------------------------------------------Opacite
    public getOpacite() : number { return this.opacite_; }
    
    public setOpacite(coef : number) {
        this.opacite_ = coef;
        this.balise_.style.opacity = ""+this.opacite_;
    }

    //------------------------------------------------------------------------------------Evenements
    public addEventListener(type : string,action : any) {
        this.balise_.addEventListener(type,action);
    }

    public removeEventListener(type : string,action : any) {
        this.balise_.removeEventListener(type,action);
    }
}

// Alias de type //---------------------------------------------------------------------------------
namespace Sprite {
    export type Pinceau = CanvasRenderingContext2D;
}

// Tests de collision //----------------------------------------------------------------------------
namespace Sprite {
    //-------------------------------------------------------------------------------------Collision
    export function collision(a : Cercle|Rectangle|Point, b : Cercle|Rectangle|Point) {
        if (a instanceof Cercle) {
            if (b instanceof Cercle)
                return collisionCercleCercle(<Cercle>a,<Cercle>b);
            else if (b instanceof Rectangle)
                return collisionCercleRectangle(<Cercle>a,<Rectangle>b);
            else if (b instanceof Point)
                return collisionCerclePoint(<Cercle>a,<Point>b);
        }
        else if (a instanceof Rectangle) {
            if (b instanceof Cercle)
                return collisionCercleRectangle(<Cercle>b,<Rectangle>a);
            else if (b instanceof Rectangle)
                return collisionRectangleRectangle(<Rectangle>a,<Rectangle>b);
            else if (b instanceof Point)
                return collisionRectanglePoint(<Rectangle>a,<Point>b);
        }
        else if (a instanceof Point) {
            if (b instanceof Cercle)
                return collisionCerclePoint(<Cercle>b,<Point>a);
            else if (b instanceof Rectangle)
                return collisionRectanglePoint(<Rectangle>b,<Point>a);
            else if (b instanceof Point)
                return collisionPointPoint(<Point>a,<Point>b);
        }
    }

    //----------------------------------------------------------------------------------Classe Point
    export class Point {
        public x_;
        public y_;

        public constructor(x : number, y : number) {
            this.x_ = x;
            this.y_ = y;
        }
    }

    //---------------------------------------------------------------------------------Classe Cercle
    export class Cercle {
        public cx_ : number;
        public cy_ : number;
        public rayon_ : number;

        public constructor(cx : number, cy : number, rayon : number) {
            this.cx_ = cx;
            this.cy_ = cy;
            this.rayon_ = rayon;
        }
    }

    //------------------------------------------------------------------------------Classe Rectangle
    export class Rectangle {
        public x_ : number;
        public y_ : number;
        public largeur_ : number;
        public hauteur_ : number;

        public constructor(x : number, y : number, largeur : number, hauteur : number) {
            this.x_ = x;
            this.y_ = y;
            this.largeur_ = largeur;
            this.hauteur_ = hauteur;
        }
    }

    //----------------------------------------------------------------------collisionCercleRectangle
    function collisionCercleRectangle(cercle : Cercle, rectangle : Rectangle) : boolean {
        let px : number = Math.max(rectangle.x_,
                                   Math.min(cercle.cx_, rectangle.x_ + rectangle.largeur_));
        let py : number = Math.max(rectangle.y_,
                                   Math.min(cercle.cy_, rectangle.y_ + rectangle.hauteur_));
        let dx : number = px - cercle.cx_;
        let dy : number = py - cercle.cy_;
        let distance : number = dx*dx + dy*dy;
        let rayon : number = cercle.rayon_ * cercle.rayon_;

        return (distance < rayon);
    }

    //-------------------------------------------------------------------------collisionCercleCercle
    function collisionCercleCercle(cercle1 : Cercle, cercle2 : Cercle) : boolean {
        let dx : number = cercle1.cx_ - cercle2.cx_;
        let dy : number = cercle1.cy_ - cercle2.cy_;
        let distance : number = dx*dx + dy*dy;
        let rayon : number = cercle1.rayon_ + cercle2.rayon_;

        return (distance < rayon*rayon);
    }

    //--------------------------------------------------------------------------collisionCerclePoint
    function collisionCerclePoint(cercle : Cercle, point : Point) : boolean {
        let dx : number = point.x_ - cercle.cx_;
        let dy : number = point.y_ - cercle.cy_;
        let distance : number = dx*dx + dy*dy;
        let rayon : number = cercle.rayon_ * cercle.rayon_;

        return (distance < rayon);
    }

    //-------------------------------------------------------------------collisionRectangleRectangle
    function collisionRectangleRectangle(rectangle1 : Rectangle,
                                         rectangle2 : Rectangle) : boolean {
        return (rectangle1.x_ < rectangle2.x_+rectangle2.largeur_
                && rectangle1.x_+rectangle1.largeur_ > rectangle2.x_
                && rectangle1.y_ < rectangle2.y_+rectangle2.hauteur_
                && rectangle1.y_+rectangle1.hauteur_ > rectangle2.y_);
    }

    //-----------------------------------------------------------------------collisionRectanglePoint
    function collisionRectanglePoint(rectangle : Rectangle, point : Point) : boolean {
        return (point.x_ >= rectangle.x_ && point.x_ <= rectangle.x_+rectangle.largeur_
                && point.y_ >= rectangle.y_ && point.y_ <= rectangle.y_+rectangle.hauteur_);
    }

    //---------------------------------------------------------------------------collisionPointPoint
    function collisionPointPoint(point1 : Point, point2 : Point) : boolean {
        let dx : number = point1.x_ - point2.x_;
        let dy : number = point1.y_ - point2.y_;
        let distance : number = dx*dx + dy*dy;

        return (distance < 1);
    }
}
