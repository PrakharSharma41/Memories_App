import express from "express";
const router = express.Router();

import { signin, signup } from "../controllers/user.js";

router.post("/signin", signin); // it is post request as we have to send form data to server
router.post("/signup", signup);

export default router;