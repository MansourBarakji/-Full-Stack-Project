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
    credentials: true, // Allow credentials
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}

module.exports = corsOptions
