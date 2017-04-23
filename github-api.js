'use strict';

var Promise = require('bluebird');
var request = require('request');
var fs = require('fs');
var TOKEN_PATH = 'token';
var apiUrl = 'https://api.github.com/';

function getToken() {
    return new Promise(function (resolve, reject) {
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                reject(err);
            }

            resolve(token.toString().slice(0, -1));
        });
    });
}

function getUrl(host) {
    return apiUrl + host;
}

function getReposList(category, httpRequest, callback) {
    request(httpRequest, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var result = JSON.parse(body).filter(function (task) {
                return task.name.includes(category + '-task');
            });
            callback(null, result.map(function (node) {
                return {
                    'name': node.name,
                    'description': node.description
                };
            }));
        } else {
            callback(err);
        }
    });
}

function getTaskInfo(task, httpRequest, callback) {
    request(httpRequest, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var reposInfo = {};
            body = JSON.parse(body);
            httpRequest.url = getUrl('repos/urfu-2016/' + task + '/readme');

            reposInfo.name = body.name;
            reposInfo.description = body.description;

            getMarkdown(reposInfo, httpRequest, callback);
        }
    });
}

function getMarkdown(reposInfo, httpRequest, callback) {
    request(httpRequest, function (error, response, readme) {
        if (!error && response.statusCode === 200) {
            var data = new Buffer(JSON.parse(readme).content, 'base64');
            reposInfo.markdown = data.toString('utf-8');
            callback(null, reposInfo);
        } else {
            callback(error);
        }
    });
}

exports.getUrl = getUrl;
exports.getToken = getToken;
exports.getReposList = getReposList;
exports.getTaskInfo = getTaskInfo;
