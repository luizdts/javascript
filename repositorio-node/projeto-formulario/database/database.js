const Sequelize = require("sequelize");

const connection = new Sequelize('perguntas','root','@Lh1902ad',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
