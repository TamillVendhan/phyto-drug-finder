import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost/phyto-drug-finder/backend/api/",
});

export default API;
