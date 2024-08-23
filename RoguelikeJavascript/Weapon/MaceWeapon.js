import { CWeapon } from "./Weapon.js"

const WEAPON_MACE = 1;

export class CMaceWeapon extends CWeapon {

    constructor(owner) {
        super(owner);

        this.name = "둔기";
        this.weaponType = WEAPON_MACE;
        this.minAttackPoint = 10;
        this.maxAttackPoint = 30;
        this.attackRating = 0.8;
        this.statusEffectRating = 0.2;
    }
}