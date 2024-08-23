import chalk from 'chalk';

import { Creature } from "./Creature.js";
import { CMaceWeapon } from "../Weapon/MaceWeapon.js"
import { CSwordWeapon } from "../Weapon/SwordWeapon.js"
import { CTwohandSwordWeapon } from "../Weapon/TwoHandSwordWeapon.js"
import { rand } from "../Math/Math.js"

import { CLogs } from "../Logs/Logs.js"

export class Monster extends Creature {
    constructor() {
        super();

        this.name = "자바스크립트";
        this.hp = 100;
        this.defensePoint = 0.1;
        this.inventory.push(new CMaceWeapon(this));
        this.inventory.push(new CSwordWeapon(this));
        this.inventory.push(new CTwohandSwordWeapon(this));
    }

    attack(battleTurn, target) {
        let Logs = CLogs.getInstance();     

        let weaponChoiceNum = rand(0, 2);

        if (this.inventory.length > 0) {
            if (this.inventory[weaponChoiceNum] != null) {
                this.weapon = this.inventory[weaponChoiceNum];

                Logs.logs = chalk.yellow(`[${battleTurn}] ${this.name}가 ${this.weapon.name}을 장착했습니다.`);

                return this.weapon.WeaponAttack(battleTurn, target);
            }
        }
    }
}