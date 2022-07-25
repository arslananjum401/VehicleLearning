export const NotificationModel = async (sequelize, DataTypes, UserModel) => {
    const Notification = await sequelize.define('Notification', {
        NotificationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        Message: {
            type: DataTypes.STRING(1234),
            allowNull: false,
        },

        FromUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },

        FromUserType: {
            type: DataTypes.STRING,
            allowNull: false,
        },


        
        ToUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },
        ToUserType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        MarkAsRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return Notification;
}