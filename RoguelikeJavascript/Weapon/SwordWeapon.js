import { CWeapon } from "./Weapon.js"

const WEAPON_SWORD = 2;

export class CSwordWeapon extends CWeapon {

    constructor(owner) {
        super(owner);

        this.name = "검";
        this.weaponType = WEAPON_SWORD;
        this.minAttackPoint = 40;
        this.maxAttackPoint = 60;
        this.attackRating = 0.6;
        this.statusEffectRating = 0.5;
    }
}