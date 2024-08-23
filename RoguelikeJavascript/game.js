import chalk from 'chalk';
import readlineSync from 'readline-sync';

import { Player } from "./Creature/Player.js";
import { Monster } from "./Creature/Monster.js";
import { CLogs } from "./Logs/Logs.js"
import { RatingSuccess } from "./Math/Math.js"

let gLogs = new CLogs();

let stage = 1; // 스테이지
let gameEnd = false;

let battleTurn = 1;

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

    let Logs = CLogs.getInstance(); 

    let battleEnd = false

    while (!battleEnd && !gameEnd) {
        console.clear();
        displayStatus(stage, player, monster);

        Logs.printLogs();
        
        console.log(
            chalk.blue(
                `\n1. 공격 2. 방어 (40%) 3. 도망 (10%)`,
            ),
        );

        const choice = readlineSync.question('선택 : ');

        let playerDead = false;
        let monsterDead = false;
        
        switch (choice) {
            case '1':
                monsterDead = player.attack(battleTurn, monster);
                playerDead = monster.attack(battleTurn, player);
                break;
            case '2':
                player.defence();
                playerDead = monster.attack(battleTurn, player);
                break;
            case '3':                
                if (RatingSuccess(0.1)) {
                    Logs.logs = chalk.green(`도망쳤습니다.`);
                    battleEnd = true;
                }
                else {
                    Logs.logs = chalk.green(`도망치지 못했습니다.`);
                }
                
                break;         
        }                 

        player.Update(battleTurn);
        monster.Update(battleTurn);

        if (monsterDead) {
            Logs.logs = chalk.blueBright(`몬스터를 죽였습니다.`);
            battleEnd = true;
        }                

        if (playerDead) {
            console.log(chalk.redBright(`플레이어가 죽었습니다. 게임을 종료합니다.`));            
            gameEnd = true;
        }

        battleTurn++;
    } 

    battleTurn = 1;    
};

export async function startGame() {
    console.clear();
    
    let player = new Player();

    // 플레이어 무기 선택
    weaponChoiceStage(player);    
    
    while (stage <= 10 && gameEnd == false) {
        let monster = new Monster(stage);
        monster.StatusUpdate(stage);                

        let Logs = CLogs.getInstance();   
        Logs.logs = chalk.blueBright(`스테이지 [${stage}] 에 입장합니다. \n`);

        await battle(stage, player, monster);        

        player.StatusUpdate(stage);

        stage++;
    }

    console.log(chalk.greenBright("\n============================================"));
    console.log(chalk.greenBright("모든 스테이지를 클리어 했습니다. 축하합니다!"));
    console.log(chalk.greenBright("============================================"));
}