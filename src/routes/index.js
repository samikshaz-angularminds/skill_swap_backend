import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import connectionRoutes from "./connections.routes.js";
import conversationRoutes from  "./conversation.routes.js";
import messageRoutes from "./message.routes.js";


const router = express.Router();

const defaultRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/connections",
        route: connectionRoutes
    },
    {
        path: "/conversation",
        route: conversationRoutes
    },
    {
        path: "/message",
        route: messageRoutes
    }
];

defaultRoutes.forEach((route) => {    
    router.use(route.path, route.route);
})

export default router;