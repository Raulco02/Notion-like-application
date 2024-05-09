import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/notes";

class NoteService {
    getNotes() {
        return axios.get(USER_BASE_REST_API_URL, {withCredentials: true});
    }

    createNote(newNote) {
        return axios.post(USER_BASE_REST_API_URL + '/create', newNote, {withCredentials: true});
    }

    getNoteById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id, {withCredentials: true});
    }

    getUserNotes(referencedNoteId) {
        return axios.get(USER_BASE_REST_API_URL + '/getUserNotes?referencedNoteId=' + referencedNoteId, {withCredentials: true});
    }

    updateNoteById(id, updatedNote) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedNote, {withCredentials: true});
    }

    deleteNoteById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`, {withCredentials: true});
    }

    //Sharing:
    getAccessUser(referencedNoteId) {
        return axios.get(USER_BASE_REST_API_URL + '/getAccessUser/' + referencedNoteId, {withCredentials: true});
    }

    getAccessUsers(referencedNoteId) {
        return axios.get(USER_BASE_REST_API_URL + '/getAccessUsers/' + referencedNoteId, {withCredentials: true});
    }

    setSharing(userId, noteId, accessMode) {
        return axios.post(USER_BASE_REST_API_URL + '/setSharing', { userId: userId, noteId: noteId, accessMode: accessMode }, { withCredentials: true });
    }

    getSharedNotes(userId) {
        return axios.get(USER_BASE_REST_API_URL + '/getSharedNotes/' + userId, {withCredentials: true});
    }

}

const NoteServiceInstance = new NoteService();
export default NoteServiceInstance;