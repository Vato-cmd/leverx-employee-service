"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDB = readDB;
exports.writeDB = writeDB;
const lowdb_1 = require("lowdb");
const node_1 = require("lowdb/node");
const adapter = new node_1.JSONFile("db.json");
const db = new lowdb_1.Low(adapter, { employees: [] });
async function readDB() {
    await db.read();
    return db.data;
}
async function writeDB(data) {
    db.data = data;
    await db.write();
}
exports.default = db;
