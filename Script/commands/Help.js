const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Mukul",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    en: {
        moduleInfo: `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot: %9
┃ 👑 Owner: 𝐌𝐔𝐊𝐔𝐋
╰━━━━━━━━━━━━━━━━╯`
    }
};

const helpImages = [
    "https://i.imgur.com/gokzyKd.jpeg",
    "https://i.imgur.com/g3hlQ0Z.jpeg",
    "https://i.imgur.com/L7txp4M.jpeg",
    "https://i.imgur.com/5dG8PS5.jpeg"
];

function downloadImage(callback) {
    try {
        const randomUrl =
            helpImages[Math.floor(Math.random() * helpImages.length)];

        const cacheDir = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheDir))
            fs.mkdirSync(cacheDir, { recursive: true });

        const filePath = path.join(
            cacheDir,
            `help_${Date.now()}.jpg`
        );

        request({
            url: randomUrl,
            encoding: null,
            timeout: 15000
        })
            .pipe(fs.createWriteStream(filePath))
            .on("finish", () => callback(filePath))
            .on("error", () => callback(null));

    } catch (err) {
        callback(null);
    }
}

function getPermission(permission) {
    switch (permission) {
        case 0:
            return "User";
        case 1:
            return "Admin Group";
        case 2:
            return "Admin Bot";
        default:
            return "Unknown";
    }
}

module.exports.handleEvent = function ({ api, event }) {
    try {
        const { commands } = global.client;
        const { threadID, messageID, body } = event;

        if (!body) return;

        const prefix =
            (global.data.threadData.get(parseInt(threadID)) || {}).PREFIX ||
            global.config.PREFIX;

        const cleanBody = body.trim();

        if (!cleanBody.toLowerCase().startsWith("help"))
            return;

        const splitBody = cleanBody.split(/\s+/);

        if (splitBody.length < 2)
            return;

        const commandName = splitBody[1].toLowerCase();

        if (!commands.has(commandName))
            return;

        const command = commands.get(commandName);

        const detail = `
╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━━┫
┃ 🔖 Name: ${command.config.name || commandName}
┃ 📄 Usage: ${command.config.usages || "Not Provided"}
┃ 📜 Description: ${command.config.description || "Not Provided"}
┃ 🔑 Permission: ${getPermission(command.config.hasPermssion)}
┃ 👨‍💻 Credit: ${command.config.credits || "Unknown"}
┃ 📂 Category: ${command.config.commandCategory || "Unknown"}
┃ ⏳ Cooldown: ${command.config.cooldowns || 0}s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot: ${global.config.BOTNAME || "𝐌𝐔𝐊𝐔𝐋 𝐁𝐎𝐓"}
┃ 👑 Owner: 𝐌𝐔𝐊𝐔𝐋
╰━━━━━━━━━━━━━━━━╯`;

        downloadImage(filePath => {

            if (!filePath) {
                return api.sendMessage(
                    detail,
                    threadID,
                    null,
                    messageID
                );
            }

            api.sendMessage(
                {
                    body: detail,
                    attachment: fs.createReadStream(filePath)
                },
                threadID,
                () => {
                    try {
                        if (fs.existsSync(filePath))
                            fs.unlinkSync(filePath);
                    } catch (e) {}
                },
                messageID
            );
        });

    } catch (err) {
        console.error("HELP HANDLE EVENT ERROR:", err);
    }
};

module.exports.run = function ({
    api,
    event,
    args
}) {
    try {
        const { commands } = global.client;
        const { threadID, messageID } = event;

        const threadData =
            global.data.threadData.get(parseInt(threadID)) || {};

        const prefix =
            threadData.PREFIX || global.config.PREFIX;

        /*
         * =========================
         * COMMAND DETAILS
         * =========================
         */

        if (args[0] && commands.has(args[0].toLowerCase())) {

            const command =
                commands.get(args[0].toLowerCase());

            const detailText = `
╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━━┫
┃ 🔖 Name: ${command.config.name || args[0]}
┃ 📄 Usage: ${command.config.usages || "Not Provided"}
┃ 📜 Description: ${command.config.description || "Not Provided"}
┃ 🔑 Permission: ${getPermission(command.config.hasPermssion)}
┃ 👨‍💻 Credit: ${command.config.credits || "Unknown"}
┃ 📂 Category: ${command.config.commandCategory || "Unknown"}
┃ ⏳ Cooldown: ${command.config.cooldowns || 0}s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot: ${global.config.BOTNAME || "𝐌𝐔𝐊𝐔𝐋 𝐁𝐎𝐓"}
┃ 👑 Owner: 𝐌𝐔𝐊𝐔𝐋
╰━━━━━━━━━━━━━━━━╯`;

            downloadImage(filePath => {

                if (!filePath) {
                    return api.sendMessage(
                        detailText,
                        threadID,
                        null,
                        messageID
                    );
                }

                api.sendMessage(
                    {
                        body: detailText,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => {
                        try {
                            if (fs.existsSync(filePath))
                                fs.unlinkSync(filePath);
                        } catch (e) {}
                    },
                    messageID
                );
            });

            return;
        }

        /*
         * =========================
         * COMMAND LIST
         * =========================
         */

        const arrayInfo = Array.from(commands.keys())
            .filter(cmdName =>
                cmdName &&
                typeof cmdName === "string" &&
                cmdName.trim() !== ""
            )
            .sort();

        if (arrayInfo.length === 0) {
            return api.sendMessage(
                "❌ কোনো command পাওয়া যায়নি!",
                threadID,
                null,
                messageID
            );
        }

        const page =
            Math.max(parseInt(args[0]) || 1, 1);

        const numberOfOnePage = 20;

        const totalPages =
            Math.ceil(arrayInfo.length / numberOfOnePage);

        const currentPage =
            Math.min(page, totalPages);

        const start =
            numberOfOnePage * (currentPage - 1);

        const helpView =
            arrayInfo.slice(
                start,
                start + numberOfOnePage
            );

        let msg = helpView
            .map((cmdName, index) =>
                `┃ ${start + index + 1}. ${cmdName}`
            )
            .join("\n");

        const text = `
╭━━━━━━━━━━━━━━━━━━╮
┃   👑 𝐌𝐔𝐊𝐔𝐋 𝐁𝐎𝐓   ┃
┃     𝐇𝐄𝐋𝐏 𝐌𝐄𝐍𝐔    ┃
╰━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓
┣━━━━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${currentPage}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot: ${global.config.BOTNAME || "SIFAT BOT"}
┃ 👑 Owner: 𝐌𝐔𝐊𝐔𝐋
╰━━━━━━━━━━━━━━━━━━╯

💡 ${prefix}help <command>
📌 Example: ${prefix}help uid

➡️ Next Page:
${prefix}help ${currentPage + 1 <= totalPages ? currentPage + 1 : 1}
`;

        downloadImage(filePath => {

            if (!filePath) {
                return api.sendMessage(
                    text,
                    threadID,
                    null,
                    messageID
                );
            }

            api.sendMessage(
                {
                    body: text,
                    attachment: fs.createReadStream(filePath)
                },
                threadID,
                () => {
                    try {
                        if (fs.existsSync(filePath))
                            fs.unlinkSync(filePath);
                    } catch (e) {}
                },
                messageID
            );
        });

    } catch (err) {

        console.error("HELP RUN ERROR:", err);

        api.sendMessage(
            `❌ Help command error!\n\n${err.message}`,
            event.threadID,
            null,
            event.messageID
        );
    }
};
