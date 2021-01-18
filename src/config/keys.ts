import dotenv from 'dotenv';
import fs from 'fs';

const path = `.env.${process.env.NODE_ENV}`

if (fs.existsSync(path)) {
    dotenv.config({ path })
} else {
    dotenv.config()
}

export default {
    firebase: {
        serviceAccount: process.env.SERVICE_ACCOUNT_PATH,
        importFeedsBucket: process.env.IMPORT_FEEDS_BUCKET,
    },
    mongoUri: process.env.MONGO_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tokenHost: process.env.TOKEN_HOST,

    sps: {
        clientId: process.env.SPS_CLIENT_ID,
        clientSecret: process.env.SPS_CLIENT_SECRET,
        refreshToken: process.env.SPS_REFRESH_TOKEN,
        redirectUri: process.env.SPS_REDIRECT_URI,
    }
};



