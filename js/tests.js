module('Definitions');
test('wysiwyg defined', function () {
    ok(typeof jQuery.fn.wysiwyg !== 'undefined');
});
test('cleanupHtml defined', function () {
    ok(typeof jQuery.mac.wysiwyg._proto.cleanupHtml !== 'undefined');
});

module('Cleanup');
cleanupHtml = jQuery.mac.wysiwyg._proto.cleanupHtml;

test('will not modify simple text', function () {
    equal(cleanupHtml('Hello'), 'Hello');
});
test('will remove comments', function () {
    equal(cleanupHtml('Hello <!-- World -->'), 'Hello ');
});