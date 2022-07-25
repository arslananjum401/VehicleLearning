import { response } from 'express';
import db from '../Conn/connection.js'
import { GenerateToken } from '../Middlewares/GenerateToken.js';
import { ComparePassword } from '../Middlewares/PasswordVerification.js';
import { CalculateRating, CheckCompletion, ProgressBar } from '../Helpers/Helpers.js';
import { Change } from '../Helpers/ChangeObject.js';
const { Student, FavouriteCourses, CourseEnrollment, StudentInterest, Course, sequelize } = db;






export const GetWishlist = async (req, res) => {
    try {
        const GetWishes = await FavouriteCourses.findAll({
            where: {
                StudentId: req.UserId
            },
            order: [
                ['createdAt', 'ASC'],
            ],
        });
        res.status(200).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Getting Wish list: ${error}`);
        return res.status(500).json(error);
    }
}
export const CreateWish = async (req, res) => {
    req.body.StudentId = req.UserId;
    try {
        const FindWish = await FavouriteCourses.findOne({
            where: {
                Wish: req.body.Wish,
                StudentId: req.body.StudentId
            }
        });
        if (FindWish) {
            const GetAllWished = await FavouriteCourses.findAll({

                where: {
                    StudentId: req.UserId
                },
                order: [
                    ['createdAt', 'ASC'],
                ],
    
            })
            return res.status(201).json(GetAllWished);
        }
        const CreateWish = await FavouriteCourses.create(req.body);
        const GetAllWished = await FavouriteCourses.findAll({

            where: {
                StudentId: req.UserId
            },
            order: [
                ['createdAt', 'ASC'],
            ],

        })
        res.status(201).json(GetAllWished)
    } catch (error) {
        console.log(`error occurred while Creating Wish list: ${error}`);
        return res.status(500).json(error);
    }
}

export const DeleteWish = async (req, res) => {

    try {
        const Delete = await FavouriteCourses.destroy({
            where: {
                WishId: req.body.WishId
            }
        })
        const GetAllWished = await FavouriteCourses.findAll({

            where: {
                StudentId: req.UserId
            },
            order: [
                ['createdAt', 'ASC'],
            ],

        })
        res.status(200).json(GetAllWished)
    } catch (error) {
        console.log(`error occurred while Deleting Wish: ${error}`);
        return res.status(500).json(error);
    }
}

export const EnrollCourse = async (req, res) => {
    req.body.StudentId = req.UserId;
    req.body.EnrollmentPeriod = Date.now() + 1 * 365 * 24 * 60 * 60 * 1000;
    req.body.EnrollmentStatus = true;
    try {
        let course;

        const CheckCourseEnrollment = await CourseEnrollment.findOne({
            where: {
                EnrolledCourse: req.body.EnrolledCourse,
                StudentId: req.body.StudentId
            }
        });

        if (CheckCourseEnrollment) {//Checking if user had ever enrolled for this course
            if (CheckCourseEnrollment.EnrollmentStatus === false) {
                const UpdatedCourse = await CourseEnrollment.update(
                    req.body,
                    {
                        where: {
                            EnrollmentId: CheckCourseEnrollment.EnrollmentId
                        }
                    })

                course = await Course.findOne({
                    where: {
                        CoursePK: CheckCourseEnrollment.EnrolledCourse
                    }
                })
                const EnrollmentCourse = await CourseEnrollment.findOne({
                    where: {
                        EnrollmentId: CheckCourseEnrollment.EnrollmentId
                    }
                })



                const OBJ = await Change(EnrollmentCourse)
                console.log(OBJ)
                return res.status(201).json({ course, EnrollmentCourse: OBJ });
            } else {
                return res.status(403).json({ message: "You have already been enrolled." });
            }
        }

        const EnrolledCourse = await CourseEnrollment.create(req.body);
        course = await Course.findOne({
            where: {
                CoursePK: req.body.EnrolledCourse,
            }
        })

        const OBJ = await Change(EnrolledCourse)

        res.status(200).json({ course, EnrollmentCourse: OBJ });
    } catch (error) {
        console.log(`error occurred while Enrolling course: ${error}`);
        return res.status(500).json(error);
    }
}
export const GetEnrolledCourses = async (req, res) => {
    try {

        const EnrolledCourses = await CourseEnrollment.findAll({
            where: {
                StudentId: req.UserId,
                EnrollmentStatus: true
            },
            order: [
                ['createdAt', 'ASC'],
            ],
        })

        const filteredES = await EnrolledCourses.filter(async (value) => {
            if (value.EnrollmentPeriod < Date.now()) {
                await CourseEnrollment.update({
                    EnrollmentStatus: false,
                },
                    {
                        where: {
                            EnrollmentId: value.EnrollmentId
                        }
                    }
                )
            }
            return value.EnrollmentStatus === true
        })

        res.status(200).json({ EnrollmentCourse: filteredES });
    } catch (error) {
        console.log(`error occurred while Getting Enrolled courses: ${error}`);
        return res.status(500).json(error);
    }
}
export const GetSingleEnrolledCourse = async (req, res) => {
    try {
        let SEnrolledCourse = await CourseEnrollment.findOne({
            where: {
                StudentId: req.UserId,
                EnrolledCourse: req.params.CoursePK,
                EnrollmentStatus: true
            }
        })
        if (SEnrolledCourse && SEnrolledCourse.EnrollmentPeriod < Date.now()) {
            SEnrolledCourse = await CourseEnrollment.update({
                EnrollmentStatus: false,
            },
                {
                    where: {
                        EnrollmentId: SEnrolledCourse.EnrollmentId
                    }
                }
            )
        }
        SEnrolledCourse = await CourseEnrollment.findOne({
            where: {
                StudentId: req.UserId,
                EnrolledCourse: req.params.CoursePK,
                EnrollmentStatus: true
            }
        })

        const OBJ = await Change(SEnrolledCourse)

        await CheckCompletion(SEnrolledCourse)

        const GetCourse = await Course.findOne({
            where: {
                CoursePK: SEnrolledCourse.EnrolledCourse
            }
        })

        res.status(200).json({ CourseEnrollment: OBJ, Course: GetCourse })
    } catch (error) {
        console.log(`error occurred while Getting Single Enrolled Course: ${error}`);
        return res.status(500).json(error);
    }
}

export const UnEnrollCourse = async (req, res) => {
    req.body.EnrollmentStatus = false;
    req.body.EnrollmentPeriod = Date.now();
    try {
        const UnEnrollCourse = await CourseEnrollment.update(req.body, {
            where: {
                EnrollmentId: req.body.EnrollmentId
            }
        })
        res.status(204).end()
    } catch (error) {
        console.log(`error occurred while UnEnrolling courses: ${error}`);
        return res.status(500).json(error);
    }
}


export const GetUnEnrolledCourses = async (req, res) => {
    try {
        const UnEnrollCourses = await CourseEnrollment.findAll({
            where: {
                StudentId: req.UserId,
                EnrollmentStatus: false
            }
        })

        res.status(200).json(UnEnrollCourses);
    } catch (error) {
        console.log(`error occurred while Getting UnEnrolled courses: ${error}`);
        return res.status(500).json(error);
    }
}


export const AddInterest = async (req, res) => {
    req.body.StudentId = req.UserId;
    try {
        const CheckInterest = await StudentInterest.findOne({
            where: {
                StudentId: req.UserId,
                CourseCategory: req.body.CourseCategory
            }
        });
        if (CheckInterest) {
            return res.status(403).json({ message: "Interest already added" });
        }

        const AddInteres = await StudentInterest.create(req.body);
        console.log(AddInteres);
        res.status(200).json(AddInteres);
    } catch (error) {
        console.log(`error occurred while Getting Interest : ${error}`);
        return res.status(500).json(error)
    }
}


export const ChangeInterest = async (req, res) => {
    try {
        const ChangedInterest = await StudentInterest.update(req.body, {
            where: {
                InterestId: req.body.InterestId
            }
        });
        const Interest = await StudentInterest.findOne({
            where: {
                StudentId: req.UserId,
            }
        })
        res.status(201).json(Interest);
    } catch (error) {
        console.log(`error occurred while Changing Student Interest: ${error}`);
        return res.status(500).json(error)
    }
}


export const RateCourse = async (req, res) => {
    try {
        await CourseEnrollment.update({
            CourseRating: req.body.CourseRating,
            Rated: true
        }, {
            where: {
                EnrollmentId: req.body.EnrollmentId
            }
        });


        let RatedCourseEnrolment = await CourseEnrollment.findOne({
            where: {
                EnrollmentId: req.body.EnrollmentId
            }
        })

        const data = await CalculateRating(RatedCourseEnrolment.EnrolledCourse)
        await Course.update({
            OverallRating: data
        }, {
            where: {
                CoursePK: RatedCourseEnrolment.EnrolledCourse
            }
        })
        const RatedCourse = await Course.findOne({
            where: {
                CoursePK: RatedCourseEnrolment.EnrolledCourse
            }
        })
        const OBJ = await Change(RatedCourseEnrolment)

        res.status(201).json({ RatedCourseEnrolment: OBJ, RatedCourse });
    } catch (error) {
        console.log(`error occurred while Rating Course : ${error}`);
        return res.status(500).json(error)
    }
}
