// Class Scene //-----------------------------------------------------------------------------
class Scene extends Sprite {

    public KeyBindings_;
    public ui_: UserInterface;
    public mainCharacter_: Character;
    public level_: Level;

    public constructor(balise : HTMLElement) {
        super(balise);
        this.setDimension(1080,720);
        this.setX((window.innerWidth - this.getLargeur()) / 2);
        this.setY((window.innerHeight - this.getHauteur()) / 2);
        enum KeyBindings {
            Up = "z",
            Left = "q",
            Down = "s",
            Right = "d",
            Jump = " ",
            Swap = "a",
            SprintLeft = "Q",
            SprintRight = "D",
            Reload = "r",
            Melee = "e",
            Menu = "Escape"
        }
        this.KeyBindings_ = KeyBindings;

        this.level_ = new Level("test_level", this);
        this.mainCharacter_ = new Character(this);
    }
    public start() {
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
        window.addEventListener("keyup", function (e) { e.preventDefault() });
        window.addEventListener("keypress", function (e) { e.preventDefault() });
        window.addEventListener("keydown", function (e) { if (e.ctrlKey) { e.preventDefault(); }; });
        window.addEventListener("dragstart", function (e) { e.preventDefault(); });
    }
    public stop() {
        
    }
}
