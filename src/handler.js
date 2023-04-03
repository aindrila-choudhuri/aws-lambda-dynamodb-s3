const AWS = require('aws-sdk');
const UsersModel = require('./models/user-model');
const { success, notFound, badRequest, serverError } = require('./utility/http-response');

const s3 = new AWS.S3();

module.exports.getUserById = async (event) => {
  try {
    const id = Number(event.pathParameters.id);
    if (!id) {
      return badRequest();
    }
    const users = await UsersModel.query('id').eq(id).exec();
    if (!users.length) {
      return notFound({ message: `User with ID ${id} not found` });
    }
    const plainUsers = users.map((User) => User.toJSON());
    return success(200, plainUsers[0]);
  } catch (err) {
    console.error('err : ', err);
    return serverError();
  }
};

module.exports.createUsers = async (event, context) => {
  try {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: process.env.DATA_FILE_NAME,
    };

    const s3Data = await s3.getObject(s3Params).promise();
    const items = JSON.parse(s3Data.Body.toString());

    // Split items into batches of 25
    const batches = [];
    while (items.length > 0) {
      batches.push(items.splice(0, 25));
    }

    await Promise.all(
      batches.map(async (batch) => {
        await UsersModel.batchPut(batch);
      })
    );

    return success(201, { message: 'Successfully created' });
  } catch (err) {
    console.error(err);
    return serverError();
  }
};
