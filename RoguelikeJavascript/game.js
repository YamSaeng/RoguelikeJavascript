import chalk from 'chalk';
import readlineSync from 'readline-sync';

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Weapon {    
    constructor() {
        
    }

    WeaponAttack() {
        console.log(`${this.name}으로 공격을 시도 합니다.`);
    }
}

class MaceWeapon extends Weapon {

    constructor() {
        super();

        this.weaponType = 1;
        this.name = "둔기";
        this.minAttackPoint = 1;
        this.maxAttackPoint = 10;
        this.attackRating = 0.9;
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
    }  
}

class TwohandSwordWeapon extends Weapon {

    constructor(weaponType) {
        super();

        this.weaponType = 3;
        this.name = "대검";
        this.minAttackPoint = 50;
        this.maxAttackPoint = 100;
        this.attackRating = 0.2;
    }
}


class Player {
    constructor() {
        this.hp = 100;
        this.defensePoint = 0;        
        this.criticalPoint = 0.6;
        this.weapon = null;
    }

    attack() {        
        // 플레이어의 공격
    }

    equipWeapon(weaponType)
    {
        switch (weaponType)
        {
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

        console.log(chalk.green(`\n${this.weapon.name}을/를 장착합니다.`),
        );
    }
}

class Monster {
    constructor() {
        this.hp = 100;
        this.defensePoint = 0;
        this.criticalPoint = 0.6;
        this.weapon = null;
    }

    attack() {
        // 몬스터의 공격
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 정보`,
        ) +
        chalk.redBright(
            `| 몬스터 정보 |`,
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
    let logs = [];

    while (player.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 아무것도 하지않는다.`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');        

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));        
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