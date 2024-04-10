var crypto = require('crypto');
var express = require('express');
const userModel = require('../model/userModel');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("GET /users")
  const arrayUsers = await userModel.getAllUsers();
  res.json(arrayUsers);
});

router.put("/login", async function (req, res, next) { //REVISAR
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.login(email, password);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let httpId = req.sessionID;

    console.log("User: ", user);
    console.log("httpId: ", httpId);
    if (!httpId) {
      httpId = crypto.randomBytes(16).toString("hex");
    }

    req.session.user_id = user._id;
    req.session.register = true;

    return res.status(200).json({ "httpId": httpId });
  } catch (err) {
    console.error(`Error signing in: ${err}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getProfile", async function (req, res, next) {
  try {
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

    const user = await userModel.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(`Error getting user: ${err}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async function (req, res, next) {
  try {
    let { userName, email, pwd1, pwd2 } = req.body;
    if (!userName || !email || !pwd1 || !pwd2) {
      return res.status(400).json({ error: "Username, email, password and confirmation are required" });
    }
    // Verificar correo...
    if (pwd1.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    if (pwd1 !== pwd2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    password = crypto.createHash('sha256').update(pwd1).digest('hex');
    const role = "u"
    await userModel.createNewUser({userName, email, password, role});

    return res.status(200).json({ message: "User signed up correctly" });
  } catch (err) {
    console.error(`Error signing up: ${err}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/logout', (req, res) => {
  console.log("Session before logout:", session);
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    // Envía una respuesta exitosa
    res.status(200).json({ message: 'Logout exitoso' });
  });
  console.log("Session after logout:", session);
});


router.get("/getById", async function (req, res, next) {
  const userId = req.query.id; // ID de la nota solicitada

  if (!userId) {
    // Si no se proporciona el ID en los parámetros de consulta, devolver un mensaje de error
    res.status(400).json({ message: "ID required in URL" });
    return;
  }

  try {
    
    const user = await userModel.getUserById(userId);

    if (!user) {
      // Si no se encuentra la nota, devolver un mensaje de error
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Devolver la nota encontrada
    res.status(200).json(user);
    
  } catch (err) {
    console.error(`Error searching for user by ID: ${err}`);
    res.status(500).send("Internal server error");
  }
});

router.post("/create", async function (req, res, next) {
  var newUser = req.body;

  if (!newUser || !newUser.userName || !newUser.email || !newUser.password) {
    res.status(400).send("Username, email and password are required to create a new user");
    return;
  }

  try {
    newUser.password = crypto.createHash('sha256').update(newUser.password).digest('hex');
    // Insertar la nueva nota en la base de datos
    const resultId = await userModel.createNewUser(newUser);

    // Devolver el id de la nota como parte de la respuesta
    res.status(200).json({
      message: "User created successfully",
      userId: resultId
    });

  } catch (err) {
    console.error(`Something went wrong trying to insert a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.put("/edit", async function (req, res, next) {
  var updatedUser = req.body;
  var updateQuery = { $set: req.body };

  if (
     !updatedUser ||
     !updatedUser.id
  ) {
    res
      .status(400)
      .send("ID is required to update a user");
    return;
  }

  try{
    await userModel.updateUserById(updatedUser.id, updateQuery);
    console.log('Document updated');
    res.status(200).json({
      message: "User updated successfully"
    });
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.delete("/delete", async function (req, res, next) {
  var user = req.body;
  if (
    !user ||
    !user.id
 ) {
   res
     .status(400)
     .send("ID is required to delete a user");
   return;
 }
  try{
    await userModel.deleteUserById(user.id);
    console.log("User deleted successfully");
    res.status(200).json({
      message: "User deleted successfully"
    });
  }catch (err) {
    console.error(`Something went wrong trying to delete a document: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
