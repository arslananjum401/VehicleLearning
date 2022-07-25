import nodemailer from 'nodemailer';
import crypto from 'crypto';
let i = 0;
export const sendEmail = async (options) => {
    const transpoter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secureConnection: false,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    transpoter.sendMail(
        mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: ', ++i, info.response);
        }
    )
}

export const getResetPasswordToken = async ({ UserId }, UserModel) => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    let ResetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    let ResetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await UserModel.update({
        ResetPasswordToken,
        ResetPasswordExpire
    },
        {
            where: {
                UserId
            }
        }
    )

    return resetToken;
}


export const getVerifyEmailToken = async ({ UserId }, Model) => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    let EmailToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    let ResetPasswordExpire = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    await Model.update({
        EmailToken,
    },
        {
            where: {
                UserId
            }
        }
    )

    return resetToken;
}