const Interpreter = require("../../core/interpreter.js");
/**
 * @param {import('../../classes/AoiClient.js')} client
 * @param {import('discord.js').ApplicationCommandPermissions} applicationCommandData
 */
module.exports = async (applicationCommandData, client) => {
    const cmds = client.cmd?.applicationCmdPermissionsUpdate.V();
    if (!cmds) return;
    let guildChannel;
    const data = {
        guild: client.guilds.cache.get(applicationCommandData.guildId),
        client: client
    };
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { newApplicationCommandData: applicationCommandData }, guildChannel);
    }
};
