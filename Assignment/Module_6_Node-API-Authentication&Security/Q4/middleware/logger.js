const chalk = require('chalk');

module.exports = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(chalk.blue(`[${timestamp}] ${req.method} ${req.url}`));
    next();
};