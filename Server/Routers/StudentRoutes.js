import express from "express";
import {  GetWishlist, CreateWish, DeleteWish, EnrollCourse, GetEnrolledCourses, UnEnrollCourse, GetUnEnrolledCourses, AddInterest,ChangeInterest ,RateCourse, GetSingleEnrolledCourse} from "../Controllers/StudentControllers.js";
import { AuthenticatedUser } from "../Middlewares/AuthenticateUser.js";


const Srouter = express.Router();





Srouter.post('/me/Interest', AuthenticatedUser, AddInterest);
Srouter.put('/me/Interest', AuthenticatedUser, ChangeInterest);

Srouter.post('/wishlist', AuthenticatedUser, CreateWish);
Srouter.get('/wishlist', AuthenticatedUser, GetWishlist);
Srouter.delete('/wishlist', AuthenticatedUser, DeleteWish);


Srouter.post('/enrollCourse', AuthenticatedUser, EnrollCourse);

Srouter.get('/enrollCourse', AuthenticatedUser, GetEnrolledCourses);
Srouter.get('/enrollCourse/:CoursePK', AuthenticatedUser, GetSingleEnrolledCourse);

Srouter.post('/Course/rating', AuthenticatedUser, RateCourse);
Srouter.put('/enrollCourse', AuthenticatedUser, UnEnrollCourse);
Srouter.get('/unenrollCourse', AuthenticatedUser, GetUnEnrolledCourses);

export default Srouter;