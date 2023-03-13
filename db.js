const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'R1ndoman#!%', {
  host: '10.0.8.137',
  dialect: 'postgres'
});

module.exports = sequelize;