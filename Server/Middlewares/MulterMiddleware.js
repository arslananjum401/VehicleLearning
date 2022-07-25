import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Public/Documents')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})


const upload = multer({ storage: storage })
const cpUpload = upload.fields([{ name: 'Document' }])
export default cpUpload;