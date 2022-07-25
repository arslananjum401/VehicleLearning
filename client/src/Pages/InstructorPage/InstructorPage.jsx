import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GetSingleInstructor } from '../../Actions/InstructorA';
import './InstructorPage.css'
const InstructorPage = () => {
    const Navigate = useNavigate()
    const { InstructorPK } = useParams();
    const dispatch = useDispatch()
    const { SInstructor, SCourses } = useSelector((state) => state.InstructorReducer);

    useEffect(() => {
        dispatch(GetSingleInstructor(InstructorPK))

    }, [dispatch, InstructorPK])
    const DeleteInstructor = async () => {
        const { data } = await axios.delete(`/institute/Instructor/delete/${InstructorPK}`,)
        Navigate('/')
    }

    return (
        <div className='Instructors'>
            <div className='ButtonContainer'>
                <button onClick={DeleteInstructor} className='UpdateCourse'>
                    Suspend Instructor
                </button>
                <Link to={`/institute/instructor/update/${InstructorPK}`} className='UpdateCourse'>
                    Update Instructor
                </Link>
            </div>
            <div className='HDcontainer'>
                <div className='HeadingContainer'>
                    <h2>Instructor Name</h2>
                    <h2>Location</h2>
                    <h2>Institute Name</h2>
                    <h2>Vehicle</h2>
                    <h2>Courses</h2>
                </div>
                <div className='dataContainer'>
                    <h2>{SInstructor?.Name}</h2>
                    <h2>{SInstructor?.Location}</h2>
                    <h2>{SInstructor?.InstituteName} a</h2>
                    <h2>{SInstructor?.Vehicle} </h2>
                    <h2>{SCourses?.CourseName} </h2>

                </div>
            </div>
        </div>
    )
}

export default InstructorPage