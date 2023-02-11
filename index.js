require("dotenv").config();

const express = require("express");
const cors = require("cors");
//const jwt = require("express-jwt");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/*app.use(
    jwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        algorithms: ["RS256"],
        credentialsRequired: false,
        getToken: function fromHeaderOrQuerystring(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    })
);*/

require("./src/main").init(app);

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("localhost:%s", port);
});
