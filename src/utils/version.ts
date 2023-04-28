import axios from "axios";
import { formatLatency } from "./formatter";

type version = number;
type url = string;
type moduleVer = any;
type latencyRawType = string;
type latency = Promise<latencyRawType>;

/**
 *
 * @returns {version} API Version
 *
 * The Version of the API.
 */
const APIVersion = (): version => {
  return 1.1;
};

/**
 *
 * @returns {url} Base URL of API
 *
 * The Base API URL used by this module.
 */
const BaseAPIURL = (): url => {
  return "https://api.musixmatch.com/ws/1.1/";
};

/**
 *
 * @returns {moduleVer} Module version
 *
 * The version of module.
 */

const ModuleVersion = (): moduleVer => {
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

/**
 *
 * @returns {latency} API Latency
 *
 * The API Latency
 */

const APILatency = async (): latency => {
  return formatLatency(await apiLatency());
};

export { APILatency, APIVersion, BaseAPIURL, ModuleVersion };
