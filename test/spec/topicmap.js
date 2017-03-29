/*
 * Copyright 2016-2017 Hewlett Packard Enterprise Development Company, L.P.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 */
define([
    'jquery',
    'src/js/topicmap'
], function($) {

    describe('Topic Map', function() {
        it('exposes a jquery plugin', function() {
            expect($.fn.topicmap).toBeDefined();
        });
    });

});
