import { Router } from "express";
import {WarriorRecords} from "../records/warrior.records";

export const hallOfFameRouter = Router();

hallOfFameRouter
    .get('/list', async (req, res) => {
        const warriors = (
            await WarriorRecords.listTop(10)
        ).map((warrior, index) => {
            return {
                place: index + 1,
                warrior,
            }
        });
        res.render('hall-of-fame/list', {
            warriors,
        })
    })
