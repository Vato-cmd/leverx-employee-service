"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashPassword(password) {
    const hashed = await bcrypt_1.default.hash(password, 12);
    console.log("Hashed password:", hashed);
}
hashPassword("your-password-here");
