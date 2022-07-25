import db from '../../Conn/connection.js';
import { CheckInstituteUser } from '../CommonControllers.js';
const { Institute, Course, CourseEnrollment } = db;
const CheckInstituteStatus = (CheckInstitute, res) => {
    if (CheckInstitute.ApplicationStatus === "Pending" || CheckInstitute.InstituteStatus === "Not Working") {

        return res.status(201).json({ error: "For now, you are not eligible to perform this action" })
    } else {
        return false
    }

}


export const NewCourse = async (req, res) => {

    // console.log(req.body)
    // console.log("req.User");


    try {

        const CheckInstitute = await CheckInstituteUser(req.User, req.UserId)
        const CheckApplicationStatus = await CheckInstituteStatus(CheckInstitute, res)
        if (CheckApplicationStatus !== false) {
            return
        }
        req.body.ByInstitute = CheckInstitute.InstituteId;
        if (!CheckInstitute) {

            return res.status(201).json({ error: "You can not create course Institute" })

        }


        const newCourse = await Course.create(req.body);
        console.log(CheckInstitute)

        res.status(201).json(newCourse)
    } catch (errors) {
        console.log(`error occured while Creating Course ${errors.message}`);
        // console.log(errors)
        return res.status(500).json(errors);
    }
}



export const UpdateCourse = async (req, res) => {
    try {
        const CheckInstitute = await CheckInstituteUser(req.User, req.UserId)
        if (!CheckInstitute) {

            console.log("here")
            return res.status(401).json({ error: "You can not update this courses" })
        }

        const CheckApplicationStatus = await CheckInstituteStatus(CheckInstitute, res)
        if (CheckApplicationStatus !== false) {
            return
        }

        const CheckCourse = await Course.findOne({
            where: {
                CoursePK: req.body.CoursePK
            }
        })
        if (CheckInstitute.InstituteId !== CheckCourse.ByInstitute) {
            return res.status(201).json({ error: "You can update only Your courses" })
        }


        const newCourse = await Course.update(
            req.body,
            {
                where: {
                    CoursePK: req.body.CoursePK
                }
            });

        const UpdatedCourse = await Course.findOne({
            where: {
                CoursePK: req.body.CoursePK
            }
        })
        res.status(201).json(UpdatedCourse)

    } catch (errors) {
        console.log(`error occured while UpdateCourse ${errors}`);
        return res.status(500).json({ errors });
    }
}


export const GetCourse = async (req, res) => {

    try {
        const CourseGot = await Course.findOne({
            where: {
                CoursePK: req.params.CoursePK
            }
        });
        if (!CourseGot) {
            return res.status(200).json({ message: "Course not found" });
        }
        if (CourseGot.Status === "Deleted") {
            return res.status(200).json({ message: "Course is Deleted" });

        }

        res.status(200).json(CourseGot);

    } catch (errors) {
        console.log(`error occured while getting Course ${errors}`);
        return res.status(500).json({ errors });
    }
}

export const GetAllIntituteCourses = async (req, res) => {
    try {
        req.User = await CheckInstituteUser(req.User, req.UserId)

        const CourseGot = await Course.findAll({
            where: {
                ByInstitute: req.User.InstituteId,

            },
            include: [
                {
                    association: "Institute",
                    attributes: ["InstituteName", "InstituteLocation"]
                }
            ]
        });

        let ViewCourses = CourseGot.filter((course) => {

            return course.Status !== "Deleted"
        })
        ViewCourses = ViewCourses.map((course) => {
            course.dataValues.InstituteName = req.User.InstituteName;
            return  course.dataValues
        })
        res.status(200).json(ViewCourses);
    } catch (error) {
        console.log(`error occured while getting all Courses of Institute ${error}`);
        return res.status(500).json({ error });
    }


}

export const DeleteCourse = async (req, res) => {


    try {
        req.User = await CheckInstituteUser(req.User, req.UserId)
        if (req.User === false) {
            return res.status(401).json({ messsage: "Institute no found" });
        }

        const CheckApplicationStatus = await CheckInstituteStatus(req.User, res)
        if (CheckApplicationStatus !== false) {
            return
        }
        const FindCourse = await Course.findOne(
            {
                where: {
                    CoursePK: req.body.CoursePK
                }
            }
        )
        if (FindCourse.ByInstitute !== req.User.InstituteId) {
            return res.status(401).json({ messsage: "You cannot delete this course" });
        }
        const DeletedCourse = await Course.update(req.body,
            {
                where: {
                    CoursePK: req.body.CoursePK
                }
            }
        )
        return res.status(200).json({ messsage: DeletedCourse });
    } catch (error) {
        console.log(`error occured while DeleteCourse ${error}`);
        return res.status(500).json(error);
    }
}