import {WarriorRecords} from "../records/warrior.records";

export const fight = (warrior1: WarriorRecords, warrior2: WarriorRecords): {
    log: string[],
    winner: WarriorRecords,
} => {
    const log: string[] = [];

    const warrior1Obj = {
        hp: warrior1.stamina * 10,
        dp: warrior1.defence,
        warrior: warrior1,
    };

    const warrior2Obj = {
        hp: warrior2.stamina * 10,
        dp: warrior2.defence,
        warrior: warrior2,
    }

    let attacker = warrior1Obj;
    let defender = warrior2Obj;

    do{
        const attackStrength = attacker.warrior.power;

        log.push(`${attacker.warrior.name} zaatakuje ${defender.warrior.name} z siłą ${attackStrength}.`);

        if(defender.dp + defender.warrior.agility > attackStrength) {
            log.push(`${defender.warrior.name} broni się przed ${attacker.warrior.name}.`);

            defender.dp -= attackStrength;

            if(defender.dp < 0) {
                log.push(`${attacker.warrior.name} przełamał obronę ${defender.warrior.name} zadając mu ${-defender.dp} obrażeń.`);
                defender.hp += defender.dp;
            }
        } else {
            log.push(`${attacker.warrior.name} zadał ${attackStrength} obrażeń ${defender.warrior.name}.`);
            defender.hp -= attackStrength;
        }

        [defender, attacker] = [attacker, defender];
    } while(defender.hp > 0);

    const winner = defender.warrior;
    log.push(`${winner.name} zwyciężył!`);

    return {
        log,
        winner,
    };
}
