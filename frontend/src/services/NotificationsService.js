import axios from "axios";

const USER_BASE_REST_API_URL = "http://localhost:3001/notifications";


class NotificationsService {
    getNotifications(){
        return axios.get(USER_BASE_REST_API_URL, {withCredentials: true});
    }

    deleteNotification(notificationId){
        return axios.delete(USER_BASE_REST_API_URL + "/delete/" + notificationId, {withCredentials: true});
    }

}

const NotificationsServiceInstance = new NotificationsService();
export default NotificationsServiceInstance;