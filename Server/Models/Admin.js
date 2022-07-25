export const AdminModel = async (sequelize, Datatypes) => {
    const Admin = await sequelize.define('Admin', {
        UserId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            allowNull: false
        },
        UserName: {
            type: Datatypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        Email: {
            type: Datatypes.STRING,
            allowNull: false
        },
        Password: {
            type: Datatypes.STRING,
            allowNull: false
        },
        User: {
            type: Datatypes.STRING,
            allowNull: false
        },
        ResetPasswordToken: {
            type: Datatypes.STRING,
            defaulValue: ''
        },
        ResetPasswordExpire: {
            type: Datatypes.DATE
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }

    );
    return Admin;
}

export const CategoriesModel = async (sequelize, Datatypes) => {
    const Categories = await sequelize.define('Categorie', {
        CategoryId:{
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        CategoryName: {
            type: Datatypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        Active: {
            type: Datatypes.BOOLEAN,
            defaultValue: true,
        }
    }

        , {
            timestamps: false
        })
    return Categories
}