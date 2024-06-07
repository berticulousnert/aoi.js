const { Guild } = require("../core/functions.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = Guild(d.data.oldGuild)[option];

    return {
        code: d.util.setCode(data)
    };
};
