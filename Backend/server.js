import  express from "express"
const app=express();
import cors from "cors"
import mongodb from "./mongodb.js"
import dotenv from "dotenv";
dotenv.config();

import route1 from "./Routers/voter_router.js"
import route2 from "./Routers/Candidate_router.js"
app.use(express.json());
app.use(cors());

app.use("/voter",route1);
app.use("/candidate",route2);
mongodb();
app.listen(3000,()=>{
    console.log(`server is connecting on 3000 port`);
})