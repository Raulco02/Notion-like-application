var express = require("express");
var router = express.Router();
const notificationModel = require("../model/notificationModel");
const { parse } = require("dotenv");
const e = require("express");

router.get("/", async function (req, res, next) {
    const userId = req.session.user_id;
    if (!userId) {
      res.status(401).json({ message: "User is not signed in" });
      return;
    }
    try {
        const notes = await notificationModel.getNotifications(userId);
        res.send(notes);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error interno del servidor");
    }
});

router.delete("/delete/:id", async function (req, res, next) {
    const userId = req.session.user_id;
    if (!userId) {
      res.status(401).json({ message: "User is not signed in" });
      return;
    }
    const notificationId = req.params.id;
    try {
        const note = await notificationModel.deleteNotification(notificationId, userId);
        res.status(200).json(note);
    } catch (err) {
        if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
            res.status(400).json("Invalid notification id");
            return;
        }else if(err.message === "Notification not found"){
            res.status(404).json("Notification not found");
            return;
        }
        console.log(err);
        res.status(500).json("Error interno del servidor");
    }
});

module.exports = router;