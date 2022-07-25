export const StudentInterestModel = async (sequelize, DataTypes, referencesModel) => {
    const StudentInterest = await sequelize.define('StudentInterest', {
        InterestId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        StudentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: referencesModel,
                key: 'UserId'
            }
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CourseCategory: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return StudentInterest;
}