const dynamoose = require('dynamoose');

const UsersSchema = new dynamoose.Schema({
  id: {
    type: Number,
    hashKey: true,
  },
  dateJoined: {
    type: Number,
    rangeKey: true,
    index: {
      name: 'id-dateJoined-index',
      global: true,
    },
  },
  firstName: String,
  lastName: String,
  email: String,
  gender: String,
  ipAddress: String,
});

const UsersModel = dynamoose.model('Users', UsersSchema);

module.exports = UsersModel;
