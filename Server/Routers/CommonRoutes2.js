import express from "express";
import { LogOutUser, SearchCourse, GetInstituteList, GetAllCourses, ForgotPassword, ResetPassword, SignUp, Login, GetUserData,NewInstitute,CheckResetPasswordToken,SendEmailVerification, VerifyEmail } from '../Controllers/CommonControllers.js';
import { AuthenticatedUser } from "../Middlewares/AuthenticateUser.js";
import { PasswordHash } from "../Middlewares/PasswordHashing.js";
import cpUpload from "../Middlewares/MulterMiddleware.js";
import { ParseData } from "../Middlewares/ParseData.js";
const CRoutes = express.Router();
CRoutes.get('/:CourseName/:ByInstitute', SearchCourse)

CRoutes.get('/logout', LogOutUser)
CRoutes.get('/Institutelist', GetInstituteList)
CRoutes.get('/courses', GetAllCourses);

CRoutes.get('/me', AuthenticatedUser, GetUserData);

CRoutes.get('/verify-email', VerifyEmail);


CRoutes.post('/forgot/password', ForgotPassword);
CRoutes.post('/request/verify-email',AuthenticatedUser, SendEmailVerification);
CRoutes.put('/forgot/password/:resetToken', PasswordHash, ResetPassword);
CRoutes.get('/forgot/password/:resetToken', CheckResetPasswordToken);

CRoutes.post('/signup', PasswordHash, SignUp);
CRoutes.post('/Institute/Register', cpUpload, ParseData, PasswordHash, NewInstitute);
CRoutes.post('/login', Login);
export { CRoutes }