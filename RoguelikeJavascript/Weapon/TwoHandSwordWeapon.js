import { CWeapon } from "./Weapon.js"

const WEAPON_TWO_HAND_SWORD = 3;

export class CTwohandSwordWeapon extends CWeapon {

    constructor(owner) {
        super(owner);

        this.name = "대검";
        this.weaponType = WEAPON_TWO_HAND_SWORD;
        this.minAttackPoint = 70;
        this.maxAttackPoint = 90;
        this.attackRating = 0.2;
        this.statusEffectRating = 0.6;
    }
}