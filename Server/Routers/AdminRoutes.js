import express from "express";
import { InstituteRequest, InstituteReqRes,CreateCategries, UpdateCategries, DeleteCategries, GetAllCategories, AcceptedRequests, RejectedRequests, DownloadDocument, getAllInstitutes, getInstitute } from '../Controllers/AdminControllers.js';
import { AuthenticatedUser } from "../Middlewares/AuthenticateUser.js";
import { PasswordHash } from '../Middlewares/PasswordHashing.js';
import db from '../Conn/connection.js';

const { Admin } = db;


const Aroutes = express.Router();

Aroutes.get('/InstitutesRequest', AuthenticatedUser, InstituteRequest);//Checked
Aroutes.put('/InstitutesRequest/res', AuthenticatedUser, InstituteReqRes);//Notification needs to be fixed
Aroutes.get('/InstitutesRequest/accepted', AuthenticatedUser, AcceptedRequests);//Checked
Aroutes.get('/InstitutesRequest/rejected', AuthenticatedUser, RejectedRequests);//Checked
Aroutes.post('/download', AuthenticatedUser, DownloadDocument);//Checked

Aroutes.get('/AllInstitutes', AuthenticatedUser, getAllInstitutes);//Checked
Aroutes.get('/Institute/:InstituteUserId', AuthenticatedUser, getInstitute);//Checked



Aroutes.post('/category/create', AuthenticatedUser, CreateCategries);//Checked
Aroutes.put('/category/update', AuthenticatedUser, UpdateCategries);//useeless
Aroutes.put('/category/delete', AuthenticatedUser, DeleteCategries);//Checked
Aroutes.get('/categorys', GetAllCategories);//Checked


export default Aroutes;