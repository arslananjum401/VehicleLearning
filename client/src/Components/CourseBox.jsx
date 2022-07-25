import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './CourseBox.css'
import { MoreHoriz } from '@mui/icons-material/';
import { useDispatch, useSelector } from 'react-redux';
import { AddToWishList, RemoveFromWishList } from '../Actions/WishListA.js';
import { GetLocalStorage } from '../Helpers/LocalStorage';
import { GetCookie } from '../Helpers/Coookies';
const CourseBox = ({ Owner, Cancel, Completed, Category, CourseName, CoursePK, Promotion, RunningCourse, Schedule, Status, ByInstitute, }) => {
  const [CourseWished, setCourseWished] = useState({
    Present: false,
    WishId: ""
  });
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [ShowMore, setShowMore] = useState(false);

  const { WishList } = useSelector((state) => state.WishListReducer);

  const AddtoWishList = (WishedCourse, Remove) => {
    if (GetCookie("checkToken") && GetLocalStorage("User")?.User === 'Student') {
      if (Remove === true) {

        dispatch(RemoveFromWishList(WishedCourse));
      } else {

        dispatch(AddToWishList(WishedCourse));
      }
    }
    else {
      Navigate('/login', { state: { path: window.location.pathname } })
    }
  }


  useEffect(() => {

    WishList?.forEach((value) => {

      if (value.Wish === CoursePK) {

        setCourseWished({ WishId: value.WishId, Present: true })
      }
    })
  }, [WishList, CoursePK])

  return (
    <div className='CourseContainer' >
      <div className='More' onClick={() => { setShowMore(!ShowMore) }}>
        <MoreHoriz />
        <span className={`${ShowMore ? "ShowMore" : null} ShowMoreHide`}>

          {
            CourseWished?.Present === false ?
              <button onClick={() => {
                AddtoWishList(CoursePK, false);
                setShowMore(!ShowMore)
              }}>Add to WishList</button>

              : CourseWished?.Present === true ? <button onClick={() => {
                AddtoWishList(CourseWished?.WishId, true);
                setShowMore(!ShowMore)
              }}>Remove from WishList</button>
                : null
          }
        </span>
      </div>
      <Link className='CourseLink' style={{ textDecoration: 'none' }} to={`/course/${CoursePK}`}>
        <h2> {CourseName}</h2>
        <h3>From Institute: <span className='unBold'> {ByInstitute}</span> </h3>
        <h3>Category: <span className='unBold'> {Category} </span></h3>
        <h3>Completed: <span className='unBold'> {Completed} </span></h3>
        <h4>Running Courses: <span className='unBold'>{RunningCourse} </span></h4>
      </Link >
    </div>
  )
}

export default CourseBox