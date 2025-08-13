import { envConfig } from '../config/envConfig.js'

const log = (...args) => {
    if (envConfig.env !== 'production') {
        console.log('[LOG] ', ...args);

    }
};

export default log;