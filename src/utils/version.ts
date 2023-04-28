import axios from "axios";

const APIVersion = () => {
  return 1.1;
};

const BaseAPIURL = () => {
  return "https://api.musixmatch.com/ws/1.1/";
};

const ModuleVersion = () => {
  const pkg = require("../../package.json");

  return pkg.version;
};

const apiLatency = async () => {
  const start = performance.now();
  const URL = "https://api.musixmatch.com/ws/1.1/";
  const res = await axios.get(URL);
  const end = performance.now();
  const latency = start - end;

  return latency;
};

const APILatency = async () => {
  return await apiLatency();
};

export { APILatency, APIVersion, BaseAPIURL, ModuleVersion };
