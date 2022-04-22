import { Event } from "../.././structures/Event";

export default new Event("ready", async (client) =>
{
    console.log("[Discord] Logged in as", client.user.tag);
});