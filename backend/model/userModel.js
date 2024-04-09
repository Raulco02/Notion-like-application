var database = require("../db/Agent");
const { ObjectId } = require('mongodb');
var crypto = require('crypto');


class userModel {
    async getAllUsers() {
        const db = await database.connectToServer();
        const users = db.collection("Users").find({});
        return await users.toArray();
      }
      async getUserById(userId) {
        const db = await database.connectToServer();
        return await db.collection("Users").findOne({ _id: new ObjectId(userId) });
    }
    async createNewUser(newUser) {
        const db = await database.connectToServer();
        const result = await db.collection("Users").insertOne(newUser);
        return result.insertedId;
    }
    async updateUserById(userId, updateQuery) {
        var findQuery = { _id: new ObjectId(userId) };

        const updateOptions = { returnOriginal: false };
        const db = await database.connectToServer();
        const updateResult = db.collection("Users").findOneAndUpdate(
          findQuery,
          updateQuery,
          updateOptions,
        );

        return updateResult
    }
    async deleteUserById(userId) {
        const db = await database.connectToServer();
        return await db.collection("Users").deleteOne({ _id: new ObjectId(userId) });
    }
    async login(email, password){
        const db = await database.connectToServer();
        const user = await db.collection("Users").findOne({ email: email });
        password = crypto.createHash('sha256').update(password).digest('hex');
        if(user.password === password){
            return user;
    }
}

module.exports = new userModel();