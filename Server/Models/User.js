export const UserModel = async (sequelize, Datatypes) => {
    const User = await sequelize.define('User', {
        UserId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        UserName: {
            type: Datatypes.STRING,
            allowNull: false,
            
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
    return User;
}