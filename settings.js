const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('settings.env'))
    require('dotenv').config({ path: __dirname + '/settings.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia05MNS9zaDhnb0xCa0o2ZWNiaSs1VUZYS3RsUDJmVU9kMTlndXdJaStGZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMDRmNTdMb2treHRTZXBHMldNeTZ1dkxpVzEzc0xmN2VKazUxeVgxMCtDUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFT01KS1lDLyswNVlGeENGYVIrM2JINGY2b2hXcnM3OEZsZUNMLzd5dDF3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpSmpUb21vT2tSWjRpK2N4RVZlcVl3RmloY3BFRXJaQlpRYTF4UWFHdUFZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFOSUtrMVZtdWlIdzZValhjZHNPbldiTHFuby83bmZkTW5PbndXK05sR0k9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZzU2ZRUUZSdXpSclZxbDFJWGgrQzlySEZIeit2bElNNTBINTdCNkVSRjA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic01zSGFuZnlCNGlEbkF2dzN5N3NKK1ZnVEIxNENVQXVReUJjRmppL1ozWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia3BkVHh2a1lYcUczUU1nOTM0Nys0dFFaNk1KYVV5WFR2dGZlRzZiN0dtND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFGNFdWT0tkOWlYQkhzOUR5MHphVHJ3WkhXKzlva0pWbTB1UUdCaXZCbStsSUt4MXZBczdCdlhwNXAyeXdMeHdEcDhFbGVzeXJVclN6dGgrSHAwTGl3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjQsImFkdlNlY3JldEtleSI6IllXRVd0Y3o2b2FhVHhab0JrSUlRTDdoRkFGNUdSV2VTTjJpVGtRWEJRQmc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTM3Nzk1NjQxNzlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRDgwOENFOEZEMjIzMkFFQUJGRDgyQkFCNTIyMTIzQUIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1NjA1MzE2MH0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTM3Nzk1NjQxNzlAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiNkQxNzg5NzUxRkVGNkJEMEU0ODQyQ0M0NjMzNDdDMjQifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1NjA1MzE2MX1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiUU5GNUhTN1oiLCJtZSI6eyJpZCI6IjkzNzc5NTY0MTc5OjE5QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IsK58J2XuvCdl7bwnZe78J2XseKLhvCdl7rwnZeu8J2YgPCdmIHwnZey8J2Xv8Kz2a3NnCIsImxpZCI6IjExNzY5OTkwNDU0NDgyOToxOUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xHVDRhMERFSmY5ck1VR0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlQ5WTRmOWFGS01NbmpucnplVmliTEVwalU4cU1IZmJwekZ1NE9uV3g4QWs9IiwiYWNjb3VudFNpZ25hdHVyZSI6IlRIYlRCbGJKeDhjcUlsaE5ZZ2NEQW96MHVxbU1CMzJuWnF6ME5lb3RHZ2phNFdUQXNoSGQzd3NiQ1E4dGVzMmM2enRKWDRkalZkeU9jd2t6b1ZkaEF3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiJXbnhQS0tXSHJZVWxPRWc2R0lkWXRXYS96NGtEUVhDbHlLSFRXSlhVc3I4R3pkNi85YVgzNkJTWkZzTnZ0L1B6V245STY0R24ySERVbEFwSUdjeG9oUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkzNzc5NTY0MTc5OjE5QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlUvV09IL1doU2pESjQ1NjgzbFlteXhLWTFQS2pCMzI2Y3hidURwMXNmQUoifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNCSUlCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1NjA1MzE1NiwibGFzdFByb3BIYXNoIjoiMkc0QW11IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMeGcifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "B.M.B-TECH",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255767862457",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8qq3l4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY, 
    WARN_COUNT : process.env.WARN_COUNT || '3',
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    CHAT_BOT: process.env.CHAT_BOT || 'yes',
    AUDIO_REPLY: process.env.AUDIO_REPLY || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway"
        : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
