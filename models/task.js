'use strict';
module.exports = (sequelize, DataTypes) => {

    class Task extends sequelize.Sequelize.Model {}

    Task.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        UserId: DataTypes.INTEGER
    }, {
        sequelize,
        hooks: {
            beforeCreate: (Task, options) => {
                Task.status = 'backlog'
            }
        },
        validate: {
            checkEmpty() {
                if (this.title == '' || this.description == '') {
                    throw new Error('please fill all the blank form')
                }
            }
        },
        modelName: 'Task'
    })
    Task.associate = function(models) {
        // associations can be defined here
        Task.belongsTo(models.User, { foreignKey: 'UserId' })
    };
    return Task;
};