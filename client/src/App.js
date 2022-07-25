import './App.css';
import SignUp from './Pages/Signup/SignUp.jsx';
import Home from './Pages/Home/Home.jsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import CreateCourse from './Pages/CreateCourse/CreateCourse';
import Login from './Pages/Login/Login';
import RegisterInstitute from './Pages/Signup/RegisterInstitute';
import InstituteRequest from './Pages/InstituteRequest/InstituteRequest';
import CoursePage from './Pages/CoursePage/CoursePage';
import UpdateCourse from './Pages/CreateCourse/UpdateCourse';
import Header from './Components/Header';
import { useState } from 'react';
import AcceptedRequests from './Pages/AcceptedRequests/AcceptedRequests';
import Category from './Pages/Category/Category';
import Allcategories from './Pages/Category/Allcategories';
import AddInstructor from './Pages/AddInstructor/AddInstructor';
import AllInstructors from './Pages/AllInstructors/AllInstructors';
import InstructorPage from './Pages/InstructorPage/InstructorPage';
import UpdateInstructor from './Pages/AddInstructor/UpdateInstructor';
import InstitutePage from './Pages/InstitutePage/InstitutePage';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import WishListPage from './Pages/WishListPage/WishListPage';
const App = () => {

  const { isAuthenticated } = useSelector((state) => state.UserReducer);

 
  const [Socket, setSocket] = useState();
  const [Height, setHeight] = useState();
  return (
    <>
      <BrowserRouter>
        <Header Socket={Socket} setSocket={setSocket} setHeight={setHeight} />
        <Routes>
          <Route path='/' element={<Home Height={Height} />} />


          <Route path='/SignUp' element={!isAuthenticated ? <SignUp /> : <Navigate to='/' />} />
          <Route path='/Login' element={<Login />} />


          <Route path='/register/Institute' element={<RegisterInstitute />} />


          <Route path='/admin/request/accepted' element={<AcceptedRequests />} />
          <Route path='/admin/requests' element={<InstituteRequest Socket={Socket} />} />
          <Route path='/admin/category/create' element={<Category />} />
          <Route path='/admin/categories' element={<Allcategories />} />
          <Route path='/admin/institute/:InstituteId' element={<InstitutePage />} />



          <Route path='/course/create' element={<CreateCourse />} />
          <Route path='/course/update/:CoursePK' element={<UpdateCourse />} />
          <Route path='/course/:CoursePK' element={<CoursePage Height={Height} />} />

          <Route path='/institute/instructor/create' element={<AddInstructor />} />
          <Route path='/institute/instructor/update/:InstructorPK' element={<UpdateInstructor />} />
          <Route path='/institute/instructors' element={<AllInstructors />} />
          <Route path='/institute/instructor/:InstructorPK' element={<InstructorPage />} />

          <Route path='/WishList' element={<WishListPage />} />
          <Route path='/forgot/password' element={<ForgotPassword />} />
          <Route path='/forgot/reset/password/:ResetToken' element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
