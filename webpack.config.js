module.exports = function (env) {

    const compileEntries = [];

    return require(`./webpack.${env}.js`)(env, compileEntries);
}