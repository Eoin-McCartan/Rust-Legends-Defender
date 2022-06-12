export default interface Config {
    discord: {
        token: string;
        prefix: string;

        guilds: {
            [guildId: string]: {
                whitelisted_urls: string[];
                servers: string[];

                channels: {
                    [channelName: string]: string;
                },
                
                roles: {
                    [roleName: string]: string;
                },

                responses: {
                    [question: string]: {
                        channel_name: string;
                        message: string;
                    }
                }
            }
        },

        auto_mod: {
            settings: {
                max_new_lines: number;
                blacklisted_emotes: string[];
            }
        }

        anti_raid: {
            enabled: boolean;
            joins: {
                enabled: boolean;
                trigger: number;
                punishment: string;
                time: number;
            },

            new_accounts: {
                enabled: boolean;
                trigger: number;
                punishment: string;
                time: number;
                account_age: number;
            }
        }
    },

    mongoose: {
        address: string;
        database: string;
    }
}