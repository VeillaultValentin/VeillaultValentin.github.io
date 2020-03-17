// Class Scene //-----------------------------------------------------------------------------
class Scene extends Sprite {
    constructor(balise) {
        super(balise);
        this.setDimension(1080, 720);
        this.setX((window.innerWidth - this.getLargeur()) / 2);
        this.setY((window.innerHeight - this.getHauteur()) / 2);
        let KeyBindings;
        (function (KeyBindings) {
            KeyBindings["Up"] = "z";
            KeyBindings["Left"] = "q";
            KeyBindings["Down"] = "s";
            KeyBindings["Right"] = "d";
            KeyBindings["Jump"] = " ";
            KeyBindings["Swap"] = "a";
            KeyBindings["SprintLeft"] = "Q";
            KeyBindings["SprintRight"] = "D";
            KeyBindings["Reload"] = "r";
            KeyBindings["Melee"] = "e";
            KeyBindings["Menu"] = "Escape";
        })(KeyBindings || (KeyBindings = {}));
        this.KeyBindings_ = KeyBindings;
        this.level_ = new Level("test_level", this);
        this.mainCharacter_ = new Character(this);
    }
    start() {
        // ui
        this.ui_ = new UserInterface(this);
        this.ajouter(this.ui_);
        this.ui_.drawBars(100);
        this.ui_.setHealth(70);
        this.ui_.initMenu();
        // character
        this.mainCharacter_.spawn(350, 50);
        this.mainCharacter_.updateRifleStats(3, 1000, 10, 500);
        // level
        this.level_.setXY(0, 0);
        this.ajouter(this.level_);
        /* event listeners */
        window.addEventListener("keyup", () => this.ui_.KeyUp(event));
        window.addEventListener("keydown", () => this.mainCharacter_.KeyDown(event));
        window.addEventListener("keyup", () => this.mainCharacter_.KeyUp(event));
        window.addEventListener("mousedown", () => this.mainCharacter_.MouseDown(event));
        // remove right & wheel click & ctrl + any actions
        window.addEventListener("contextmenu", function (e) { e.preventDefault(); });
        window.addEventListener("click", function (e) { e.preventDefault(); });
        window.addEventListener("keyup", function (e) { e.preventDefault(); });
        window.addEventListener("keypress", function (e) { e.preventDefault(); });
        window.addEventListener("keydown", function (e) { if (e.ctrlKey) {
            e.preventDefault();
        } ; });
        window.addEventListener("dragstart", function (e) { e.preventDefault(); });
    }
    stop() {
    }
}
//# sourceMappingURL=Scene.js.map