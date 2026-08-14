
import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getLiveKitUrl = () => {
  return axios.get(`${BASE_URL}/users/liveKit`);
};

export default getLiveKitUrl;
