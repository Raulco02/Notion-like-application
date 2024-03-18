var express = require("express");
var router = express.Router();
var database = require("../db/conn");

router.get("/", function (req, res, next) {
  database.connectToServer(function (err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Internal server error");
      return;
    }

    database
      .getDb()
      .collection("notes")
      .find({})
      .toArray(function (err, notas) {
        if (err) {
          console.error("Error consulting the database:", err);
          res.status(500).send("Internal server error");
          return;
        }

        res.json(notas);
      });
  });
});

router.post("/create", function (req, res, next) {
  var newNote = req.body;

  if (!newNote || !newNote.title || !newNote.content) {
    res
      .status(400)
      .send("Title and content are required to create a new note");
    return;
  }

  database.connectToServer(function (err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Internal server error");
      return;
    }

    database
      .getDb()
      .collection("notes")
      .insertOne(newNote, function (err, result) {
        if (err) {
          console.error("Error inserting a note in the database:", err);
          res.status(500).send("Internal server error");
          return;
        }

        res.status(201).json({
          message: "Note created successfully",
          note: result.ops[0],
        });
      });
  });
});

router.put("/:id/edit", function (req, res, next) {
  var noteId = req.params.id;
  var updatedNote = req.body;

  if (
    !updatedNote ||
    !updatedNote.title ||
    !updatedNote.content
  ) {
    res
      .status(400)
      .send("Title and content are required to update a note");
    return;
  }

  database.connectToServer(function (err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Internal server error");
      return;
    }

    database
      .getDb()
      .collection("notes")
      .updateOne(
        { _id: ObjectId(noteId) },
        { $set: updatedNote },
        function (err, result) {
          if (err) {
            console.error("Error editing the database:", err);
            res.status(500).send("Internal server error");
            return;
          }

          res.status(200).json({ mensaje: "Note edited succesfully" });
        }
      );
  });
});

router.delete("/:id/delete", function (req, res, next) {
  var noteId = req.params.id;

  database.connectToServer(function (err) {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Internal server error");
      return;
    }

    database
      .getDb()
      .collection("notes")
      .deleteOne({ _id: ObjectId(noteId) }, function (err, result) {
        if (err) {
          console.error("Error deleting note from the database:", err);
          res.status(500).send("Internal server error");
          return;
        }

        // Devolver una respuesta de éxito
        res.status(200).json({ message: "Note deleted succesfully" });
      });
  });
});

module.exports = router;
