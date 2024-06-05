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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverLoad = exports.countConnect = void 0;
const console_1 = require("console");
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const process_1 = __importDefault(require("process"));
const _SECONDS = 5000;
const countConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    const numConnections = mongoose_1.default.connections.length;
    (0, console_1.log)(`Number of connections: ${numConnections}`);
});
exports.countConnect = countConnect;
//check overload
const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose_1.default.connections.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process_1.default.memoryUsage().rss;
        //Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;
        (0, console_1.log)(`Active connections:: ${numConnections}`);
        (0, console_1.log)(`Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
        if (numConnections > maxConnections) {
            (0, console_1.log)(`Connection overload detected`);
        }
    }, _SECONDS); // monitor 5s 
};
exports.checkOverLoad = checkOverLoad;
