import chalk from 'chalk';
import { CLogs } from "../Logs/Logs.js"

const STATUS_EFFECT_NONE = 0;
const STATUS_EFFECT_RESERVE_STUN = 1;
const STATUS_EFFECT_STUN = 2;
const STATUS_EFFECT_RESERVE_BLEEDING = 3;
const STATUS_EFFECT_BLEEDING = 4;

export class CStatusEffect {
    constructor(owner) {
        this.owner = owner;
        this.Effect = STATUS_EFFECT_NONE;
        this.EffectCount = 0;
        this.damage = 0;
    }

    StatusInit() {
        this.Effect = STATUS_EFFECT_NONE;
        this.EffectCount = 0;
        this.damage = 0;
    }

    Start(battleTurn)
    {
        let Logs = CLogs.getInstance();

        switch (this.Effect) {
            case STATUS_EFFECT_RESERVE_STUN:
                this.EffectCount = 1;
                Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 기절!! [${this.EffectCount}] 턴 남음`);

                this.Effect = STATUS_EFFECT_STUN;
                break;
            case STATUS_EFFECT_RESERVE_BLEEDING:
                this.EffectCount = 3;
                Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 출혈!! 1턴당 [${this.damage}]씩 체력이 감소합니다. [${this.EffectCount}] 턴 남음`);

                this.Effect = STATUS_EFFECT_BLEEDING;                
                break;
        }
    }

    Update(battleTurn) {
        let Logs = CLogs.getInstance();

        this.EffectCount--;       

        switch (this.Effect) {
            case STATUS_EFFECT_STUN:
                Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 기절!! [${this.EffectCount}] 턴 남음`);                
                break;
            case STATUS_EFFECT_BLEEDING:
                Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 출혈!! 1턴당 [${this.damage}]씩 체력이 감소합니다. [${this.EffectCount}] 턴 남음`);
                this.owner.OnDamage(this.damage);                
                break;
        }              

        if (this.EffectCount == 0) {

            switch (this.Effect) {
                case STATUS_EFFECT_STUN:
                    Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 기절 해제!`);
                    break;
                case STATUS_EFFECT_BLEEDING:
                    Logs.logs = chalk.cyanBright(`[${battleTurn}] [${this.owner.name}] 출혈 해제!`);
                    break;
            }

            this.StatusInit();
        }
    }   
}