import chalk from 'chalk';
import readlineSync from 'readline-sync';

let logs = []; // 각종 로그 출력

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attackSuccess(attackRating) {
    return Math.random() < attackRating;
}

class Weapon {
    constructor() {

    }

    WeaponAttack(monster) {

        logs.push(chalk.green(`${this.name}으로 몬스터를 공격합니다.`));

        if (attackSuccess(this.attackRating))
        {            
            let damagePoint = rand(this.minAttackPoint, this.maxAttackPoint);
            logs.push(chalk.green(`공격 성공! ${monster.name}에게 ${damagePoint}의 피해를 입혔습니다.`));

            monster.OnDamage(damagePoint);
        }
        else
        {
            logs.push(chalk.red(`공격이 빗나갔습니다.`));
        }                
    }
}

class MaceWeapon extends Weapon {

    constructor() {
        super();

        this.weaponType = 1;
        this.name = "둔기";
        this.minAttackPoint = 1;
        this.maxAttackPoint = 10;
        this.attackRating = 0.8;
        this.stunRating = 0.4;
    }
}

class SwordWeapon extends Weapon {

    constructor() {
        super();

        this.weaponType = 2;
        this.name = "검";
        this.minAttackPoint = 10;
        this.maxAttackPoint = 30;
        this.attackRating = 0.6;
        this.doubleAttackRating = 0.5;
    }
}

class TwohandSwordWeapon extends Weapon {

    constructor(weaponType) {
        super();

        this.weaponType = 3;
        this.name = "대검";
        this.minAttackPoint = 50;
        this.maxAttackPoint = 100;
        this.attackRating = 0.3;
        this.bleedingRating = 0.6;
    }
}


class Player {
    constructor() {
        this.hp = 100;
        this.defensePoint = 0;
        this.criticalPoint = 0.6;
        this.weapon = null;
    }

    attack(monster) {
        // 플레이어의 공격
        if (this.weapon != null) {
            this.weapon.WeaponAttack(monster);                                    
        }
    }

    equipWeapon(weaponType) {
        switch (weaponType) {
            case '1':
                this.weapon = new MaceWeapon();
                break;
            case '2':
                this.weapon = new SwordWeapon();
                break;
            case '3':
                this.weapon = new TwohandSwordWeapon();
                break;
        }

        logs.push(chalk.green(`\n${this.weapon.name}을/를 장착합니다.`));
    }

    OnDamage(damagePoint) {
        if (this.hp - damagePoint < 0)
        {
            this.hp = 0;
        }
        else
        {
            this.hp -= damagePoint;
        }
    }
}

class Monster {
    constructor() {
        this.name = "자바스크립트";
        this.hp = 100;
        this.defensePoint = 0;
        this.criticalPoint = 0.6;
        this.weapon = null;
    }

    attack() {
        // 몬스터의 공격
    }

    OnDamage(damagePoint) {
        if (this.hp - damagePoint < 0)
        {
            this.hp = 0;
        }
        else
        {
            this.hp -= damagePoint;
        }        
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 정보 | 체력 : ${player.hp}`,
        ) +
        chalk.redBright(
            `| 몬스터 정보 | 체력 : ${monster.hp}`,
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
                break;
            case '2':
                break;
        }
    }

};

export async function startGame() {
    console.clear();

    const player = new Player();

    weaponChoiceStage(player);

    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster(stage);
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건

        stage++;
    }
}