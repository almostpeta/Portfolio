const mongoose = require('mongoose');
const DATABASE_URL = 'mongodb+srv://cambioNelson:0Jp3JoV1mBwnEj7U@cluster0-ldeej.mongodb.net/cambioNelson?retryWrites=true&w=majority'


module.exports =() =>{
  mongoose.connect(DATABASE_URL, {userNewUrlParser: true})
  .then(()=> console.log('Mongo connected on '+DATABASE_URL))
  .catch(err => console.log('Connection has error '+err))
}