import express from "express";
import { NewInstitute, LoginInstitute, GetInstituteData } from '../Controllers/Institute Controllers/InstituteControllers.js'
import { NewCourse, UpdateCourse, GetCourse, DeleteCourse, GetAllIntituteCourses, } from '../Controllers/Institute Controllers/CoursesControllers.js';
import { CreateInstructor, UpdateInstructor, GetAllInstructors, DeleteInstructors, GetSingleInstructor, GetInstructor } from "../Controllers/Institute Controllers/InstructorController.js";
const Irouter = express.Router();
import db from '../Conn/connection.js';
import { AuthenticatedUser } from "../Middlewares/AuthenticateUser.js";
import { Realtions } from "../Conn/Relations.js";

const { Institute } = db;
const isAuthenticated = (req, res, next) => {
    AuthenticatedUser(req, res, next, Institute);
}



// Course APIs
Irouter.post('/course/create', AuthenticatedUser, NewCourse);//done
Irouter.put('/course/update', AuthenticatedUser, UpdateCourse);//done
Irouter.delete('/course', isAuthenticated, DeleteCourse);//done
Irouter.get('/course/:CoursePK', GetCourse);
Irouter.get('/courses', isAuthenticated, GetAllIntituteCourses);

Realtions()
// Instructor APIs
Irouter.post('/Instructor/create', isAuthenticated, CreateInstructor);
Irouter.put('/Instructor/update', isAuthenticated, UpdateInstructor);
Irouter.get('/Instructors/my', isAuthenticated, GetInstructor);
Irouter.delete('/Instructor/delete/:InstructorPK', isAuthenticated, DeleteInstructors);

Irouter.get('/Instructor/:InstructorPK', GetSingleInstructor);
Irouter.get('/Instructors', GetAllInstructors);

export default Irouter;