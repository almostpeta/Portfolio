/* jshint strict: true */

'use strict';

const mongodb = require('../connectors/mongodb');

module.exports = {
  name: 'connectors',
  register: async () => {
    await mongodb();
  },
};
