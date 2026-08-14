import axios from "axios";
import { BASE_URL } from "../../config/constant";

export const createUser = (data) => {
  return axios.post(BASE_URL + "/distributor/create-user", data);
};

export const disAllUsers = (id) => {
  return axios.get(BASE_URL + `/distributor/users/${id}`);
};

export const disDeleteUser = (id) => {
  return axios.delete(BASE_URL + `/distributor/users/${id}`);
};

export const getPaymentUrl = (data) => {
  return axios.post(BASE_URL + `/distributor/sub/getPaymentUrl`, data);
};

export const subValidatePayment = (data) => {
  return axios.post(BASE_URL + `/distributor/sub/validatePayment`, data);
};

