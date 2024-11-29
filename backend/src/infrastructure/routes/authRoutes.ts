import express from "express";
import { AuthService } from "../../application/authService.js";
import { InMemoryUserRepo } from "../database/userRepo.js";

const router = express.Router();
const userRepo = new InMemoryUserRepo();
const authService = new AuthService(userRepo);

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    await authService.register(email, password);
    res.status(201).send({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).send({ token });
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
