import path from 'path';
import { fileURLToPath } from 'url';

export const ParseData = async (req, res, next) => {
    try {

        const StringData = JSON.parse(req.body.Signup);
        req.body = StringData;

        const FixedLink = req.files.Document[0].path.replaceAll(`\\`, '/')
        req.body.DocumentFile = FixedLink;

        next();
    } catch (error) {
        console.log(error);
    }
}

