import axios from "axios"

export const EnrollCourse = (courseId) => async (dispatch) => {
    try {
        dispatch({
            type: "EnrollCourseRequest"
        })
        const { data } = await axios.post('/enrollCourse',
            { EnrolledCourse: courseId },

        )
        let NewData = data.EnrollmentCourse.UserData;
        if (data.EnrollmentCourse.Progress) {
            NewData.Progress = data.EnrollmentCourse.Progress;
        }
        dispatch({
            type: "EnrollCourseSuccess",
            payload: NewData,
            SCourse: data.course
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "EnrollCourseFailure",
            payload: error,
        })
    }
}
//This will be called when User is logged in as student
export const GetSEnrollCourse = (CoursePK) => async (dispatch) => {
    try {
        dispatch({
            type: "GetSEnrolledRequest"
        })
        const { data } = await axios.get(`/enrollCourse/${CoursePK}`);
        
        let NewData = data.CourseEnrollment.UserData;
        NewData.Progress = data.CourseEnrollment.Progress;
        dispatch({
            type: "GetSEnrolledSuccess",
            payload: NewData,
            SCourse: data.Course
        })


    } catch (error) {
        dispatch({
            type: "GetSEnrolledFailure",
            payload: error,
        })
    }
}

export const GetEnrollCourse = () => async (dispatch) => {//for multiple courses
    try {
        dispatch({
            type: "GetEnrolledRequest"
        })

        const { data } = await axios.get(`/enrollCourse/`);
        dispatch({
            type: "GetEnrolledSuccess",
            payload: data.EnrollmentCourse,
            SCourse: data.course,
        })
    } catch (error) {
        console.log(error);
        dispatch({
            type: "GetEnrolledFailure",
            payload: error,
        })
    }
}


export const UnEnrollCourse = (EnrollmentId) => async (dispatch) => {
    try {
        dispatch({
            type: "UnEnrollCourseRequest"
        })
        const { data } = await axios.put('/enrollCourse',
            {
                EnrollmentId: EnrollmentId
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        dispatch({
            type: "UnEnrollCourseSuccess",
            payload: data,
        })
    } catch (error) {
        console.log(error);
        dispatch({
            type: "UnEnrollCourseFailure",
            payload: error,
        })
    }
}

export const RateCourse = (value, EnrollmentId) => async (dispatch) => {
    try {
        dispatch({
            type: "GetSEnrolledRequest"
        })
        const { data } = await axios.post('/Course/rating', {
            CourseRating: value,
            EnrollmentId
        })
        let NewData = data.RatedCourseEnrolment.UserData;
        if (data.RatedCourseEnrolment.Progress) {
            NewData.Progress = data.RatedCourseEnrolment.Progress;
        }

        dispatch({
            type: "GetSEnrolledSuccess",
            payload: NewData,
            SCourse: data.RatedCourse
        })
    } catch (error) {
        console.log(error);
        dispatch({
            type: "GetSEnrolledFailure",
            payload: error,
        })
    }
}