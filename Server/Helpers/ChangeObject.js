import {ProgressBar } from './Helpers.js';

export const Change = async (EnrolledCourse) => {
    let SEnrolledCoursedata = {}
    SEnrolledCoursedata.UserData = EnrolledCourse;
    if (EnrolledCourse !== null) {
        let Result = await ProgressBar(EnrolledCourse);
        SEnrolledCoursedata.Progress = Result;
    }
    return SEnrolledCoursedata
}