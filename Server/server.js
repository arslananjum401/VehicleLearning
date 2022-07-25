import Express from "express";
import connection from './Conn/connection.js';
import CookieParser from 'cookie-parser';
import Irouter from "./Routers/InstituteRoutes.js";
import Aroutes from "./Routers/AdminRoutes.js";
import dotenv from 'dotenv';
import Srouter from "./Routers/StudentRoutes.js";
import cors from 'cors'
import { Server } from "socket.io";
import http from 'http';
import {SocketFunction} from './SocketIo.js';
import { CRoutes } from "./Routers/CommonRoutes2.js";
import { Realtions } from "./Conn/Relations.js";





const app = Express();
const server = http.createServer(app)
 const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000"
  }
 });

dotenv.config({ path: "./Config/config.env" })


const Port = 9000

SocketFunction(io)

app.use(cors());
app.use(CookieParser())
app.use(Express.urlencoded({ limit: "50mb", extended: true }));
app.use(Express.json({ limit: "50mb" }))
app.use('/Institute', Irouter);
app.use('/Admin', Aroutes)
app.use('/', Srouter);
app.use('/', CRoutes)



Realtions();
server.listen(Port, () => {
    console.log(`App  is  runnging on port ${Port}`)
});