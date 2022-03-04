export class Logger {

    static TAG = 'SYMBL';

    static info(message, metadata) {
        console.info(`%c ${this.TAG} :: ${message}`, 'color: blue', metadata ? metadata : '');
    }

    static debug(message, metadata) {
        console.debug(`${this.TAG} :: ${message}`, metadata ? metadata : '');
    }

    static error(message, metadata) {
        console.error(`${this.TAG} :: ${message}`, metadata ? metadata : '');
    }
}