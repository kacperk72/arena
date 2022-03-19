import {ValidationError} from "../utils/error";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type WarriorRecordResult = [WarriorRecords[], FieldPacket[]];

export class WarriorRecords {
    public id?: string;
    public readonly name: string;
    public readonly power: number;
    public readonly defence: number;
    public readonly stamina: number;
    public readonly agility: number;
    public wins?: number;

    constructor(obj: Omit<WarriorRecords, 'insert' | 'update'>) {   //Omit tworzy typ bez tych dwóch metod
        const {id, name, power, defence, stamina, agility, wins} = obj;

        const stats = [stamina,defence,power,agility];

        const sum = stats.reduce((prev,curr) => prev + curr, 0);

        if(sum !== 10) {
            throw new ValidationError(`Suma wszystkich statystyk musi wynosic 10. Aktualnie jest to ${sum}`);
        }

        for(const stat of stats) {
            if (stat < 1) {
                throw new ValidationError('Każda statystyka musi być większa od 0')
            }
        }

        if(name.length < 3 && name.length > 50){
            throw new ValidationError(`Imie musi posiadać od 3 do 50 znaków. Aktualnie jest to ${name.length}`);
        }

        this.id = id ?? uuid();
        this.wins = wins ?? 0;
        this.name = name;
        this.power = power;
        this.defence = defence;
        this.stamina = stamina;
        this.agility = agility;
    }

    async insert(): Promise<string | undefined> {
        await pool.execute("INSERT INTO warriors (`id`, `name`, `power`, `defence`, `stamina`, `agility`, `wins`) VALUES (:id, :name, :power, :defence, :stamina, :agility, :wins)", {
            id: this.id,
            name: this.name,
            power: this.power,
            defence: this.defence,
            stamina:  this.stamina,
            agility: this.agility,
            wins: this.wins
        });

        return this.id;
    }

    async update(): Promise<void> {
        await pool.execute("UPDATE warriors SET `wins` = :wins WHERE id = :id", {
            id: this.id,
            wins: this.wins,
        });
    }

    static async getOne(id: string): Promise<WarriorRecords | null> {
        const [results] = await pool.execute("SELECT * FROM `warriors` WHERE `id` = :id", {
            id,
        }) as WarriorRecordResult;

        return results.length === 0 ? null : new WarriorRecords(results[0]);
    }

    static async listAll(): Promise<WarriorRecords[]> {
        const [results] = await pool.execute("SELECT * FROM `warriors`") as WarriorRecordResult;

        return results.map(obj => new WarriorRecords(obj));
    }

    static async listTop(topCount: number): Promise<WarriorRecords[]> {
        const [results] = await pool.execute("SELECT * FROM `warriors` ORDER BY `wins` DESC LIMIT :topCount", {
            topCount,
        }) as WarriorRecordResult;

        return results.map(obj => new WarriorRecords(obj));
    }

    static async isNameTaken(name: string): Promise<boolean> {
        const [results] = await pool.execute("SELECT * FROM `warriors` where `name` = :name", {
            name,
        }) as WarriorRecordResult;

        return results.length > 0;
    }
}
