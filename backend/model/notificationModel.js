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

    async deleteNotification(notificationId, receiver_id){
        try{
            const db = await database.connectToServer();
            const notification = await db.collection("Notifications").deleteOne({_id: new ObjectId(notificationId), receiver_id: receiver_id});
            if(notification.deletedCount === 0){
                throw new Error("Notification not found");
            }
            return notification;
        }catch(err){
            throw err;
        }
    }

    static async buildMessage(data){
        let message = "";
        const user = await userModel.getUserById(data.sender_id);
        let note = {};
        if(data.note_id){
            note = await noteModel.getNoteById(data.note_id, data.sender_id);
        }
        if(data.type === "s"){
            if(data.access_mode === "r"){
                message = user.userName + " wants you to share the reading permission note: " + note.title + " with him/her";
            } else if(data.access_mode === "w"){
                message = user.userName + " wants you to share the writing permission note: " + note.title + " with him/her";
            }
            console.log(message);
        }else if(data.type === "f"){
            message = user.userName + " wants to be your friend";
        }else if(data.type === "as"){
            if(data.access_mode === "r"){
                message = user.userName + " accepted your sharing request for the reading permission of the note: " + note.title;
            }else if(data.access_mode === "w"){
                message = user.userName + " accepted your sharing request for the writing permission of the note: " + note.title;
            }
        }else if(data.type === "af"){
            message = user.userName + " accepted your friend request";
        }else if(data.type === "ss"){
            if(data.access_mode === "r"){
                message = user.userName + " shared the reading permission note: " + note.title + " with you";
            }else if(data.access_mode === "w"){
                message = user.userName + " shared the writing permission note: " + note.title + " with you";
            }
        }
        return message;
    }
}

module.exports = new notificationModel();