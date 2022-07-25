import { configureStore } from '@reduxjs/toolkit';
import { UserReducer, CourseReducer, AdminReducer, CategoriesReducer, InstituteListReducer } from './Reducers/UserR.js'
import { SocketReducer } from './Reducers/SocketR.js';
import { InstructorReducer } from './Reducers/InstructorsR.js';
import { ListReducer } from './Reducers/ListR.js';
import { ForgotPasswordReducer } from './Reducers/ForgotPasswordR.js';
import { WishListReducer } from './Reducers/WishListR.js';
const Store = configureStore({
    reducer: {
        UserReducer,
        CourseReducer,
        AdminReducer,
        CategoriesReducer,
        InstituteListReducer,
        SocketReducer,
        InstructorReducer,
        ListReducer,
        ForgotPasswordReducer,
        WishListReducer
    }
})

export default Store;