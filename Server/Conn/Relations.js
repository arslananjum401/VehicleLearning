import db from './connection.js';
const {Institute,Course,User } = db;
export const Realtions = () => {


    // Institute.hasMany(Course);
    // Course.belongsTo(Institute);
    Institute.belongsTo(User, { foreignKey: 'InstituteUserId' });

}