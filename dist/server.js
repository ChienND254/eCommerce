"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./src/index"));
const PORT = process.env.PORT || 3055;
const server = index_1.default.listen(PORT, () => {
    console.log('The application is listening on port 3000!');
});
process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
    // notify.ping('')
});
