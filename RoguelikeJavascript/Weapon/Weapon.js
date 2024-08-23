import chalk from 'chalk';

import { rand } from "../Math/Math.js"
import { RatingSuccess } from "../Math/Math.js"
import { CLogs } from "../Logs/Logs.js"

import { CStatusEffect } from "../StatusEffect/StatusEffect.js"


const DEFENCE_OFF = 0;
const DEFENCE_ON = 1;

const WEAPON_NONE = 0;
const WEAPON_MACE = 1;
const WEAPON_SWORD = 2;
const WEAPON_TWO_HAND_SWORD = 3;

const STATUS_EFFECT_NONE = 0;
const STATUS_EFFECT_RESERVE_STUN = 1;
const STATUS_EFFECT_STUN = 2;
const STATUS_EFFECT_RESERVE_BLEEDING = 3;
const STATUS_EFFECT_BLEEDING = 4;

export class CWeapon {
    constructor(owner) {
        this.owner = owner;

        this.weaponType = WEAPON_NONE;
        this.statusEffectRating = 0;
    }

    WeaponAttack(battleTurn, target) {
        let Logs = CLogs.getInstance();

        if (this.owner.statusEffect.Effect == STATUS_EFFECT_STUN) {
            Logs.logs = chalk.cyanBright(`${this.owner.name}가 기절 상태이상에 걸려 공격할 수 없습니다.`);
            return false;
        }

        if (RatingSuccess(this.attackRating)) {
            if (target.defenceState == DEFENCE_ON) {
                target.defenceState = DEFENCE_OFF;

                if (RatingSuccess(target.defenceRating)) { // 상대방의 방어 확률에 따라 방어                                        
                    Logs.logs = chalk.yellow(`[${battleTurn}] ${target.name}가 ${this.owner.name}의 공격을 방어했습니다.`);

                    return false;
                }
                else {
                    Logs.logs = chalk.yellow(`[${battleTurn}] ${target.name}가 ${this.owner.name}의 공격을 방어하지 못했습니다.`);
                }
            }

            let damagePoint = rand(this.minAttackPoint + this.owner.attackPoint, this.maxAttackPoint + this.owner.attackPoint);
            let finalDamagePoint = Math.floor(damagePoint - damagePoint * target.defensePoint);

            if (target.statusEffect.Effect == STATUS_EFFECT_NONE) {
                if (RatingSuccess(this.statusEffectRating)) {
                    if (target.statusEffect != null) {
                        // 상태이상 적용
                        switch (this.weaponType) {
                            case WEAPON_MACE:
                                Logs.logs = chalk.magenta(`[${battleTurn}] ${target.name}에게 기절 상태이상 적용.`);

                                target.statusEffect.Effect = STATUS_EFFECT_RESERVE_STUN;
                                break;
                            case WEAPON_SWORD:
                                target.OnDamage(finalDamagePoint)
                                break;
                            case WEAPON_TWO_HAND_SWORD:
                                Logs.logs = chalk.magenta(`[${battleTurn}] ${target.name}에게 출혈 상태이상 적용.`);

                                target.statusEffect.Effect = STATUS_EFFECT_RESERVE_BLEEDING;
                                target.statusEffect.damage = this.owner.attackPoint;
                                break;
                        }
                    }
                }
            }

            Logs.logs = chalk.green(`[${battleTurn}] ${this.owner.name} 공격 성공! ${this.owner.name}가 ${target.name}에게 ${finalDamagePoint} 의 피해를 입혔습니다.`);

            return target.OnDamage(finalDamagePoint);
        }
        else {
            Logs.logs = chalk.red(`[${battleTurn}] ${this.owner.name}의 공격이 빗나갔습니다.`);

            return false;
        }
    }
}