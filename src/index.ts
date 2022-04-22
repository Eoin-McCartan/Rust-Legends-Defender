import Config from "../config";
const config: Config = require("../config.json");

import mongoose from "mongoose";

import { RLClient } from "./structures/Client";

mongoose
    .connect(config.mongoose.address, <mongoose.ConnectOptions> {
        dbName: config.mongoose.database,
    })
    .then(async () => console.log("[MongoDB] Connected"))
    .catch(console.error);

export const client = new RLClient();

client.start();