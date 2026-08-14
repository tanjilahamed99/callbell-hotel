import { BASE_URL } from "../../config/constant";
import axios from "axios";

const userFreeTrail = ({ planId, id }) => {
  return axios.put(`${BASE_URL}/users/subscription/freeTrail/${id}`, {
    planId,
  });
};

export default userFreeTrail;
