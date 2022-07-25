export const StudentModel = async (sequelize, DataTypes) => {
    const Student = await sequelize.define('Student', {
        UserId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        UserName: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        User: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ResetPasswordToken: {
            type: DataTypes.STRING,
            defaulValue: ''
        },
        ResetPasswordExpire: {
            type: DataTypes.DATE
        }

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return Student;
}