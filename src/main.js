//const express = require("express");
//const io = require("./io");

let auth = require("./routes/auth");
let forum = require("./routes/forum");

/**
 * Init all modules
 */
exports.init = async (app) => {
    app.get("/", function (req, res) {
        res.send("hello");
    });

    app.use("/auth", auth.route);
    app.use("/api", forum.route);
};
