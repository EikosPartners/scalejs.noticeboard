import ko from 'knockout';
import core from 'scalejs.core';
var observable = ko.observable,
    computed = ko.computed,
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
            let item = dict[key];
            return item;
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
            if(newValue !== oldValue) {
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
                })
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

core.registerExtension({
    noticeboard: {
        createNewNoticeboard: noticeboard,
        global: noticeboard()
    }
});


let {
    setValue,
    getValue,
    get,
    set,
    subscribe,
    remove,
    dictionary
} = global;

export {
    setValue,
    getValue,
    get,
    set,
    subscribe,
    remove,
    dictionary,
    noticeboard as createNewNoticeboard
}
export default {
    setValue,
    getValue,
    get,
    set,
    subscribe,
    remove,
    dictionary,
    createNewNoticeboard : noticeboard
}



