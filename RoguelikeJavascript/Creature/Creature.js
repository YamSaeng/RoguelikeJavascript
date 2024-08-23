import { CStatusEffect } from "../StatusEffect/StatusEffect.js"
import { CMaceWeapon } from "../Weapon/MaceWeapon.js"
import { CSwordWeapon } from "../Weapon/SwordWeapon.js"
import { CTwohandSwordWeapon } from "../Weapon/TwoHandSwordWeapon.js"
import { rand } from "../Math/Math.js"

const DEFENCE_OFF = 0;
const DEFENCE_ON = 1;

export class Creature {
    constructor() {
        this.bonusHP = 30;
        this.bonusRecovoryHP = 0.02;

        this.defenceState = DEFENCE_OFF;
        this.defenceRating = 0.4;

        this.attackPoint = 1;
        this.recovoryHP = 0.2;
        this.name = null;
        this.weapon = null;
        this.inventory = [];

        this.statusEffect = new CStatusEffect(this);
    }

    equipWeapon(weaponType) {
        switch (weaponType) {
            case '1':
                this.weapon = new CMaceWeapon(this);
                break;
            case '2':
                this.weapon = new CSwordWeapon(this);
                break;
            case '3':
                this.weapon = new CTwohandSwordWeapon(this);
                break;
        }
    }

    attack(battleTurn, target) {
        if (this.weapon != null) {
            return this.weapon.WeaponAttack(battleTurn, target);
        }
    }

    defence() {
        this.defenceState = DEFENCE_ON;
    }

    OnDamage(damagePoint) {
        if (this.hp - damagePoint < 0) {
            this.hp = 0;

            return true;
        }
        else {
            this.hp -= damagePoint;

            return false;
        }
    }

    StatusUpdate(stage) {
        this.hp += Math.floor(this.hp * this.recovoryHP) + (rand(1, 3) * stage);
        this.attackPoint += (rand(1, 3) * stage);

        this.recovoryHP += this.bonusRecovoryHP;

        this.statusEffectCount = 0;
    }
}