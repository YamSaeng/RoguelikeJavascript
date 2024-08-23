import { Creature } from "./Creature.js";

export class Player extends Creature {
    constructor() {
        super();

        this.name = "플레이어";
        this.hp = 250;
        this.defensePoint = 0.5;
    }
}