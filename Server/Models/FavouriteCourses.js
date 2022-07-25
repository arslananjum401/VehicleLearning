export const FavouriteCoursesModel = async (sequelize, DataTypes, referencesModel1, referencesModel2) => {
    const FavouriteCourse = await sequelize.define('FavouriteCourse', {
        WishId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        Wish: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: referencesModel1,
                key: 'CoursePK'
            }
        },
        StudentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: referencesModel2,
                key: 'UserId'
            }
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return FavouriteCourse;
}