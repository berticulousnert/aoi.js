module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, automodRuleName, force = true] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);

    const autoModerationRules = await guild.autoModerationRules.fetch({ force: force, cache: force === false ? true : false });
    const result = autoModerationRules.find(rule => rule.name === automodRuleName || rule.id === automodRuleName);

    data.result = result.id;

    return {
        code: d.util.setCode(data),
    };
}
