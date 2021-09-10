"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "src/config/.env.config" });
// Server Config
var SERVER_NODE_ENV = process.env.SERVER_NODE_ENV || "development";
var SERVER_HOST = process.env.SERVER_HOST || "localhost";
var SERVER_PORT = process.env.SERVER_PORT || 6000;
var SERVER_ACCESS_TOKEN_EXPIRE = process.env.SERVER_ACCESS_TOKEN_EXPIRE || "86400000"; // 1day
var SERVER_REFRESH_TOKEN_EXPIRE = process.env.SERVER_ACCESS_TOKEN_EXPIRE || "31557600000"; // 1yr
var SERVER = {
    SERVER_NODE_ENV: SERVER_NODE_ENV,
    SERVER_HOST: SERVER_HOST,
    SERVER_PORT: SERVER_PORT,
    SERVER_ACCESS_TOKEN_EXPIRE: SERVER_ACCESS_TOKEN_EXPIRE,
    SERVER_REFRESH_TOKEN_EXPIRE: SERVER_REFRESH_TOKEN_EXPIRE
};
// Client Config
var CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
var CLIENT_PORT = process.env.CLIENT_PORT || 5000;
var CLIENT_GOOGLE_AUTH_CLIENT_ID = process.env.CLIENT_GOOGLE_AUTH_CLINENT_ID || "CLINENT_ID";
var CLIENT = {
    CLIENT_HOST: CLIENT_HOST,
    CLIENT_PORT: CLIENT_PORT,
    CLIENT_GOOGLE_AUTH_CLIENT_ID: CLIENT_GOOGLE_AUTH_CLIENT_ID
};
// Mysql config 
var MONGO_USER = process.env.MONGO_USER || "your_username";
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || "your_password";
var MONGO_HOST = process.env.MONGO_HOST || "your_host";
var MONGO_DATABASE = process.env.MONGO_DATABASE || "your_database";
var MONGO = {
    MONGO_USER: MONGO_USER,
    MONGO_HOST: MONGO_HOST,
    MONGO_PASSWORD: MONGO_PASSWORD,
    MONGO_DATABASE: MONGO_DATABASE,
    MONGO_URL: "mongodb://localhost:27017",
};
var JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "khskrhktmgenmrn";
var JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE || "1d";
var JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "rueuuiwiggsjg";
var JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "1y";
var JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "hriagbjregbbfj";
var JWT_RESET_EXPIRE = process.env.JWT_RESET_EXPIRE || "5m";
var JWT_ACTIVATION_SECRET = process.env.JWT_ACTIVATION_SECRET || "ethweharibbgfb";
var JWT_ACTIVATION_EXPIRE = process.env.JWT_ACTIVATION_EXPIRE || "10m";
var JWT_LINKING_ACCESS_SECRET = process.env.JWT_LINKING_ACCESS_SECRET || "ethweharibbgfb";
var JWT_LINKING_ACCESS_EXPIRE = process.env.JWT_LINKING_ACCESS_EXPIRE || "15m";
var JWT_ISSUER = process.env.JWT_ISSUER || SERVER_HOST;
var JWT = {
    JWT_ISSUER: JWT_ISSUER,
    JWT_ACCESS_SECRET: JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRE: JWT_ACCESS_EXPIRE,
    JWT_REFRESH_SECRET: JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRE: JWT_REFRESH_EXPIRE,
    JWT_RESET_SECRET: JWT_RESET_SECRET,
    JWT_RESET_EXPIRE: JWT_RESET_EXPIRE,
    JWT_ACTIVATION_SECRET: JWT_ACTIVATION_SECRET,
    JWT_ACTIVATION_EXPIRE: JWT_ACTIVATION_EXPIRE,
    JWT_LINKING_ACCESS_SECRET: JWT_LINKING_ACCESS_SECRET,
    JWT_LINKING_ACCESS_EXPIRE: JWT_LINKING_ACCESS_EXPIRE
};
/* Global Config module */
var config = {
    SERVER: SERVER,
    MONGO: MONGO,
    CLIENT: CLIENT,
    JWT: JWT
};
exports.default = config;
