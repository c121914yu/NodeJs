"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const add = (a, b) => a + b;
app.get("/", (req, res) => {
    console.log(add(5, 6));
    res.send("hello world!");
});
app.listen(4000, () => console.log("服务器运行"));
