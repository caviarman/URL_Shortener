'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Urls', [{
      base: 'https://snatchbot.me',
      custom: 'sfdgss',
      shorten: 'sfsfsfs',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Urls', null, {});
  }
};
