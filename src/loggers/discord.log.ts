import 'dotenv/config';
import { Client, TextChannel, GatewayIntentBits } from 'discord.js';

const { CHANNELID_DISCORD, DISCORD_TOKEN } = process.env;

class LoggerService {
    private client: Client;
    private channelId: string;

    constructor() {
        if (!CHANNELID_DISCORD || !DISCORD_TOKEN) {
            throw new Error('Missing necessary environment variables');
        }

        this.channelId = CHANNELID_DISCORD;

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.client.once('ready', () => {
            if (!this.client.user) return;
            console.log(`Ready! Logged in as ${this.client.user.tag}`);
        });

        this.client.login(DISCORD_TOKEN);

        this.client.on('error', console.error); // Log any client errors
    }

    async sendToFormatCode(logData: any) {
        const {code , message = 'this is some additional information about the code.', title = 'code example'} = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ]
        }

        this.sendToMessage(codeMessage)
    }

    async sendToMessage(message: any) {
        const channel = this.client.channels.cache.get(this.channelId);

        if (!channel || !(channel instanceof TextChannel)) {
            throw new Error(`Channel not found or not a text channel: ${this.channelId}`);
        }

        await channel.send(message).catch(e => console.error(e));
    }
}

export default new LoggerService();
