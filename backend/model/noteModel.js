var database = require("../db/Agent");
const { ObjectId } = require('mongodb');

class noteModel {
    async getAllNotes() {
        const db = await database.connectToServer();
        const notes = db.collection("Notes").find({});
        return await notes.toArray();
      }

    async getNoteById(noteId) {
        const db = await database.connectToServer();
        return await db.collection("Notes").findOne({ _id: new ObjectId(noteId) });
    }

    async createNewNote(newNote) {
        const db = await database.connectToServer();
        const result = await db.collection("Notes").insertOne(newNote);
        return result.insertedId;
    }

    async updateNoteById(noteId, updateQuery) {
        var findQuery = { _id: new ObjectId(noteId) };

        const updateOptions = { returnOriginal: false };
        const db = await database.connectToServer();
        const updateResult = db.collection("Notes").findOneAndUpdate(
          findQuery,
          updateQuery,
          updateOptions,
        );

        return updateResult
    }

    async deleteNoteById(noteId) {
        const db = await database.connectToServer();
        return await db.collection("Notes").deleteOne({ _id: new ObjectId(noteId) });
    }

    async getUserNotes(userId) {
        const db = await database.connectToServer();
        const notes = db.collection("Notes").find({ user_id: userId });
        return await notes.toArray();
    }

}

module.exports = new noteModel();