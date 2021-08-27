import * as jwtManager from "../services/jwtManager";
import * as passwordManager from "../services/passwordManager";
import { db } from "../database";
import { AppRequest, AppResponse } from "./types";

export async function login(req: AppRequest, res: AppResponse) {
  const person = await db.getPersonByName(req.body.userName);
  if (!person) {
    res.status(404).json({ error: "Person not found" });
  } else {
    const passwordCorrect = await passwordManager.checkPassword(
      req.body.password,
      person.password
    );

    if (!passwordCorrect) {
      res.status(400).json({ error: "User or password invalid" });
    } else {
      const token = jwtManager.generateToken({ personId: person.id });
      res.json({
        token,
        message: "Login success!",
      });
    }
  }
}
