var express = require("express");
var router = express.Router();
const collectionModel = require("../model/collectionModel");

//¿Controlar que el usuario sea admin para según qué acciones?¿Añadir boolean admin a session?

router.get("/", async function (req, res, next) {
  console.log("GET /collections")
  const arraycollections = await collectionModel.getAllcollections();
  res.json(arraycollections);
});

// Endpoint para obtener una nota por su ID
router.get("/getById", async function (req, res, next) {
  const collectionId = req.query.id; // ID de la nota solicitada

  if (!collectionId) {
    // Si no se proporciona el ID en los parámetros de consulta, devolver un mensaje de error
    res.status(400).json({ message: "Se requiere el parámetro 'id' en la URL" });
    return;
  }

  try {
    
    const collection = await collectionModel.getCollectionById(collectionId);

    if (!collection) {
      // Si no se encuentra la nota, devolver un mensaje de error
      res.status(404).json({ message: "Nota no encontrada" });
      return;
    }

    // Devolver la nota encontrada
    res.status(200).json(collection);
    
  } catch (err) {
    console.error(`Error al buscar la nota por ID: ${err}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/getUserCollections", async function (req, res, next) {
  const userId = req.session.user_id; // ID de la nota solicitada
  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }
  console.log('user ID en getUserCollections:', userId);

  try {
    userCollections = await collectionModel.getUserCollections(userId);

    if (!userCollections) {
      // Si no se encuentra la nota, devolver un mensaje de error
      res.status(404).json({ message: "User Collections not found" });
      return;
    }
    console.log(userCollections)

    // Devolver la nota encontrada
    res.status(200).json(userCollections);
    
  } catch (err) {
    console.error(`Error al buscar las Collections del usuario: ${err}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/create", async function (req, res, next) {
  var newcollection = req.body;
  var userId = req.session.user_id;
  if (!userId) {
    res.status(401).json({ message: "User is not signed in" });
    return;
  }
  newcollection.user_id = userId;
  if (!newcollection || !newcollection.name || !newcollection.notes) {
    res.status(400).send("Name and notes are required to create a new collection");
    return;
  }

  try {
    // Insertar la nueva nota en la base de datos
    const resultId = await collectionModel.createNewcollection(newcollection);

    // Devolver el id de la nota como parte de la respuesta
    res.status(200).json({
      message: "collection created successfully",
      collectionId: resultId
    });

  } catch (err) {
    console.error(`Something went wrong trying to insert a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});


router.put("/:id/edit", async function (req, res, next) {
  var updatedcollection = req.body;
  var collectionId = req.params.id;
  // var findQuery = { _id: new ObjectId(collectionId) };
  var updateQuery = { $set: req.body };

  if (
     !updatedcollection ||
     !updatedcollection.name ||
     !updatedcollection.notes
  ) {
    res
      .status(400)
      .send("Name and notes are required to update a collection");
    console.log("Name and notes are required to update a collection")
    return;
  }

  try{
    const currentCollection = await collectionModel.getCollectionById(collectionId);
    if (!currentCollection) {
      res.status(404).json({
        message: "Collection not found"
      });
      console.log("Collection not found")
      return;
    }
    if(req.session.user_id !== currentCollection.user_id){
      console.log("Session user id:", req.session.user_id);
      console.log("collection user id:", currentCollection.user_id);
      res.status(403).json({
        message: "You are not allowed to update this collection"
      });
      console.log(req.session.user_id, ' is not allowed to update this collection')
      return;
    }  
  }catch (err) {
    console.error(`Something went wrong trying to get one document to update it: ${err}\n`);
    res.status(500).send("Internal server error");
  }
  try{

    await collectionModel.updatecollectionById(collectionId, updateQuery);
    
    console.log('Document updated');
    res.status(200).json({
      message: "collection updated successfully"
    });
    console.log("collection updated successfully")
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id/delete", async function (req, res, next) {
  var collectionId = req.params.id;
  try{
    const currentCollection = await collectionModel.getCollectionById(collectionId);
    if (!currentCollection) {
      res.status(404).json({
        message: "Note not found"
      });
      return;
    }
    if(req.session.user_id !== currentCollection.user_id){
      console.log("Session user id:", req.session.user_id);
      console.log("collection user id:", currentCollection.user_id);
      res.status(403).json({
        message: "You are not allowed to delete this collection"
      });
      return;
    }  
  }catch (err) {
    console.error(`Something went wrong trying to get one document to update it: ${err}\n`);
    res.status(500).send("Internal server error");
  }
  try{
    await collectionModel.deletecollectionById(collectionId);
    console.log("collection deleted successfully");
    res.status(200).json({
      message: "collection deleted successfully"
    });
  }catch (err) {
    console.error(`Something went wrong trying to delete a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
