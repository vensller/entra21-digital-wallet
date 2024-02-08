import axios, { AxiosResponse } from "axios";

export const client = axios.create({
  baseURL: "http://localhost:3000",
});

client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      window.location.replace("/html/index.html");
    }
    return error;
  }
);

export const validateAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("/html/index.html");
  } else {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};
