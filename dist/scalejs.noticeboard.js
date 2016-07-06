'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewNoticeboard = exports.dictionary = exports.remove = exports.subscribe = exports.set = exports.get = exports.getValue = exports.setValue = undefined;

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _scalejs = require('scalejs.core');

var _scalejs2 = _interopRequireDefault(_scalejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var observable = _knockout2.default.observable,
    computed = _knockout2.default.computed,
    global = noticeboard();

function noticeboard() {
    var dictionary = observable({}),
        subs = {};

    // will set the value on an existing observable

    function setValue(key, value) {
        if (dictionary()[key]) {
            dictionary()[key](value);
        } else {
            dictionary()[key] = observable(value);
            dictionary.valueHasMutated();
        }
    }

    function getValue(key) {
        var item = dictionary()[key];
        if (item) {
            return item();
        }
    }

    function subscribe(key, callback) {
        var sub = computed(function () {
            return getValue(key);
        });
        sub.subscribe(function (newValue) {
            callback(newValue);
        });
        callback(sub()); // When initially called
        subs[key] = subs[key] || [];
        subs[key].push(sub);
        return sub;
    }

    function remove(key) {
        if (dictionary()[key]) {
            if (subs[key]) {
                subs[key].forEach(function (sub) {
                    sub.dispose();
                });
            }
            delete dictionary()[key];
            dictionary.valueHasMutated();
        }
    }

    return {
        setValue: setValue,
        getValue: getValue,
        get: getValue,
        set: setValue,
        subscribe: subscribe,
        remove: remove,
        dictionary: dictionary
    };
}

_scalejs2.default.registerExtension({
    noticeboard: {
        createNewNoticeboard: noticeboard,
        global: noticeboard()
    }
});

var setValue = global.setValue;
var getValue = global.getValue;
var get = global.get;
var set = global.set;
var subscribe = global.subscribe;
var remove = global.remove;
var dictionary = global.dictionary;
exports.setValue = setValue;
exports.getValue = getValue;
exports.get = get;
exports.set = set;
exports.subscribe = subscribe;
exports.remove = remove;
exports.dictionary = dictionary;
exports.createNewNoticeboard = noticeboard;
exports.default = {
    setValue: setValue,
    getValue: getValue,
    get: get,
    set: set,
    subscribe: subscribe,
    remove: remove,
    dictionary: dictionary,
    createNewNoticeboard: noticeboard
};
//# sourceMappingURL=scalejs.noticeboard.js.map