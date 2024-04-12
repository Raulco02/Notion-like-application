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
    
    
    
    
    

}

module.exports = new noteModel();