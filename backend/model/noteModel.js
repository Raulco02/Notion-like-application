const { parse } = require("dotenv");
var database = require("../db/Agent");
const { ObjectId } = require("mongodb");

class noteModel {
  async getAllNotes() {
    const db = await database.connectToServer();

    // Consulta para obtener todas las notas del usuario y sus subnotas
    const notes = await db
      .collection("Notes")
      .find({ })
      .toArray();

    // Mapear notas a objetos con la estructura de árbol
    const notesMap = {};
    const rootNotes = [];

    // Crear un mapa de notas por su ID y encontrar las notas raíz
    notes.forEach((note) => {
      notesMap[note._id] = note;

      if (
        note.referencedNoteId.equals(new ObjectId("000000000000000000000000"))
      ) {
        console.log("Funciona");
        rootNotes.push(note);
      }
    });

    // Función recursiva para obtener todas las subnotas de una nota dada
    const getSubNotes = (noteId) => {
      const subNotes = [];
      notes.forEach((note) => {
        if (note.referencedNoteId.equals(noteId)) {
          const subNote = { ...note };
          const childSubNotes = getSubNotes(note._id); // Llamada recursiva para obtener las subnotas de esta subnota
          if (childSubNotes.length > 0) {
            subNote.subNotes = childSubNotes; // Asignar las subnotas encontradas como subnotas de esta subnota
          }
          subNotes.push(subNote);
        }
      });

      return subNotes;
    };

    // Asignar subnotas a las notas correspondientes
    rootNotes.forEach((rootNote) => {
      rootNote.subNotes = getSubNotes(rootNote._id);
    });

    return rootNotes;
  }

  async getNoteById(noteId, userId) {
    const db = await database.connectToServer();
    const note = await db
      .collection("Notes")
      .findOne({ _id: new ObjectId(noteId) });
    if (!note) {
      throw new Error("Note not found");
    }
    console.log('userId:', userId, 'note.user_id:', note.user_id);
    if (
      note.user_id !== userId &&
      note.readers &&
      !note.readers.includes(userId) &&
      note.editors &&
      !note.editors.includes(userId)
    ) {
      console.log(note.user_id)
      throw new Error("User does not have access to this note");
    }
    return note;
  }

  async getNoteByIdAdmin(noteId) {
    const db = await database.connectToServer();
    const note = await db
      .collection("Notes")
      .findOne({ _id: new ObjectId(noteId) });
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  }

  async createNewNote(newNote) {
    if (parseInt(newNote.referencedNoteId) === -1) {
      newNote.referencedNoteId = new ObjectId("000000000000000000000000");
    } else {
      newNote.referencedNoteId = new ObjectId(newNote.referencedNoteId);
    }

    const db = await database.connectToServer();
    const result = await db.collection("Notes").insertOne(newNote);
    return result.insertedId;
  }

  async updateNoteById(noteId, updateQuery) {
    var findQuery = { _id: new ObjectId(noteId) };

    const updateOptions = { returnOriginal: false };
    const db = await database.connectToServer();
    const updateResult = db
      .collection("Notes")
      .findOneAndUpdate(findQuery, updateQuery, updateOptions);

    return updateResult;
  }

  async deleteNoteById(noteId, userId, roleId) {
    const db = await database.connectToServer();
    const note = await db.collection("Notes").findOne({ _id: new ObjectId(noteId) })
    if (note){
      if (note.user_id === userId || roleId === 'a') {
        return await db
          .collection("Notes")
          .deleteOne({ _id: new ObjectId(noteId) });

      }
      else{
        throw new Error("User does not have access to this note");
      }
    }else{
      throw new Error("Note not found");
    }
  }
  // async deleteNoteById(noteId, userId) {
  //   const db = await database.connectToServer();
  //   const notes = await this.getUserNotes(userId, noteId);
  //   if (notes.length === 0) {
  //     throw new Error("User notes not found");
  //   }
  
  //   // Función recursiva para eliminar una nota y todas sus subnotas
  //   const deleteNoteAndSubnotes = async (note) => {
  //     // Si la nota tiene subnotas, eliminarlas recursivamente
  //     if (note.subNotes && note.subNotes.length > 0) {
  //       for (const subNote of note.subNotes) {
  //         await deleteNoteAndSubnotes(subNote);
  //       }
  //     }
  
  //     // Eliminar la nota de la base de datos
  //     await db.collection("Notes").deleteOne({ _id: note._id });
  //   };
  
  //   // Función para encontrar la nota correspondiente al noteId en las notas y subnotas
  //   const findNoteAndDelete = async (notes) => {
  //     for (const note of notes) {
  //       if (note._id === noteId) {
  //         console.log(note)
  //         if(note.user_id !== userId){
  //           throw new Error("User does not have access to this note");
  //         }
  //         await deleteNoteAndSubnotes(note);
  //         return; // Termina la búsqueda si la nota se encuentra y elimina
  //       }
  //       if (note.subNotes && note.subNotes.length > 0) {
  //         await findNoteAndDelete(note.subNotes); // Busca en las subnotas recursivamente
  //       }
  //     }
  //   };
  
  //   // Buscar y eliminar la nota correspondiente al noteId
  //   await findNoteAndDelete(notes);
  // }
  
  // async getUserNotes(userId, referencedNoteId) {

  //     const db = await database.connectToServer();
  //     let query = { user_id: userId };

  //     if (parseInt(referencedNoteId) === -1) {
  //         let query = { user_id: userId,  referencedNoteId: new ObjectId('000000000000000000000000')};
  //         const notes = db.collection("Notes").find(query);
  //         const returndata = await notes.toArray();
  //         return returndata;
  //     }

  //     else {
  //         let query = { user_id: userId,  referencedNoteId: new ObjectId(referencedNoteId)};
  //         const notes = db.collection("Notes").find(query);
  //         const returndata = await notes.toArray();
  //         return returndata;
  //     }

  //     const notes = db.collection("Notes").find(query);
  //     const returndata = await notes.toArray();

  //     return returndata;
  // }

  async getUserNotes(userId, referencedNoteId) {
    const db = await database.connectToServer();

    // Consulta para obtener todas las notas del usuario y sus subnotas
    const notes = await db
      .collection("Notes")
      .find({ user_id: userId })
      .toArray();

    // Mapear notas a objetos con la estructura de árbol
    const notesMap = {};
    const rootNotes = [];

    // Crear un mapa de notas por su ID y encontrar las notas raíz
    notes.forEach((note) => {
      notesMap[note._id] = note;

      if (
        note.referencedNoteId.equals(new ObjectId("000000000000000000000000"))
      ) {
        console.log("Funciona");
        rootNotes.push(note);
      }
    });

    // Función recursiva para obtener todas las subnotas de una nota dada
    const getSubNotes = (noteId) => {
      const subNotes = [];
      notes.forEach((note) => {
        if (note.referencedNoteId.equals(noteId)) {
          const subNote = { ...note };
          const childSubNotes = getSubNotes(note._id); // Llamada recursiva para obtener las subnotas de esta subnota
          if (childSubNotes.length > 0) {
            subNote.subNotes = childSubNotes; // Asignar las subnotas encontradas como subnotas de esta subnota
          }
          subNotes.push(subNote);
        }
      });

      return subNotes;
    };

    // Asignar subnotas a las notas correspondientes
    rootNotes.forEach((rootNote) => {
      rootNote.subNotes = getSubNotes(rootNote._id);
    });

    return rootNotes;
  }

  async setSharing(
    noteId,
    userId,
    ownerId,
    accessMode,
    isAnswer,
    checkFriendship,
    createNotification
  ) {
    const areFriends = await checkFriendship(ownerId, userId);
    if (!areFriends) {
      throw new Error("User is not friend of the owner");
    }
    const db = await database.connectToServer();
    const objectNoteId = new ObjectId(noteId);
    let updateQuery = {};
    // Determinar qué acción tomar según el valor de access_mode
    if (accessMode === "r") {
      // Si access_mode es "r", agregar userId a readers
      updateQuery = {
        $addToSet: { readers: userId },
        $pull: { editors: userId },
      };
    } else if (accessMode === "w") {
      // Si access_mode es "w", agregar userId a editors
      updateQuery = {
        $addToSet: { editors: userId },
        $pull: { readers: userId },
      };
    } else if (accessMode === "n") {
      // Si access_mode es "n", eliminar userId de readers y editors
      updateQuery = { $pull: { readers: userId, editors: userId } };
    }
  
    // Realizar la actualización
    const updateResult = await db.collection("Notes").findOneAndUpdate(
      {
        _id: objectNoteId,
        user_id: ownerId,
      },
      updateQuery,
      {
        returnOriginal: false,
      }
    );
    if (!updateResult) {
      throw new Error("Note not found");
    }
  
    // Actualizar las subnotas directas
    const subNotes = await db
      .collection("Notes")
      .find({
        user_id: ownerId,
        referencedNoteId: objectNoteId,
      })
      .toArray();
  
    if (subNotes.length > 0) {
      const subNotesUpdateResult = await db.collection("Notes").updateMany(
        {
          user_id: ownerId,
          referencedNoteId: objectNoteId,
        },
        updateQuery
      );
  
      console.log(
        "Number of subnotes updated:",
        subNotesUpdateResult.modifiedCount
      );
  
      // Función para actualizar las subnotas de manera recursiva
      async function updateSubNotes(noteId) {
        const objectNoteId = new ObjectId(noteId);
        const subNotes = await db
          .collection("Notes")
          .find({
            user_id: ownerId,
            referencedNoteId: objectNoteId,
          })
          .toArray();
  
        // Actualizar las subnotas, si existen
        if (subNotes.length > 0) {
          const subNotesUpdateResult = await db.collection("Notes").updateMany(
            {
              user_id: ownerId,
              referencedNoteId: objectNoteId,
            },
            updateQuery
          );
  
          console.log(
            "Number of subnotes updated:",
            subNotesUpdateResult.modifiedCount
          );
  
          // Llamar recursivamente para actualizar las subnotas de las subnotas
          for (const subNote of subNotes) {
            await updateSubNotes(subNote._id);
          }
        }
      }
  
      // Llamar la función para actualizar las subnotas de manera recursiva
      for (const subNote of subNotes) {
        await updateSubNotes(subNote._id);
      }
    }
    let msgMode = "";
    if (isAnswer === "true") {
      msgMode = "as";
    } else {
      msgMode = "ss";
    }
    if (accessMode === "n") {
      return;
    }
    const notificacion = await noteModel.createNotification(
      msgMode,
      ownerId,
      userId,
      noteId,
      accessMode
    );
    console.log(notificacion);
    createNotification(notificacion);
    // const updatedNote = updateResult;
    // console.log(updatedNote);
    // updatedNote.subNotes = subNotes;
    // console.log("Con subnotas Updated note:", updatedNote);
  }
  //When you delete a friendship, you must delete the sharing of the notes that the user has shared with the friend
  async setSharingDeletedFriend(userId, friendId) {
    const db = await database.connectToServer();
    const notes = await db
      .collection("Notes")
      .find({ user_id: userId })
      .toArray();
    notes.forEach(async (note) => {
      console.log(note)
      console.log(note.readers)
      if (note.readers && note.readers.includes(friendId)) {
        const updateQuery = { $pull: { readers: friendId } };
        const updateResult = await db.collection("Notes").findOneAndUpdate(
          {
            _id: note._id,
            user_id: userId,
          },
          updateQuery,
          {
            returnOriginal: false,
          }
        );
        if (!updateResult) {
          throw new Error("Note not found");
        }
        const subNotes = await db
          .collection("Notes")
          .find({
            user_id: userId,
            referencedNoteId: note._id,
          })
          .toArray();
        // Actualizar las subnotas, si existen
        if (subNotes.length > 0) {
          const subNotesUpdateResult = await db.collection("Notes").updateMany(
            {
              user_id: userId,
              referencedNoteId: note._id,
            },
            updateQuery
          );

          console.log(
            "Number of subnotes updated:",
            subNotesUpdateResult.modifiedCount
          );
        }
      }
      console.log(note.editors)
      if (note.editors && note.editors.includes(friendId)) {
        const updateQuery = { $pull: { editors: friendId } };
        const updateResult = await db.collection("Notes").findOneAndUpdate(
          {
            _id: note._id,
            user_id: userId,
          },
          updateQuery,
          {
            returnOriginal: false,
          }
        );
        if (!updateResult) {
          throw new Error("Note not found");
        }
        const subNotes = await db
          .collection("Notes")
          .find({
            user_id: userId,
            referencedNoteId: note._id,
          })
          .toArray();
        // Actualizar las subnotas, si existen
        if (subNotes.length > 0) {
          const subNotesUpdateResult = await db.collection("Notes").updateMany(
            {
              user_id: userId,
              referencedNoteId: note._id,
            },
            updateQuery
          );

          console.log(
            "Number of subnotes updated:",
            subNotesUpdateResult.modifiedCount
          );
        }
      }
    });
  }
  async getAccessUser(noteId, userId) {
    const db = await database.connectToServer();
    const note = await db
      .collection("Notes")
      .findOne({ _id: new ObjectId(noteId) });
    if (!note) {
      throw new Error("Note not found");
    }
    if (note.user_id === userId) {
      return "o";
    }
    if (note.readers && note.readers.includes(userId)) {
      return "r";
    }
    if (note.editors && note.editors.includes(userId)) {
      return "w";
    }
    return "n";
  }
  async getSharedNotes(ownerId, userId, checkFriendship) {
    const areFriends = await checkFriendship(ownerId, userId);
    if (!areFriends) {
      throw new Error("User is not friend of the owner");
    }

    const db = await database.connectToServer();

    // Consulta para obtener todas las notas del propietario y sus subnotas
    const notes = await db
      .collection("Notes")
      .find({ user_id: ownerId })
      .toArray();

    // Mapear notas a objetos con la estructura de árbol
    const permissionNotesMap = {};
    const notesMap = {};
    let rootNotes = [];
    let permissionNotes = [];

    // Crear un mapa de notas por su ID
    notes.forEach((note) => {
      notesMap[note._id] = note;
      if (
        (note.readers && note.readers.includes(userId)) ||
        (note.editors && note.editors.includes(userId))
      ) {
        note.access_mode =
          note.readers && note.readers.includes(userId) ? "r" : "w";
        permissionNotes.push(note);
        permissionNotesMap[note._id] = note;
      }
    });

    rootNotes = permissionNotes.filter(
      (note) =>
        note.referencedNoteId.equals(new ObjectId("000000000000000000000000"))
    );
    // Filtrar permissionNotes para eliminar las notas raíz
    permissionNotes = permissionNotes.filter(
      (note) =>
        !note.referencedNoteId.equals(new ObjectId("000000000000000000000000"))
    );

    // Crear un mapa de notas por su _id para facilitar la búsqueda

    rootNotes.forEach((note) => {
      notesMap[note._id] = note;
    });

    const findAncestor = (noteId) => {
      const note = notesMap[noteId];
      if (!note) {
        return null; // Si no se encuentra la nota en notesMap, retorna null
      }
      if (permissionNotesMap[noteId]) {
        return note; // Si se encuentra la nota en permissionNotesMap, retorna la nota
      }
      return findAncestor(note.referencedNoteId); // Buscar el ancestro recursivamente
    };

    // Iterar sobre las notas restantes en permissionNotes
    permissionNotes.forEach((note) => {
      // Encontrar el padre con permisos en rootNotes
      const parentNote = permissionNotesMap[note.referencedNoteId];
      if(note._id.equals(new ObjectId("663b85671213c0bcfc5bf15c")))
        console.log(note, parentNote)
      if (parentNote) {
        if (!parentNote.subNotes) {
          parentNote.subNotes = [];
        }
        parentNote.subNotes.push(note);

      } else {
        if(note._id.equals(new ObjectId("663b57f71427a57729cf85a2")))
          console.log(note._id)
        if (note.referencedNoteId.equals(new ObjectId("000000000000000000000000"))) {
          console.log('ROOT', note)
          rootNotes.push(note);
        }
        const second = notesMap[note.referencedNoteId];
        if(second && second.referencedNoteId.equals(new ObjectId("000000000000000000000000"))){
          console.log('ROOT', note)
          rootNotes.push(note);
        } else if (second && !second.referencedNoteId.equals(new ObjectId("000000000000000000000000"))) {
          console.log('Busqueda de ancestros:', note, second)
          const ancestor = findAncestor(note.referencedNoteId);
          if(ancestor !== null){
            console.log(ancestor.referencedNoteId.equals(new ObjectId("000000000000000000000000")))
            console.log(ancestor)
            if(!ancestor.referencedNoteId.equals(new ObjectId("000000000000000000000000"))){
              console.log(note)
              if(ancestor.subNotes === undefined){
                console.log('entra')
                ancestor.subNotes = [];
                ancestor.subNotes.push(note);
              }
              else{
                ancestor.subNotes.push(note);
              }
              console.log(ancestor)
            }else{
              if(ancestor.access_mode){
                if(ancestor.subNotes === undefined){
                  ancestor.subNotes = [];
                  ancestor.subNotes.push(note);
                }
                else{
                  ancestor.subNotes.push(note);
                }
              }else{
                rootNotes.push(note);
              }
            }
          }

        }
      }
    });
    return rootNotes;
  }

  async sharingRequest(
    userId,
    noteId,
    access_mode,
    checkFriendship,
    createNotification
  ) {
    const db = await database.connectToServer();

    const note = await db
      .collection("Notes")
      .findOne({ _id: new ObjectId(noteId) });
    if (!note) {
      throw new Error("Note not found");
    }

    const ownerId = note.user_id;
    const areFriends = await checkFriendship(ownerId, userId);
    if (!areFriends) {
      throw new Error("User is not friend of the owner");
    }
    // Verificar si el usuario ya tiene permisos para la nota
    const userAccess = await this.getAccessUser(noteId, userId);
    if (userAccess === access_mode) {
      throw new Error("User already has the requested access mode");
    }

    const notification = await noteModel.createNotification(
      "s",
      userId,
      ownerId,
      noteId,
      access_mode
    );
    createNotification(notification);
    return notification;
  }

  async getAccessUsers(noteId, userId, getAllUsers) {
    const db = await database.connectToServer();
    const note = await db
      .collection("Notes")
      .findOne({ _id: new ObjectId(noteId) });
    if (!note) {
      throw new Error("Note not found");
    }
    const readerIds = [];
    if (note.readers) {
      note.readers.forEach((reader) => {
        readerIds.push(reader);
      });
    }
    const editorIds = [];
    if (note.editors) {
      note.editors.forEach((editor) => {
        editorIds.push(editor);
      });
    }
    const arrayUsers = await getAllUsers();
    const users = [];
    arrayUsers.filter((user) => {
      const { role, password, friends, friend_requests, ...filteredUser } =
        user;
      const newUser = { ...filteredUser }; // Crea un nuevo objeto para modificar
      if (readerIds.includes(user._id.toString())) {
        newUser.accessMode = "r";
        users.push(newUser);
        return newUser;
      } else if (editorIds.includes(user._id.toString())) {
        newUser.accessMode = "w";
        users.push(newUser);
        return newUser;
      } else if (user._id.toString() === userId) {
        newUser.accessMode = "o";
        users.push(newUser);
        return newUser;
      }
      return false;
    });

    return users;
  }

  static async createNotification(
    type,
    sender_id,
    receiver_id,
    note_id,
    access_mode
  ) {
    console.log(
      "type:",
      type,
      "sender_id:",
      sender_id,
      "receiver_id:",
      receiver_id,
      "note_id:",
      note_id,
      "access_mode:",
      access_mode
    );
    const data = {
      type: type,
      sender_id: sender_id,
      receiver_id: receiver_id,
      note_id: note_id,
      access_mode: access_mode,
    };
    return data;
  }
}

module.exports = new noteModel();