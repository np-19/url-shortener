const serverModule = require("./vercel-build/server.js");
const app = serverModule.default || serverModule;

module.exports = app;
