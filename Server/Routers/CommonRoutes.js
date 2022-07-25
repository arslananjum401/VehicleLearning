import express from "express";
import { LogOutUser, SearchCourse, GetInstituteList, GetAllCourses, ForgotPassword, ResetPassword } from '../Controllers/CommonControllers.js';
import { PasswordHash } from "../Middlewares/PasswordHashing.js";


const CRoutes = express.Router();





export { CRoutes };