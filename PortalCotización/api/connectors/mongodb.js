/* jshint strict: true */

'use strict';

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI2;
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const mongodb = async () => {
  const db = mongoose.connection;
  db.once(
    'connected',
    () => console.log('[mongodb]', `Connected to: ${db.host}:${db.port}/${db.name}`),
  );

  await mongoose.connect(uri, options);

  return db;
};

module.exports = mongodb;
