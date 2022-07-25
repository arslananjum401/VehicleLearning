import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GetSingleCourse, GetUser } from '../../Actions/UserA'
import { GetCookie } from '../../Helpers/Coookies'
import { GetLocalStorage } from '../../Helpers/LocalStorage';
import './CoursePage.css';
import { EnrollCourse, GetSEnrollCourse, UnEnrollCourse } from '../../Actions/CourseA'
import Rating from '../../Components/Rating/Rating';
import ProgressBar from '../../Components/ProgressBar/ProgressBar'
const CoursePage = ({ Height }) => {
    const Navigate = useNavigate()
    const { CoursePK } = useParams()
    const dispatch = useDispatch()

    const { SCourse, EnrolledCourse: ReducedEnrolledCourses, loading: CourseLoading } = useSelector((state) => state.CourseReducer);
    const { User: SelectedUser, loading: UserLoading } = useSelector((state) => state.UserReducer);
    const [Course, setCourse] = useState();
    const [User, setUser] = useState(SelectedUser);
    const [EnrolledCourses, setEnrolledCourses] = useState([]);
    useEffect(() => {
        if (GetCookie('checkToken')) {
            dispatch(GetUser("/" + GetLocalStorage("User").User))
        }

        if (GetLocalStorage("User")?.User === 'Student') {

            dispatch(GetSEnrollCourse(CoursePK))
        } else {

            dispatch(GetSingleCourse(CoursePK))
        }
    }, [dispatch, CoursePK])

    useEffect(() => {
        setCourse(SCourse);

    }, [SCourse])

    // console.log(SCourse)
    useEffect(() => {
        setUser(SelectedUser)
    }, [SelectedUser])


    useEffect(() => {


        setEnrolledCourses(ReducedEnrolledCourses)

    }, [ReducedEnrolledCourses])

    const EnrollForCourse = () => {
        if (!GetLocalStorage("User")) {
            Navigate('/login', { state: { path: window.location.pathname } })
            return
        }
        if (GetLocalStorage("User")?.User === 'Student') {
            // dispatch(GetSingleCourse(CoursePK))
            dispatch(EnrollCourse(CoursePK))
        }

    }
    const UnEnrollForCourse = () => {
        if (GetLocalStorage("User")?.User === 'Student') {
            dispatch(UnEnrollCourse(EnrolledCourses?.EnrollmentId));

            dispatch(GetSEnrollCourse(CoursePK))
        }
    }

    return (
        <>


            {!UserLoading && !CourseLoading ?
                <div className='setBg'
                    style={{ height: `calc(100% - ${Height}px)` }}
                >
                    <div className='UpdateCourse'>
                        {GetLocalStorage("User")?.User === "Institute" &&
                            Course?.ByInstitute === User?.InstituteId

                            ? <Link to={`/course/update/${CoursePK}`} className='UpdateCourse'>
                                Update Course
                            </Link>

                            : !User || User?.User !== 'Admin'
                                ? !EnrolledCourses
                                    ? <button onClick={EnrollForCourse} className='UpdateCourse'>
                                        Enroll For this course
                                    </button>
                                    : <button onClick={UnEnrollForCourse} className='UpdateCourse'>
                                        UnEnroll From this course
                                    </button>
                                : null
                        }
                    </div>


                    <div className='CourseData'>
                        <div className='CourseInfoContainer'>
                            <div className='CourseHeading'>
                                <h3>Completed By:</h3>
                                <h3>From Institute:</h3>
                                <h3>Promotions: </h3>
                                <h3>Course Name: </h3>
                                {EnrolledCourses?.EnrollmentStatus === true ? <h3>Your Progress:</h3> : null}
                            </div>

                            <div className='CourseInfo'>
                                <h3> {Course?.Completed}</h3>
                                <h3> {Course?.ByInstitute}</h3>
                                <h3> {Course?.Promotion}</h3>
                                <h3> {Course?.CourseName}</h3>
                                {EnrolledCourses?.EnrollmentStatus === true &&
                                    !isNaN(EnrolledCourses?.Progress)
                                    ?
                                    <div className='ProgressContainer'>
                                        <ProgressBar progress={Math.round(EnrolledCourses?.Progress)} />
                                        <h4> {Math.round(EnrolledCourses?.Progress)}</h4>
                                    </div>
                                    : null}
                            </div>

                        </div>

                        <span className='DescriptionContainer'>
                            <h4 className='DescriptionHeading' >   Description:</h4>
                            <h4 className='DescriptionData'><span> {Course?.Description} </span></h4>
                        </span>

                        <Rating
                            EnrolledCourses={EnrolledCourses}
                            CRating={EnrolledCourses?.CourseRating}
                            Rated={EnrolledCourses?.Rated}
                            EnrollmentId={EnrolledCourses?.EnrollmentId}
                            OverallRating={Course?.OverallRating}
                        />
                    </div>
                </div>
                :
                <h1>loading</h1>
            }
        </>
    )
}

export default CoursePage