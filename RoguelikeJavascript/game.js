import chalk from 'chalk';
import readlineSync from 'readline-sync';

let logs = []; // 각종 로그 출력
let stage = 1; // 스테이지
let gameEnd = false;

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
            let finalDamagePoint = Math.floor(damagePoint - damagePoint * target.defensePoint);
            logs.push(chalk.green(`[${stage}] ${this.owner.name} 공격 성공! ${this.owner.name}가 ${target.name}에게 ${finalDamagePoint} 의 피해를 입혔습니다.\n`));

            return target.OnDamage(finalDamagePoint);
        }
        else {
            logs.push(chalk.red(`[${stage}] ${this.owner.name}의 공격이 빗나갔습니다.\n`));

            return false;
        }
    }
}

class MaceWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "둔기";
        this.minAttackPoint = 10;
        this.maxAttackPoint = 30;
        this.attackRating = 0.8;
        this.stunRating = 0.4;
    }
}

class SwordWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "검";
        this.minAttackPoint = 40;
        this.maxAttackPoint = 60;
        this.attackRating = 0.6;
        this.doubleAttackRating = 0.5;
    }
}

class TwohandSwordWeapon extends Weapon {

    constructor(owner) {
        super(owner);

        this.name = "대검";
        this.minAttackPoint = 70;
        this.maxAttackPoint = 90;
        this.attackRating = 0.2;
        this.bleedingRating = 0.6;
    }
}

class Creature {
    constructor() {
        this.bonusHP = 30;
        this.bonusRecovoryHP = 0.02;

        this.recovoryHP = 0.2;
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
            return this.weapon.WeaponAttack(target);
        }
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
        this.hp = this.hp + Math.floor(this.hp * this.recovoryHP) + 2 * stage;
        this.recovoryHP += this.bonusRecovoryHP;
    }
}

class Player extends Creature {
    constructor() {
        super();

        this.name = "플레이어";
        this.hp = 250;
        this.defensePoint = 0.5;                     
    }   
}

class Monster extends Creature {
    constructor() {
        super();
        
        this.name = "자바스크립트";
        this.hp = 100;
        this.defensePoint = 0.1;        
        this.inventory.push(new MaceWeapon(this));
        this.inventory.push(new SwordWeapon(this));
        this.inventory.push(new TwohandSwordWeapon(this));     
    } 

    attack(target) {
        let weaponChoiceNum = rand(0, 2);

        if (this.inventory.length > 0) {
            if (this.inventory[weaponChoiceNum] != null) {
                this.weapon = this.inventory[weaponChoiceNum];                

                logs.push(chalk.yellow(`${this.name}가 ${this.weapon.name}을 장착했습니다.`));

                return this.weapon.WeaponAttack(target);                
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
            `\n| 몬스터 정보 | 체력 : ${monster.hp} `,
        ),        
    );

    if (monster.weapon != null) {
        console.log(chalk.redBright(`무기 : ${monster.weapon.name} 공격력 : ${monster.weapon.minAttackPoint} ~ ${monster.weapon.maxAttackPoint} 명중률 : ${monster.weapon.attackRating * 100}% \n`));
    }

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

    let battleEnd = false

    while (!battleEnd) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        if (battleEnd || gameEnd) {
            break;
        }

        console.log(
            chalk.blue(
                `\n1. 공격한다 2. 도망친다.`,
            ),
        );

        const choice = readlineSync.question('선택 : ');

        switch (choice) {
            case '1':
                let monsterDead = player.attack(monster);
                let playerDead = monster.attack(player);

                if (monsterDead) {
                    logs.push(chalk.blueBright(`몬스터를 죽였습니다.`)); 
                    battleEnd = true;
                }

                if (playerDead) {
                    logs.push(chalk.redBright(`플레이어가 죽었습니다. 게임을 종료합니다.`));                    
                    gameEnd = true;
                }

                break;
            case '2':
                logs.push(chalk.green(`도망쳤습니다.`));                

                battleEnd = true;
                break;         
        }                        
    } 
};

export async function startGame() {
    console.clear();
    
    let player = new Player();

    // 플레이어 무기 선택
    weaponChoiceStage(player);    
    
    while (stage <= 10 && gameEnd == false) {
        let monster = new Monster(stage);
        monster.StatusUpdate(stage);

        logs.push(chalk.blueBright(`스테이지 [${stage}] 에 입장합니다. \n`));
        await battle(stage, player, monster);        

        player.StatusUpdate(stage);

        stage++;
    }
}