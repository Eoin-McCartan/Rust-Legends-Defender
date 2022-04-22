export default interface Config {
    discord: {
        token: string;
        prefix: string;

        guilds: {
            [guildId: string]: {
                channels: {
                    [channelName: string]: string
                }
            }
        }
    },

    mongoose: {
        address: string;
        database: string;
    }
}