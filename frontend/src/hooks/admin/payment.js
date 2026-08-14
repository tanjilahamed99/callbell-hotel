import axios from "axios";
import { BASE_URL } from "../../config/constant";

export const updatePaymentCredentials = ({ userId, email, data }) => {
  return axios.put(`${BASE_URL}/admin/paygic/set/${userId}/${email}`, data);
};

export const getDepartmentUsers = async () => {
  // TODO: confirm this matches your real endpoint/base URL pattern (same as getAllUsers)
  return axios.get(`${BASE_URL}/admin/departments`);
};

export const createDepartmentUser = async (payload) => {
  return axios.post(`${BASE_URL}/admin/departments`, payload);
};

export const deleteDepartmentUser = async (id) => {
  return axios.delete(`${BASE_URL}/admin/departments/${id}`);
};

export const updateDepartmentUser = async (id, payload) => {
  return axios.patch(`${BASE_URL}/admin/departments/${id}`, payload);
};
