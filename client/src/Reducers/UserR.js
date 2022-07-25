import { createReducer } from '@reduxjs/toolkit';

const InitialState = {
    SCourse: {},
    EnrolledCourses: [],
    EnrolledCourse: {}
};


export const UserReducer = createReducer(InitialState, {
    SignUpRequest: (state) => {
        state.loading = true;
    },
    SignUpSuccess: (state, action) => {
        state.loading = false;
        state.SUser = action.payload;
        state.isAuthenticated = true;
    },
    SignUpFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },


    LoginRequest: (state) => {
        state.loading = true;
    },
    LoginSuccess: (state, action) => {
        state.loading = false;
        state.User = action.payload;
        state.isAuthenticated = true;
    },
    LoginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },



    getUserRequest: (state, action) => {
        state.loading = true;
    },
    getUserSuccess: (state, action) => {
        state.loading = false;
        state.User = action.payload;
        state.Notifications = action.Notifications;
        state.Interest = action.Interest;
        state.Message = action.Message
        state.isAuthenticated = true;
    },

    getUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    getStuInterestRequest: (state, action) => {
        state.loading = true;
    },
    getStuInterestSuccess: (state, action) => {
        state.loading = false;
        state.Interest = action.Interest;
    },

    getStuInterestFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    logOutUserRequest: (state, action) => {
        state.loading = true;
    },
    logOutUserSuccess: (state, action) => {
        state.loading = false;
        state.User = action.payload;
        state.Msg = action.message;
        state.isAuthenticated = false;
    },
    logOutUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

})
export const CourseReducer = createReducer(InitialState, {
    CourseRequest: (state, action) => {
        state.loading = true;
    },

    CourseSuccess: (state, action) => {
        state.loading = false;
        state.Courses = action.payload;
    },
    CourseFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },



    SingleCourseRequest: (state, action) => {
        state.loading = true;
    },

    SingleCourseSuccess: (state, action) => {
        state.loading = false;
        state.SCourse = action.payload;
    },
    SingleCourseFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },



    CreateCourseRequest: (state, action) => {
        state.loading = true;
    },

    CreateCourseSuccess: (state, action) => {
        state.loading = false;
        state.CourseCreated = action.payload;
    },
    CreateCourseFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    EnrollCourseRequest: (state, action) => {
        state.loading = true;
    },

    EnrollCourseSuccess: (state, action) => {
        state.loading = false;
        state.EnrolledCourse = action.payload;
        state.SCourse = action.SCourse;
    },
    EnrollCourseFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },



    UnEnrollCourseRequest: (state, action) => {
        state.loading = true;
    },

    UnEnrollCourseSuccess: (state, action) => {
        state.loading = false;
        state.EnrolledCourse = undefined;
    },
    UnEnrollCourseFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },



    GetEnrolledRequest: (state, action) => {
        state.loading = true;
    },

    GetEnrolledSuccess: (state, action) => {
        state.loading = false;
        state.EnrolledCourses = action.payload;
    },
    GetEnrolledFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },




    GetSEnrolledRequest: (state, action) => {
        state.loading = true;
    },
    GetSEnrolledSuccess: (state, action) => {
        state.loading = false;
        state.EnrolledCourse = action.payload;
        state.SCourse = action.SCourse;
    },
    GetSEnrolledFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },



})

export const AdminReducer = createReducer(InitialState, {
    InstituteReqRequest: (state, action) => {
        state.loading = true;
    },
    InstituteReqSuccess: (state, action) => {
        state.loading = false;
        state.Request = action.payload;
    },
    InstituteReqFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    AcceptedReqRequest: (state, action) => {
        state.loading = true;
    },
    AcceptedReqSuccess: (state, action) => {
        state.loading = false;
        state.AcceptedRequests = action.payload;
    },
    AcceptedReqFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

})

export const CategoriesReducer = createReducer(InitialState, {
    CategoriesRequest: (state, action) => {
        state.loading = true;
    },
    CategoriesSuccess: (state, action) => {
        state.loading = false;
        state.Categories = action.payload;
    },
    CategoriesFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
})

export const InstituteListReducer = createReducer(InitialState, {
    InstituteListRequest: (state, action) => {
        state.loading = true;
    },
    InstituteListSuccess: (state, action) => {
        state.loading = false;
        state.InstitutesList = action.payload;
    },
    InstituteListFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
})