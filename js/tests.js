var WORD_2013 = {
    P: '<p class="MsoNormal"><span lang="EN-US">p<o:p></o:p></span></p>',
    OL:{
        ONE:'<p class="MsoListParagraph" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">1.<span style="font-size: 7pt; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item<o:p></o:p></span></p>',
        TWO:'<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">1.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">2.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item2<o:p></o:p></span></p>',
        TREE:'<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]-->1.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><!--[endif]--><span lang="EN-US">Item1</span><o:p></o:p></p><p class="MsoListParagraphCxSpLast" style="margin-left:72.0pt;mso-add-space:auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]-->a.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><!--[endif]--><span lang="EN-US">Item1.1</span><o:p></o:p></p>'
    },
    UL:{
        ONE:'<p class="MsoListParagraph" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item<o:p></o:p></span></p>',
        TWO:'<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item2<o:p></o:p></span></p>',
        TREE:'<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="margin-left:72.0pt;mso-add-space:auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;;mso-ansi-language:EN-US">o<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1.1<o:p></o:p></span></p>'
    }

};
var WORDPAD = {
    OLD:{
        ONE:'',
        TWO:'<div>1.<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">	</span></span>Item1</div><div>2.<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">	</span></span>Item2</div>',
        TREE:'<div>1.<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;"> </span></span>Item1</div><div>2.<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">    </span></span>Item1.1</div>'
    }
};
var HTML = {
    P: '<p>p</p>',
    DIV: '<div>d</div>',
    TXT: 'Hello'
};
var CLEAN = {
    P: '<p>p</p>',
    DIV: '<p>d</p>'
}
module('Definitions');
test('wysiwyg defined', function () {
    ok(typeof jQuery.fn.tinylight !== 'undefined');
});
test('cleanupHtml defined', function () {
    ok(typeof jQuery.mac.tinylight._proto.cleanupHtml !== 'undefined');
});

module('Cleanup');
cleanupHtml = jQuery.mac.tinylight._proto.cleanupHtml;

test('will wrap simple text with paragraphs', function () {
    equal(cleanupHtml('Hello'), '<p>Hello</p>');
});

test('will not modify simple text', function () {
    equal(cleanupHtml('<p>Hello</p>'), '<p>Hello</p>');
});
test('will remove comments', function () {
    equal(cleanupHtml('Hello <!-- World -->'), '<p>Hello </p>');
});

module('Word OL lists');
test('single item', function () {
    var expected = '<ol><li><p>Item</p></li></ol>';
    var given = WORD_2013.OL.ONE;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

test('multiple items', function () {
    var expected = '<ol><li><p>Item1</p></li><li><p>Item2</p></li></ol>';
    var given = WORD_2013.OL.TWO;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

test('indented lists', function () {
    var expected = '<ol><li><p>Item1</p></li><li><p>Item1.1</p></li></ol>';
    var given = WORD_2013.OL.TREE;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

module('Word UL lists');
test('single item', function () {
    var expected = '<ul><li><p>Item</p></li></ul>';
    var given = WORD_2013.UL.ONE;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

test('multiple items', function () {
    var expected = '<ul><li><p>Item1</p></li><li><p>Item2</p></li></ul>';
    var given = WORD_2013.UL.TWO;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

test('indented lists', function () {
    var expected = '<ul><li><p>Item1</p></li><li><p>Item1.1</p></li></ul>';
    var given = WORD_2013.UL.TREE;
    equal(cleanupHtml(given), expected);
    equal(cleanupHtml(HTML.P + given), CLEAN.P + expected);
    equal(cleanupHtml(HTML.TXT + given), '<p>' + HTML.TXT + '</p>' + expected);
    equal(cleanupHtml(given + HTML.P), expected + CLEAN.P);
    equal(cleanupHtml(given + HTML.TXT), expected + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.P + given + HTML.P), CLEAN.P + expected + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + given + HTML.TXT), '<p>' + HTML.TXT + '</p>' + expected + '<p>' + HTML.TXT + '</p>');
});

module('Html lists');
test('lists can not be nested', function () {
    equal(cleanupHtml('<ul><li>Item1<ul><li>Item1.1</li></ul></li></ul>'), '<ul><li><p>Item1</p></li><li><p>Item1.1</p></li></ul>');
    equal(cleanupHtml('<ol><li>Item1<ol><li>Item1.1</li></ol></li></ol>'), '<ol><li><p>Item1</p></li><li><p>Item1.1</p></li></ol>');
    equal(cleanupHtml('<div><ul><li>Item</li></ul></div>'), '<ul><li><p>Item</p></li></ul>');
    equal(cleanupHtml('<p><ul><li>Item</li></ul></p>'), '<ul><li><p>Item</p></li></ul>');
});

module('Html other');
test('replace long tags with short', function () {
    equal(cleanupHtml('<strong>Item</strong>'), '<b>Item</b>');
    equal(cleanupHtml('<em>Item</em>'), '<i>Item</i>');
});

test('replace headers', function () {
    equal(cleanupHtml('<h1>Header</h1>'), '<p><b>Header</b></p>');
    equal(cleanupHtml('<h2>Header</h2>'), '<p><b>Header</b></p>');
    equal(cleanupHtml('<h3>Header</h3>'), '<p><b>Header</b></p>');
    equal(cleanupHtml('<h4>Header</h4>'), '<p><b>Header</b></p>');
    equal(cleanupHtml('<h5>Header</h5>'), '<p><b>Header</b></p>');
    equal(cleanupHtml('<h6>Header</h6>'), '<p><b>Header</b></p>');
});

test('convert spans with styles to allowed tags', function () {
    equal(cleanupHtml('<span style="font-weight:bold">span</span>'), '<b>span</b>');
    equal(cleanupHtml('<span style="font-style:italic">span</span>'), '<i>span</i>');
    equal(cleanupHtml('<span style="text-decoration:underline">span</span>'), '<u>span</u>');
    equal(cleanupHtml('<span style="font-weight:bold;font-style:italic">span</span>'), '<b><i>span</i></b>');
    equal(cleanupHtml('<span style="font-weight:bold;text-decoration:underline">span</span>'), '<b><u>span</u></b>');
    equal(cleanupHtml('<span style="font-weight:bold;font-style:italic;text-decoration:underline">span</span>'), '<b><i><u>span</u></i></b>');
    equal(cleanupHtml('<span style="font-style:italic;text-decoration:underline">span</span>'), '<i><u>span</u></i>');
});

test('will not nest duplicate tags', function () {
    equal(cleanupHtml('<b><span style="font-weight:bold">span</span></b>'), '<b>span</b>');
    equal(cleanupHtml('<i><span style="font-style:italic">span</span></i>'), '<i>span</i>');
    equal(cleanupHtml('<u><span style="text-decoration:underline">span</span></u>'), '<u>span</u>');
    equal(cleanupHtml('<b><span style="font-weight:bold;font-style:italic">span</span></b>'), '<b><i>span</i></b>');
    equal(cleanupHtml('<b><span style="font-weight:bold;text-decoration:underline">span</span></b>'), '<b><u>span</u></b>');
});

test('convert divs to pargaraphs', function () {
    equal(cleanupHtml(HTML.DIV), CLEAN.DIV);
    equal(cleanupHtml(HTML.P), CLEAN.P);
    equal(cleanupHtml(HTML.TXT + HTML.DIV), '<p>' + HTML.TXT + '</p>' + CLEAN.DIV);
    equal(cleanupHtml(HTML.TXT + HTML.P), '<p>' + HTML.TXT + '</p>' + CLEAN.P);
    equal(cleanupHtml(HTML.TXT + HTML.DIV + HTML.TXT), '<p>' + HTML.TXT + '</p>' + CLEAN.DIV + '<p>' + HTML.TXT + '</p>');
    equal(cleanupHtml(HTML.TXT + HTML.P + HTML.TXT), '<p>' + HTML.TXT + '</p>' + CLEAN.P + '<p>' + HTML.TXT + '</p>');
});

test('remove not allowed tags', function () {
    equal(cleanupHtml('<iframe></iframe>'), '');
    equal(cleanupHtml('<script></script>'), '');
    equal(cleanupHtml('<style></style>'), '');
    equal(cleanupHtml('<img>'), '');
    equal(cleanupHtml('<a></a>'), '');
    equal(cleanupHtml('<table></table>'), '');
});

test('remove tag attributes', function () {
    equal(cleanupHtml('<b style="font-size:12px">b</b>'), '<b>b</b>');
    equal(cleanupHtml('<b class="loud" style="font-size:12px">b</b>'), '<b>b</b>');
    equal(cleanupHtml('<b data-bind="text: name">b</b>'), '<b>b</b>');
});

test('combine repeated tags', function () {
    equal(cleanupHtml('<b>H</b><b>ello</b>'), '<b>Hello</b>');
    equal(cleanupHtml('<i>H</i><i>ello</i>'), '<i>Hello</i>');
    equal(cleanupHtml('<u>H</u><u>ello</u>'), '<u>Hello</u>');
});


/* TEST CASE EXAMPLE
test('<TEST CASE TITLE>', function () {
    var given = '<b>H</b><b>ello</b>';
    var expect = '<b>Hello</b>';
    equal(cleanupHtml(given), expect);
});
*/
