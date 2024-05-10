var crypto = require('crypto');
var express = require('express');
const userModel = require('../model/userModel');
const { createNotification } = require('../model/notificationModel');
var router = express.Router();

//¿Controlar que el usuario sea admin para según qué acciones?¿Añadir boolean admin a session?

/* GET users listing. */
router.get('/', async function(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).json({ error: "User is not signed in" });
  }
  if (req.session.role !== "a") {
    return res.status(403).json({ error: "User is not an admin" });
  }
  const arrayUsers = await userModel.getAllUsers();
  return res.json(arrayUsers);
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
    req.session.role = user.role;

    return res.status(200).json({ "httpId": httpId });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    else{
      console.error(`Error signing in: ${err}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/getProfile", async function (req, res, next) {
  try {
    const session = req.session;
    const registered = session.register;
    const role = session.role;

    console.log("Session: ", session);
    console.log("Registered: ", registered);
    console.log("User ID: ", session.user_id);
    console.log("Role: ", role);

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

router.post("/register", async function (req, res, next) { //No comprueba que no haya otro usuario ya registrado
  try {
    let { userName, email, pwd1, pwd2 } = req.body;
    if (!userName || !email || !pwd1 || !pwd2) {
      return res.status(400).json({ error: "Username, email, password and confirmation are required" });
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
  // console.log("Session before logout:", session);
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    // Envía una respuesta exitosa
    res.status(200).json({ message: 'Logout exitoso' });
  });

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

  if(!req.session.user_id){
    return res.status(401).json({ error: "User is not signed in" });
  }
  if(!req.session.role || req.session.role !== 'a'){
    return res.status(403).json({ error: "You must be an admin to create a note" })
  }

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
    if(err.message === "Email already in use"){
      return res.status(400).send("Email already in use")
    }else{
      console.error(`Something went wrong trying to insert a document: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

router.put("/edit", async function (req, res, next) {
  var updatedUser = req.body;
  var updateQuery = { $set: req.body };

  if (
     !updatedUser ||
     !updatedUser._id
  ) {
    res
      .status(400)
      .send("_id is required to update a user");
    return;
  }
  if(!req.session.user_id){
    return res.status(401).send("User is not signed in")
  }
  if(!req.session.role || req.session.role !== 'a'){
    return res.status(403).send("User must be admin to edit users")
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
 if(!req.session.user_id){
  return res.status(401).send("User is not signed in")
 }
 if(req.session.user_id === user.id || req.session.role === 'a'){
  try{
    await userModel.deleteUserById(user.id);
    console.log("User deleted successfully");
    res.status(200).json({
      message: "User deleted successfully"
    });
    return;
  }catch (err) {
    if(err.message === "User not found"){
      res.status(404).send("User not found");
      return;
    }else{
      console.error(`Something went wrong trying to delete a document: ${err}\n`);
      res.status(500).send("Internal server error");
      return
    }
  }
  }else{
    return res.status(403).send("You must be admin or the selected user to delete it")
  }
});

router.post("/friendship_request", async function (req, res, next) {
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

  var user = req.body;
  if (
    !user ||
    !user.requestedUserEmail
 ) {
   res
     .status(400)
     .send("requestedUserEmail is required to create a friendship request");
   return;
 }
  try{
    await userModel.createFriendshipRequest(user_id, user.requestedUserEmail, createNotification);
    console.log("Friendship request created successfully");
    res.status(200).json({
      message: "Friendship request created successfully"
    });
  }catch (err) {
    if(err.message === "User already sent a request"){
      res.status(400).send("User already sent a request");
      return;
    }
    else if (err.message === "User not found"){
      res.status(404).send("User not found");
      return;
    }
    else if (err.message === "User already has a request from this sender"){
      res.status(400).send("User already has a request from this sender");
      return;
    }
    else if (err.message === "You cannot send a friend request to yourself"){
      res.status(400).send("You cannot send a friend request to yourself");
      return;
    }
    else if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"){
      res.status(400).send("Invalid requestedUserId");
      return;
    }
    else{
      console.error(`Something went wrong trying to create a friendship request: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

router.get("/get_friendship_requests", async function (req, res, next) { //Devolver variable true o false de nota compartida
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

  try{
    const requests = await userModel.getFriendshipRequests(user_id);
    console.log("Friendship requests obtained successfully");
    res.status(200).json({
      message: "Friendship requests obtained successfully",
      requests: requests
    });
  }catch (err) {
    console.error(`Something went wrong trying to get friendship requests: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.post("/set_friendship_request", async function (req, res, next) {
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

  var user = req.body;
  if (
    !user ||
    !user.userId ||
    !user.accepted
  ){
    res
      .status(400)
      .send("userId and accepted are required to set a friendship request");
    return;
  }
  if(user.accepted !== 'true' && user.accepted !== 'false'){
    res.status(400).send("Accepted must be true o false");
    return;
  }
  try{
    await userModel.setFriendshipRequest(user_id, user.userId, user.accepted, createNotification);
    console.log("Friendship request set successfully");
    res.status(200).json({
      message: "Friendship request set successfully"
    });
  }catch (err) {
    if(err.message === "Friend request not found"){
      res.status(404).send("Friend request not found");
      return;
    }
    else if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"){
      res.status(400).send("Invalid userId");
      return;
    }
    else{
      console.error(`Something went wrong trying to set a friendship request: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

router.get("/get_friends", async function (req, res, next) {
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

  try{
    const friends = await userModel.getFriends(user_id);
    console.log("Friends obtained successfully");
    res.status(200).json({
      message: "Friends obtained successfully",
      friends: friends
    });
  }catch (err) {
    console.error(`Something went wrong trying to get friends: ${err}\n`);
    res.status(500).send("Internal server error");
  }
});

router.delete("/delete_friend", async function (req, res, next) {
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

  var user = req.body;
  if (
    !user ||
    !user.userId
 ) {
   res
     .status(400)
     .send("userId is required to delete a friend");
   return;
 }
  try{
    await userModel.deleteFriend(user_id, user.userId);
    console.log("Friend deleted successfully");
    res.status(200).json({
      message: "Friend deleted successfully"
    });
  }catch (err) {
    if(err.message === "Friend not found"){
      res.status(404).send("Friend not found");
      return;
    }
    else if(err.message === "User is not a friend"){
      res.status(404).send("User is not a friend");
      return;
    }
    else if (err.message === "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"){
      res.status(400).send("Invalid userId");
      return;
    }
    else{
      console.error(`Something went wrong trying to delete a friend: ${err}\n`);
      res.status(500).send("Internal server error");
    }
  }
});

module.exports = router;
