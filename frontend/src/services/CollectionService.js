import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/collections";

class CollectionService {
    getCollections() {
        return axios.get(USER_BASE_REST_API_URL);
    }

    createCollection(newCollection) {
        return axios.post(USER_BASE_REST_API_URL + '/create', newCollection);
    }

    getCollectionById(id) {
        return axios.get(USER_BASE_REST_API_URL + '/getById?id=' + id);
    }

    updateCollectionById(id, updatedCollection) {
        return axios.put(`${USER_BASE_REST_API_URL}/${id}/edit`, updatedCollection);
    }

    deleteCollectionById(id) {
        return axios.delete(`${USER_BASE_REST_API_URL}/${id}/delete`);
    }

}

const collectionServiceInstance = new CollectionService();
export default collectionServiceInstance;