const express = require("express");
let route = (exports.route = express());

const { authenticate } = require("./auth");
// auth.authenticateToken

route.get("/forum", async (req, res) => {
    let result = {
        boards: [0, 1, 2],
    };

    res.send(result);
});

route.get("/board/:id", authenticate, async (req, res) => {
    console.log(req.user);

    let result = [
        {
            id: 0,
            title: "Announcements",
            description:
                "All fresh announcements about the forum or product will be posted here.",
        },

        {
            id: 1,
            title: "Moderation",
            description:
                "This board has been dedicated to moderative discussions, talks or other restricted topics.",
        },

        {
            id: 2,
            title: "Suggestions",
            description:
                "Got an idea that needs to be added? You may want to send it here!",
        },
    ];

    res.send(result[req.params.id]);
});

route.get("/board/:id/:page", async (req, res) => {
    let result = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12],
        [13, 14, 15, 16],
    ];

    res.send(result[req.params.id]);
});

route.get("/topic/:id", async (req, res) => {
    let result = [
        {
            id: 0,
            parent: 0, // Board Id
            author: 1,
            title: "I think we need an upvote system.",
            deleted: false,
            locked: false,
            op: [0], // The main thread attached message. An array so mods can do cool stuff.
            pinned: [2],
        },
        {
            id: 1,
            parent: 0,
            author: 1,
            title: "Why bugs are red.",
        },
        {
            id: 2,
            parent: 0,
            author: 1,
            title: "ZA WARRUUUDDDDOOOOOOO",
        },
        {
            id: 3,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 4,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 5,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 6,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 7,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 8,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 9,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {
            id: 10,
            parent: 0,
            author: 1,
            title: "You have lost.",
        },
        {},
        {},
        {},
        {},
        {},
        {},
    ];

    res.send(result[req.params.id]);
});

route.get("/topic/:id/:page", async (req, res) => {
    let result = [0, 1, 2];

    res.send(result);
});

route.get("/message/:id/", async (req, res) => {
    let result = [
        {
            type: "OP",
            timestamp: 0,
            author: 0,
            content: "Lorem Ipsum Dolor Sit Amet",
        },
        {
            type: "POST",
            timestamp: 5000,
            author: 1,
            content: "Lorem Ipsum Dolor Sit Amet",
        },
        {
            type: "SYSTEM",
            timestamp: 100000,
            title: "Pinned Post Title",
            content:
                "Lorem Ipsum Dolor Sit Amet Consecetur or so, you get it. Placeholder text",
        },
    ];

    res.send(result[req.params.id]);
});

route.get("/user/:id", async (req, res) => {
    let result = {};

    res.send(result);
});
