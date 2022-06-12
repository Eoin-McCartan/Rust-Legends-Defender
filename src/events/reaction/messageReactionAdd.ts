import { client } from "../..";
const { auto_mod } = client.config.discord;

import { MessageReaction, User } from "discord.js";

import { Event } from "../../structures/Event";

import { noTryAsync } from "no-try";

export default new Event("messageReactionAdd", async (reaction: MessageReaction, user: User) =>
{
    if (user.bot) return;

    if (reaction.message.partial)
        reaction.message.fetch();

    if (auto_mod.settings.blacklisted_emotes.includes(reaction.emoji.name))
    {
        let emote: string = reaction.emoji.name ? reaction.emoji.name : reaction.emoji.id;

        noTryAsync(() => reaction.message.reactions.resolve(emote).remove());
    }
});