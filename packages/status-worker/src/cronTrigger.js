"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.processCronTrigger = exports.getCleanUpDate = exports.getDate = exports.getCheckLocation = exports.notifyDiscord = exports.notifyTelegram = exports.notifySlack = exports.getOperationalLabel = exports.getKVMonitors = void 0;
var config_json_1 = require("./../../../config.json");
var kvDataKey = 'monitor-data-v1';
function getKVMonitors(env) {
    return __awaiter(this, void 0, void 0, function () {
        var data, defaultData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, env.KV_STATUS_PAGE.get(kvDataKey, { type: 'json' })
                    // const data = JSON.parse(await KV_STATUS_PAGE.get(kvDataKey, 'text'))
                ];
                case 1:
                    data = _a.sent();
                    defaultData = { lastUpdate: { allOperational: true }, monitors: {} };
                    if (data === null)
                        return [2 /*return*/, defaultData];
                    else
                        return [2 /*return*/, data];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getKVMonitors = getKVMonitors;
var getOperationalLabel = function (operational) {
    return operational
        ? config_json_1["default"].settings.monitorLabelOperational
        : config_json_1["default"].settings.monitorLabelNotOperational;
};
exports.getOperationalLabel = getOperationalLabel;
function notifySlack(monitor, operational) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = {
                attachments: [
                    {
                        fallback: "Monitor ".concat(monitor.name, " changed status to ").concat((0, exports.getOperationalLabel)(operational)),
                        color: operational ? '#36a64f' : '#f2c744',
                        blocks: [
                            {
                                type: 'section',
                                text: {
                                    type: 'mrkdwn',
                                    text: "Monitor *".concat(monitor.name, "* changed status to *").concat((0, exports.getOperationalLabel)(operational), "*")
                                }
                            },
                            {
                                type: 'context',
                                elements: [
                                    {
                                        type: 'mrkdwn',
                                        text: "".concat(operational ? ':white_check_mark:' : ':x:', " `").concat(monitor.method ? monitor.method : 'GET', " ").concat(monitor.url, "` - :eyes: <").concat(config_json_1["default"].settings.url, "|Status Page>")
                                    },
                                ]
                            },
                        ]
                    },
                ]
            };
            return [2 /*return*/, fetch(process.env.SECRET_SLACK_WEBHOOK_URL, {
                    body: JSON.stringify(payload),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })];
        });
    });
}
exports.notifySlack = notifySlack;
function notifyTelegram(monitor, operational) {
    return __awaiter(this, void 0, void 0, function () {
        var text, payload, telegramUrl;
        return __generator(this, function (_a) {
            text = "Monitor *".concat(monitor.name.replaceAll('-', '\\-'), "* changed status to *").concat((0, exports.getOperationalLabel)(operational), "*\n  ").concat(operational ? '✅' : '❌', " `").concat(monitor.method ? monitor.method : 'GET', " ").concat(monitor.url, "` \\- \uD83D\uDC40 [Status Page](").concat(config_json_1["default"].settings.url, ")");
            payload = new FormData();
            payload.append('chat_id', process.env.SECRET_TELEGRAM_CHAT_ID);
            payload.append('parse_mode', 'MarkdownV2');
            payload.append('text', text);
            telegramUrl = "https://api.telegram.org/bot".concat(process.env.SECRET_TELEGRAM_API_TOKEN, "/sendMessage");
            return [2 /*return*/, fetch(telegramUrl, {
                    body: payload,
                    method: 'POST'
                })];
        });
    });
}
exports.notifyTelegram = notifyTelegram;
// Visualize your payload using https://leovoel.github.io/embed-visualizer/
function notifyDiscord(monitor, operational) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            payload = {
                username: "".concat(config_json_1["default"].settings.title),
                avatar_url: "".concat(config_json_1["default"].settings.url, "/").concat(config_json_1["default"].settings.logo),
                embeds: [
                    {
                        title: "".concat(monitor.name, " is ").concat((0, exports.getOperationalLabel)(operational), " ").concat(operational ? ':white_check_mark:' : ':x:'),
                        description: "`".concat(monitor.method ? monitor.method : 'GET', " ").concat(monitor.url, "` - :eyes: [Status Page](").concat(config_json_1["default"].settings.url, ")"),
                        color: operational ? 3581519 : 13632027
                    },
                ]
            };
            return [2 /*return*/, fetch(process.env.SECRET_DISCORD_WEBHOOK_URL, {
                    body: JSON.stringify(payload),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })];
        });
    });
}
exports.notifyDiscord = notifyDiscord;
function getCheckLocation() {
    return __awaiter(this, void 0, void 0, function () {
        var res, header;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://cloudflare-dns.com/dns-query', {
                        method: 'OPTIONS'
                    })];
                case 1:
                    res = _a.sent();
                    header = res.headers.get('cf-ray');
                    if (header)
                        return [2 /*return*/, header.split('-')[1]];
                    else
                        return [2 /*return*/, 'unknown'];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCheckLocation = getCheckLocation;
function getDate() {
    return new Date().toISOString().split('T')[0];
}
exports.getDate = getDate;
function getCleanUpDate() {
    // delete dates older than config.settings.daysInHistogram
    var date = new Date();
    date.setDate(date.getDate() - config_json_1["default"].settings.daysSavedForHistogram);
    return date.toISOString().split('T')[0];
}
exports.getCleanUpDate = getCleanUpDate;
function getConfig() {
    return config_json_1["default"];
}
function processCronTrigger(event, env, config) {
    if (config === void 0) { config = getConfig(); }
    return __awaiter(this, void 0, void 0, function () {
        var checkLocation, checkDay, cleanUpDate, monitorsState, _loop_1, _i, _a, monitor, dataString;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCheckLocation()];
                case 1:
                    checkLocation = _b.sent();
                    checkDay = getDate();
                    cleanUpDate = getCleanUpDate();
                    return [4 /*yield*/, getKVMonitors(env)
                        // Reset default all monitors state to true
                    ];
                case 2:
                    monitorsState = _b.sent();
                    // Reset default all monitors state to true
                    monitorsState.lastUpdate.allOperational = true;
                    _loop_1 = function (monitor) {
                        var init, requestStartTime, monitorOperational, monitorStatus, monitorStatusText, e_1, requestTime, monitorStatusChanged, no, ms;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    // Monitor: remove days from KV
                                    if (config.settings.daysSavedForHistogram && config.settings.daysSavedForHistogram > 0 && monitorsState.monitors[monitor.id]) {
                                        Object.keys(monitorsState.monitors[monitor.id].checks).forEach(function (checkDay) {
                                            if (checkDay < cleanUpDate)
                                                delete monitorsState.monitors[monitor.id].checks[checkDay];
                                        });
                                    }
                                    // Monitor not active - go on
                                    if (!monitor.shouldAnalyze)
                                        return [2 /*return*/, "continue"];
                                    // Create default monitor state if does not exist yet
                                    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
                                        monitorsState.monitors[monitor.id] = {
                                            firstCheck: checkDay,
                                            lastCheck: {},
                                            checks: {}
                                        };
                                    }
                                    init = {
                                        method: monitor.method || 'GET',
                                        redirect: monitor.followRedirect ? 'follow' : 'manual',
                                        headers: {
                                            'User-Agent': config.settings.user_agent || 'cf-worker-status-page'
                                        }
                                    };
                                    requestStartTime = Date.now();
                                    monitorOperational = false;
                                    monitorStatus = 0;
                                    monitorStatusText = 'error';
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, fetch(monitor.url, init).then(function (response) {
                                            monitorOperational = response.status === (monitor.expectStatus || 200);
                                            monitorStatus = response.status;
                                            monitorStatusText = response.statusText;
                                        })["catch"](function (error) {
                                            // eslint-disable-next-line no-console
                                            console.log('found error', error);
                                        })];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _c.sent();
                                    // eslint-disable-next-line no-console
                                    console.log('found error', e_1);
                                    return [3 /*break*/, 4];
                                case 4:
                                    requestTime = Math.round(Date.now() - requestStartTime);
                                    monitorStatusChanged = monitorsState.monitors[monitor.id].lastCheck.operational
                                        !== monitorOperational;
                                    // Save monitor's last check response status
                                    monitorsState.monitors[monitor.id].lastCheck = {
                                        status: monitorStatus,
                                        statusText: monitorStatusText,
                                        operational: monitorOperational
                                    };
                                    // Send Slack message on monitor change
                                    if (monitorStatusChanged
                                        && typeof SECRET_SLACK_WEBHOOK_URL !== 'undefined')
                                        event.waitUntil(notifySlack(monitor, monitorOperational));
                                    // Send Telegram message on monitor change
                                    if (monitorStatusChanged
                                        && typeof SECRET_TELEGRAM_API_TOKEN !== 'undefined'
                                        && typeof SECRET_TELEGRAM_CHAT_ID !== 'undefined')
                                        event.waitUntil(notifyTelegram(monitor, monitorOperational));
                                    // Send Discord message on monitor change
                                    if (monitorStatusChanged
                                        && typeof SECRET_DISCORD_WEBHOOK_URL !== 'undefined')
                                        event.waitUntil(notifyDiscord(monitor, monitorOperational));
                                    // make sure checkDay exists in checks in cases when needed
                                    if ((config.settings.collectResponseTimes || !monitorOperational)
                                        && !Object.prototype.hasOwnProperty.call(monitorsState.monitors[monitor.id].checks, checkDay)) {
                                        monitorsState.monitors[monitor.id].checks[checkDay] = {
                                            fails: 0,
                                            res: {},
                                            failData: {}
                                        };
                                    }
                                    if (config.settings.collectResponseTimes && monitorOperational) {
                                        // make sure location exists in current checkDay
                                        if (!Object.prototype.hasOwnProperty.call(monitorsState.monitors[monitor.id].checks[checkDay].res, checkLocation)) {
                                            monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation] = {
                                                n: 0,
                                                ms: 0,
                                                a: 0,
                                                msMin: 10000000,
                                                msMax: 0
                                            };
                                        }
                                        // check and save min ms
                                        if (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMin > requestTime)
                                            monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMin = requestTime;
                                        // check and save max ms
                                        if (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMax < requestTime)
                                            monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].msMax = requestTime;
                                        no = ++monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].n;
                                        ms = (monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].ms += requestTime);
                                        // save new average ms
                                        monitorsState.monitors[monitor.id].checks[checkDay].res[checkLocation].a = Math.round(ms / no);
                                    }
                                    else if (!monitorOperational) {
                                        // Save allOperational to false
                                        monitorsState.lastUpdate.allOperational = false;
                                        monitorsState.monitors[monitor.id].checks[checkDay].failData[Date.now()] = { loc: checkLocation };
                                        // Increment failed checks on status change or first fail of the day (maybe call it .incidents instead?)
                                        if (monitorStatusChanged || monitorsState.monitors[monitor.id].checks[checkDay].fails === 0)
                                            monitorsState.monitors[monitor.id].checks[checkDay].fails++;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = config.monitors;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    monitor = _a[_i];
                    return [5 /*yield**/, _loop_1(monitor)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // Save last update information
                    monitorsState.lastUpdate.time = Date.now();
                    monitorsState.lastUpdate.loc = checkLocation;
                    dataString = JSON.stringify(monitorsState);
                    return [4 /*yield*/, env.KV_STATUS_PAGE.put('monitor-data-v1', dataString)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.processCronTrigger = processCronTrigger;
