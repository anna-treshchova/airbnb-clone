import { ERROR_CODES } from './error.constants.js';

export class AppError extends Error {
    constructor(errConfig, details) {
        const isValidConfig = !!(errConfig?.code && errConfig?.message);

        const errMessage = isValidConfig
            ? errConfig.message
            : `AppError Initialization Failed: Invalid or missing errConfig. Passed: ${JSON.stringify(errConfig)}`;

        super(errMessage);

        this.code = isValidConfig ? errConfig.code : ERROR_CODES.system.INTERNAL_SERVER_ERROR.code;

        this.details = details || null;

        this.isOperational = isValidConfig;

        Error.captureStackTrace(this, this.constructor);
    }
}