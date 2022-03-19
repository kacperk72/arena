import {Router} from "express";
import {WarriorRecords} from "../records/warrior.records";
import {ValidationError} from "../utils/error";

export const warriorRouter = Router();

warriorRouter
    .get('/add-form', (req, res) => {
        res.render('warrior/add-form')
    })
    .post('/', async (req, res) => {
        const {agility, power, defence, stamina, name} = req.body;

        if(await WarriorRecords.isNameTaken(name)) {
            throw new ValidationError(`Imie ${name} jest zajęte`)
        }

        const warrior = new WarriorRecords({
            ...req.body,
            power: Number(power),
            defence: Number(defence),
            stamina: Number(stamina),
            agility: Number(agility),
        });
        const id = await warrior.insert();
        res.render('warrior/warrior-added', {
            id,
            name: warrior.name,
        })
    }) ;

