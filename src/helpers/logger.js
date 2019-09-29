class Logger {
    initialize(debug) {
        this.debug = debug;
    }

    log(...args) {
        // eslint-disable-next-line no-unused-expressions
        this.debug && console.log('[BMWStatus]:', ...args);
    }
}

export default new Logger();
