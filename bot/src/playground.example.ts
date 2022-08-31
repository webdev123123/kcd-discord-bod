// copy/paste this into a sibling file called `playground.ts`
// which is gitignored so you can make changes without committing them
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import path from 'path'
import * as Discord from 'discord.js'
import dotenv from 'dotenv'
import invariant from 'tiny-invariant'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const { DISCORD_BOT_TOKEN, KCD_GUILD_ID } = process.env

invariant(DISCORD_BOT_TOKEN, 'DISCORD_BOT_TOKEN is required')
invariant(KCD_GUILD_ID, 'KCD_GUILD_ID is required')

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
})

client.on('ready', async () => {
	console.log('ready to go')
	const guild = client.guilds.cache.get(KCD_GUILD_ID)
	if (!guild) throw new Error('Could not find KCD guild')
})

console.log('logging in')
void client.login(DISCORD_BOT_TOKEN)
