const { EmbedBuilder } = require("discord.js");

class EmbedBuilderUtil {
    static createBasicEmbed(title, description) {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#6300ff')
            .setAuthor({
                name: 'The 1% Journey ♠',
                iconURL: 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636'
            })
            .setFooter({
                text: 'The 1% Journey ♠', 
                iconURL: 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636'
            })
            .setTimestamp();
    }

    static createCustomEmbed(title, description, color, author, footer, thumbnailimg) {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color || '#6300ff')
            .setAuthor({
                name: author.name || 'The 1% Journey ♠',
                iconURL: author.iconURL || 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636'
            })
            .setFooter({
                name: footer.text || 'The 1% Journey ♠',
                iconURL: footer.iconURL || 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636'
            })
            .setThumbnail(thumbnailimg || 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636')
            .setTimestamp();
    }
}

module.exports = EmbedBuilderUtil;
