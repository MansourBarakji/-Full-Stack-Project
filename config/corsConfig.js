const allowedOrigins = require('./allowedOrigin')
const ExpressError = require("../utils/express_error");

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new ExpressError('Not allowed by CORS', 403))
        }
    },
    optionsSuccessStatus: 200,
}

module.exports = corsOptions
