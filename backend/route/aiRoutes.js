import express from "express";

import isAuth from "../middleware/isAuth.js";

import {
    searchWithAi
} from "../controller/aiController.js";


const aiRouter = express.Router();



aiRouter.post(
    "/search",
    isAuth,
    searchWithAi
);



export default aiRouter;