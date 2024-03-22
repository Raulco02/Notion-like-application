var express = require("express");
var router = express.Router();
var database = require("../db/conn");
const { ObjectId } = require('mongodb');


router.get("/", async function (req, res, next) {
  console.log("GET /notes")
  const db = await database.connectToServer();
  const notes = db.collection("Notes").find({});
  const arrayNotes = await notes.toArray();
  console.log(arrayNotes)
  res.json(arrayNotes);
});

// Endpoint para obtener una nota por su ID
router.get("/getById", async function (req, res, next) {
  const noteId = req.query.id; // ID de la nota solicitada

  if (!noteId) {
    // Si no se proporciona el ID en los parámetros de consulta, devolver un mensaje de error
    res.status(400).json({ message: "Se requiere el parámetro 'id' en la URL" });
    return;
  }

  try {
    const db = await database.connectToServer();
    // Buscar la nota por su ID en la base de datos
    const note = await db.collection("Notes").findOne({ _id: new ObjectId(noteId) });
    
    if (!note) {
      // Si no se encuentra la nota, devolver un mensaje de error
      res.status(404).json({ message: "Nota no encontrada" });
      return;
    }

    // Devolver la nota encontrada
    res.status(200).json(note);
  } catch (err) {
    console.error(`Error al buscar la nota por ID: ${err}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/create", async function (req, res, next) {
  var newNote = req.body;

  if (!newNote || !newNote.title || !newNote.content) {
    res
      .status(400)
      .send("Title and content are required to create a new note");
    return;
  }

  try{
    const db = await database.connectToServer();
    console.log("POST /notes/create")
    db.collection("Notes").insertOne(newNote);
    res.status(200).json({
      message: "Note created successfully"
    });
  } catch (err) {
    console.error(`Something went wrong trying to insert a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.put("/:id/edit", async function (req, res, next) {
  var noteId = req.params.id;
  var findQuery = { _id: new ObjectId(noteId) };
  var updateQuery = { $set: req.body };

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

  try{
    const updateOptions = { returnOriginal: false };
    const db = await database.connectToServer();
    const updateResult = db.collection("Notes").findOneAndUpdate(
      findQuery,
      updateQuery,
      updateOptions,
    );
    console.log('Document updated');
    res.status(200).json({
      message: "Note updated successfully"
    });
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id/delete", async function (req, res, next) {
  var noteId = req.params.id;

  try{
    const db = await database.connectToServer();
    db.collection("Notes").deleteOne({ _id: new ObjectId(noteId) });
    console.log("Note deleted successfully");
    res.status(200).json({
      message: "Note deleted successfully"
    });
  }catch (err) {
    console.error(`Something went wrong trying to delete a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
