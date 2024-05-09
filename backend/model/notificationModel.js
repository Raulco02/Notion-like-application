var database = require("../db/Agent");
const { ObjectId } = require('mongodb');

class notificationModel{
    async createNotification(data){
        try{
            const db = await database.connectToServer();
            const notification = await db.collection("Notifications").insertOne(data);
            return notification;
        }catch(err){
            throw err;
        }
    }
}
module.exports = new notificationModel();