import chalk from 'chalk';
import readlineSync from 'readline-sync';

let logs = []; // 각종 로그 출력
let stage = 1; // 스테이지
let gameEnd = false;

const DEFENCE_OFF = 0;
const DEFENCE_ON = 1;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RatingSuccess(attackRating) {
    return Math.random() < attackRating;
}

class Weapon {
    constructor(owner) {
        this.owner = owner;
    }

    WeaponAttack(target) {
        if (RatingSuccess(this.attackRating)) {          
            if (target.defenceState == DEFENCE_ON) {
                target.defenceState = DEFENCE_OFF;

                if (RatingSuccess(target.defenceRating)) { // 상대방의 방어 확률에 따라 방어
                    logs.push(chalk.yellow(`${target.name}가 ${this.owner.name}의 공격을 방어했습니다.`));

                    return false;
                }
                else
                {
                    logs.push(chalk.yellow(`${target.name}가 ${this.owner.name}의 공격을 방어하지 못했습니다.`));
                }
            }

            let damagePoint = rand(this.minAttackPoint + this.owner.attackPoint, this.maxAttackPoint + this.owner.attackPoint);
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

        this.defenceState = DEFENCE_OFF;      
        this.defenceRating = 0.4;

        this.attackPoint = 1;
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
        this.hp += Math.floor(this.hp * this.recovoryHP) + 2 * stage;
        this.attackPoint += (2 * stage);

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
        )      
    );
    
    console.log(chalk.redBright(`\n| 몬스터 정보 | 체력 : ${monster.hp}`));

    if (monster.weapon != null) {
        console.log(chalk.redBright(`몬스터 무기 : ${monster.weapon.name} 공격력 : ${monster.weapon.minAttackPoint} ~ ${monster.weapon.maxAttackPoint} 명중률 : ${monster.weapon.attackRating * 100}% \n`));
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
                `\n1. 공격 2. 방어 (40%) 3. 도망 (40%)`,
            ),
        );

        const choice = readlineSync.question('선택 : ');

        let playerDead = false;
        let monsterDead = false;

        switch (choice) {
            case '1':
                monsterDead = player.attack(monster);
                playerDead = monster.attack(player);
                break;
            case '2':
                player.defence();
                playerDead = monster.attack(player);
                break;
            case '3':                
                if (RatingSuccess(0.4)) {
                    logs.push(chalk.green(`도망쳤습니다.`));
                    battleEnd = true;
                }
                else {
                    logs.push(chalk.green(`도망치지 못했습니다.`));
                }
                
                break;         
        }                        

        if (monsterDead) {
            logs.push(chalk.blueBright(`몬스터를 죽였습니다.`));
            battleEnd = true;
        }                

        if (playerDead) {
            logs.push(chalk.redBright(`플레이어가 죽었습니다. 게임을 종료합니다.`));
            gameEnd = true;
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