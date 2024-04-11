var express = require("express");
var router = express.Router();
const collectionModel = require("../model/collectionModel");


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
    
    const collection = await collectionModel.getcollectionById(collectionId);

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

router.post("/create", async function (req, res, next) {
  var newcollection = req.body;

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
    return;
  }

  try{
    await collectionModel.updatecollectionById(collectionId, updateQuery);
    
    console.log('Document updated');
    res.status(200).json({
      message: "collection updated successfully"
    });
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id/delete", async function (req, res, next) {
  var collectionId = req.params.id;

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
