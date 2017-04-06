'use strict';

var githubApi = require('./github-api');
require('buffer');

/**
 * Сделано задание на звездочку
 * Реализовано получение html
 */
exports.isStar = false;

/**
 * Получение списка задач
 * @param {String} category – категория задач (javascript или markup)
 * @param {Function} callback
 */
exports.getList = function (category, callback) {
    var httpRequest = {
        url: githubApi.getUrl('orgs/urfu-2016/repos'),
        auth: {
            'bearer': ''
        },
        headers: {
            'User-Agent': 'api-agent'
        }
    };

    githubApi.getToken()
    .then(
        function (token) {
            httpRequest.auth.bearer = token;
            githubApi.getReposList(category, httpRequest, callback);
        },
    function (err) {
        callback(err);
    });
};

/**
 * Загрузка одной задачи
 * @param {String} task – идентификатор задачи
 * @param {Function} callback
 */
exports.loadOne = function (task, callback) {
    var httpRequest = {
        url: githubApi.getUrl('repos/urfu-2016/' + task),
        auth: {
            'bearer': ''
        },
        headers: {
            'User-Agent': 'Strandol'
        }
    };

    githubApi.getToken()
    .then(
        function (token) {
            httpRequest.auth.bearer = token;
            githubApi.getTaskInfo(task, httpRequest, callback);
        },
        function (err) {
            callback(err);
        });
};
