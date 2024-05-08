const { parse } = require("dotenv");
var database = require("../db/Agent");
const { ObjectId } = require('mongodb');

class noteModel {

    async getAllNotes() {
        const db = await database.connectToServer();
        const notes = db.collection("Notes").find({});
        return await notes.toArray();
    }

    async getNoteById(noteId) {
        const db = await database.connectToServer();
        return await db.collection("Notes").findOne({ _id: new ObjectId(noteId) });
    }

    async createNewNote(newNote) {
        if (parseInt(newNote.referencedNoteId) === -1) {
            newNote.referencedNoteId = new ObjectId('000000000000000000000000');
        }
        else {
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
        const updateResult = db.collection("Notes").findOneAndUpdate(
            findQuery,
            updateQuery,
            updateOptions,
        );

        return updateResult
    }

    async deleteNoteById(noteId) {
        const db = await database.connectToServer();
        return await db.collection("Notes").deleteOne({ _id: new ObjectId(noteId) });
    }

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
        const notes = await db.collection("Notes").find({ user_id: userId }).toArray();
    
        // Mapear notas a objetos con la estructura de árbol
        const notesMap = {};
        const rootNotes = [];
    
        // Crear un mapa de notas por su ID y encontrar las notas raíz
        notes.forEach(note => {
            notesMap[note._id] = note;
    
            if (note.referencedNoteId.equals(new ObjectId('000000000000000000000000'))) {
                console.log("Funciona");
                rootNotes.push(note);
            }
        });
    
        // Función recursiva para obtener todas las subnotas de una nota dada
        const getSubNotes = (noteId) => {
            const subNotes = [];
            notes.forEach(note => {
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
        rootNotes.forEach(rootNote => {
            rootNote.subNotes = getSubNotes(rootNote._id);
        });
    
        return rootNotes;
    }
    
    async setSharing(noteId, userId, ownerId, accessMode, checkFriendship){
        const areFriends = await checkFriendship(ownerId, userId);
        console.log("Somo amigo?", areFriends)
        if (!areFriends) {
            throw new Error("User is not friend of the owner");
        }
        const db = await database.connectToServer();
        console.log("ownerId", ownerId);
        console.log("noteId", new ObjectId(noteId));
        const objectNoteId = new ObjectId(noteId);
        let updateQuery = {};
        // Determinar qué acción tomar según el valor de access_mode
        if (accessMode === "r") {
            // Si access_mode es "r", agregar userId a readers
            updateQuery = { $addToSet: { readers: userId } };
        } else if (accessMode === "w") {
            // Si access_mode es "w", agregar userId a editors
            updateQuery = { $addToSet: { editors: userId } };
        } else if (accessMode === "n") {
            // Si access_mode es "n", eliminar userId de readers y editors
            updateQuery = { $pull: { readers: userId, editors: userId } };
        }
        
        // Realizar la actualización
        const updateResult = await db.collection("Notes").findOneAndUpdate(
            { 
                _id: objectNoteId,
                user_id: ownerId 
            },
            updateQuery,
            { 
                returnOriginal: false 
            }
        );
        if (!updateResult) {
            throw new Error("Note not found");
        }
        const subNotes = await db.collection("Notes").find({
            user_id: ownerId,
            referencedNoteId: objectNoteId
        }).toArray();
        // Actualizar las subnotas, si existen
        if (subNotes.length > 0) {
            const subNotesUpdateResult = await db.collection("Notes").updateMany(
                { 
                    user_id: ownerId,
                    referencedNoteId: objectNoteId 
                },
                updateQuery
            );

            console.log("Number of subnotes updated:", subNotesUpdateResult.modifiedCount);
        }
        // const updatedNote = updateResult;
        // console.log(updatedNote);
        // updatedNote.subNotes = subNotes;
        // console.log("Con subnotas Updated note:", updatedNote);
    }
    //When you delete a friendship, you must delete the sharing of the notes that the user has shared with the friend
    async setSharingDeletedFriend(userId, friendId){
        const db = await database.connectToServer();
        const notes = await db.collection("Notes").find({ user_id: userId }).toArray();
        notes.forEach(async note => {
            if (note.readers && note.readers.includes(friendId)) {
                const updateQuery = { $pull: { readers: friendId } };
                const updateResult = await db.collection("Notes").findOneAndUpdate(
                    { 
                        _id: note._id,
                        user_id: userId 
                    },
                    updateQuery,
                    { 
                        returnOriginal: false 
                    }
                );
                if (!updateResult) {
                    throw new Error("Note not found");
                }
                const subNotes = await db.collection("Notes").find({
                    user_id: userId,
                    referencedNoteId: note._id
                }).toArray();
                // Actualizar las subnotas, si existen
                if (subNotes.length > 0) {
                    const subNotesUpdateResult = await db.collection("Notes").updateMany(
                        { 
                            user_id: userId,
                            referencedNoteId: note._id 
                        },
                        updateQuery
                    );
        
                    console.log("Number of subnotes updated:", subNotesUpdateResult.modifiedCount);
                }
            }
            if (note.editors && note.editors.includes(friendId)) {
                const updateQuery = { $pull: { editors: friendId } };
                const updateResult = await db.collection("Notes").findOneAndUpdate(
                    { 
                        _id: note._id,
                        user_id: userId 
                    },
                    updateQuery,
                    { 
                        returnOriginal: false 
                    }
                );
                if (!updateResult) {
                    throw new Error("Note not found");
                }
                const subNotes = await db.collection("Notes").find({
                    user_id: userId,
                    referencedNoteId: note._id
                }).toArray();
                // Actualizar las subnotas, si existen
                if (subNotes.length > 0) {
                    const subNotesUpdateResult = await db.collection("Notes").updateMany(
                        { 
                            user_id: userId,
                            referencedNoteId: note._id 
                        },
                        updateQuery
                    );
        
                    console.log("Number of subnotes updated:", subNotesUpdateResult.modifiedCount);
                }
            }
        });
    }
    async getAccessUser(noteId, userId){
        const db = await database.connectToServer();
        const note = await db.collection("Notes").findOne({ _id: new ObjectId(noteId) });
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
    async getSharedNotes(ownerId, userId, checkFriendship){
        const areFriends = await checkFriendship(ownerId, userId);
        if (!areFriends) {
            throw new Error("User is not friend of the owner");
        }
        const db = await database.connectToServer();

        const readerNotes = await db.collection("Notes").find({ user_id: ownerId, readers: { $in: [userId] } }).toArray();
        const writerNotes = await db.collection("Notes").find({ user_id: ownerId, editors: { $in: [userId] } }).toArray();
        const notes = { "readerNotes": readerNotes, "editorNotes": writerNotes };
        return notes;
    }
}

module.exports = new noteModel();