const { bmbtz } = require("../devbmb/bmbtz");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../settings');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
//const { repondre } = require(__dirname + "/../devbmb/context");

const catbox = new Catbox();

// FGG CONSTANTS
const fgg = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: `🟢 Bmb Tech Info 🟢`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;BELTAH TECH 255767862457;;;\nFN:B.M.B-TECH\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    },
  },
};

/**
 * Construct contextInfo object for messages.
 */
function getContextInfo(title = '', userJid = '', thumbnailUrl = '') {
  try {
    return {
      mentionedJid: [userJid],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "Bmb Tech Updates",
        serverMessageId: Math.floor(100000 + Math.random() * 900000),
      },
      externalAdReply: {
        showAdAttribution: true,
        title: conf.BOT || 'B.M.B-TECH DOWNLOADS',
        body: "🟢 Powering Smart Automaton 🟢",
        thumbnailUrl: conf.URL || '',
        sourceUrl: conf.GURL || 'https://wa.me/255767862487',
      },
    };
  } catch (error) {
    console.error(`Error in getContextInfo: ${error.message}`);
    return {};
  }
}

// Function to upload a file to Catbox and return the URL
async function uploadToCatbox(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }
    const uploadResult = await catbox.uploadFile({ path: filePath });
    return uploadResult || null;
  } catch (error) {
    console.error('Catbox upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// YouTube search helper
async function searchYouTube(query) {
  try {
    const searchResults = await ytSearch(query);
    if (!searchResults?.videos?.length) {
      throw new Error('No video found for the specified query.');
    }
    return searchResults.videos[0];
  } catch (error) {
    console.error('YouTube search error:', error);
    throw new Error(`YouTube search failed: ${error.message}`);
  }
}

// Download media from the unified API
async function downloadFrombmbtzApi(url, type) {
  try {
    const apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl, { timeout: 20000 });
    if (!res.data?.result) throw new Error('No result found from API.');
    if (type === "audio" && !res.data.result.audio) throw new Error('Audio URL not found.');
    if (type === "video" && !res.data.result.video) throw new Error('Video URL not found.');
    return res.data.result;
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

// Universal play command (audio)
bmbtz({
  nomCom: "play3",
  aliases: ["song", "audio", "mp3"],
  categorie: "download",
  reaction: "🎵"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, userJid } = commandOptions;
  try {
    if (!arg[0]) {
      return repondre(zk, dest, ms, "Please provide a song name or YouTube link.");
    }
    const query = arg.join(" ");
    const video = await searchYouTube(query);

    await zk.sendMessage(dest, {
      text: `B.M.B-TECH Downloading audio... This may take a moment...`,
      contextInfo: getContextInfo(`Downloading Requested Audio`, userJid, video.thumbnail)
    }, { quoted: fgg });

    // Download from API
    const result = await downloadFrombmbtzApi(video.url, "audio");
    const { title, audio, thumbnail } = result;

    await zk.sendMessage(dest, {
      audio: { url: audio }, mimetype: 'audio/mp4',
      caption: `🎵 *${title}*`,
      contextInfo: getContextInfo(title, userJid, thumbnail || video.thumbnail)
    }, { quoted: ms });

  } catch (error) {
    console.error('Download error:', error);
    repondre(zk, dest, ms, `Failed: ${error.message}`);
  }
});

// Universal video command (video)
bmbtz({
  nomCom: "video3",
  aliases: ["film", "mp4"],
  categorie: "download",
  reaction: "🎥"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, userJid } = commandOptions;
  try {
    if (!arg[0]) {
      return repondre(zk, dest, ms, "Please provide a video name or YouTube link.");
    }
    const query = arg.join(" ");
    const video = await searchYouTube(query);

    await zk.sendMessage(dest, {
      text: `B.M.B-TECH Downloading video... This may take a moment...`,
      contextInfo: getContextInfo(`Downloading Requested Video`, userJid, video.thumbnail)
    }, { quoted: fgg });

    // Download from API
    const result = await downloadFrombmbtzApi(video.url, "video");
    const { title, video: videoUrl, thumbnail } = result;

    await zk.sendMessage(dest, {
      video: { url: videoUrl }, mimetype: 'video/mp4',
      caption: `🎥 *${title}*`,
      contextInfo: getContextInfo(title, userJid, thumbnail || video.thumbnail)
    }, { quoted: ms });

  } catch (error) {
    console.error('Download error:', error);
    repondre(zk, dest, ms, `Failed: ${error.message}`);
  }
});

// URL upload command
bmbtz({
  nomCom: 'tourl',
  categorie: "download",
  reaction: '👨🏿‍💻'
}, async (dest, zk, commandOptions) => {
  const { msgRepondu, userJid, ms } = commandOptions;
  try {
    if (!msgRepondu) {
      return repondre(zk, dest, ms, "Please mention an image, video, or audio.");
    }

    const mediaTypes = [
      'videoMessage', 'gifMessage', 'stickerMessage',
      'documentMessage', 'imageMessage', 'audioMessage'
    ];

    const mediaType = mediaTypes.find(type => msgRepondu[type]);
    if (!mediaType) {
      return repondre(zk, dest, ms, "Unsupported media type.");
    }

    const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu[mediaType]);
    const fileUrl = await uploadToCatbox(mediaPath);
    fs.unlinkSync(mediaPath);

    await zk.sendMessage(dest, {
      text: `✅ Here's your file URL:\n${fileUrl} \n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙱.𝙼.𝙱 ᴛᴇᴄʜ ᴛᴇᴀᴍ`,
      contextInfo: getContextInfo("Upload Complete", userJid)
    });

  } catch (error) {
    console.error("Upload error:", error);
    repondre(zk, dest, ms, `Upload failed: ${error.message}`);
  }
});
      
