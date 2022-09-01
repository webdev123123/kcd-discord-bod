import type * as Discord from 'discord.js'
import { isMember } from '../utils/roles'
import { getIntroductionsChannel, getTipsChannel } from './utils'

export function setup(client: Discord.Client) {
	async function welcomeNewMember(member: Discord.GuildMember) {
		const introductions = getIntroductionsChannel(member.guild)
		const tips = getTipsChannel(member.guild)
		if (!introductions) return
		if (!tips) return

		const canMakePrivateThreads = ['TIER_2', 'TIER_3'].includes(
			member.guild.premiumTier,
		)
		const thread = await introductions.threads.create({
			type: canMakePrivateThreads
				? 'GUILD_PRIVATE_THREAD'
				: 'GUILD_PUBLIC_THREAD',
			autoArchiveDuration: 1440,
			name: `Welcome ${member.user.username} 👋`,
			reason: `${member.user.username} joined the server`,
		})
		await thread.members.add(member)
		await thread.send(
			`
Hello ${member}! Welcome to the KCD Discord server!

I'm your friendly robot 🤖. To learn more about me, go ahead and run the command \`/help\` and I'll tell you all about myself.

I'd suggest you checkout ${tips} to learn more about the server and how to get the most out of it.

We'd love to get to know you. Why don't you introduce yourself in ${introductions}? Here's a template you can use for starters:

🌐 I'm from: 
🏢 I work at: 
💻 I work with this tech: 
🍎 I snack on: 
🤪 I really enjoy: 

We hope you enjoy your time here! 🎉
			`.trim(),
		)
	}

	client.on('guildMemberAdd', async member => {
		if (isMember(member)) {
			return welcomeNewMember(member)
		}
	})

	client.on('guildMemberUpdate', async (oldMember, member) => {
		const oldHasMemberRole = isMember(oldMember)
		const newHasMemberRole = isMember(member)
		const isNewMember = newHasMemberRole && !oldHasMemberRole

		if (isNewMember) {
			member = await member.fetch()
			return welcomeNewMember(member)
		}
	})
}
