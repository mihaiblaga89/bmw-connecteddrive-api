/**
 * Logger class for...logging purposes
 *
 * @class Logger
 */
class Logger {
    /**
     * Initializes the logger
     *
     * @param {Boolean} debug
     * @memberof Logger
     */
    init(debug) {
        this.debug = debug;
    }

    /**
     * Whatever it's passed to logger will be console.log'ed if the API instance is set to `debug:true`
     *
     * @param {Array|String|Object} args
     * @memberof Logger
     */
    log(...args) {
        // eslint-disable-next-line no-unused-expressions
        this.debug && console.log('[BMWStatus]:', ...args);
    }
}

export default new Logger();
