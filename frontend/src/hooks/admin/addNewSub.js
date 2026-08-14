import axios from "axios";
import { BASE_URL } from "../../config/constant";

const addNewWebsiteData = (id, email, data) => {
  return axios.post(`${BASE_URL}/admin/website/add/${id}/${email}`, data);
};

export default addNewWebsiteData;
