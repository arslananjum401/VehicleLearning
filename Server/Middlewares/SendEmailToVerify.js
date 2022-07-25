import { getVerifyEmailToken, sendEmail } from "./ResetPassword.js";

export const SendEmailToVerify = async (UserInfo,UserModel) => {
    let Token = await getVerifyEmailToken(UserInfo, UserModel);
    console.log(Token);
    const Link = `http://${req.headers.host}/verify-email?token=${Token}`
    const options = {
        email: UserInfo.Email,
        subject: `Vehicle Learning School-Please verify your email`,
        text: `Thanks for Signing up. Please open the link given below to verify your account.
           ${Link}
            `,
        html: `<h2>Thanks for signing up</h2
            <p> Please click the link to verify your account</p>
            <a href="${Link}">Verify Your Email</a>
            `
    }

    await sendEmail(options);
}