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
// Classe  S c e n e //-----------------------------------------------------------------------------
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    //----------------------------------------------------------------------------------Constructeur
    function Scene(balise) {
        var _this = _super.call(this, balise) || this;
        _this.setDimension(960, 640);
        _this.setX((window.innerWidth - _this.getLargeur()) / 2);
        _this.setY((window.innerHeight - _this.getHauteur()) / 2);
        _this.distance_ = 0;
        _this.bullets_ = new Array();
        _this.score_ = 0;
        _this.temps_ = 0;
        return _this;
    }
    //--------------------------------------------------------------------------------------demarrer
    Scene.prototype.demarrer = function () {
        /* Ecrire ici le code qui demarre la scene. */
        var _this = this;
        //affiche groupe info perso
        this.infos_ = new Sprite(document.createElement("div"));
        this.infos_.setDimension(200, 70);
        this.infos_.balise_.setAttribute("ID", "barres");
        this.ajouter(this.infos_);
        //barre vie
        this.vie_ = new Barre(document.createElement("img"));
        this.vie_.setImage("vie.png", 0, 16);
        this.vie_.setXY(4, 4);
        this.infos_.ajouter(this.vie_);
        //barre chargement
        this.charge_ = new Barre(document.createElement("img"));
        this.charge_.setImage("charge.png", 0, 8);
        this.charge_.setXY(4, 24);
        this.infos_.ajouter(this.charge_);
        //affichage chargeur
        this.chargeur_ = new Sprite(document.createElement("div"));
        this.chargeur_.setXY(50, 40);
        this.infos_.ajouter(this.chargeur_);
        //masque infos
        var masque = new Sprite(document.createElement("img"));
        masque.setImage("masque.svg", this.infos_.getLargeur(), this.infos_.getHauteur());
        masque.getBalise().style.zIndex = (1000).toString();
        masque.setXY(0, 0);
        this.infos_.ajouter(masque);
        /*cration personnage*/
        this.perso_ = new Perso(document.createElement("img"), this);
        this.perso_.setImage("perso.svg", 100, 100);
        this.perso_.setLimites();
        this.perso_.setXY(this.getLargeur() / 2 - this.perso_.getLargeur() / 2, this.getHauteur() / 2 - this.perso_.getHauteur() / 2);
        this.perso_.getBalise().setAttribute("ID", "Perso");
        this.ajouter(this.perso_);
        this.arme_ = new Arme(document.createElement("img"), 20, 3, 300, 5, this);
        this.arme_.setImage("arme.svg", 100, 100);
        this.arme_.setXY(this.perso_.getX(), this.perso_.getY());
        this.arme_.getBalise().setAttribute("ID", "Arme");
        this.ajouter(this.arme_);
        this.arme_.animer();
        //initialise les barres
        this.vie_.setProgress(this.perso_.vie_);
        this.charge_.setProgress(this.perso_.charge_ * 3);
        //action qui sera associ�e � l'action clavier
        var actionClavier = function (e) {
            if (e.key == "ArrowLeft")
                _this.perso_.gauche(_this.distance_);
            else if (e.key == "ArrowRight")
                _this.perso_.droite(_this.distance_);
            else if (e.key == "ArrowUp")
                _this.perso_.haut(_this.distance_);
            else if (e.key == "ArrowDown")
                _this.perso_.bas(_this.distance_);
            _this.distance_ = 0;
            _this.charge_.setProgress(_this.perso_.charge_ * 3);
        };
        //action definir distance
        var maintientTouche = function (e) {
            if (e.key == "ArrowLeft") {
                if (_this.distance_ < 20) {
                    _this.distance_ = _this.distance_ + 4;
                }
            }
            else if (e.key == "ArrowRight") {
                if (_this.distance_ < 20) {
                    _this.distance_ = _this.distance_ + 4;
                }
            }
            else if (e.key == "ArrowUp") {
                if (_this.distance_ < 20) {
                    _this.distance_ = _this.distance_ + 4;
                }
            }
            else if (e.key == "ArrowDown") {
                if (_this.distance_ < 20) {
                    _this.distance_ = _this.distance_ + 4;
                }
            }
            ;
            _this.perso_.charge_ = _this.distance_;
            _this.charge_.setProgress(_this.perso_.charge_ * 3);
        };
        //captation cliques souris
        this.click_ = function (e) {
            if (e.button == 0) {
                _this.arme_.tirer();
            }
            else if (e.button == 1) {
                _this.arme_.recharger();
            }
            ;
        };
        //affichage temps
        var temps = new Sprite(document.createElement("span"));
        temps.setDimension(100, 30);
        temps.setXY(this.getLargeur() - 100, 15);
        this.ajouter(temps);
        var Temps = function () {
            _this.temps_ += 1;
            temps.getBalise().innerText = _this.temps_.toString() + " sec";
        };
        //association action -> event clavier
        window.addEventListener("keydown", maintientTouche);
        window.addEventListener("keyup", actionClavier);
        window.addEventListener("click", this.click_);
        this.perso_.animer();
        this.asteroid_ = window.setInterval(Temps, 1000);
        this.intTemps_ = window.setInterval(function () { return _this.asteroid(); }, 500);
    };
    //---------------------------------------------------------------------------------------arreter
    Scene.prototype.arreter = function () {
        /* Ecrire ici le code qui termine la scene. */
        //stop l'horloge et la g�n�ration des asteroids
        window.clearInterval(this.asteroid_);
        window.clearInterval(this.intTemps_);
        window.removeEventListener("click", this.click_);
        //fait dispara�tre le perso
        this.perso_.figer();
        this.retirer(this.perso_);
        this.arme_.figer();
        this.retirer(this.arme_);
        //affichage �cran fin
        var gameover = new Sprite(document.createElement("div"));
        gameover.getBalise().style.wordBreak = "break-all";
        gameover.getBalise().style.overflow = "hidden";
        gameover.getBalise().style.fontSize = "40px";
        gameover.getBalise().style.fontWeight = "bold";
        gameover.getBalise().style.textAlign = "center";
        gameover.setDimension(200, 50);
        gameover.getBalise().innerText = "Game Over";
        gameover.setXY(this.getLargeur() / 2 - gameover.getLargeur() / 2, this.getHauteur() / 2 - gameover.getHauteur() / 2 - 20);
        this.ajouter(gameover);
        var score = new Sprite(document.createElement("div"));
        score.getBalise().style.wordBreak = "break-all";
        score.getBalise().style.overflow = "hidden";
        score.getBalise().style.fontSize = "20px";
        score.getBalise().style.fontWeight = "bold";
        score.getBalise().style.textAlign = "center";
        score.setDimension(300, 30);
        score.getBalise().innerText = "Points ast�roids : " + this.score_.toString();
        score.setXY(this.getLargeur() / 2 - score.getLargeur() / 2, this.getHauteur() / 2 - score.getHauteur() / 2 + 30);
        this.ajouter(score);
        var score2 = new Sprite(document.createElement("div"));
        score2.getBalise().style.wordBreak = "break-all";
        score2.getBalise().style.overflow = "hidden";
        score2.getBalise().style.fontSize = "20px";
        score2.getBalise().style.fontWeight = "bold";
        score2.getBalise().style.textAlign = "center";
        score2.setDimension(300, 30);
        score2.getBalise().innerText = "Temps : " + this.temps_.toString() + " sec";
        score2.setXY(this.getLargeur() / 2 - score2.getLargeur() / 2, this.getHauteur() / 2 - score2.getHauteur() / 2 + 60);
        this.ajouter(score2);
        var score3 = new Sprite(document.createElement("div"));
        score3.getBalise().style.wordBreak = "break-all";
        score3.getBalise().style.overflow = "hidden";
        score3.getBalise().style.fontSize = "20px";
        score3.getBalise().style.fontWeight = "bold";
        score3.getBalise().style.textAlign = "center";
        score3.setDimension(300, 30);
        score3.getBalise().innerText = "Score final : " + Math.round((this.temps_ / 10) * this.score_).toString();
        score3.setXY(this.getLargeur() / 2 - score3.getLargeur() / 2, this.getHauteur() / 2 - score3.getHauteur() / 2 + 90);
        this.ajouter(score3);
    };
    Scene.prototype.asteroid = function () {
        if (document.getElementsByClassName("asteroid").length < 15) {
            //ast�roid
            var asteroid = new Asteroid(document.createElement("img"), this);
            //taille random
            asteroid.taille_ = Math.random() * 85 + 15;
            asteroid.setImage("asteroid.svg", asteroid.taille_, asteroid.taille_);
            asteroid.getBalise().setAttribute("class", "asteroid");
            asteroid.setPivotRotation(asteroid.getCentreX(), asteroid.getCentreY());
            //defini position initiale
            var aX = Math.random() * this.getLargeur(); //alea x
            var aY = Math.random() * this.getHauteur(); //alea y
            switch (Math.round(Math.random() * 4)) {
                case 0:
                    asteroid.setXY(aX, -100);
                    break;
                case 1:
                    asteroid.setXY(aX, this.getHauteur() + 100);
                    break;
                case 2:
                    asteroid.setXY(-100, aY);
                    break;
                case 3:
                    asteroid.setXY(this.getLargeur() + 100, aY);
                    break;
            }
            asteroid.target();
            this.ajouter(asteroid);
            asteroid.animer();
        }
        //si perso mort
        if (this.perso_.vie_ == 0) {
            this.arreter();
        }
    };
    return Scene;
}(Sprite));
//# sourceMappingURL=Scene.js.map