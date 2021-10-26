"use strict";
const raw = require("raw-body");
const inflate = require("inflation");

function msgpack(req, opts) {
  req = req.req || req;
  // defaults
  const len = req.headers["content-length"];
  const encoding = req.headers["content-encoding"] || "identity";
  if (len && encoding === "identity") opts.length = ~~len;
  // opts.encoding = opts.encoding || "utf8";
  opts.limit = opts.limit || "1mb";

  return raw(inflate(req), opts).then(function (str) {
      try {
        return str;
      } catch (err) {
        err.status = 400;
        err.body = str;
        throw err;
      }
    })
}

function requestbody(opts) {
  opts = opts || {};
  opts.onError = 'onError' in opts ? opts.onError : false;
  opts.parsedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  return function (ctx, next) {
    let bodyPromise;
    if (opts.parsedMethods.includes(ctx.method.toUpperCase())) {
      try {
        bodyPromise = msgpack(ctx, opts);
      } catch (parsingError) {
        if (typeof opts.onError === "function") {
          opts.onError(parsingError, ctx);
        } else {
          throw parsingError;
        }
      }
    }

    bodyPromise = bodyPromise || Promise.resolve();
    return bodyPromise.then(function (body) {
      ctx.request.body = body;
      return next();
    }).catch(function (parsingError) {
        if (typeof opts.onError === "function") {
          opts.onError(parsingError, ctx);
        } else {
          throw parsingError;
        }
        return next();
      })
  };
}
module.exports = requestbody;