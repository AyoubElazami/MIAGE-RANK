
let io = null;
const initializeSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "*",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        console.log("✅ Client connecté:", socket.id);
        socket.on("join:ranking", () => {
            socket.join("ranking");
            console.log(`Client ${socket.id} a rejoint la room ranking`);
        });
        socket.on("join:team", (teamId) => {
            socket.join(`team:${teamId}`);
            console.log(`Client ${socket.id} a rejoint la room team:${teamId}`);
        });
        socket.on("join:challenge", (challengeId) => {
            socket.join(`challenge:${challengeId}`);
            console.log(`Client ${socket.id} a rejoint la room challenge:${challengeId}`);
        });
        socket.on("disconnect", () => {
            console.log("❌ Client déconnecté:", socket.id);
        });
    });
    return io;
};
const emitRankingUpdate = (rankingData) => {
    if (io) {
        io.to("ranking").emit("ranking:update", {
            data: rankingData,
            timestamp: new Date()
        });
    }
};
const emitTeamUpdate = (teamId, teamData) => {
    if (io) {
        io.to(`team:${teamId}`).emit("team:update", {
            data: teamData,
            timestamp: new Date()
        });
    }
};
const emitChallengeUpdate = (challengeId, challengeData) => {
    if (io) {
        io.to(`challenge:${challengeId}`).emit("challenge:update", {
            data: challengeData,
            timestamp: new Date()
        });
    }
};
const emitNotification = (message, type = "info") => {
    if (io) {
        io.emit("notification", {
            message,
            type,
            timestamp: new Date()
        });
    }
};
module.exports = {
    initializeSocket,
    emitRankingUpdate,
    emitTeamUpdate,
    emitChallengeUpdate,
    emitNotification
};