var express = require("express");
var router = express.Router();
const noteModel = require("../model/noteModel");


router.get("/", async function (req, res, next) {
  console.log("GET /notes")
  const arrayNotes = await noteModel.getAllNotes();
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
    
    const note = await noteModel.getNoteById(noteId);

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
    res.status(400).send("Title and content are required to create a new note");
    return;
  }

  try {
    // Insertar la nueva nota en la base de datos
    const resultId = await noteModel.createNewNote(newNote);

    // Devolver el id de la nota como parte de la respuesta
    res.status(200).json({
      message: "Note created successfully",
      noteId: resultId
    });

  } catch (err) {
    console.error(`Something went wrong trying to insert a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});


router.put("/:id/edit", async function (req, res, next) {
  var updatedNote = req.body;
  var noteId = req.params.id;
  // var findQuery = { _id: new ObjectId(noteId) };
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
    await noteModel.updateNoteById(noteId, updateQuery);
    
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
    // const db = await database.connectToServer();
    // db.collection("Notes").deleteOne({ _id: new ObjectId(noteId) });
    await noteModel.deleteNoteById(noteId);
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
