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
    // notify when key becomes available
    // notify when value changes
    function getValue(key) {
        var dict = dictionary.peek();

        if (dict.hasOwnProperty(key)) {
            var item = dict[key];
            return item();
        }
        return dictionary()[key]; // returns undefined
    }

    function subscribe(key, callback) {
        var sub = computed(function () {
            return getValue(key);
        }),
            oldValue;

        sub.subscribe(function (val) {
            oldValue = val;
        }, null, 'beforeChange');

        sub.subscribe(function (newValue) {
            if (newValue !== oldValue) {
                callback(newValue);
            }
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

var setValue = global.setValue,
    getValue = global.getValue,
    get = global.get,
    set = global.set,
    subscribe = global.subscribe,
    remove = global.remove,
    dictionary = global.dictionary;
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