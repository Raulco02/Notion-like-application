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

module.exports = router;