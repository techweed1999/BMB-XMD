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
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUZ6WGkrN0Q2bWJHK3J1RTlGS1RrcjJrWmdaTmFwdTNQYzlDL3dxQ0NFQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoienIyQW9MM3ZyeTRObW1MK1RGNElMd1RXQUIyU2VSVjN6UVZnT00zcTdDND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjS05tcW9WZHozVjZLbXgzeitFTkJTMEF2UFBSeXdkeGEzdnNFSG5XSjBvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLZ0YzbCtWT2VHZWdWY0FwckRMV1JYK0swejFkdnk0SC9CUENUcFVhRUFZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndJMVd2bnFUb2ZjcWtFT1JUMjIxVEE4eHFlcTZXWmpKaENFelJrOFM4R289In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkYwRWhsTmVsaXNPbEE3cFp0VDV4Y0dVS1FIN1hFUUpmYUYvaUxvZzd6RGc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0E4OXlpMUZwRnduZk1mQ1Jsci9FZDhjbmNLdmxOV3lmTEZCUmxyU3BrUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNHpjOERPZm13TEo1MkRRK2ZnY1F4Q1ZNc081am1sQkpXNWxEQTRTSWRTOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkV2T0M1a2JZSWdvVWsyaGI1ZllXVHRqM1dMMGh6OVZyUWNmUDIrZmhrWVJhejBXbUFpWUczY0NQYURxamU2TzBkcTBjUnhqUlI5bzlKd2dhaU9kK2pnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTEwLCJhZHZTZWNyZXRLZXkiOiJoYnora2NTbE9oZkxwZllSRzAzc1ZtNEhKVTI2Rjl3akVWaTY1TzV5WEtjPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjUwOTQ4MzE2NDM5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkNCQzY4OTY3NDEzNTVFMjdBMkRCNjVDN0RCMDBFN0RGIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTY0MDA2NzZ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjUwOTQ4MzE2NDM5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjdERDNFQUZFOTlGMEU4NjBFNjFCRjdDNzZEQzJDQjE2In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTY0MDA2Nzl9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IktZRUVCS0s4IiwibWUiOnsiaWQiOiI1MDk0ODMxNjQzOTo1QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IvCdka3wnZKT8J2ShvCdkoYg8J2Ru/CdkobwnZKE8J2SiSDwnZG58J2SkPCdkoriiIfOlCIsImxpZCI6IjEyMTgxODc2MTQyMDg0NDo1QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUGI5NE9ZRkVKT1l3c1VHR0FnZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWEZrT0RSQnZTRENsTXJydTV6OERpWXQ0aHgwMmZadk9WRVNVczVWenJFYz0iLCJhY2NvdW50U2lnbmF0dXJlIjoibVZKM0VYNzd0OGp0YzNCRUsyVVNxYk5VMitMSk1VT0s1UjQwcVgrSjN2Z1ZtcG9ZVXJ0WHBxSFFOWkVQeXhxNGU2cThianNmRTBPem51dFY5R3RhQlE9PSIsImRldmljZVNpZ25hdHVyZSI6ImFzRGZEQmFkaEYzQnhCTmdGMGFuZDhtdjNPOTlSY3EwaWpSVGJEV2NSdVJpQlB4bm9KN1NsUlUwelM4bDZYTWFpbG5KYkQvbzFBK3RUbXUxQm1EbGdnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNTA5NDgzMTY0Mzk6NUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWeFpEZzBRYjBnd3BUSzY3dWMvQTRtTGVJY2RObjJiemxSRWxMT1ZjNnhIIn19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQTBJQlE9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTY0MDA2NzMsImxhc3RQcm9wSGFzaCI6IjJQMVloZiIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBRzAxIn0=',
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
