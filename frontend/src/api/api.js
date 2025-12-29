import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost/phyto-drug-finder/backend/api/",
  baseURL: "https://hcctrichy.ac.in/phyto-drug-finder-main/backend/api/",
});

export default API;
