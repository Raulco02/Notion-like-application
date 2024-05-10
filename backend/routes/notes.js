var express = require("express");
var router = express.Router();
const noteModel = require("../model/noteModel");
const userModel = require("../model/userModel");
const notificationModel = require("../model/notificationModel");
const { parse } = require("dotenv");
const e = require("express");

//¿Controlar que el usuario sea admin para según qué acciones?¿Añadir boolean admin a session?

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
      res.status(404).json({ message: "Note not found" });
      return;
    }
    // if (req.session.user_id !== note.user_id) {
    //   res.status(403).json({
    //     message: "You are not allowed to see this note"
    //   });
    //   return;
    // }

    // Devolver la nota encontrada
    res.status(200).json(note);

  } catch (err) {
    console.error(`Error al buscar la nota por ID: ${err}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/getUserNotes", async function (req, res, next) {
  const userId = req.session.user_id; // ID de la nota solicitada
  var referencedNoteId = req.query.referencedNoteId;

  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }

  try {
    userNotes = await noteModel.getUserNotes(userId, referencedNoteId);

    if (!userNotes) {
      // Si no se encuentra la nota, devolver un mensaje de error
      res.status(404).json({ message: "User notes not found" });
      return;
    }
    console.log(userNotes)

    // Devolver la nota encontrada
    res.status(200).json(userNotes);

  } catch (err) {
    console.error(`Error al buscar las notas del usuario: ${err}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/create", async function (req, res, next) {
  var newNote = req.body;

  var userId = req.session.user_id;


  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }

  newNote.user_id = userId;

  if (!newNote || !newNote.title || !newNote.content || !newNote.referencedNoteId) {
    res.status(400).send("Title, content, and Note Reference are required to create a new note");
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
  try {
    const currentNote = await noteModel.getNoteById(noteId);
    if (!currentNote) {
      res.status(404).json({
        message: "Note not found"
      });
      return;
    }
    if (req.session.user_id !== currentNote.user_id && (currentNote.editors && !currentNote.editors.includes(req.session.user_id))) {
      console.log("Session user id:", req.session.user_id);
      console.log("note user id:", currentNote.user_id);
      res.status(403).json({
        message: "You are not allowed to update this note"
      });
      return;
    }
  } catch (err) {
    console.error(`Something went wrong trying to get one document to update it: ${err}\n`);
    res.status(500).send("Internal server error");
  }
  try {
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
  try {
    const currentNote = await noteModel.getNoteById(noteId);
    if (!currentNote) {
      res.status(404).json({
        message: "Note not found"
      });
      return;
    }
    if (req.session.user_id !== currentNote.user_id) {
      res.status(403).json({
        message: "You are not allowed to delete this note"
      });
      return;
    }
  } catch (err) {
    console.error(`Something went wrong trying to get one document to delete it: ${err}\n`);
    res.status(500).send("Internal server error");
  }
  try {
    // const db = await database.connectToServer();
    // db.collection("Notes").deleteOne({ _id: new ObjectId(noteId) });
    await noteModel.deleteNoteById(noteId);
    console.log("Note deleted successfully");
    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (err) {
    console.error(`Something went wrong trying to delete a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.post("/setSharing", async function (req, res, next) {
  const session = req.session;
  const registered = session.register;

  console.log("Session: ", session);
  console.log("Registered: ", registered);
  console.log("User ID: ", session.user_id);

  if (!registered) {
    return res.status(404).json({ error: "User does not have a session or is not signed up" });
  }

  const user_id = session.user_id;

  if (!user_id) {
    return res.status(401).json({ error: "User is not signed in" });
  }

  var request = req.body;
  if (
    !request ||
    !request.userId ||
    !request.noteId ||
    !request.accessMode ||
    !request.isAnswer
  ) {
    res
      .status(400)
      .send("userId, noteId and accessMode are required to share a note");
    return;
  }
  if (request.accessMode !== "r" && request.accessMode !== "w" && request.accessMode !== "n") {
    res
      .status(400)
      .send("accessMode must be 'r', 'w' or 'n'");
    return;
  }
  try {
    await noteModel.setSharing(request.noteId, request.userId, user_id, request.accessMode, request.isAnswer, userModel.checkFriendship, notificationModel.createNotification);
    res.status(200).json({
      message: "Note shared successfully"
    });
  } catch (err) {
    if (err.message === "Note not found") {
      res.status(404).json({
        message: "Note not found"
      });
    } else if (err.message === "User is not friend of the owner") {
      res.status(403).json({
        message: "User is not friend of the owner"
      });
    }
    else {
      console.error(`Something went wrong trying to get one document to update it: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

router.get("/getAccessUser/:id", async function (req, res, next) {
  const noteId = req.params.id;
  const userId = req.session.user_id;

  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }

  try {
    const access = await noteModel.getAccessUser(noteId, userId);

    // Devolver la nota encontrada
    res.status(200).json({ "access_mode:": access });

  } catch (err) {
    if (err.message === "Note not found") {
      res.status(404).json({
        message: "Note not found"
      });
    } else {
      console.error(`Error al buscar las notas del usuario: ${err}`);
      res.status(500).send("Error interno del servidor");
    }
  }
});

router.get("/getSharedNotes/:ownerId", async function (req, res, next) {
  const userId = req.session.user_id;
  const ownerId = req.params.ownerId;

  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }

  try {
    const sharedNotes = await noteModel.getSharedNotes(ownerId, userId, userModel.checkFriendship);

    // Devolver la nota encontrada
    res.status(200).json(sharedNotes);

  } catch (err) {
    if (err.message === "User is not friend of the owner") {
      res.status(403).json({
        message: "User is not friend of the owner"
      });
    }
    else if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
      res.status(400).json({
        message: "Invalid owner ID"
      });
    }
    else if (err.message === "User not found") {
      res.status(404).json({
        message: "User not found"
      });

    }
    else {
      console.error(`Error al buscar las notas del usuario: ${err}`);
      res.status(500).send("Error interno del servidor");
    }
  }
});

router.post("/requestSharing", async function (req, res, next) {
  const session = req.session;
  const registered = session.register;

  console.log("Session: ", session);
  console.log("Registered: ", registered);
  console.log("User ID: ", session.user_id);

  if (!registered) {
    return res.status(404).json({ error: "User does not have a session or is not signed up" });
  }

  const user_id = session.user_id;

  if (!user_id) {
    return res.status(401).json({ error: "User is not signed in" });
  }

  var request = req.body;
  if (
    !request ||
    !request.noteId ||
    !request.accessMode
  ) {
    res
      .status(400)
      .send("noteId and accessMode are required to request share a note");
    return;
  }
  if (request.accessMode !== "r" && request.accessMode !== "w" && request.accessMode !== "n") {
    res
      .status(400)
      .send("accessMode must be 'r', 'w' or 'n'");
    return;
  }
  try {
    const sharingRequest = await noteModel.sharingRequest(user_id, request.noteId, request.accessMode, userModel.checkFriendship, notificationModel.createNotification);
    res.status(200).json(sharingRequest);
  } catch (err) {
    if (err.message === "Note not found") {
      res.status(404).json({
        message: "Note not found"
      });
    } else if (err.message === "User is not friend of the owner") {
      res.status(403).json({
        message: "User is not friend of the owner"
      });
    } else if (err.message === "User already has the requested access mode") {
      res.status(400).json({
        message: "User already has the requested access mode"
      });
    }
    else {
      console.error(`Something went wrong trying to get one document to update it: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

router.get("/getAccessUsers/:noteId", async function (req, res, next) {
  const noteId = req.params.noteId;
  const userId = req.session.user_id;

  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }

  try {
    const access = await noteModel.getAccessUsers(noteId, userId, userModel.getAllUsers);

    // Devolver la nota encontrada
    res.status(200).json(access);

  } catch (err) {
    if (err.message === "Note not found") {
      res.status(404).json({
        message: "Note not found"
      });
    } else {
      console.error(`Error al buscar las notas del usuario: ${err}`);
      res.status(500).send("Error interno del servidor");
    }
  }
});

module.exports = router;