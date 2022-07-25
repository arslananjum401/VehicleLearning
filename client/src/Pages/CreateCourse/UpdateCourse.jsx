import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { UpdateCurrentCourse } from '../../Actions/UserA';
import './CreateCourse.css';
import { GetCookie } from '../../Helpers/Coookies.js';
import axios from 'axios';
const UpdateCourse = () => {
  const { CoursePK } = useParams()
  const Navigate = useNavigate()

  const [User, setUser] = useState("");
  const [Course, setCourse] = useState({
    CourseName: "",
    Description: "",
    Category: "",
    Schedule: ""
  })
  const { Categories: GotCategorries } = useSelector((state) => state.CategoriesReducer);

  const [DescriptionError, setDescriptionError] = useState(false)
  const [CourseNameError, setCourseName] = useState(false)
  const dispatch = useDispatch();

  const UserAndCourseApi = async () => {
    const { data: UserData } = await axios.get(`/me`,
      {
        withCredentials: true
      });
    const { data: CourseData } = await axios.get(`/Institute/course/${CoursePK}`);

    setCourse(CourseData);
    setUser(UserData);
  }


  useEffect(() => {
    if (GetCookie('checkToken')) {
      UserAndCourseApi()
    }

    if (User && Course && User.InstituteName !== Course.ByInstitute) {
      Navigate('/');
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, CoursePK])


  const SubmitCourse = (e) => {
    e.preventDefault()

    if (Course.Description.length < 200 && Course.CourseName.length < 5) {
      setDescriptionError(true)
      setCourseName(true)
      return
    }
    else if (Course.Description.length < 200) {
      setDescriptionError(true)
      return
    }
    else if (Course.CourseName.length < 5) {
      setCourseName(true)
      return
    }


    dispatch(UpdateCurrentCourse(Course, CoursePK))
      .then(() => {
        Navigate('/')
      })

  }



  return (
    Course &&
    <form onSubmit={SubmitCourse} className='CourseForm'>
      <label htmlFor="CourseName" style={{ color: "red" }}>
        {CourseNameError ?
          "Course Name Cannot be less that 5 characters "
          : null
        }
      </label>


      <input type="text"
        id='CourseName'
        placeholder='*Course Name'
        value={Course.CourseName}
        required
        onChange={(e) => {
          setCourseName(false)
          setCourse({ ...Course, CourseName: e.target.value })
        }}
      />


      <label htmlFor="Description" style={{ color: "red" }}>
        {DescriptionError ?
          "Description Cannot be less that 200 characters"
          : null
        } </label>


      <textarea
        placeholder='*Description'
        value={Course.Description}
        id="Description"
        minLength="200"
        required={true}
        onChange={(e) => {
          setDescriptionError(false)
          setCourse({ ...Course, Description: e.target.value })
        }}
      >

      </textarea>
      <div>
        <label htmlFor="cars">Choose a Category:</label>
        <select id="cars" name="cars"
          value={Course.Category}
          onChange={(e) => {
            console.log(e.target.value);
            setCourse({ ...Course, Category: e.target.value })
          }}
        >
          <option value="Category" disabled defaultValue>Select Category</option>
          {GotCategorries?.map((value) => {
            return (

              <option value={value.CategoryName} key={value.CategoryId}>{value.CategoryName}</option>

            )
          })}

        </select>
      </div>
      <input type="time" value={Course.Schedule}
        onChange={(e) => { setCourse({ ...Course, Schedule: e.target.value }) }}
      />
      <button type="submit">Update Course</button>
    </form>


  )
}

export default UpdateCourse