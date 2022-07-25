import db from '../Conn/connection.js';
import { ComparePassword } from '../Middlewares/PasswordVerification.js';
import { GenerateToken } from '../Middlewares/GenerateToken.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { request } from 'https';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const { Institute, Admin, Categories, Notification, User, sequelize } = db;
export const InstituteRequest = async (req, res) => {
    try {
        const GetIns = await Institute.findOne({
            where: {
                InstituteId: "44f6ac00-6d2b-4411-97b9-f63162532682",
            },
            include: User
        })


        // console.log(GetIns.dataValues.User.dataValues)
        const a = { ...GetIns.dataValues.User.dataValues }
        delete GetIns.dataValues.User
        console.log(GetIns.dataValues)
        const RequestedInstitutes = await Institute.findAll({

            where: {
                ApplicationStatus: "Pending",
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        if (RequestedInstitutes.length === 0) {
            return res.status(200).json(RequestedInstitutes);
        }

        const InstituteWUser = await Promise.all(RequestedInstitutes.map(async (value, index) => {
            const InstituteUser = await User.findOne({
                where: {
                    UserId: "25979962-7c0b-4a58-9839-504273fc06b6",
                    User: "Institute"
                }
            })
            value = await Object.assign({}, InstituteUser.dataValues, value.dataValues);
            if (value.User === "Admin") {

            }
            return value
        }))



        return res.status(200).json(InstituteWUser);
    } catch (errors) {

        console.log(`error occured while creating newInstitute ${errors}`);

        return res.status(500).json({ messsage: errors });

    }
}

export const InstituteReqRes = async (req, res) => {
    try {

        if (req.body.ApplicationStatus === "Accepted") {


            req.body.InstituteStatus = "Working";
            const ResToReqofInstitute = await Institute.update(req.body, {
                where: {
                    ApplicationStatus: 'Pending',
                    InstituteId: req.body.InstituteId
                }
            })
            if (ResToReqofInstitute[0] === 0) {
                return res.status(200).json('The request is already accepted');
            }
        }


        if (req.body.ApplicationStatus === "Rejected") {

            req.body.InstituteStatus = "not Working";
            const ResToReqofInstitute = await Institute.update(
                {
                    ApplicationStatus: req.body.ApplicationStatus,
                    InstituteStatus: req.body.InstituteStatus
                },
                {
                    where: {
                        ApplicationStatus: 'Pending',
                        InstituteId: req.body.InstituteId
                    }
                })
        }




        const ResonsedInstitute = await Institute.findOne({
            where: {
                ApplicationStatus: 'Accepted',
                InstituteId: req.body.InstituteId
            }
        })


        if (req.body.NotificationsId !== undefined) {
            const noti = await Notification.update(
                {
                    MarkAsRead: true
                },
                {
                    where: {
                        NotificationId: req.body.NotificationsId
                    }
                })
        }
        return res.status(200).json(ResonsedInstitute);
    } catch (errors) {

        console.log(`error occured while creating newInstitute ${errors}`);
        return res.status(500).json({ messsage: errors });
    }
}








export const CreateCategries = async (req, res) => {
    req.body.Active = true
    try {
        if (req.User.User !== "Admin") {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
        const FindCategory = await Categories.findOne({
            where: {
                CategoryName: req.body.CategoryName
            }
        })


        if (FindCategory) {
            return res.status(409).json({ message: "Category name already exist. Chosse a different name" });
        }


        const NewCategory = await Categories.create(req.body);
        res.status(200).json(NewCategory);
    } catch (error) {
        console.log(`error occurred while Creating Category: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const UpdateCategries = async (req, res) => {
    try {
        if (req.User !== "Admin") {
            return res.status(401).json({ message: "Unauthorized Access" });
        }
        const NewCategory = await Categories.update(req.body, {
            where: {
                CategoryId: req.body.CategoryId
            }
        });
        res.status(200).json(NewCategory);
    } catch (error) {
        console.log(`error occurred while Updating Category: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}
export const DeleteCategries = async (req, res) => {
    req.body.Active = false;
    try {
        if (req.User.User !== "Admin") {
            console.log("here")
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        const DeleteCategory = await Categories.update(req.body, {
            where: {
                CategoryId: req.body.CategoryId
            },

        });
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        console.log(`error occurred while Deleting Category: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}

export const GetAllCategories = async (req, res) => {
    try {
        const AllCatgories = await Categories.findAll({
            where: {
                Active: true
            }
        });
        res.status(200).json(AllCatgories);
    } catch (error) {
        console.log(`error occurred while Deleting Category: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}


export const AcceptedRequests = async (req, res) => {
    try {
        const AcceptedInstitutes = await Institute.findAll({
            where: {
                ApplicationStatus: 'Accepted'
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });
        res.status(200).json(AcceptedInstitutes);

    } catch (error) {
        console.log(`error occurred while Getting Accepted requests: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}


export const RejectedRequests = async (req, res) => {
    try {
        const RejectedInstitutes = await Institute.findAll({
            where: {
                ApplicationStatus: 'Rejected'
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });
        res.status(200).json(RejectedInstitutes);
    } catch (error) {
        console.log(`error occurred while Getting Accepted requests: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}


export const DownloadDocument = (req, res) => {
    try {
        const FilePath = path.join(__dirname, `../${req.body.DocumentFile}`)

        res.status(200).download(FilePath, `${req.body.InstituteName}.pdf`);
    } catch (error) {
        console.log(`Error occured while downloading ${error}`)
        return res.status(500).json({ error: error.message });
    }
}



export const getAllInstitutes = async (req, res) => {
    try {
        const AllInstitutes = await Institute.findAll({
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        res.status(200).json(AllInstitutes)
    } catch (error) {
        console.log(error);
    }
}
export const getInstitute = async (req, res) => {
    try {
        const AllInstitutes = await Institute.findOne({
            where: {
                InstituteUserId: req.params.InstituteUserId
            }
        })
        res.status(200).json(AllInstitutes)
    } catch (error) {
        console.log(error);
    }
}