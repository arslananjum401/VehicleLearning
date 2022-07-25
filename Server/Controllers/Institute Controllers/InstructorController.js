import db from '../../Conn/connection.js'
const { Instructor, Course } = db;

const CheckInstitute = (req) => {
    if (req.body.ApplicationStatus === "Pending" || req.body.InstituteStatus === "Not Working") {
        return res.status(401).json({ error: "For now, you are not eligible to perform this action" })
    }
}



export const GetInstructor = async (req, res) => {
    CheckInstitute(req)

    try {
        const NewInstructor = await Instructor.findAll({
            where: {
                FromInstitute: req.User.InstituteId,
                Suspend: false
            }
        });
        return res.status(201).json(NewInstructor)
    } catch (error) {
        console.log(`error occured while Creating Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const CreateInstructor = async (req, res) => {
    CheckInstitute(req)
    req.body.FromInstitute = req.User.InstituteId;
    try {

        const NewInstructor = await Instructor.create(req.body);
        return res.status(201).json(NewInstructor)
    } catch (error) {
        console.log(`error occured while Creating Instructor ${error.message}`);
        return res.status(500).json(error);
    }
}

export const UpdateInstructor = async (req, res) => {
    try {
        const CheckInstructor = await Instructor.findOne({
            where: {
                InstructorPK: req.body.InstructorPK
            }
        })

        if (!CheckInstructor || CheckInstructor.Suspend === true) {
            return res.status(201).json({ message: "the Instructor is nor present or has been deleted" })
        }
        if (req.User.InstituteName !== CheckInstructor.FromInstitute) {
            return res.status(201).json({ message: "You cannot update this instructor" })
        }

        const ModifyInstructor = await Instructor.update(req.body, {
            where: {
                InstructorPK: req.body.InstructorPK
            }
        });

        const UpdatedInstructor = await Instructor.findOne({
            where: {
                InstructorPK: req.body.InstructorPK
            }
        });
        return res.status(201).json(UpdatedInstructor)
    } catch (error) {
        console.log(error.message)
        console.log(`error occured while Updating Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const GetSingleInstructor = async (req, res) => {
    try {
        const GetInstructor = await Instructor.findOne({
            where: {
                InstructorPK: req.params.InstructorPK
            }
        });
        const GetInstructorCourse = await Course.findOne({
            where: {
                CoursePK: GetInstructor.CourseFK
            }
        })
       
        if (GetInstructor.Suspend === true) {
            return res.status(200).json({ message: "Instructor not found" });
        }
        return res.status(200).json({ GetInstructor:GetInstructor.dataValues, GetInstructorCourse:GetInstructorCourse.dataValues })
    } catch (error) {
        console.log(`error occured while Getting Single Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}
export const GetAllInstructors = async (req, res) => {
    try {
        const GetAllInstructor = await Instructor.findAll({
            where: {
                Suspend: false
            }
        });
        const FilteredInstructor = GetAllInstructor.filter((instructor) => instructor.Suspend !== true)
        res.status(200).json(FilteredInstructor);
    } catch (error) {
        console.log(`error occured while Getting all Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}

export const DeleteInstructors = async (req, res) => {
    try {
        const TobeDeleted = await Instructor.update(
            {
                Suspend: true
            },
            {
                where: {
                    InstructorPK: req.params.InstructorPK
                }
            });

        res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (error) {
        console.log(`error occured while Deleting all Instructor ${error.message}`);
        return res.status(500).json({ error });
    }
}