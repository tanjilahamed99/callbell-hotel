import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getWebsiteData = () => {
  return axios.get(`${BASE_URL}/users/website`);
};

export default getWebsiteData;
