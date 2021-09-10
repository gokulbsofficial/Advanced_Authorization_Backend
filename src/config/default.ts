import dotenv from 'dotenv';
dotenv.config({ path: "src/config/.env.config" });

// Server Config
const SERVER_NODE_ENV = process.env.SERVER_NODE_ENV || "development"
const SERVER_HOST = process.env.SERVER_HOST || "localhost"
const SERVER_PORT = process.env.SERVER_PORT || 6000
const SERVER_ACCESS_TOKEN_EXPIRE = process.env.SERVER_ACCESS_TOKEN_EXPIRE || "86400000" // 1day
const SERVER_REFRESH_TOKEN_EXPIRE = process.env.SERVER_ACCESS_TOKEN_EXPIRE || "31557600000" // 1yr

const SERVER = {
    SERVER_NODE_ENV,
    SERVER_HOST,
    SERVER_PORT,
    SERVER_ACCESS_TOKEN_EXPIRE,
    SERVER_REFRESH_TOKEN_EXPIRE
}

// Client Config
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';
const CLIENT_PORT = process.env.CLIENT_PORT || 5000
const CLIENT_GOOGLE_AUTH_CLIENT_ID = process.env.CLIENT_GOOGLE_AUTH_CLINENT_ID || "CLINENT_ID";

const CLIENT = {
    CLIENT_HOST,
    CLIENT_PORT,
    CLIENT_GOOGLE_AUTH_CLIENT_ID
}

// Mysql config 
const MONGO_USER = process.env.MONGO_USER || "your_username"
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "your_password"
const MONGO_HOST = process.env.MONGO_HOST || "your_host"
const MONGO_DATABASE = process.env.MONGO_DATABASE || "your_database"

const MONGO = {
    MONGO_USER,
    MONGO_HOST,
    MONGO_PASSWORD,
    MONGO_DATABASE,
    MONGO_URL: "mongodb://localhost:27017",

}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "khskrhktmgenmrn"
const JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE || "1d"

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "rueuuiwiggsjg"
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "1y"

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "hriagbjregbbfj"
const JWT_RESET_EXPIRE = process.env.JWT_RESET_EXPIRE || "5m"

const JWT_ACTIVATION_SECRET = process.env.JWT_ACTIVATION_SECRET || "ethweharibbgfb"
const JWT_ACTIVATION_EXPIRE = process.env.JWT_ACTIVATION_EXPIRE || "10m"

const JWT_LINKING_ACCESS_SECRET = process.env.JWT_LINKING_ACCESS_SECRET || "ethweharibbgfb"
const JWT_LINKING_ACCESS_EXPIRE = process.env.JWT_LINKING_ACCESS_EXPIRE || "15m"

const JWT_ISSUER = process.env.JWT_ISSUER || SERVER_HOST

const JWT = {
    JWT_ISSUER,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRE,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRE,
    JWT_RESET_SECRET,
    JWT_RESET_EXPIRE,
    JWT_ACTIVATION_SECRET,
    JWT_ACTIVATION_EXPIRE,
    JWT_LINKING_ACCESS_SECRET,
    JWT_LINKING_ACCESS_EXPIRE
}

/* Global Config module */
const config = {
    SERVER,
    MONGO,
    CLIENT,
    JWT
}
export default config;