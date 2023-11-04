import axios from "axios";

const request = axios.create({
  baseURL: "https://65020ccf736d26322f5cae42.mockapi.io/",
  timeout: 25000,
});

request.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default request;
