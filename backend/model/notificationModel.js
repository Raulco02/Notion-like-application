var database = require("../db/Agent");
const noteModel = require("../model/noteModel");
const userModel = require("../model/userModel");
const { ObjectId } = require('mongodb');

class notificationModel{
    async createNotification(data){
        try{
            const db = await database.connectToServer();
            data.message = await notificationModel.buildMessage(data);
            const notification = await db.collection("Notifications").insertOne(data);
            return notification;
        }catch(err){
            throw err;
        }
    }
    async getNotifications(userId){
        try{
            const db = await database.connectToServer();
            const notifications = await db.collection("Notifications").find({receiver_id: userId}).toArray();
            return notifications;
        }catch(err){
            throw err;
        }
    }

    static async buildMessage(data){
        let message = "";
        const user = await userModel.getUserById(data.sender_id);
        let note = {};
        if(data.note_id){
            note = await noteModel.getNoteById(data.note_id);
        }
        if(data.type === "s"){
            message = user.userName + " wants you to share the note: " + note.title + " with him/her";
            console.log(message);
        }else if(data.type === "f"){
            message = user.userName + " wants to be your friend";
        }else if(data.type === "as"){
            message = user.userName + " accepted your sharing request for the note: " + note.title;
        }else if(data.type === "af"){
            message = user.userName + " accepted your friend request";
        }
        return message;
    }
}

module.exports = new notificationModel();