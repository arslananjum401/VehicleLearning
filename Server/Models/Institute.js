import { Deferrable } from 'sequelize';

export const Institute = async (sequelize, DataTypes, referencesModel) => {
    const institute = await sequelize.define('Institute', {
        InstituteUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: referencesModel,
                key: 'UserId'
            }
        },
        InstituteId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        DocumentFile: {
            type: DataTypes.STRING(2134),
            allowNull: false
        },
        InstituteName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        InstituteLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ApplicationStatus: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
            allowNull: false
        },
        InstituteStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Not Working"
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }

    )
    return institute;
}

export const CourseModel = async (sequelize, DataTypes, InstituteModel, CategoryModel) => {
    const course = await sequelize.define('Course', {
        CoursePK: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        Description: {
            type: DataTypes.STRING(2134),
            allowNull: false
        },
        RunningCourse: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        CourseName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Promotion: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        Completed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        Schedule: {
            type: DataTypes.STRING,
            allowNull: false
        },

        Cancel: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ByInstitute: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteModel,
                key: 'InstituteId'
            }
        },
        Category: {
            type: DataTypes.STRING,
            allowNull: false,
            
            references: {
                model: CategoryModel,
                key: 'CategoryName'
            }
        },
        OverallRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        Status: {
            type: DataTypes.STRING,
            defaultValue: "Viewable"
        }

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return course;
}

export const InstructorModel = async (sequelize, DataTypes, CourseMKey, InstituteMId) => {

    const Instructor = await sequelize.define('Instructor', {
        InstructorPK: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FromInstitute: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteMId,
                key: 'InstituteId'
            }
        },
        Category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Vehicle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Time: {
            type: DataTypes.STRING,
        },
        CourseFK: {
            type: DataTypes.UUID,
            references: {
                model: CourseMKey,
                key: 'CoursePK'
            }
        },
        Students: {
            type: DataTypes.INTEGER,
        },
        Suspend: {
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
    return Instructor;
}