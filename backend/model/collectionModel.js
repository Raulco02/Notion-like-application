var database = require("../db/Agent");
const { ObjectId } = require('mongodb');

class collectionModel {
    async getAllcollections() {
        const db = await database.connectToServer();
        const collections = db.collection("Collections").find({});
        return await collections.toArray();
      }

    async getcollectionById(collectionId) {
        const db = await database.connectToServer();
        return await db.collection("Collections").findOne({ _id: new ObjectId(collectionId) });
    }

    async createNewcollection(newcollection) {
        const db = await database.connectToServer();
        const result = await db.collection("Collections").insertOne(newcollection);
        return result.insertedId;
    }

    async updatecollectionById(collectionId, updateQuery) {
        var findQuery = { _id: new ObjectId(collectionId) };

        const updateOptions = { returnOriginal: false };
        const db = await database.connectToServer();
        const updateResult = db.collection("Collections").findOneAndUpdate(
          findQuery,
          updateQuery,
          updateOptions,
        );

        return updateResult
    }

    async deletecollectionById(collectionId) {
        const db = await database.connectToServer();
        return await db.collection("Collections").deleteOne({ _id: new ObjectId(collectionId) });
    }
}

module.exports = new collectionModel();