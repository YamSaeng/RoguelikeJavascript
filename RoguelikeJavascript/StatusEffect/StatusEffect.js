const DEFENCE_OFF = 0;
const DEFENCE_ON = 1;

const WEAPON_NONE = 0;
const WEAPON_MACE = 1;
const WEAPON_SWORD = 2;
const WEAPON_TWO_HAND_SWORD = 3;

const STATUS_EFFECT_NONE = 0;
const STATUS_EFFECT_STUN = 1;
const STATUS_EFFECT_BLEEDING = 2;

export class CStatusEffect {
    constructor(owner) {
        this.owner = owner;
        this.Effect = STATUS_EFFECT_NONE;
        this.EffectCount = 0;
    }

    update() {
        if (this.EffectCount == 0) {

        }
    }
}