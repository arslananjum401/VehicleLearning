import { Sequelize, DataTypes } from 'sequelize';
import { AdminModel, CategoriesModel } from '../Models/Admin.js';
import { CourseEnrollmentModel } from '../Models/CourseErnrollment.js';
import { FavouriteCoursesModel } from '../Models/FavouriteCourses.js';
import { Institute, CourseModel, InstructorModel } from '../Models/Institute.js';
import { NotificationModel } from '../Models/Notifications.js';
import { StudentModel } from '../Models/Student.js';
import { StudentInterestModel } from '../Models/StudentInterest.js';
import { UserModel } from '../Models/User.js';

export const sequelize = new Sequelize(
    'testvl',//Databse name
    'postgres',//username
    'arslan',//password
    {
        host: 'localhost',
        dialect: "postgres",
        logging: false
    }
);
const db = {}
const sequelApp = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true })
            .then(() => { console.log('Re-sync Done') });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.User = await UserModel(sequelize, DataTypes, db.Student);

db.Institute = await Institute(sequelize, DataTypes, db.User);


db.Admin = await AdminModel(sequelize, DataTypes);
db.Student = await StudentModel(sequelize, DataTypes);
db.Categories = await CategoriesModel(sequelize, DataTypes);
db.Course = await CourseModel(sequelize, DataTypes, db.Institute,db.Categories);
db.Instructor = await InstructorModel(sequelize, DataTypes, db.Course, db.Institute);
db.Notification = await NotificationModel(sequelize, DataTypes, db.User);
db.FavouriteCourses = await FavouriteCoursesModel(sequelize, DataTypes, db.Course, db.User);
db.CourseEnrollment = await CourseEnrollmentModel(sequelize, DataTypes, db.Course, db.User);
db.StudentInterest = await StudentInterestModel(sequelize, DataTypes, db.User);
export default db;

// Realtions();
sequelApp();