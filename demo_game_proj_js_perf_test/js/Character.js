// Class  Character //-----------------------------------------------------------------------------
class Character extends GravitySprite {
    constructor(scene) {
        super(document.createElement("div"), scene.level_);
        this.scale_ = 0.2;
        this.frozen_ = false;
        /* animation related */
        this.lock_ = false;
        this.animating_ = false;
        this.animationProgress_ = 0;
        this.animationDirection_ = 1;
        this.rolling_ = false;
        this.noTurn_ = false;
        /* jump related */
        this.charged_ = false;
        this.jumping_ = false;
        this.jumpProgress_ = 0;
        this.direction_ = "any";
        /* equipment */
        this.hasKnife_ = true;
        this.holstering_ = true;
        /* Keyboard events */
        this.KeyDown = (e) => {
            if (!this.frozen_) {
                if (e.key == this.scene_.KeyBindings_.Left && this.jumping_ == false && this.lock_ == false) {
                    let obstacle = this.getCharObstacle("left");
                    this.turn("left");
                    if (obstacle != undefined) {
                        if (obstacle.checkLimits(this.getX() - 12 * this.scale_)) {
                            this.move(-12 * this.scale_);
                        }
                    }
                    else {
                        this.move(-12 * this.scale_);
                    }
                }
                else if (e.key == this.scene_.KeyBindings_.Right && this.jumping_ == false && this.lock_ == false) {
                    let obstacle = this.getCharObstacle("right");
                    this.turn("right");
                    if (obstacle != undefined) {
                        if (obstacle.checkLimits(this.getX() + this.getLargeur() + 12 * this.scale_)) {
                            this.move(12 * this.scale_);
                        }
                    }
                    else {
                        this.move(12 * this.scale_);
                    }
                }
                else if (e.key == this.scene_.KeyBindings_.SprintLeft && this.jumping_ == false && this.lock_ == false) {
                    let obstacle = this.getCharObstacle("left");
                    this.turn("left");
                    if (obstacle != undefined) {
                        if (obstacle.checkLimits(this.getX() - 20 * this.scale_)) {
                            this.move(-20 * this.scale_);
                        }
                    }
                    else {
                        this.move(-20 * this.scale_);
                    }
                }
                else if (e.key == this.scene_.KeyBindings_.SprintRight && this.jumping_ == false && this.lock_ == false) {
                    let obstacle = this.getCharObstacle("right");
                    this.turn("right");
                    if (obstacle != undefined) {
                        if (obstacle.checkLimits(this.getX() + this.getLargeur() + 20 * this.scale_)) {
                            this.move(20 * this.scale_);
                        }
                    }
                    else {
                        this.move(20 * this.scale_);
                    }
                }
                else if (e.key == this.scene_.KeyBindings_.Down && this.jumping_ == false && this.rolling_ == false) {
                    this.chargeJump();
                    if (this.direction_ != "any") {
                        this.turn(this.direction_);
                    }
                }
                else if (e.key == this.scene_.KeyBindings_.Jump && this.jumping_ == false && this.rolling_ == false) {
                    this.lock_ = true;
                    if (this.direction_ != "any") {
                        this.turn(this.direction_);
                    }
                }
                else if ((e.key == this.scene_.KeyBindings_.Right || e.key == this.scene_.KeyBindings_.SprintRight) && this.lock_ == true && this.jumping_ == false) {
                    this.direction_ = "right";
                    this.turn(this.direction_);
                }
                else if ((e.key == this.scene_.KeyBindings_.Left || e.key == this.scene_.KeyBindings_.SprintLeft) && this.lock_ == true && this.jumping_ == false) {
                    this.direction_ = "left";
                    this.turn(this.direction_);
                }
                else if (e.ctrlKey && this.lock_ == false && this.jumping_ == false) {
                    this.roll();
                }
            }
        };
        this.KeyUp = (e) => {
            if (!this.frozen_) {
                if (e.key == this.scene_.KeyBindings_.Down && this.charged_ == true && this.jumping_ == false) {
                    this.animate(() => this.jump(300, 1.2), 35);
                }
                else if (e.key == this.scene_.KeyBindings_.Jump && this.jumping_ == false && this.rolling_ == false) {
                    this.jumpProgress_ = 0;
                    if (this.holstering_) {
                        this.initPos_ = [
                            this.left_arm_.getRotation(),
                            this.left_arm_.getPart(1).getRotation(),
                            this.right_arm_.getRotation(),
                            this.right_arm_.getPart(1).getRotation()
                        ];
                    }
                    this.animate(() => this.jump(150, 1.8), 35);
                }
                else if ((e.key == this.scene_.KeyBindings_.Left || e.key == this.scene_.KeyBindings_.Right || e.key == this.scene_.KeyBindings_.SprintLeft || e.key == this.scene_.KeyBindings_.SprintRight) && this.lock_ == false && this.jumping_ == false) {
                    let target = this.targetFall();
                    if (target == undefined) {
                        this.lock_ = false;
                        window.clearInterval(this.fallingInstance_);
                    }
                    else if ((this.getY() + this.getHauteur()) < target.getY()) {
                        this.lock_ = true;
                        this.charFall(target);
                    }
                    this.animate(() => this.idle(), 50);
                    /* remove blocking on auto mouse turn */
                    this.noTurn_ = false;
                }
                else if ((e.key == this.scene_.KeyBindings_.Left || e.key == this.scene_.KeyBindings_.Right) && this.lock_ == true && this.jumping_ == false) {
                    this.direction_ = "any";
                }
                else if (e.key == this.scene_.KeyBindings_.Down && this.jumping_ == false && this.charged_ == false && this.rolling_ == false) {
                    /* init revert */
                    let init = this.animationProgress_.valueOf();
                    let yPos = this.originalYPos_.valueOf();
                    this.initPos_ = [
                        this.left_arm_.getRotation(),
                        this.left_arm_.getPart(1).getRotation(),
                        this.right_arm_.getRotation(),
                        this.right_arm_.getPart(1).getRotation()
                    ];
                    this.animate(() => this.chargeRevert(init, yPos), 50);
                }
                else if (e.key == this.scene_.KeyBindings_.Swap && this.hasKnife_) {
                    this.holster();
                }
                else if (e.key == this.scene_.KeyBindings_.Reload && this.holstering_ == false) {
                    this.rifle_.reload();
                }
                else if (e.key == this.scene_.KeyBindings_.Melee && this.holstering_ && this.lock_ == false) {
                    this.animate(() => this.knifeHit(), 10);
                }
            }
        };
        this.MouseDown = (e) => {
            if (!this.frozen_) {
                if (e.button == 0 && this.holstering_ == false && this.rolling_ == false) {
                    if (this.rifle_.shoot()) {
                        this.recoil();
                    }
                }
            }
        };
        this.scene_ = scene;
        this.setDimension(446.84 * this.scale_, 784.17 * this.scale_);
        /* holstered rifle */
        this.rifle_holstered_ = new Sprite(document.createElement("img"));
        this.rifle_holstered_.setImage("assets/rifle_no_ammo.svg", 495.3 * this.scale_, 132.1 * this.scale_);
        this.ammo_tape_ = new Sprite(document.createElement("img"));
        this.ammo_tape_.setImage("assets/ammo_tape.svg", 52 * this.scale_, 81.6 * this.scale_);
        /* body part setup */
        // head
        this.head_ = new BodyGroup("head", new BodyPart("head_1", 260.062 * this.scale_, 330.929 * this.scale_), new BodyPart("eye_3", 260.062 * this.scale_, 330.929 * this.scale_));
        // main body
        this.body_ = new BodyPart("chest", 342.3 * this.scale_, 178.758 * this.scale_);
        this.body_overlay_ = new BodyPart("chest_overlay", 342.3 * this.scale_, 178.758 * this.scale_);
        // belt knife
        this.belt_knife_ = new BodyPart("belt_knife", this.body_.getHauteur(), this.body_.getLargeur());
        // tail
        this.tail_ = new BodyPart("tail", 334.747 * this.scale_, 251.383 * this.scale_);
        // arms
        this.left_arm_ = new BodyGroup("left_arm", new BodyPart("top_arm_part", 145.572 * this.scale_, 83.115 * this.scale_), new BodyGroup("bottom_arm_w_knife", new BodyPart("bottom_arm_part", 288.596 * this.scale_, 96.311 * this.scale_), new BodyPart("knife_blade", 185.025 * this.scale_, 53.5 * this.scale_)));
        this.right_arm_ = new BodyGroup("right_arm", new BodyPart("top_arm_part", 145.572 * this.scale_, 83.115 * this.scale_), new BodyPart("bottom_arm_part_bis", 288.596 * this.scale_, 96.311 * this.scale_));
        // legs
        this.left_leg_ = new BodyGroup("left_leg", new BodyPart("top_leg_part", 143.5 * this.scale_, 87.521 * this.scale_), new BodyGroup("left_foot", new BodyPart("bottom_leg_part", 166.552 * this.scale_, 82.375 * this.scale_), new BodyPart("foot", 48.669 * this.scale_, 147.651 * this.scale_)));
        this.right_leg_ = new BodyGroup("right_leg", new BodyPart("top_leg_part", 143.5 * this.scale_, 87.521 * this.scale_), new BodyGroup("right_foot", new BodyPart("bottom_leg_part", 166.552 * this.scale_, 82.375 * this.scale_), new BodyPart("foot", 48.669 * this.scale_, 147.651 * this.scale_)));
        /* rifle with its arm attached */
        this.rifle_ = new Gun("assets/rifle_no_ammo.svg", 495.3 * this.scale_, 132.1 * this.scale_, this.left_arm_, this.scale_, this.scene_);
    }
    spawn(x, y) {
        /* head setup */
        this.head_.setXY(0, 0);
        this.head_.getPart(0).setXY(0, 0);
        this.head_.getPart(1).setXY(0, 0);
        this.head_.getPart(0).getBalise().style.zIndex = "1";
        this.head_.getPart(1).getBalise().style.zIndex = "0";
        this.head_.getBalise().style.zIndex = "14";
        // inflect point
        this.head_.setPivotRotation(0.47 * this.head_.getPart(0).getLargeur(), 0.8 * this.head_.getPart(0).getHauteur());
        /* body & overlay setup */
        this.body_.setXY(0 + this.head_.getPart(0).getLargeur() / 2 - this.body_.getLargeur() / 2, -34 * this.scale_ + this.head_.getPart(0).getHauteur());
        this.body_overlay_.setXY(0 + this.head_.getPart(0).getLargeur() / 2 - this.body_.getLargeur() / 2, -34 * this.scale_ + this.head_.getPart(0).getHauteur());
        this.body_.getBalise().style.zIndex = "10";
        this.body_overlay_.getBalise().style.zIndex = "16";
        /* belt knife */
        this.belt_knife_.setXY(0 + this.head_.getPart(0).getLargeur() / 2 - this.body_.getLargeur() / 2, -34 * this.scale_ + this.head_.getPart(0).getHauteur());
        this.belt_knife_.getBalise().style.zIndex = "12";
        /* tail setup */
        this.tail_.setXY(30 * this.scale_ + this.head_.getPart(0).getLargeur() / 2, 180 * this.scale_);
        this.tail_.getBalise().style.zIndex = "1";
        // inflect point
        this.tail_.setPivotRotation(0.2 * this.tail_.getLargeur(), 0.97 * this.tail_.getHauteur());
        /* left arm setup */
        this.left_arm_.setXY(-16 * this.scale_ + this.body_.getLargeur(), 16 * this.scale_ + this.head_.getPart(0).getHauteur());
        this.left_arm_.getPart(0).setXY(0, 0);
        this.left_arm_.getPart(1).setXY(20 * this.scale_, 14 * this.scale_ + this.left_arm_.getPart(0).getHauteur() / 2);
        this.left_arm_.getBalise().style.zIndex = "15";
        // inflect points
        this.left_arm_.setPivotRotation(0.55 * this.left_arm_.getPart(0).getLargeur(), 0.21 * this.left_arm_.getPart(0).getHauteur());
        this.left_arm_.getPart(1).setPivotRotation(0.35 * this.left_arm_.getPart(1).getPart(0).getLargeur(), 0.17 * this.left_arm_.getPart(1).getPart(0).getHauteur());
        /* right arm setup */
        this.right_arm_.setXY(64 * this.scale_, 26 * this.scale_ + this.head_.getPart(0).getHauteur());
        this.right_arm_.getPart(0).setXY(0, 0);
        this.right_arm_.getPart(1).setXY(20 * this.scale_, 14 * this.scale_ + this.right_arm_.getPart(0).getHauteur() / 2);
        this.right_arm_.getBalise().style.zIndex = "4";
        // inflect points
        this.right_arm_.setPivotRotation(0.55 * this.right_arm_.getPart(0).getLargeur(), 0.21 * this.right_arm_.getPart(0).getHauteur());
        this.right_arm_.getPart(1).setPivotRotation(0.35 * this.right_arm_.getPart(1).getLargeur(), 0.17 * this.right_arm_.getPart(1).getHauteur());
        /* left leg setup */
        this.left_leg_.setXY(-10 * this.scale_ + this.body_.getX() + this.body_.getLargeur() - this.left_leg_.getPart(0).getLargeur(), -108 * this.scale_ + this.head_.getPart(0).getHauteur() + this.body_.getHauteur());
        this.left_leg_.getPart(0).setXY(0, 0);
        this.left_leg_.getPart(1).setXY(12 * this.scale_, -44 * this.scale_ + this.left_leg_.getPart(0).getHauteur());
        this.left_leg_.getPart(1).getPart(0).setXY(0, 0);
        this.left_leg_.getPart(1).getPart(1).setXY(-68 * this.scale_, -24 * this.scale_ + this.left_leg_.getPart(1).getPart(0).getHauteur());
        this.left_leg_.getBalise().style.zIndex = "11";
        // inflect points
        this.left_leg_.setPivotRotation(0.73 * this.left_leg_.getPart(0).getLargeur(), 0.1 * this.left_leg_.getPart(0).getHauteur());
        this.left_leg_.getPart(1).setPivotRotation(0.37 * this.left_leg_.getPart(1).getPart(0).getLargeur(), 0.1 * this.left_leg_.getPart(1).getPart(0).getHauteur());
        this.left_leg_.getPart(1).getPart(1).setPivotRotation(0.8 * this.left_leg_.getPart(1).getPart(1).getLargeur(), 0.55 * this.left_leg_.getPart(1).getPart(1).getHauteur());
        /* right leg setup */
        this.right_leg_.setXY(-4 * this.scale_ + this.body_.getX(), -108 * this.scale_ + this.head_.getPart(0).getHauteur() + this.body_.getHauteur());
        this.right_leg_.getPart(0).setXY(0, 0);
        this.right_leg_.getPart(1).setXY(12 * this.scale_, -44 * this.scale_ + this.right_leg_.getPart(0).getHauteur());
        this.right_leg_.getPart(1).getPart(0).setXY(0, 0);
        this.right_leg_.getPart(1).getPart(1).setXY(-68 * this.scale_, -24 * this.scale_ + this.right_leg_.getPart(1).getPart(0).getHauteur());
        this.right_leg_.getBalise().style.zIndex = "7";
        // inflect points
        this.right_leg_.setPivotRotation(0.73 * this.right_leg_.getPart(0).getLargeur(), 0.1 * this.right_leg_.getPart(0).getHauteur());
        this.right_leg_.getPart(1).setPivotRotation(0.37 * this.right_leg_.getPart(1).getPart(0).getLargeur(), 0.1 * this.right_leg_.getPart(1).getPart(0).getHauteur());
        this.right_leg_.getPart(1).getPart(1).setPivotRotation(0.8 * this.right_leg_.getPart(1).getPart(1).getLargeur(), 0.55 * this.right_leg_.getPart(1).getPart(1).getHauteur());
        /* spawning parts */
        this.ajouter(this.head_);
        this.head_.spawn();
        this.ajouter(this.body_);
        this.ajouter(this.body_overlay_);
        this.ajouter(this.belt_knife_);
        this.ajouter(this.tail_);
        this.ajouter(this.left_arm_);
        this.left_arm_.spawn();
        this.ajouter(this.right_arm_);
        this.right_arm_.spawn();
        this.ajouter(this.left_leg_);
        this.left_leg_.spawn();
        this.ajouter(this.right_leg_);
        this.right_leg_.spawn();
        /* rifle holstered */
        this.rifle_holstered_.setXY(20 * this.scale_, 40 * this.scale_ + this.rifle_.getHauteur() / 2 + this.head_.getPart(0).getHauteur());
        this.rifle_holstered_.setPivotRotation(this.rifle_.getLargeur() / 2, this.rifle_.getHauteur() / 2);
        this.rifle_holstered_.setRotation(80);
        this.rifle_holstered_.getBalise().style.transform += " scaleX(-1)";
        this.rifle_holstered_.getBalise().style.zIndex = "2";
        this.rifle_holstered_.getBalise().id = "Rifle-holstered";
        this.ajouter(this.rifle_holstered_);
        /* rifle */
        this.rifle_.setPivotRotation(this.rifle_.getLargeur() / 2, this.rifle_.getHauteur() / 2);
        this.rifle_.setRotation(40);
        this.rifle_.getBalise().style.zIndex = "-1";
        this.rifle_.setXY(-410 * this.scale_, -60 * this.scale_);
        this.rifle_.getBalise().id = "Rifle";
        this.rifle_.masquer();
        this.left_arm_.ajouter(this.rifle_);
        this.ammo_tape_.setXY(-142 * this.scale_, 36 * this.scale_);
        this.ammo_tape_.setRotation(40);
        this.ammo_tape_.getBalise().style.zIndex = "";
        this.left_arm_.ajouter(this.ammo_tape_);
        this.ammo_tape_.masquer();
        /* knife */
        this.left_arm_.getPart(1).getPart(1).setRotation(75);
        this.left_arm_.getPart(1).getPart(1).getBalise().style.transform += " scaleX(-1)";
        this.left_arm_.getPart(1).getPart(1).setXY(-24 * this.scale_, -140 * this.scale_ + this.left_arm_.getPart(1).getPart(0).getHauteur());
        this.left_arm_.getPart(1).getPart(1).masquer();
        /* main character init */
        this.getBalise().id = "MainCharacter";
        this.setPivotRotation(this.getLargeur() / 2, this.getHauteur() / 2);
        this.setXY(x, y);
        this.originalXPos_ = this.getX();
        this.originalYPos_ = this.getY();
        // draw
        this.scene_.ajouter(this);
        this.followingOn();
        // map limits
        window.setInterval(() => this.checkLimits(), 50);
        // gravity
        this.lock_ = true; // prevents from softlocking when moving before ground is hit
        let int = window.setInterval(() => {
            if (this.scene_.level_.loaded_) {
                this.charFall(this.targetFall());
                window.clearInterval(int);
            }
        }, 50);
        // toggle main body ajustment
        this.ajustOverlay();
    }
    moveTo(x, y) {
        this.setXY(x, y);
        this.charFall(this.targetFall());
    }
    move(distance) {
        /* loopable animation, distance is one unit */
        if (this.animating_) {
            this.stop();
        }
        this.setX(this.getX() + distance);
        this.originalXPos_ = this.getX();
        this.noTurn_ = true;
        this.walk(Math.abs(distance) * 0.025);
        let target = this.targetFall();
        if ((this.getY() + this.getHauteur()) != target.getY()) { // don't spam fall(), it would cancel other animations like walk otherwise
            this.charFall(target);
        }
    }
    turn(direction) {
        /* mirrors the character visually */
        if (direction == "left" && this.getBalise().style.transform.split(" ")[1] == "scaleX(-1)") {
            this.getBalise().style.transform = "rotate(" + this.getRotation() + "deg)";
        }
        else if (direction == "right" && this.getBalise().style.transform.split(" ")[1] != "scaleX(-1)") {
            this.getBalise().style.transform += " scaleX(-1)";
        }
    }
    toggleKnife() {
        /* toggles the knife on character's belt */
        if (this.hasKnife_ == false) {
            this.belt_knife_.montrer();
            this.hasKnife_ = true;
        }
        else {
            this.belt_knife_.masquer();
            this.hasKnife_ = false;
        }
    }
    ajustOverlay() {
        if (this.left_arm_.getBalise().style.zIndex == "15") {
            this.left_arm_.getBalise().style.zIndex = "17";
        }
        else {
            this.left_arm_.getBalise().style.zIndex == "15";
        }
    }
    holster() {
        if (!this.holstering_) {
            /* remove gun */
            this.holstering_ = true;
            this.rifle_.masquer();
            this.ammo_tape_.masquer();
            this.rifle_holstered_.montrer();
            // arms positioning
            this.left_arm_.setRotation(0);
            this.left_arm_.getPart(1).setRotation(0);
            this.right_arm_.setRotation(0);
            this.right_arm_.getPart(1).setRotation(0);
            this.right_arm_.getPart(1).changeImage("assets/bottom_arm_part_bis.svg");
        }
        else {
            /* take gun */
            this.holstering_ = false;
            this.rifle_holstered_.masquer();
            this.rifle_.montrer();
            this.ammo_tape_.montrer();
            // arms positioning
            this.left_arm_.setRotation(-40);
            this.left_arm_.getPart(1).setRotation(120);
            this.right_arm_.setRotation(10);
            this.right_arm_.getPart(1).setRotation(90);
            this.right_arm_.getPart(1).changeImage("assets/bottom_arm_part_bis_tight.svg");
        }
    }
    /* animations */
    /*
     * Animation limits recommended
     *
     * head -20deg ; 20deg
     * leg  -60 ; 60deg | knee -90deg ; 0deg | foot -20deg ; 20deg
     * arm -50deg ; 70deg | elbow 0 ; 140deg
     * tail -20deg ; 20deg
     *
    */
    stop() {
        /* stops animation loop */
        this.animating_ = false;
        if (this.interval_) {
            window.clearInterval(this.interval_);
        }
        this.setY(this.originalYPos_);
        this.animationProgress_ = 0;
        this.animationDirection_ = 1;
    }
    animate(animation, delay) {
        /* loops an animation */
        if (this.animating_) {
            this.stop();
        }
        this.animationProgress_ = 0;
        this.animating_ = true;
        this.originalYPos_ = this.getY();
        this.interval_ = window.setInterval(animation, delay);
    }
    idle() {
        if (this.animating_) {
            if (this.animationProgress_ >= 1 || this.animationProgress_ < 0) {
                this.animationDirection_ *= -1;
            }
            /* head, tail, eye */
            if (this.animationProgress_ < 0.5) {
                this.head_.getPart(0).changeImage("assets/head_1.svg");
            }
            else {
                this.head_.getPart(0).changeImage("assets/head_2.svg");
            }
            this.head_.getPart(1).changeImage("assets/eye_2.svg");
            this.tail_.setRotation(10 - this.animationProgress_ * 20);
            /* do not move arms if holstering his rifle */
            if (this.holstering_) {
                // head
                this.head_.setRotation(0 - this.animationProgress_ * 10);
                // arms
                this.left_arm_.setRotation(-20 + this.animationProgress_ * 20);
                this.left_arm_.getPart(1).setRotation(20 + this.animationProgress_ * 20);
                this.right_arm_.setRotation(0 - this.animationProgress_ * 20);
                this.right_arm_.getPart(1).setRotation(40 - this.animationProgress_ * 20);
            }
            // legs
            this.left_leg_.setRotation(0 + this.animationProgress_ * 20);
            this.left_leg_.getPart(1).setRotation(0 + this.animationProgress_ * -30);
            this.left_leg_.getPart(1).getPart(1).setRotation(0 + this.animationProgress_ * 10);
            this.right_leg_.setRotation(0 + this.animationProgress_ * 20);
            this.right_leg_.getPart(1).setRotation(0 + this.animationProgress_ * -30);
            this.right_leg_.getPart(1).getPart(1).setRotation(0 + this.animationProgress_ * 10);
            this.setY(this.originalYPos_ + (22 * this.scale_ * this.animationProgress_));
            this.animationProgress_ += this.animationDirection_ * 0.04;
        }
    }
    walk(speed) {
        if (this.animationProgress_ >= 1 || this.animationProgress_ < 0) {
            this.animationDirection_ *= -1;
        }
        /* head, tail, eye */
        this.head_.getPart(0).changeImage("assets/head_1.svg");
        this.head_.getPart(1).changeImage("assets/eye_3.svg");
        this.tail_.setRotation(10 - this.animationProgress_ * 10);
        /* do not move arms if holstering his rifle */
        if (this.holstering_) {
            //head
            this.head_.setRotation(0 - this.animationProgress_ * 5);
            // arms
            this.right_arm_.setRotation(-20 + this.animationProgress_ * 20);
            this.right_arm_.getPart(1).setRotation(20 + this.animationProgress_ * 40);
            this.left_arm_.setRotation(0 - this.animationProgress_ * 20);
            this.left_arm_.getPart(1).setRotation(60 - this.animationProgress_ * 40);
        }
        // legs
        this.right_leg_.setRotation(45 - 70 * this.animationProgress_);
        this.right_leg_.getPart(1).setRotation(-60 + 60 * this.animationProgress_);
        this.right_leg_.getPart(1).getPart(1).setRotation(20 - 20 * this.animationProgress_);
        this.left_leg_.setRotation(-25 + 70 * this.animationProgress_);
        this.left_leg_.getPart(1).setRotation(0 - 60 * this.animationProgress_);
        this.left_leg_.getPart(1).getPart(1).setRotation(0 + 20 * this.animationProgress_);
        this.animationProgress_ += this.animationDirection_ * speed;
    }
    jump(hight, speed) {
        this.jumping_ = true;
        if (this.animationProgress_ < 0 && this.animationDirection_ == -1) {
            this.stop();
            let target = this.targetFall();
            this.charFall(target);
            //this.animate(() => this.land(), 50);
        }
        if (this.animationProgress_ >= 1) {
            this.animationDirection_ *= -1;
        }
        /* head, tail, eye */
        this.head_.getPart(0).changeImage("assets/head_1.svg");
        this.head_.getPart(1).changeImage("assets/eye_3.svg");
        this.tail_.setRotation(-10 + this.animationProgress_ * 20);
        if (this.holstering_) {
            //head
            this.head_.setRotation(-10 + this.animationProgress_ * 20);
            // arms
            this.left_arm_.setRotation(this.initPos_[0] - this.initPos_[0] * this.animationProgress_);
            this.left_arm_.getPart(1).setRotation(this.initPos_[1] - this.initPos_[1] * this.animationProgress_);
            this.right_arm_.setRotation(this.initPos_[2] - this.initPos_[2] * this.animationProgress_);
            this.right_arm_.getPart(1).setRotation(this.initPos_[3] - this.initPos_[3] * this.animationProgress_);
        }
        this.right_leg_.setRotation(30 - 30 * this.animationProgress_);
        this.right_leg_.getPart(1).setRotation(-50 + 50 * this.animationProgress_);
        this.right_leg_.getPart(1).getPart(1).setRotation(20 - 40 * this.animationProgress_);
        this.left_leg_.setRotation(30 - 30 * this.animationProgress_);
        this.left_leg_.getPart(1).setRotation(-50 + 50 * this.animationProgress_);
        this.left_leg_.getPart(1).getPart(1).setRotation(20 - 40 * this.animationProgress_);
        let hauteur = hight * this.scale_;
        let direction = 0;
        if (this.direction_ == "left") {
            direction = -1;
        }
        else if (this.direction_ == "right") {
            direction = 1;
        }
        let x = 2 * hauteur * this.jumpProgress_;
        let y = -(x - hauteur) * (x - hauteur) / hauteur + hauteur;
        /* when wall is hit just fall */
        let obstacle = this.getCharObstacle(this.direction_);
        let offset = x * direction;
        if (direction == 1) {
            offset += this.getLargeur();
        }
        if (obstacle != undefined && !obstacle.checkLimits(this.originalXPos_ + offset)) {
            let target = this.targetFall();
            if (target != undefined) {
                this.stop();
                if (this.direction_ == "left") {
                    this.setX(target.getX() + target.getLargeur());
                }
                else if (this.direction_ == "right") {
                    this.setX(target.getX());
                }
                window.clearInterval(this.fallingInstance_);
                this.charFall(target);
            }
        }
        this.setXY(this.originalXPos_ + x * direction, this.originalYPos_ - (132 * this.scale_ + y));
        this.jumpProgress_ += 0.05 * speed;
        this.animationProgress_ += this.animationDirection_ * 0.1 * speed;
        /* when jump on higer ground tile detected */
        if (this.animationDirection_ == -1) {
            let target = this.targetFall();
            if (target != undefined) {
                if (((this.getY() + this.getHauteur()) <= (target.getY() + target.getLargeur() * 0.1 * speed)) && ((this.getY() + this.getHauteur()) >= (target.getY() - target.getLargeur() * 0.1 * speed))) {
                    this.originalYPos_ = this.getY();
                    this.stop();
                    this.charFall(target);
                }
            }
        }
    }
    chargeJump() {
        /* anim initialisation */
        this.lock_ = true;
        this.jumpProgress_ = 0;
        if (this.animating_) {
            this.stop();
        }
        /* head, tail, eye */
        this.head_.getPart(0).changeImage("assets/head_2.svg");
        this.head_.getPart(1).changeImage("assets/eye_2.svg");
        this.tail_.setRotation(10 - this.animationProgress_ * 20);
        if (this.holstering_) {
            ///head
            this.head_.setRotation(0 - this.animationProgress_ * 10);
            // arms
            this.initPos_ = [
                this.left_arm_.getRotation(),
                this.left_arm_.getPart(1).getRotation(),
                this.right_arm_.getRotation(),
                this.right_arm_.getPart(1).getRotation()
            ];
        }
        // legs
        this.right_leg_.setRotation(0 + 30 * this.animationProgress_);
        this.right_leg_.getPart(1).setRotation(0 - 50 * this.animationProgress_);
        this.right_leg_.getPart(1).getPart(1).setRotation(0 + 20 * this.animationProgress_);
        this.left_leg_.setRotation(0 + 30 * this.animationProgress_);
        this.left_leg_.getPart(1).setRotation(0 - 50 * this.animationProgress_);
        this.left_leg_.getPart(1).getPart(1).setRotation(0 + 20 * this.animationProgress_);
        this.setY(this.originalYPos_ + 40 * this.scale_ * this.animationProgress_);
        if (this.animationProgress_ < 1) {
            this.animationProgress_ += 0.2;
        }
        else {
            this.charged_ = true;
        }
    }
    land() {
        /* head, tail, eye */
        this.head_.getPart(0).changeImage("assets/head_2.svg");
        this.head_.getPart(1).changeImage("assets/eye_2.svg");
        this.tail_.setRotation(-10 + this.animationProgress_ * 20);
        if (this.holstering_) {
            //head
            this.head_.setRotation(-10 + this.animationProgress_ * 10);
            // arms
            this.left_arm_.setRotation(0 - this.animationProgress_ * 20);
            this.left_arm_.getPart(1).setRotation(0 + this.animationProgress_ * 20);
            this.right_arm_.setRotation(0);
            this.right_arm_.getPart(1).setRotation(0 + this.animationProgress_ * 40);
        }
        // legs
        this.right_leg_.setRotation(30 - 30 * this.animationProgress_);
        this.right_leg_.getPart(1).setRotation(-50 + 50 * this.animationProgress_);
        this.right_leg_.getPart(1).getPart(1).setRotation(20 - 20 * this.animationProgress_);
        this.left_leg_.setRotation(30 - 30 * this.animationProgress_);
        this.left_leg_.getPart(1).setRotation(-50 + 50 * this.animationProgress_);
        this.left_leg_.getPart(1).getPart(1).setRotation(20 - 20 * this.animationProgress_);
        this.setY(this.originalYPos_ - 40 * this.scale_ * this.animationProgress_);
        if (this.animationProgress_ <= 1) {
            this.animationProgress_ += 0.2;
        }
        else {
            this.originalXPos_ = this.getX();
            this.originalYPos_ -= 40 * this.scale_;
            this.stop();
            this.charged_ = false;
            this.lock_ = false;
            this.jumping_ = false;
            this.direction_ = "any";
            this.animate(() => this.idle(), 50);
        }
    }
    chargeRevert(animInit, yPos) {
        this.originalYPos_ = yPos;
        /* anim initialisation */
        this.lock_ = true;
        this.jumpProgress_ = 0;
        /* tail */
        this.tail_.setRotation(-10 * animInit + this.animationProgress_ * 20 * animInit);
        /* do not move arms if holstering his rifle */
        if (this.holstering_) {
            //head
            this.head_.setRotation(-10 * animInit + this.animationProgress_ * 10 * animInit);
            // arms
            this.left_arm_.setRotation(this.initPos_[0] - this.animationProgress_ * (20 + this.initPos_[0]));
            this.left_arm_.getPart(1).setRotation(this.initPos_[1] + this.animationProgress_ * (20 - this.initPos_[1]));
            this.right_arm_.setRotation(this.initPos_[2] - this.animationProgress_ * this.initPos_[2]);
            this.right_arm_.getPart(1).setRotation(this.initPos_[3] + this.animationProgress_ * (40 - this.initPos_[3]));
        }
        // legs
        this.right_leg_.setRotation(30 * animInit - animInit * 30 * this.animationProgress_);
        this.right_leg_.getPart(1).setRotation(-50 * animInit + animInit * 50 * this.animationProgress_);
        this.right_leg_.getPart(1).getPart(1).setRotation(animInit * 20 - animInit * 20 * this.animationProgress_);
        this.left_leg_.setRotation(animInit * 30 - animInit * 30 * this.animationProgress_);
        this.left_leg_.getPart(1).setRotation(-50 * animInit + animInit * 50 * this.animationProgress_);
        this.left_leg_.getPart(1).getPart(1).setRotation(20 * animInit - animInit * 20 * this.animationProgress_);
        this.setY(this.originalYPos_ + 40 * this.scale_ * animInit - 40 * this.scale_ * animInit * this.animationProgress_);
        if (this.animationProgress_ < 1) {
            this.animationProgress_ += 0.2;
        }
        else {
            this.stop();
            this.lock_ = false;
            this.animate(() => this.idle(), 50);
        }
    }
    roll() {
        this.stop();
        this.followingOff();
        this.lock_ = true;
        this.rolling_ = true;
        let x = this.getX();
        let mainRotation = 0;
        let orientation = 1;
        if (this.getBalise().style.transform.split(" ")[1] == "scaleX(-1)") {
            orientation = -1;
        }
        this.originalXPos_ = x - 600 * this.scale_ * orientation;
        /*let fall: boolean = true;
        let target: Tile = this.targetFall();
        let hasFallen: boolean = true;
        if ((this.getY() + this.getHauteur()) == target.getY()) {
            hasFallen = false;
        }*/
        let anim = () => {
            if (this.animationProgress_ < 0) {
                this.stop();
                this.followingOn();
                this.lock_ = false;
                this.rolling_ = false;
                //if (!hasFallen) {
                this.animate(() => this.idle(), 50);
                //}
            }
            else if (this.animationProgress_ >= 1) {
                this.animationDirection_ *= -1;
            }
            this.head_.setRotation(0 - 20 * this.animationProgress_);
            this.head_.getPart(0).changeImage("assets/head_3.svg");
            this.head_.getPart(1).changeImage("assets/eye_1.svg");
            this.tail_.setRotation(10 - 30 * this.animationProgress_);
            if (this.holstering_) {
                this.left_arm_.setRotation(0 + 70 * this.animationProgress_);
                this.left_arm_.getPart(1).setRotation(0 + 100 * this.animationProgress_);
                this.right_arm_.setRotation(0 + 70 * this.animationProgress_);
                this.right_arm_.getPart(1).setRotation(0 + 100 * this.animationProgress_);
            }
            this.left_leg_.setRotation(0 + 110 * this.animationProgress_);
            this.left_leg_.getPart(1).setRotation(0 - 110 * this.animationProgress_);
            this.left_leg_.getPart(1).getPart(1).setRotation(0 + 20 * this.animationProgress_);
            this.right_leg_.setRotation(0 + 110 * this.animationProgress_);
            this.right_leg_.getPart(1).setRotation(0 - 110 * this.animationProgress_);
            this.right_leg_.getPart(1).getPart(1).setRotation(0 + 20 * this.animationProgress_);
            if (mainRotation > 1) {
                mainRotation = 1;
            }
            else if (mainRotation < -1) {
                mainRotation = -1;
            }
            this.setRotation(0 - 360 * mainRotation);
            if (orientation == -1) {
                this.getBalise().style.transform += " scaleX(-1)";
            }
            this.setX(x - 600 * this.scale_ * mainRotation);
            this.animationProgress_ += this.animationDirection_ * 0.1;
            mainRotation += 0.05 * orientation;
            /*if (!fall) {
                fall = true;
            } else {
                fall = false;
            }
            if (fall) {
                this.fall(target);
            }*/
        };
        this.animate(anim, 30);
    }
    knifeHit() {
        if (this.holstering_) {
            if (this.animationProgress_ < 0) {
                this.stop();
                this.toggleKnife();
                this.left_arm_.getPart(1).getPart(1).masquer();
                this.left_arm_.getPart(1).getPart(0).changeImage("assets/bottom_arm_part.svg");
                this.animate(() => this.idle(), 50);
            }
            else if (this.animationProgress_ >= 1) {
                this.animationDirection_ *= -1;
            }
            // arms
            this.left_arm_.setRotation(-70 + this.animationProgress_ * 130);
            this.left_arm_.getPart(1).setRotation(110 - this.animationProgress_ * 60);
            this.right_arm_.setRotation(10 - this.animationProgress_ * 10);
            this.right_arm_.getPart(1).setRotation(20 - this.animationProgress_ * 10);
            if (this.hasKnife_ && this.animationProgress_ >= 0.05) {
                this.toggleKnife();
                this.left_arm_.getPart(1).getPart(0).changeImage("assets/bottom_arm_part_holding_knife.svg");
                this.left_arm_.getPart(1).getPart(1).montrer();
            }
            this.animationProgress_ += this.animationDirection_ * 0.05;
        }
    }
    recoil() {
        this.followingOff();
        // unsynchronized animation allowing others to play at the same time
        let Progress = 0;
        let AnimationDirection = 1;
        // initial position
        let LeftArmAngle = this.left_arm_.getRotation();
        let RightArmAngle = this.right_arm_.getRotation();
        let anim = () => {
            if (Progress < 0) {
                window.clearInterval(int);
                this.followingOn();
            }
            else if (Progress >= 1) {
                AnimationDirection *= -1;
            }
            if (!this.rolling_) {
                this.left_arm_.setRotation(LeftArmAngle + 10.5 * Progress);
                this.right_arm_.setRotation(RightArmAngle + 15 * Progress);
            }
            Progress += AnimationDirection * 0.15;
        };
        let int = window.setInterval(anim, 15);
    }
    updateRifleStats(atkSpeed, range, mag, reloadSpeed) {
        /* stats update for in game upgrades */
        this.rifle_.setStats(atkSpeed, range, mag, reloadSpeed);
    }
    getRifleStats() {
        return this.rifle_.getStats();
    }
    followingOn() {
        this.mouse_ = (e) => { this.follow(e); };
        window.addEventListener("mousemove", this.mouse_);
    }
    followingOff() {
        if (this.mouse_ != null) {
            window.removeEventListener("mousemove", this.mouse_);
        }
        this.mouse_ = null;
    }
    follow(e) {
        if (!this.holstering_) {
            /* mouse coords in scene */
            let sx = e.clientX - this.scene_.getX();
            let sy = e.clientY - this.scene_.getY() + 1.5 * this.rifle_.getHauteur();
            /* where is reference center */
            let px = 0.55 * this.left_arm_.getPart(0).getLargeur() + this.left_arm_.getX() + this.getX();
            let py = 0.21 * this.left_arm_.getPart(0).getHauteur() + this.left_arm_.getY() + this.getY();
            /* direction */
            let dx = sx - px;
            let dy = sy - py;
            let d = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.acos(dx / d) / Math.PI * 180 - 180;
            if (dy < 0)
                angle = -angle;
            let mvt;
            if (this.getBalise().style.transform.split(" ")[1] == "scaleX(-1)") {
                /* symetria is weird to manage with angles, it's how to fix it */
                mvt = -(angle + 130) / 70;
                if (dy < 0) {
                    if (mvt > -4.4 && mvt <= -4.1) {
                        mvt += 5.1;
                        this.moveRifle(mvt);
                    }
                }
                else {
                    if (mvt < 1 && mvt >= 0) {
                        this.moveRifle(mvt);
                    }
                }
            }
            else {
                mvt = (angle + 50) / 70;
                if (mvt < 1 && mvt >= 0) {
                    this.moveRifle(mvt);
                }
            }
        }
        /* turn with mouse */
        let treshold = e.clientX - this.scene_.getX() - this.getX() - 0.47 * this.head_.getPart(0).getLargeur();
        if (this.jumping_ == false && this.lock_ == false && this.noTurn_ == false) {
            if (treshold < 0) {
                this.turn("left");
            }
            else {
                this.turn("right");
            }
        }
    }
    moveRifle(progress) {
        // arms positioning + head
        this.head_.setRotation(-20 + 40 * progress);
        this.left_arm_.setRotation(-70 + 70 * progress);
        this.right_arm_.setRotation(-35 + 100 * progress);
        // giving shoot direction
        this.rifle_.inflexion_ = progress;
    }
    /* gravity */
    /* From GravitySprite superclass
     * setLevel();
     * getXYByTiles();
     * targetFall();
     * fall(); ~~ should be set up
     * getObstacle(); ~~ should be set up
     */
    charFall(target) {
        let increment = 100 * this.scale_; //~= falling speed
        let yOffSet = 40 * this.scale_; //= idle offset
        /* seting up fall parameters */
        let fallConfigured = () => {
            this.fall(target, increment, yOffSet, () => {
                this.animate(() => this.land(), 50);
            }, () => {
                this.lock_ = false;
                this.jumping_ = false;
            });
        };
        /* executing function */
        this.jumping_ = true;
        this.fallingInstance_ = window.setInterval(() => {
            fallConfigured();
        }, 50);
    }
    getCharObstacle(direction) {
        let yOffSet = 40 * this.scale_; //= idle offset
        return super.getObstacle(direction, yOffSet);
    }
    checkLimits() {
        if (this.getX() < 0) {
            this.setX(0);
        }
        else if (this.getX() + this.getLargeur() > this.scene_.getLargeur()) {
            this.setX(this.scene_.getLargeur() - this.getLargeur());
        }
    }
}
/*
 * TO DO
 * Secondary rifle mode, grenade launcher -> mode switched with wheel click, UI for greande mag & rifle mode, grenade sprite, explosion sprite & hitzone
 * Knife attack hitzone / interactions ?
 * character's general hitbox ? or realistic part by part checking ?
 *
 * faire les propriétées des plafonds
 * s'occuper de la gravité des roulades
 *
 * faire les warp, pour tp d'un niveau à l'autre
 * faire des échelles/cordes qui permettent de monter avec la touche "Up" et l'anim qui va avec
 * faire des pentes 45° basiques vers droite/gauche qui devraient fixer le prb quand on tombe d'un bloc à moitié dedans peut soit bloquer quand on jump soit permettre de passer au travers en marchant
 */ 
//# sourceMappingURL=Character.js.map