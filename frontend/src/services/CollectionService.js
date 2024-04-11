import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/collections";

class CollectionService {
    getCollections() {
        return axios.get(USER_BASE_REST_API_URL, {withCredentials: true});
    }
    getUserCollections() {
        return axios.get(USER_BASE_REST_API_URL + '/getUserCollections', {withCredentials: true});
    }
    createCollection(newCollection) {
        return axios.post(USER_BASE_REST_API_URL + '/create', newCollection, {withCredentials: true});
    }

    getCollectionById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id, {withCredentials: true});
    }

    updateCollectionById(id, updatedCollection) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedCollection, {withCredentials: true});
    }

    deleteCollectionById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`, {withCredentials: true});
    }

}

const collectionServiceInstance = new CollectionService();
export default collectionServiceInstance;