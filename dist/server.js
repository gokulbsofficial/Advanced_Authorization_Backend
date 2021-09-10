"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Installed Imported Modules */
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
/* Custom Imported Modules */
var default_1 = __importDefault(require("./config/default"));
var connection_1 = __importDefault(require("./config/connection"));
var logger_1 = __importDefault(require("./config/logger"));
var errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
var errorResponse_1 = __importDefault(require("./classes/errorResponse"));
var adminAuthRouter_1 = __importDefault(require("./routes/adminAuthRouter"));
var userAuthRouter_1 = __importDefault(require("./routes/userAuthRouter"));
var adminRouter_1 = __importDefault(require("./routes/adminRouter"));
var userRouter_1 = __importDefault(require("./routes/userRouter"));
/* Config Variables */
var app = express_1.default();
var server = http_1.default.createServer(app);
var NAMESPACE = "Server";
var _a = default_1.default.SERVER, SERVER_PORT = _a.SERVER_PORT, SERVER_HOST = _a.SERVER_HOST;
var _b = default_1.default.MONGO, MONGO_HOST = _b.MONGO_HOST, MONGO_DATABASE = _b.MONGO_DATABASE, MONGO_USER = _b.MONGO_USER;
/* Middlewares */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(cors_1.default({
    origin: ["*"],
    credentials: true,
    allowedHeaders: ["Authorization"],
}));
/* MONGO connection */
connection_1.default.connect(function (err) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (err) {
            logger_1.default.error(NAMESPACE, err.message, err);
        }
        else {
            logger_1.default.info(NAMESPACE, "MONGO DATABASE:[" + MONGO_DATABASE + "] connected in HOST:[" + MONGO_HOST + "] by USER:[" + MONGO_USER + "]");
        }
        return [2 /*return*/];
    });
}); });
/* All Api Logs */
app.use(function (req, res, next) {
    logger_1.default.info(NAMESPACE, " METHOD:[" + req.method + "] - URL:[" + req.url + "] - IP:[" + req.socket.remoteAddress + "]");
    res.on("finish", function () {
        logger_1.default.info(NAMESPACE, " METHOD:[" + req.method + "] - URL:[" + req.url + "] - STATUS:[" + res.statusCode + "] - IP:[" + req.socket.remoteAddress + "]");
    });
    next();
});
/* Routes */
app.use("/api/v1/auth/admin", adminAuthRouter_1.default);
app.use("/api/v1/auth/user", userAuthRouter_1.default);
app.use("/api/v1/admin", adminRouter_1.default);
app.use("/api/v1/user", userRouter_1.default);
/* 404 Route */
app.use("*", function (req, res, next) {
    return next(new errorResponse_1.default("Not Found", 404));
});
/* Error Handling */
app.use(errorHandler_1.default);
/* SERVER listening */
server.listen(SERVER_PORT);
server.on("listening", function () {
    logger_1.default.info(NAMESPACE, "Server listening in HOST:[" + SERVER_HOST + "] PORT:[" + SERVER_PORT + "]");
});
