"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const logger = (0, morgan_1.default)('dev');
//inti middleware
app.use(logger);
// app.use(morgan('combined'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));
app.use((0, helmet_1.default)());
// app.use(compression())
//init routes
app.get('/', (req, res) => {
    const str = 'Hello sadasdasds';
    return res.status(200).json({
        message: 'done',
        metadata: str.repeat(10000)
    });
});
//handle error
exports.default = app;
