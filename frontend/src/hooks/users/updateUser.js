import { BASE_URL } from "../../config/constant";
import axios from "axios";

const updateUser = ({ id, data }) => {
  return axios.put(`${BASE_URL}/users/update/${id}`, data);
};

export default updateUser;

export const updateContactList = ({ id, data }) => {
  return axios.put(`${BASE_URL}/users/contact/${id}`, data);
};

export const getContactList = (id) => {
  return axios.get(`${BASE_URL}/users/contact/${id}`);
};

export const getUniqueContact = (id) => {
  return axios.get(`${BASE_URL}/users/contact/${id}/unique`);
};

export const blockGest = (userId, gestId) => {
  return axios.post(`${BASE_URL}/users/gest/block/${gestId}/${userId}`);
};

export const unblockGest = (userId, gestId) => {
  return axios.post(`${BASE_URL}/users/gest/unblock/${gestId}/${userId}`);
};
