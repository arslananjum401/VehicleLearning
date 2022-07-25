import db from '../../Conn/connection.js'
import { GenerateToken } from '../../Middlewares/GenerateToken.js';
import { ComparePassword } from '../../Middlewares/PasswordVerification.js';
const { Institute } = db;

export const NewInstitute = async (req, res) => {

    req.body.User = "Institute";
    try {
        const CheckName = await Institute.findOne({
            where: { InstituteName: req.body.InstituteName }
        })
        const CheckEmail = await Institute.findOne({
            where: { Email: req.body.Email }
        })
        const CheckUserName = await Institute.findOne({
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
            console.log("CheckUserName")
            return res.status(401).json({
                error: {
                    UserNameMsg: "UserName is already taken"
                }
            })
        }




        const newInstitute = await Institute.create(req.body)

        return res.status(201).json(newInstitute)
    } catch (errors) {
        console.log(`error occured while creating newInstitute ${errors}`);
        console.log(errors)
        return res.status(500).json({ messsage: errors });
    }

}

export const LoginInstitute = async (req, res) => {
    console.log("Institute")
    try {
        const CheckEmail = await Institute.findOne({ where: { Email: req.body.Email } });

        if (!CheckEmail) {
            return res.status(401).json({ message: "Email or password is invalid" })
        }

        const CheckPassword = ComparePassword(req.body.Password, CheckEmail.Password);
        if (!CheckPassword) {
            return res.status(401).json({ message: "Email or password is invalid" });
        }
        if (CheckEmail.User !== "Institute") {
            return res.status(401).json({ message: "Email or password is invalid" })
        }

        const Token = await GenerateToken(CheckEmail.UserId);
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        // console.log(Token);
        return res
            .status(201)
            .cookie("token", Token, options)
            .cookie("checkToken", Token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) })
            .json(CheckEmail)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ messsage: error });
    }
}

export const GetInstituteData = async (req, res) => {
    try {
        if (req.User.User !== 'Institute') {
            res.status(401).clearCookie('token').json({ message: 'please login again' }).end()
        }
        if (req.User.ApplicationStatus === 'Rejected') {
            return res.status(200).json({ data: req.User, message: 'Your Request has been rejected' })
        }
        res.status(200).json({ data: req.User })
    } catch (error) {
        return res.status(500).json({ messsage: error });
    }
}