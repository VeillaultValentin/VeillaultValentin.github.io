// Class UserInterface //-----------------------------------------------------------------------------
class UserInterface extends Sprite {
    constructor(scene) {
        super(document.createElement("div"));
        this.locked_ = false;
        this.KeyUp = (e) => {
            if (e.key == this.scene_.KeyBindings_.Menu && this.locked_ == false) {
                if (this.menu_.estVisible()) {
                    this.menu_.masquer();
                    this.scene_.mainCharacter_.frozen_ = false;
                }
                else {
                    this.menu_.montrer();
                    this.scene_.mainCharacter_.frozen_ = true;
                }
            }
        };
        this.scene_ = scene;
        this.getBalise().style.zIndex = "100";
        this.getBalise().id = "ui";
        this.setXY(10, 10);
        this.magazine_ = new Sprite(document.createElement("div"));
        this.rifle_ammos_ = new Sprite(document.createElement("div"));
        this.rifle_ammos_.setXY(0, 0);
        this.reloader_ = new Sprite(document.createElement("img"));
        this.reloader_.setImage("assets/reloader.svg", 20, 20);
        this.reloader_.setXY(0, 20);
        this.reloader_instance_ = window.setInterval(() => {
            this.reloader_.setRotation(this.reloader_.getRotation() - 1);
        }, 50);
        this.magazine_.ajouter(this.rifle_ammos_);
        this.magazine_.ajouter(this.reloader_);
        this.reloader_.masquer();
    }
    drawBars(healthAmount) {
        let bars = new Sprite(document.createElement("div"));
        bars.getBalise().id = "bars";
        let healthBar = new Sprite(document.createElement("div"));
        healthBar.getBalise().id = "healthBar";
        healthBar.setDimension(250, 18);
        let group = document.createElement("div");
        group.style.height = "100%";
        let health = document.createElement("div");
        health.id = "health";
        let whiteBar = document.createElement("div");
        whiteBar.id = "healthWhite";
        let styling = document.createElement("div");
        styling.classList.add("stylization");
        group.appendChild(whiteBar);
        group.appendChild(health);
        health.appendChild(styling);
        this.healthBar_ = health;
        let barBackground = new Sprite(document.createElement("div"));
        barBackground.getBalise().id = "healthBg";
        barBackground.setDimension(healthBar.getLargeur(), healthBar.getHauteur());
        barBackground.ajouter(group);
        healthBar.ajouter(barBackground);
        this.total_health_ = healthAmount;
        this.actual_health_ = healthAmount;
        bars.ajouter(healthBar);
        bars.setY(0);
        this.ajouter(bars);
    }
    setHealth(value) {
        let health = value;
        if (value > this.total_health_) {
            health = this.total_health_;
        }
        this.healthBar_.style.width = (health * 100 / this.total_health_).toString() + "%";
        this.actual_health_ = health;
    }
    setMaxHealth(value) {
        this.total_health_ = value;
        this.setHealth(this.actual_health_);
    }
    drawMagazine(capacity) {
        this.magazine_.getBalise().id = "magazine";
        if (this.magazine_.getParent() != null) {
            this.retirer(this.magazine_);
            while (this.mag_ammos_.length != 0) {
                this.rifle_ammos_.retirer(this.mag_ammos_.pop());
            }
        }
        this.mag_ammos_ = [];
        this.capacity_ = capacity;
        for (let i = 0; i < this.capacity_; i += 1) {
            this.mag_ammos_[i] = new Sprite(document.createElement("img"));
            this.mag_ammos_[i].setImage("assets/magazine.svg", 8, 16);
            this.mag_ammos_[i].setXY(12 * i, 0);
            this.rifle_ammos_.ajouter(this.mag_ammos_[i]);
        }
        ;
        this.magazine_.setY(25);
        this.ajouter(this.magazine_);
    }
    setMagazine(ammoCount) {
        for (let i = ammoCount; i < this.capacity_; i += 1) {
            this.mag_ammos_[i].getBalise().style.opacity = "0.3";
        }
    }
    reloadMagazine() {
        for (let i = 0; i < this.capacity_; i += 1) {
            this.mag_ammos_[i].getBalise().style.opacity = "1";
        }
        ;
    }
    reloadProgression(duration) {
        this.reloader_.montrer();
        window.setTimeout(() => {
            this.reloader_.masquer();
        }, duration);
    }
    initMenu() {
        this.menu_ = new Sprite(document.createElement("div"));
        this.menu_.setXY(0, 0);
        this.menu_.setDimension(this.scene_.getLargeur(), this.scene_.getHauteur());
        this.menu_.getBalise().id = "menu";
        this.menu_.getBalise().style.zIndex = "1000";
        this.scene_.ajouter(this.menu_);
        /* draw menu content below */
        let basicMoves = document.createElement("div");
        basicMoves.id = "basicMoves";
        let moveGroup = document.createElement("div");
        moveGroup.id = "movementKeys";
        let bottomGroup = document.createElement("div");
        bottomGroup.id = "bottomGroup";
        let keyBindsTable = new Sprite(document.createElement("table"));
        let columnOne = document.createElement("th");
        let columnTwo = document.createElement("th");
        columnOne.innerHTML = "Action";
        columnTwo.innerHTML = "Key";
        let firstRow = new Sprite(document.createElement("tr"));
        firstRow.getBalise().style.position = "";
        firstRow.ajouter(columnOne);
        firstRow.ajouter(columnTwo);
        keyBindsTable.ajouter(firstRow);
        for (let item in this.scene_.KeyBindings_) {
            if (isNaN(Number(item))) {
                let row = new Sprite(document.createElement("tr"));
                let action = document.createElement("td");
                let keybind = new Sprite(document.createElement("td"));
                keybind.getBalise().style.position = "";
                let button = document.createElement("button");
                row.getBalise().style.position = "";
                row.getBalise().id = item;
                switch (item) {
                    case "SprintLeft":
                        row.getBalise().id = "Sprint";
                        action.innerHTML = "Sprint";
                        button.innerHTML = "Shift";
                        button.disabled = true;
                        break;
                    case "SprintRight":
                        row.getBalise().id = "Roll";
                        action.innerHTML = "Roll";
                        button.innerHTML = "Control";
                        button.disabled = true;
                        break;
                    case "Jump":
                        action.innerHTML = item;
                        button.innerHTML = "Space";
                        button.addEventListener("click", () => { this.changeKey(item); });
                        break;
                    default:
                        action.innerHTML = item;
                        button.innerHTML = this.scene_.KeyBindings_[item];
                        button.addEventListener("click", () => { this.changeKey(item); });
                        break;
                }
                ;
                let text = button.innerText;
                button.innerHTML = "";
                let buttonText = document.createElement("div");
                buttonText.innerHTML = text;
                button.appendChild(buttonText);
                if (item == "Jump" || item == "Up") {
                    button.id = item;
                    if (item == "Up") {
                        let div = document.createElement("div");
                        div.id = "upKeyDivGrp";
                        div.appendChild(button);
                        moveGroup.appendChild(div);
                    }
                    else if (item == "Jump") {
                        moveGroup.appendChild(bottomGroup);
                        moveGroup.appendChild(button);
                    }
                }
                else if (item == "Left" || item == "Right" || item == "Down") {
                    button.id = item;
                    bottomGroup.appendChild(button);
                }
                else {
                    row.ajouter(action);
                    keybind.ajouter(button);
                    row.ajouter(keybind);
                    keyBindsTable.ajouter(row);
                }
            }
        }
        let close = new Sprite(document.createElement("div"));
        close.getBalise().innerHTML = "&times;";
        close.getBalise().classList.add("close");
        close.setXY(0, 0);
        close.addEventListener("click", () => { this.menu_.masquer(); });
        let title = document.createElement("h1");
        title.innerHTML = "Controls";
        this.menu_.ajouter(close);
        this.menu_.ajouter(title);
        basicMoves.appendChild(moveGroup);
        let menuContent = document.createElement("div");
        menuContent.id = "menuContent";
        menuContent.appendChild(basicMoves);
        menuContent.appendChild(keyBindsTable.getBalise());
        this.menu_.ajouter(menuContent);
        ///////////////////////////////////////////////////////////////////////
        /* keybind window */
        let bindingWindow = new Sprite(document.createElement("div"));
        bindingWindow.setDimension(200, 150);
        bindingWindow.setXY(this.scene_.getLargeur() / 2 - bindingWindow.getLargeur() / 2, this.scene_.getHauteur() / 2 - bindingWindow.getHauteur() / 2);
        bindingWindow.getBalise().id = "bindingWindow";
        let part = document.createElement("div");
        part.id = "bindingTopBar";
        let closeWindow = document.createElement("div");
        closeWindow.innerHTML = "&times;";
        closeWindow.classList.add("close");
        closeWindow.addEventListener("click", () => {
            document.getElementById("menu").style.overflowY = "";
            document.getElementById("windowBackground").style.display = "none";
            document.getElementById("bindingWindow").style.display = "none";
            this.locked_ = false;
            this.binding_ = null;
        });
        bindingWindow.ajouter(part);
        bindingWindow.ajouter(closeWindow);
        let bindingDisplay = document.createElement("span");
        bindingDisplay.id = "bindingDislay";
        bindingWindow.ajouter(bindingDisplay);
        let windowBackground = new Sprite(document.createElement("div"));
        windowBackground.setXY(0, 0);
        windowBackground.setDimension(this.scene_.getLargeur(), this.scene_.getHauteur());
        windowBackground.getBalise().style.backgroundColor = "#000";
        windowBackground.getBalise().style.opacity = "0.5";
        windowBackground.getBalise().id = "windowBackground";
        this.menu_.ajouter(windowBackground);
        this.menu_.ajouter(bindingWindow);
        document.getElementById("windowBackground").style.display = "none";
        document.getElementById("bindingWindow").style.display = "none";
        window.addEventListener("keyup", (e) => { this.setKey(e, bindingDisplay); });
    }
    changeKey(key) {
        document.getElementById("bindingTopBar").innerHTML = key;
        document.getElementById("bindingDislay").innerHTML = "&#60;Press a Key&#62;";
        this.locked_ = true;
        this.binding_ = key;
        document.getElementById("menu").style.overflowY = "hidden";
        document.getElementById("menu").scrollTo(0, 0);
        document.getElementById("windowBackground").style.display = "block";
        document.getElementById("bindingWindow").style.display = "block";
    }
    setKey(e, displayPart) {
        if (this.binding_ != null) {
            let bind = this.binding_;
            let button = document.createElement("button");
            let buttonText = document.createElement("div");
            if (e.key == " ") {
                document.getElementById(bind).getElementsByTagName("div")[0].innerHTML = "Space";
                buttonText.innerHTML = "Space";
            }
            else {
                document.getElementById(bind).getElementsByTagName("div")[0].innerHTML = e.key;
                buttonText.innerHTML = e.key;
            }
            button.appendChild(buttonText);
            displayPart.innerHTML = "";
            displayPart.appendChild(button);
            this.scene_.KeyBindings_[bind.valueOf()] = e.key;
            // set sprint keys if necessary
            if (bind == "Left" || bind == "Right") {
                this.scene_.KeyBindings_["Sprint" + bind.valueOf()] = e.key.toUpperCase();
            }
        }
    }
}
//# sourceMappingURL=UserInterface.js.map