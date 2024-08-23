import { CStatusEffect } from "../StatusEffect/StatusEffect.js"
import { CMaceWeapon } from "../Weapon/MaceWeapon.js"
import { CSwordWeapon } from "../Weapon/SwordWeapon.js"
import { CTwohandSwordWeapon } from "../Weapon/TwoHandSwordWeapon.js"
import { rand } from "../Math/Math.js"

import { CLogs } from "../Logs/Logs.js"

const DEFENCE_OFF = 0;
const DEFENCE_ON = 1;

const STATUS_EFFECT_NONE = 0;
const STATUS_EFFECT_RESERVE_STUN = 1;
const STATUS_EFFECT_STUN = 2;
const STATUS_EFFECT_RESERVE_BLEEDING = 3;
const STATUS_EFFECT_BLEEDING = 4;

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

        this.statusEffect.StatusInit();
    }

    Update(battleTurn) {
        let Logs = CLogs.getInstance();

        switch (this.statusEffect.Effect) {
            case STATUS_EFFECT_RESERVE_STUN:
            case STATUS_EFFECT_RESERVE_BLEEDING:
                this.statusEffect.Start(battleTurn);
                break;
            case STATUS_EFFECT_STUN:
            case STATUS_EFFECT_BLEEDING:
                this.statusEffect.Update(battleTurn);
                break;
        }
    }
}