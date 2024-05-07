import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/users";

class FriendShipService {

    sendFriendShipRequest(email) {
        return axios.post(USER_BASE_REST_API_URL + '/friendship_request', { email: email }, { withCredentials: true });
    }
    
    getFriendShipRequests() {
        return axios.get(USER_BASE_REST_API_URL + '/get_friendship_requests', { withCredentials: true });
    }

    acceptFriendShipRequest(userId, accepted) {
        return axios.post(USER_BASE_REST_API_URL + '/accept_friendship_request', { userId: userId, accepted: accepted }, { withCredentials: true });
    }

    getUserFriends() {
        return axios.get(USER_BASE_REST_API_URL + '/get_friends', { withCredentials: true });
    }

    getUserDeleteFriend(userId) {
        return axios.delete(USER_BASE_REST_API_URL + '/delete_friend',{ userId: userId }, { withCredentials: true });
    }

}

const FriendShipServiceInstance = new FriendShipService();
export default FriendShipServiceInstance;