define([
    'scalejs.core', 'scalejs.application'
], function(
    core
) {
    var noticeboard = core.noticeboard;

    // For deeper testing, log to console
    console.log('core.noticeboard: ', noticeboard);

    describe('core.noticeboard', function() {

        it('is defined', function() {
            expect(noticeboard).toBeDefined();
        });

    });
});

