import express from "express";
import Protectedroutes from "../middleware/Protectedroutes.js";
import { getdata, postdata } from "../controller/Data.js";

const router = express.Router();

router.post("/send", Protectedroutes, postdata);
router.get("/get", Protectedroutes, getdata);

export default router;
