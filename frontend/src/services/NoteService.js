import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/notes";

class NoteService {
    getNotes() {
        return axios.get(USER_BASE_REST_API_URL);
    }

    getNoteById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id);
    }

    updateNoteById(id, updatedNote) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedNote);
    }

}

const NoteServiceInstance = new NoteService();
export default NoteServiceInstance;