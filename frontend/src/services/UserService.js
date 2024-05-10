import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/users";


class UserService {
    checkSession() {
        return axios.get(USER_BASE_REST_API_URL + '/checkSession', {withCredentials: true});
    }

    getUsers() {
        return axios.get(USER_BASE_REST_API_URL, {withCredentials: true});
    }

    createUser(newNote) {
        return axios.post(USER_BASE_REST_API_URL + '/create', newNote);
    }

    getUserById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id);
    }

    updateUserById(updatedNote) {
        return axios.put(`${USER_BASE_REST_API_URL}/edit`, updatedNote);
    }

    deleteUserById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`);
    }

    login(credentials){
        return axios.put(USER_BASE_REST_API_URL + '/login', credentials, {withCredentials: true});
    }

    register(user){
        console.log(user);
        return axios.post(USER_BASE_REST_API_URL + '/register', user, {withCredentials: true});
    }

    getProfile(){
        return axios.get(USER_BASE_REST_API_URL + '/getProfile', {withCredentials: true});
    }
    
    logout(){
        return axios.post(USER_BASE_REST_API_URL + '/logout', {withCredentials: true});
    }

}

const UserServiceInstance = new UserService();
export default UserServiceInstance;