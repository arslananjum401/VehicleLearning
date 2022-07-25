export const CourseEnrollmentModel = async (sequelize, DataTypes, CourseModel, UserModel) => {
    const CourseEnrollment = await sequelize.define('CourseEnrollment', {
        EnrollmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        EnrolledCourse: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CourseModel,
                key: 'CoursePK'
            }
        },
        StudentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },
        EnrollmentPeriod: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        EnrollmentDescription: {
            type: DataTypes.STRING(2134),
        },
        EnrollmentStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        CourseRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },

        Rated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Completion: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        CompletionMark:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return CourseEnrollment;
}