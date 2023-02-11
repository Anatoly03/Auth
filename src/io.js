// Redis DB
const redis = require("redis").createClient();
const redis_key = "forum-";

//
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @description For the case of the redis client failing to work.
 */
redis.on("error", function (error) {
    throw error;
});

/**
 * @param {string} key
 * @returns {Promise<string>} Data that was stored to the redis client
 * @description Gets key and then executes callback handing over the value as
 * parameter. If the value wasn't saved yet, returns default value defined in
 * default.json
 */
exports.getString = (key) => {
    return new Promise((resolve, reject) => {
        redis.get(redis_key + key, async (err, reply) => {
            if (err != null) reject(err);
            //cache[key] = JSON.parse(reply); // Add received value to cache so it can be received quicker next request.
            resolve(reply);
        });
    });
};

/**
 * @param {string} key
 * @returns {Promise<object>} Encoded data that was stored to the redis client
 * @description Gets key and then executes callback handing over the value as
 * parameter. If the value wasn't saved yet, returns default value defined in
 * default.json
 */
exports.get = async (key) => {
    return new Promise((resolve, reject) => {
        redis.get(redis_key + key, async (err, reply) => {
            if (err != null) reject(err);
            //cache[key] = reply ? JSON.parse(reply) : null; // Add received value to cache so it can be received quicker next request.
            resolve(reply ? JSON.parse(reply) : null);
        });
    });
};

/**
 * @param {string} key
 * @param {function (object) : any} operation The operation that will edit the object.
 * @returns {object} New value of key is the returned value of an array function, or
 * if that is null, the operation edit on the shallow function.
 * @description Get data from the redis client and edit it with an array function.
 */
exports.edit = async (key, operation) => {
    let data = await exports.get(key);
    let value = operation(data);
    await exports.set(key, typeof value == "object" ? value : data);
    return typeof value == "object" ? value : data;
};

/**
 * @param {string} key
 * @param {object} value
 * @description Gets key and then executes callback handing over the value as
 * parameter. If the value wasn't saved yet, returns default value defined in
 * default.json
 */
exports.set = (key, value) => {
    //cache[key] = value; // Add received value to cache so it can be received quicker next request.
    //console.log(key);

    if (typeof value == "object")
        return new Promise((resolve, reject) => {
            redis.set(redis_key + key, JSON.stringify(value), (err, reply) => {
                if (err) reject(err);
                resolve(value);
            });
        });

    throw "IO.set(..) must contain an object to be stringified.";
};

/**
 * @param {string} value
 * @description Gets a string and then returns its' hash.
 */
exports.hash = async (value) => {
    return new Promise((res, rej) => {
        bcrypt.hash(value, saltRounds, function (err, hash) {
            if (err) rej(err);
            res(hash);
        });
    });
};

/**
 * @param {string} value
 * @description Compare value input to hash.
 */
exports.compareHash = async (value, hash) => {
    return new Promise((res, rej) => {
        bcrypt.compare(value, hash, function (err, result) {
            if (err) rej(err);
            res(result);
        });
    });
};
