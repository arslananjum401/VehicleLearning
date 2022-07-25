import { Op } from 'sequelize';
import db from '../Conn/connection.js';
import crypto from 'crypto';
import { getResetPasswordToken, getVerifyEmailToken, sendEmail } from '../Middlewares/ResetPassword.js';
import { ComparePassword } from '../Middlewares/PasswordVerification.js';
import { GenerateToken } from '../Middlewares/GenerateToken.js';
import { GetNotifications } from '../Helpers/GetNotifications.js';
import { SendEmailToVerify } from '../Middlewares/SendEmailToVerify.js';
const { Course, Institute, User: UserModel, StudentInterest, Notification } = db;

export const CheckInstituteUser = async (CheckInstitute, UserId) => {
    if (CheckInstitute.User === "Institute") {
        const InstituteData = await Institute.findOne({
            where: {
                InstituteUserId: UserId
            }
        })
        if (!InstituteData) {
            return false;
        }
        CheckInstitute = Object.assign({}, InstituteData.dataValues, CheckInstitute);

        return CheckInstitute
    }
    return CheckInstitute
}








export const SearchCourse = async (req, res) => {
    console.log(req.params.CourseName)
    if (req.params.CourseName === "''") {
        req.params.CourseName = ''
    }
    if (req.params.ByInstitute === "''") {
        req.params.ByInstitute = ''
    }
    try {
        const GetCourse = await Course.findAll({
            where: {
                [Op.or]: {
                    CourseName: {
                        [Op.like]: `%${req.params.CourseName}%`,
                    },
                    ByInstitute: {
                        [Op.like]: `%${req.params.ByInstitute}%`,
                    }
                }
            }
        })
        res.status(200).json(GetCourse);
    } catch (error) {
        console.log(`error occurred while Searching course : ${error}`);
        res.status(500).json(error);
    }

}


export const LogOutUser = async (req, res) => {
    try {
        res.status(200)
            .clearCookie('token')
            .clearCookie('checkToken')
            .json({ message: 'Logout successfully' })
            .end();
    } catch (error) {
        console.log(`error occurred while Logging out user: ${error}`);
        res.status(500).json(error);
    }
}

export const GetInstituteList = async (req, res) => {
    try {
        const Institutes = await Institute.findAll({
            where: {
                InstituteStatus: "Working",
                ApplicationStatus: "Accepted"
            }
        });
        res.status(200).json(Institutes)
    } catch (error) {
        console.log(`error occurred while Getting InstituteList: ${error}`);
        res.status(500).json(error);
    }
}
export const GetAllCourses = async (req, res) => {

    try {
        const CourseGot = await Course.findAll({
            order: [
                ['createdAt', 'ASC'],
            ],
        });
        const ViewCourses = CourseGot.filter((course) => {
            return course.Status !== "Deleted"
        })

        res.status(200).json(ViewCourses);
    } catch (error) {
        console.log(`error occured while getting all Courses ${error}`);
        return res.status(500).json(error);
    }

}


export const ForgotPassword = async (req, res) => {

    try {
        const FindUser = await UserModel.findOne({
            where: {
                Email: req.body.Email
            }
        });
        if (!FindUser) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        const ResetToken = await getResetPasswordToken(FindUser, UserModel);
        let resestUrl = `${req.protocol}://localhost:3000/forgot/reset/password/${ResetToken}`


        if (process.env.NODE_ENV === 'production') {
            resestUrl = `${req.protocol}://${req.get('host')}/forgot/reset/password/reset/${ResetToken}`
        }
        const message = `Reset your password by clicking on the link below: ${resestUrl}`;

        try {
            await sendEmail({
                email: FindUser.Email,
                subject: "Reset Password",
                message
            })

            res.status(200).json({
                success: true,
                message: "Link for reset password is sent to the email"
            })
        } catch (error) {
            console.log(`error occured sending email ${error}`);
        }


    } catch (error) {
        console.log(`error occured while running forgot password ${error}`);
        return res.status(500).json(error);

    }

}

export const ResetPassword = async (req, res) => {

    try {

        let String = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
        const FoundUser = await UserModel.findOne({
            where: {
                ResetPasswordToken: String
            }
        })
        if (!FoundUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token or expired"
            })
        }
        FoundUser.Password = req.body.Password
        FoundUser.ResetPasswordToken = ''
        FoundUser.ResetPasswordExpire = undefined
        await FoundUser.save()

        res.status(200).json({ message: "Password Changed Successfully" })

    } catch (error) {
        console.log(`error occured while resetting password ${error}`);
        return res.status(500).json(error);
    }
}



export const SignUp = async (req, res) => {
    if (req.body.User === undefined) {
        req.body.User = "Admin"
    }
    try {
        const CheckEmail = await UserModel.findOne({
            where: {
                Email: req.body.Email
            }
        });
        const CheckUserName = await UserModel.findOne({
            where: {
                UserName: req.body.UserName
            }
        });

        if (CheckEmail && CheckUserName) {
            return res.status(401).json({ message: "Email and UserName is already in use" });
        }
        else if (CheckEmail) {
            return res.status(401).json({ message: "Email is already in use" });
        }
        else if (CheckUserName) {
            return res.status(401).json({ message: "UserName is already taken" });
        }


        
        const User = await UserModel.create(req.body);

        SendEmailToVerify(User,UserModel)
        return res.status(201).json(User);

    } catch (error) {
        console.log(`error occurred while Signing up student: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}


export const Login = async (req, res) => {
    try {
        let CheckEmail = await UserModel.findOne({
            where: { Email: req.body.Email }
        });

        if (!CheckEmail) {
            console.log("Email")
            return res.status(401).json({ message: "Email or password incorrect" });
        }
        const CheckPassword = await ComparePassword(req.body.Password, CheckEmail.Password);
        if (!CheckPassword) {
            console.log("Password")
            return res.status(401).json({ message: "Email or password incorrect" });
        }
        const Token = await GenerateToken(CheckEmail.UserId);
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        CheckEmail = await CheckInstituteUser(CheckEmail.dataValues, CheckEmail.dataValues.UserId)


        return res
            .status(200)
            .cookie("token", Token, options)
            .cookie("checkToken", Token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) })
            .json(CheckEmail);
    } catch (error) {
        console.log(`error occurred while Logging in student: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}


export const GetUserData = async (req, res) => {
    let UserRealtedData

    try {
        if (req.User.User === 'Student') {

            UserRealtedData = await StudentInterest.findOne({
                where: {
                    StudentId: req.UserId,
                }
            })

        }

        req.User = await CheckInstituteUser(req.User, req.UserId);

        let UserNotifications = await GetNotifications(Notification, req.User, req.UserId);

        res.status(200).json({ data: req.User, Interest: UserRealtedData, Notifications: UserNotifications })
    } catch (error) {
        console.log(`error occurred while Getting  student data: ${error}`);
        return res.status(500).json(error);
    }
}


export const NewInstitute = async (req, res) => {

    req.body.User = "Institute";
    try {

        const CheckName = await UserModel.findOne({
            where: { UserName: req.body.UserName }
        })
        const CheckEmail = await UserModel.findOne({
            where: { Email: req.body.Email }
        })
        const CheckUserName = await UserModel.findOne({
            where: { UserName: req.body.UserName }
        })

        if (CheckName && CheckEmail && CheckUserName) {

            return res.status(401).json({
                error: {
                    InstituteNameMsg: "Institute name is already registered",
                    EmailMsg: "Email is already is use",
                    UserNameMsg: "UserName is already taken",
                }
            })
        }
        else if (CheckName) {
            return res.status(401).json({
                error: {
                    InstituteNameMsg: "Institute name is already registered"
                }
            })
        }
        else if (CheckEmail) {
            return res.status(401).json({
                error: {
                    EmailMsg: "Email is already is use"
                }
            })
        }
        else if (CheckUserName) {
            return res.status(401).json({
                error: {
                    UserNameMsg: "UserName is already taken"
                }
            })
        }

        let newInstituteUser = await UserModel.create(req.body)
        req.body.InstituteUserId = newInstituteUser.UserId;

        let newInstitute = await Institute.create(req.body)

        let NewUSER = Object.assign({}, newInstitute.dataValues, newInstituteUser.dataValues);


        return res.status(201).json(NewUSER)
    } catch (errors) {
        console.log(`error occured while creating newInstitute ${errors}`);
        console.log(errors)
        return res.status(500).json({ messsage: errors });
    }

}

export const CheckResetPasswordToken = async (req, res) => {
    try {

        let ChString = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const FoundUser = await UserModel.findOne({
            where: {
                ResetPasswordToken: ChString,
                ResetPasswordExpire: {
                    [Op.gt]: new Date(Date.now())
                }
            }
        })



        if (!FoundUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid Token or expired"
            })
        }

        const message = { message: "Allow User", success: true }

        res.status(200).json(message)

    } catch (error) {
        console.log(`error occured while resetting password ${error}`);
        return res.status(500).json(error);
    }
}


export const SendEmailVerification = async (req, res) => {
    try {
        let Token = await getVerifyEmailToken({ UserId: req.UserId }, User);

        const Link = `http://${req.headers.host}/verify-email?token=${Token}`
        const options = {
            email: req.body.Email,
            subject: `Vehicle Learning School-Please verify your email`,
            text: `Thanks for Signing up. Please open the link given below to verify your account.
           ${Link}
            `,
            html: `<h2>Thanks for signing up</h2
            <p> Please click the link to verify your account</p>
            <a href="${Link}">Verify Your Email</a>
            `
        }

        await sendEmail(options)
        res.status(200).json({ message: "Please check your inbox for Email." })
    } catch (error) {

    }
}




export const VerifyEmail = async (req, res) => {
    let ChString = crypto.createHash('sha256').update(req.query.token).digest('hex');

    try {
        const FoundUser = await User.findOne({
            where: {
                EmailToken: ChString
            }
        })
        if (!FoundUser) {
            // res.flash('Please login')
            return res.redirect('/')
        }
        FoundUser.EmailToken = '';
        FoundUser.IsVerified = true;
        await FoundUser.save();
        let options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200)
            .redirect('/login')
            .cookie("token", Token, options)
            .cookie("checkToken", Token, { ...options, httpOnly: false })
            .json(FoundUser)
    } catch (error) {

    }
}