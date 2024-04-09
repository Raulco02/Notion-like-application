import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/users";

class UserService {
    getUsers() {
        return axios.get(USER_BASE_REST_API_URL);
    }

    createUser(newNote) {
        return axios.post(USER_BASE_REST_API_URL + '/create', newNote);
    }

    getUserById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id);
    }

    updateUserById(id, updatedNote) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedNote);
    }

    deleteUserById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`);
    }

    login(){
        return axios.post(USER_BASE_REST_API_URL + '/login');
    }

    register(){
        return axios.post(USER_BASE_REST_API_URL + '/register');
    }

}

const UserServiceInstance = new UserService();
export default UserServiceInstance;