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

    getUserNotes(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getUserNotes?id=' + id, {withCredentials: true});
    }

    updateNoteById(id, updatedNote) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedNote, {withCredentials: true});
    }

    deleteNoteById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`, {withCredentials: true});
    }

}

const NoteServiceInstance = new NoteService();
export default NoteServiceInstance;