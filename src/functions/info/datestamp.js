module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    data.result = Date.now();

    return {
        code: d.util.setCode(data)
    };
}