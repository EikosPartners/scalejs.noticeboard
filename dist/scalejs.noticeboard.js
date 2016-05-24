define('scalejs.noticeboard',[
    'scalejs.core',
    'knockout'
], function (
    core,
    ko
) {
    'use strict';
    
    var observable = ko.observable,
        computed = ko.computed;

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
});


