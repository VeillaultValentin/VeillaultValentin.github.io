﻿// Class Gun //-----------------------------------------------------------------------------
class Gun extends Sprite {

    private scale_: number;
    private scene_: Scene;
    private weapon_arm_: BodyGroup;
    private atk_speed_: number = 3;
    private reload_speed_: number = 1000;
    private wait_: boolean = false;
    private reloading_: boolean = false;
    private magazine_: number = 100;
    private magazine_capacity_: number = 100;
    private range_: number = 1000;
    public inflexion_: number;

    public constructor(imgSrc: string, largeur: number, hauteur: number, weapon_arm: BodyGroup, scale: number, scene: Scene) {
        super(document.createElement("img"));
        this.setImage(imgSrc, largeur, hauteur);
        this.scale_ = scale;
        this.scene_ = scene;
        this.weapon_arm_ = weapon_arm;
    }
    public shoot(): boolean {
        if (this.magazine_ > 0 && this.wait_ == false) {
            this.wait_ = true;
            let ammo: Ammo = new Ammo(32 * this.scale_, 7.3 * this.scale_, this.scale_);

            let armInflectX: number = 0.55 * this.weapon_arm_.getPart(0).getLargeur() + this.weapon_arm_.getX();
            let armInflectY: number = 0.21 * this.weapon_arm_.getPart(0).getHauteur() + this.weapon_arm_.getY();

            ammo.setXY(206 * this.scale_ + armInflectX - this.getLargeur() - 38 * this.scale_ * this.inflexion_, 260 * this.scale_ + armInflectY - 424 * this.scale_ * this.inflexion_);
            ammo.setRotation(this.getRotation() - 90 - 70 + 70 * this.inflexion_);
            ammo.getBalise().style.zIndex = "-1";
            this.weapon_arm_.getParent().ajouter(ammo);

            this.magazine_ -= 1;
            this.scene_.ui_.setMagazine(this.magazine_);
            ammo.move(this.range_);
            window.setTimeout(() => {
                this.wait_ = false;
            }, 1000 / this.atk_speed_);
            return true;
        }
        return false;
    }
    public reload() {
        if (this.reloading_ == false && this.wait_ == false && this.magazine_ != this.magazine_capacity_) {
            this.reloading_ = true;
            this.wait_ = true;
            this.scene_.ui_.reloadProgression(this.reload_speed_);
            window.setTimeout(() => {
                this.magazine_ = this.magazine_capacity_;
                this.scene_.ui_.reloadMagazine();
                this.reloading_ = false;
                this.wait_ = false;
            }, this.reload_speed_);
        }
    }
    public setStats(atkSpeed: number, range: number, magazine: number, reloadSpeed: number) {
        this.atk_speed_ = atkSpeed;
        this.range_ = range;
        this.magazine_capacity_ = magazine;
        this.magazine_ = magazine;
        this.reload_speed_ = reloadSpeed;

        this.scene_.ui_.drawMagazine(magazine);
    }
    public getStats() {
        return [this.atk_speed_, this.range_, this.magazine_capacity_];
    }
}
