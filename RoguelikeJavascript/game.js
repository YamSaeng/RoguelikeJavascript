import chalk from 'chalk';
import readlineSync from 'readline-sync';

let logs = []; // 각종 로그 출력
let stage = 1; // 스테이지

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attackSuccess(attackRating) {
    return Math.random() < attackRating;
}

class Weapon {
    constructor(owner) {
        this.owner = owner;
    }

    WeaponAttack(target) {
        if (attackSuccess(this.attackRating)) {
            let damagePoint = rand(this.minAttackPoint, this.maxAttackPoint);
            logs.push(chalk.green(`[${stage}] ${this.owner.name} 공격 성공! ${this.owner.name}가 ${target.name}에게 ${damagePoint}의 피해를 입혔습니다.\n`));

            target.OnDamage(damagePoint);
        }
        else {
            logs.push(chalk.red(`[${stage}] ${this.owner.name}의 공격이 빗나갔습니다.\n`));
        }
    }
}

class MaceWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "둔기";
        this.minAttackPoint = 1;
        this.maxAttackPoint = 10;
        this.attackRating = 0.8;
        this.stunRating = 0.4;
    }
}

class SwordWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "검";
        this.minAttackPoint = 10;
        this.maxAttackPoint = 30;
        this.attackRating = 0.6;
        this.doubleAttackRating = 0.5;
    }
}

class TwohandSwordWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "대검";
        this.minAttackPoint = 50;
        this.maxAttackPoint = 100;
        this.attackRating = 0.3;
        this.bleedingRating = 0.6;
    }
}

class Creature {
    constructor() {
        this.name = null;
        this.weapon = null;
        this.inventory = [];
    }

    equipWeapon(weaponType) {
        switch (weaponType) {
            case '1':
                this.weapon = new MaceWeapon(this);
                break;
            case '2':
                this.weapon = new SwordWeapon(this);
                break;
            case '3':
                this.weapon = new TwohandSwordWeapon(this);
                break;
        }
    }

    attack(target) {
        if (this.weapon != null) {
            this.weapon.WeaponAttack(target);
        }
    }   

    OnDamage(damagePoint) {
        if (this.hp - damagePoint < 0) {
            this.hp = 0;
        }
        else {
            this.hp -= damagePoint;
        }
    }
}

class Player extends Creature {
    constructor() {
        super();

        this.name = "플레이어";
        this.hp = 1000;
        this.defensePoint = 0;
        this.criticalPoint = 0.6;        
    }   
}

class Monster extends Creature {
    constructor() {
        super();
        
        this.name = "자바스크립트";
        this.hp = 1000;
        this.defensePoint = 0;
        this.criticalPoint = 0.6;
        this.inventory.push(new MaceWeapon(this));
        this.inventory.push(new SwordWeapon(this));
        this.inventory.push(new TwohandSwordWeapon(this));     
    } 

    attack(target) {
        let weaponChoiceNum = rand(0, 2);

        if (this.inventory.length > 0) {
            if (this.inventory[weaponChoiceNum] != null) {
                this.weapon = this.inventory[weaponChoiceNum];                

                this.weapon.WeaponAttack(target);
            }            
        }
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `\n| 플레이어 정보 | 체력 : ${player.hp} 무기 : ${player.weapon.name} 공격력 : ${player.weapon.minAttackPoint} ~ ${player.weapon.maxAttackPoint} 명중률 : ${player.weapon.attackRating * 100}%`,
        ) +
        chalk.redBright(
            `\n| 몬스터 정보 | 체력 : ${monster.hp}`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

function weaponChoiceStage(player) {
    console.log(
        chalk.green(
            `\n무기를 선택하세요.`,
        ),
    );

    console.log(
        chalk.green(
            `\n1.둔기 ( 낮은 데미지, 명중률이 높음, 일정 확률로 상대방을 기절)
             \n2.검 ( 평균 데미지, 명중률이 중간, 일정 확률로 두번 공격)
             \n3.대검 ( 높은 데미지, 명중률이 낮음, 일정 확률로 상대방을 출혈)`,
        ),
    );

    let weaponType = readlineSync.question('선택 : ');

    player.equipWeapon(weaponType);
}

const battle = async (stage, player, monster) => {

    while (player.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.blue(
                `\n1. 공격한다 2. 아무것도 하지않는다.`,
            ),
        );

        const choice = readlineSync.question('선택 : ');

        switch (choice) {
            case '1':
                player.attack(monster);
                monster.attack(player);
                break;
            case '2':
                break;
        }
    }

};

export async function startGame() {
    console.clear();

    let player = new Player();

    weaponChoiceStage(player);    

    while (stage <= 10) {
        let monster = new Monster(stage);
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건

        stage++;
    }
}