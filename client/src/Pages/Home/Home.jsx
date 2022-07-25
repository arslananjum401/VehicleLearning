import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChangedInterest, EmptyLogout, GetAllCategories, GetAllCourses, InstituteRequests } from '../../Actions/UserA';
import { useNavigate } from 'react-router-dom';
import CourseBox from '../../Components/CourseBox.jsx';
import './Home.css'
import { DeleteLocalStorage, GetLocalStorage, } from '../../Helpers/LocalStorage.js'
import { GetCookie } from '../../Helpers/Coookies.js';
import StudentHome from './StudentHome';
import InstituteList from '../../Components/InstituteList/InstituteList';

const Home = ({ Height }) => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const { User: SelectedUser, loading, Interest } = useSelector((state) => state.UserReducer);
    const { Categories: GotCategorries } = useSelector((state) => state.CategoriesReducer);
    const { Courses: ReducedCourses, loading: CourseLoading } = useSelector((state) => state.CourseReducer);

    const [Show, setShow] = useState('hideStudentForm');
    const [StuInterest, setStuInterest] = useState(Interest);
    const [User, setUser] = useState(SelectedUser);
    const [Courses, setCourses] = useState(ReducedCourses);
    //checking use login
    useEffect(() => {
        if (!GetCookie('checkToken')) {
            DeleteLocalStorage("User")
            dispatch(EmptyLogout());
        }

        dispatch(GetAllCourses('/' + GetLocalStorage("User")?.User));
    }, [dispatch, Navigate])

    useEffect(() => {
        dispatch(GetAllCategories())
    }, [dispatch])

    useEffect(() => {
        setStuInterest(Interest)
    }, [Interest])


    useEffect(() => {

        if (!Interest?.StudentId) {
            if ((User?.User === "Student")) {
                setShow('')
            }
        } else {
            setShow('hideStudentForm');
        }
    }, [Interest, User])


    //getting user Data
    useEffect(() => {
        setUser(SelectedUser)
    }, [SelectedUser])


    useEffect(() => {
        if (User?.User === "Admin") {
            dispatch(InstituteRequests());
        }
    }, [User, dispatch])



    useEffect(() => {
        if (!GetCookie('checkToken')) {
            DeleteLocalStorage("User")
            setCourses(ReducedCourses);
        }
        else if (GetLocalStorage("User")?.User === 'Student') {
            setCourses(ReducedCourses?.filter((value) => value.Category === Interest?.CourseCategory));
        } else if (GetLocalStorage("User")?.User !== 'Student') {
            setCourses(ReducedCourses);
        }
    }, [Interest, User, ReducedCourses])



    return (
        <>


            <div className='HomeContainer'
                style={{ height: `calc(100% - ${Height}px)` }}
            >
                {!loading && !CourseLoading ?
                    <div className='CourseMajorContainer'>
                        <div>
                            <h1>Courses</h1>
                            {/* Change Course Category for Student */}
                            {GetCookie('checkToken') && GetLocalStorage("User")?.User === 'Student' ?
                                <select name="" id="" value={StuInterest?.CourseCategory}
                                    onChange={(e) => {
                                        dispatch(ChangedInterest(e.target.value, StuInterest?.InterestId))
                                    }}
                                >
                                    <option value="Category" disabled defaultValue>Change Category</option>
                                    {GotCategorries?.map((value) => {
                                        return (
                                            <option value={value.CategoryName} key={value.CategoryId}>{value.CategoryName}</option>
                                        )
                                    })}
                                </select>
                                : null
                            }
                        </div>
                        <div className='CoursesContainer'>

                            {Courses && Courses.length > 0 ?
                                Courses.map((value) => {
                                    return (
                                        <CourseBox
                                            Category={value.Category}
                                            InstituteName={value.InstituteName}
                                            key={value.CoursePK}
                                            Cancel={value.Cancel}
                                            Completed={value.Completed}
                                            CourseName={value.CourseName}
                                            CoursePK={value.CoursePK}
                                            Promotion={value.Promotion}
                                            RunningCourse={value.RunningCourse}
                                            Schedule={value.Schedule}
                                            Status={value.Status}
                                        />
                                    )
                                }
                                )
                                : <h1>No courses found</h1>
                            }
                        </div>
                        {GetCookie('checkToken') && GetLocalStorage("User")?.User === 'Admin'
                            ? <InstituteList />
                            : null
                        }
                    </div>

                    : <h1>
                        Loading
                    </h1>
                }
                <StudentHome setShow={setShow} Show={Show} />
            </div>

        </>
    )
}

export default Home