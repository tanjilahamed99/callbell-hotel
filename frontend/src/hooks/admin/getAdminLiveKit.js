import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getAllLiveKit = (id, email) => {
  return axios.get(`${BASE_URL}/admin/livekit/${id}/${email}`);
};

export default getAllLiveKit;
