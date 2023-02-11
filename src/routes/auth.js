const express = require("express");
let route = (exports.route = express());

const io = require("../io");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

/**
 * AUTHENTICATION ROUTES
 *
 * ----- POST /auth/token -----
 *
 *
 *
 * ----- POST /auth/login -----
 *
 *
 *
 * ----- DELETE /auth/logout -----
 *
 *
 *
 * ----- POST /auth/register -----
 *
 *
 *
 */

route.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(
            AuthUser(0, user.name, user.password)
        );
        res.json({ accessToken: accessToken });
    });
});

route.post("/login", async (req, res) => {
    // let match = await io.compareHash("password", ...);

    const username = req.body.username;
    const password = req.body.password;

    if (username != "admin")
        return res.json({
            success: false,
            error: "User not found!",
        });
    if (password != "abc123")
        return res.json({
            success: false,
            error: "Wrong password!",
        });

    const user = AuthUser(0, username, password);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    let result = {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };

    res.send(result);
});

route.delete("/logout", async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token != req.body.token);
    res.sendStatus(204);
});

route.post("/register", async (req, res) => {
    let hash = await io.hash("password");

    const username = req.body.username;
    const password = req.body.password;

    let result = {
        success: true,
        token: "abc",
    };

    res.send(result);
});

/**
 * AUTHENTICATION EXPORTS
 *
 * ----- authenticate -----
 *
 * Usage: route.get('/path/to', authenticate, () => {})
 *
 * Authenticates a user based by token. Route will not abort, if user is
 * not in permissions.
 *
 * ----- authorize -----
 *
 * Usage: route.get('/path/to', authorize, () => {})
 *
 * Authorize a user based by token. Route will abort, if user is
 * not in permissions. Use for highly administrative/ member-only
 * sections.
 */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
exports.authenticate = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    jwt.verify(token || "", process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        req.user = err ? {} : user;
        next();
    });
};

/**
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
exports.authorize = function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/**
 * AUTHENTICATION FUNCTIONS
 *
 * ----- generateAccessToken -----
 *
 * Generate an expering access token.
 *
 * ----- generateRefreshToken -----
 *
 * Generate a refresh token.
 *
 */

/**
 * @param {string | object | Buffer} content
 * @returns {string}
 */
function generateAccessToken(content) {
    return jwt.sign(content, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}

/**
 * @param {string | object | Buffer} content
 * @returns {string}
 */
function generateRefreshToken(content) {
    const token = jwt.sign(content, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(token);
    return token;
}

/**
 * @class
 *
 * @param {number} id
 * @param {string} name
 * @param {string} password
 */
function AuthUser(id, name, password) {
    return {
        id: id,
        name: name,
        password: password,
    };
}
