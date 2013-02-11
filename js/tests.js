var WORD_2013 = {
    P: '<p class="MsoNormal"><span lang="EN-US">p<o:p></o:p></span></p>',
    OL: {
        ONE: '<p class="MsoListParagraph" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">1.<span style="font-size: 7pt; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item<o:p></o:p></span></p>',
        TWO: '<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">1.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">2.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item2<o:p></o:p></span></p>',
        TREE: '<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]-->1.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><!--[endif]--><span lang="EN-US">Item1</span><o:p></o:p></p><p class="MsoListParagraphCxSpLast" style="margin-left:72.0pt;mso-add-space:auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]-->a.<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><!--[endif]--><span lang="EN-US">Item1.1</span><o:p></o:p></p>'
    },
    UL: {
        ONE: '<p class="MsoListParagraph" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item<o:p></o:p></span></p>',
        TWO: '<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item2<o:p></o:p></span></p>',
        TREE: '<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol;mso-ansi-language:EN-US">·<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="margin-left:72.0pt;mso-add-space:auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;;mso-ansi-language:EN-US">o<span style="font-size: 7pt; line-height: normal; font-family: Times New Roman; ">&nbsp;&nbsp;</span></span><!--[endif]--><span lang="EN-US">Item1.1<o:p></o:p></span></p>'
    }

};

var HTML = {
    P: '<p>p</p>',
    DIV: '<div>d</div>',
    TXT: 'Hello'
};

var CLEAN = {
    P: '<p>p</p>',
    DIV: '<p>d</p>',
    TXT: '<p>Hello</p>'
};

module('Definitions');
test('wysiwyg defined', function () {
    ok(jQuery.fn.tinylight !== undefined);
});
test('cleanupHtml defined', function () {
    ok(jQuery.mac.tinylight._proto.cleanupHtml !== undefined);
});

module('Cleanup');
cleanupHtml = jQuery.mac.tinylight._proto.cleanupHtml;

function check(given, expected) {
    equal(cleanupHtml(given).toLowerCase(), expected.toLowerCase());
}

test('Will wrap simple text with paragraphs', function () {
    check('Hello', '<p>Hello</p>');
});
test('will remove comments', function () {
    check('Hello <!-- World -->', '<p>Hello</p>');
});


module('Word OL lists');
test('single item', function () {
    var expected = '<ol><li>Item</li></ol>',
        given = WORD_2013.OL.ONE;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});

test('multiple items', function () {
    var expected = '<ol><li>Item1</li><li>Item2</li></ol>',
        given = WORD_2013.OL.TWO;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});

test('indented lists', function () {
    var expected = '<ol><li>Item1</li><li>Item1.1</li></ol>',
        given = WORD_2013.OL.TREE;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});

module('Word UL lists');
test('single item', function () {
    var expected = '<ul><li>Item</li></ul>',
        given = WORD_2013.UL.ONE;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});

test('multiple items', function () {
    var expected = '<ul><li>Item1</li><li>Item2</li></ul>',
        given = WORD_2013.UL.TWO;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});

test('indented lists', function () {
    var expected = '<ul><li>Item1</li><li>Item1.1</li></ul>',
        given = WORD_2013.UL.TREE;

    check(given, expected);
    check(HTML.P + given, CLEAN.P + expected);
    check(HTML.TXT + given, CLEAN.TXT + expected);
    check(given + HTML.P, expected + CLEAN.P);
    check(given + HTML.TXT, expected + CLEAN.TXT);
    check(HTML.P + given + HTML.P, CLEAN.P + expected + CLEAN.P);
    check(HTML.TXT + given + HTML.TXT, CLEAN.TXT + expected + CLEAN.TXT);
});


module('Html lists');
test('lists can not be nested', function () {
    check('<ul><li>Item1<ul><li>Item1.1</li></ul></li></ul>', '<ul><li>Item1</li><li>Item1.1</li></ul>');
    check('<ol><li>Item1<ol><li>Item1.1</li></ol></li></ol>', '<ol><li>Item1</li><li>Item1.1</li></ol>');
    check('<div><ul><li>Item</li></ul></div>', '<ul><li>Item</li></ul>');
    check('<p><ul><li>Item</li></ul></p>', '<ul><li>Item</li></ul>');
    check('<p><p>one</p><ul><li>two</li></ul></p>', '<p>one</p><ul><li>two</li></ul>');
});

test('will fix broken lists items after', function() {
    check('<ul><li>one</li></ul><li>two</li>', '<ul><li>one</li><li>two</li></ul>');
    check('<ul><li>one</li></ul><li>two</li><li>three</li>', '<ul><li>one</li><li>two</li><li>three</li></ul>');
    check('<ul><li>one</li></ul><li>two</li><li>three</li><li>four</li>', '<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>');

    check('<ol><li>one</li></ol><li>two</li>', '<ol><li>one</li><li>two</li></ol>');
    check('<ol><li>one</li></ol><li>two</li><li>three</li>', '<ol><li>one</li><li>two</li><li>three</li></ol>');
    check('<ol><li>one</li></ol><li>two</li><li>three</li><li>four</li>', '<ol><li>one</li><li>two</li><li>three</li><li>four</li></ol>');
});

test('will fix broken lists items before', function() {
    check('<li>one</li><ul><li>two</li></ul>', '<ul><li>one</li><li>two</li></ul>');
    check('<li>one</li><li>two</li><ul><li>three</li></ul>', '<ul><li>one</li><li>two</li><li>three</li></ul>');
    check('<li>one</li><li>two</li><li>three</li><ul><li>four</li></ul>', '<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>');

    check('<li>one</li><ol><li>two</li></ol>', '<ol><li>one</li><li>two</li></ol>');
    check('<li>one</li><li>two</li><ol><li>three</li></ol>', '<ol><li>one</li><li>two</li><li>three</li></ol>');
    check('<li>one</li><li>two</li><li>three</li><ol><li>four</li></ol>', '<ol><li>one</li><li>two</li><li>three</li><li>four</li></ol>');
});

test('will fix broken lists items before and after', function() {
    check('<li>one</li><ul><li>two</li></ul><li>three</li>', '<ul><li>one</li><li>two</li><li>three</li></ul>');
    check('<li>one</li><li>two</li><ul><li>three</li></ul><li>four</li><li>five</li>', '<ul><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li></ul>');

    check('<li>one</li><ol><li>two</li></ol><li>three</li>', '<ol><li>one</li><li>two</li><li>three</li></ol>');
    check('<li>one</li><li>two</li><ol><li>three</li></ol><li>four</li><li>five</li>', '<ol><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li></ol>');
});

test('will fix broken lists items between', function() {
    check('<ul><li>one</li></ul><li>two</li><ul><li>three</li></ul>', '<ul><li>one</li><li>two</li><li>three</li></ul>');
    check('<ul><li>one</li></ul><li>two</li><li>three</li><li>four</li><ul><li>five</li></ul>', '<ul><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li></ul>');
    check('<ul><li>one</li></ul><li>two</li><ol><li>three</li></ol>', '<ul><li>one</li><li>two</li></ul><ol><li>three</li></ol>');
});

test('lists can have line breaks', function() {
    check('<ul><li>one<br>two</li></ul>', '<ul><li>one<br>two</li></ul>');
});

module('Html other');
test('replace long tags with short', function () {
    check('<strong>Item</strong>', '<p><b>Item</b></p>');
    check('<em>Item</em>', '<p><i>Item</i></p>');
});

test('unwrap font tags', function () {
    check('<p><font face="Arial">hello</font></p>', '<p>hello</p>');
    check('<p><b><font face="Arial">hello</font></b></p>', '<p><b>hello</b></p>');
    check('<p><font face="Arial"><b>hello</b></font></p>', '<p><b>hello</b></p>');
});

test('unwrap span tags', function () {
    check('<p><span style="color:red">hello</span></p>', '<p>hello</p>');
    check('<p><b><span style="color:red">hello</span></b></p>', '<p><b>hello</b></p>');
    check('<p><span style="color:red"><b>hello</b></span></p>', '<p><b>hello</b></p>');

    check('<p><span style="color:red"><span style="font-weight:bold">hello</span></span></p>', '<p>hello</p>');
});

test('replace headers', function () {
    check('<h1>Header</h1>', '<p><b>Header</b></p>');
    check('<h2>Header</h2>', '<p><b>Header</b></p>');
    check('<h3>Header</h3>', '<p><b>Header</b></p>');
    check('<h4>Header</h4>', '<p><b>Header</b></p>');
    check('<h5>Header</h5>', '<p><b>Header</b></p>');
    check('<h6>Header</h6>', '<p><b>Header</b></p>');
});

test('convert spans with styles to allowed tags', function () {
    check('<span style="font-weight:bold">span</span>', '<p><b>span</b></p>');
    check('<span style="font-style:italic">span</span>', '<p><i>span</i></p>');
    check('<span style="text-decoration:underline">span</span>', '<p><u>span</u></p>');
    check('<span style="font-weight:bold;font-style:italic">span</span>', '<p><b><i>span</i></b></p>');
    check('<span style="font-weight:bold;text-decoration:underline">span</span>', '<p><b><u>span</u></b></p>');
    check('<span style="font-weight:bold;font-style:italic;text-decoration:underline">span</span>', '<p><b><i><u>span</u></i></b></p>');
    check('<span style="font-style:italic;text-decoration:underline">span</span>', '<p><i><u>span</u></i></p>');
});

test('will wrap b, i, u with paragraph', function () {
    check('<b>hello</b>', '<p><b>hello</b></p>');
    check('<i>hello</i>', '<p><i>hello</i></p>');
    check('<u>hello</u>', '<p><u>hello</u></p>');
    check('<b><i>hello</i></b>', '<p><b><i>hello</i></b></p>');
});

test('will not nest duplicate tags', function () {
    check('<b><span style="font-weight:bold">span</span></b>', '<p><b>span</b></p>');
    check('<i><span style="font-style:italic">span</span></i>', '<p><i>span</i></p>');
    check('<u><span style="text-decoration:underline">span</span></u>', '<p><u>span</u></p>');
    check('<b><span style="font-weight:bold;font-style:italic">span</span></b>', '<p><b><i>span</i></b></p>');
    check('<b><span style="font-weight:bold;text-decoration:underline">span</span></b>', '<p><b><u>span</u></b></p>');
});

test('remove paragrahs and divs', function () {
    check(HTML.DIV, CLEAN.DIV);
    check(HTML.P, CLEAN.P);
    check(HTML.TXT + HTML.DIV, CLEAN.TXT + CLEAN.DIV);
    check(HTML.TXT + HTML.P, CLEAN.TXT + CLEAN.P);
    check(HTML.TXT + HTML.DIV + HTML.TXT, CLEAN.TXT + CLEAN.DIV + CLEAN.TXT);
    check(HTML.TXT + HTML.P + HTML.TXT, CLEAN.TXT + CLEAN.P + CLEAN.TXT);
});

test('remove not allowed tags', function () {
    check('<iframe></iframe>', '');
    check('<script></script>', '');
    check('<style></style>', '');
    check('<img>', '');
    check('<a></a>', '');
    check('<table></table>', '');
});

test('remove tag attributes', function () {
    check('<b style="font-size:12px">b</b>', '<p><b>b</b></p>');
    check('<b class="loud" style="font-size:12px">b</b>', '<p><b>b</b></p>');
    check('<b data-bind="text: name">b</b>', '<p><b>b</b></p>');
});

test('combine repeated tags', function () {
    check('<b>H</b><b>ello</b>', '<p><b>Hello</b></p>');
    check('<i>H</i><i>ello</i>', '<p><i>Hello</i></p>');
    check('<u>H</u><u>ello</u>', '<p><u>Hello</u></p>');
    check('<b>H</b><b>ell</b><b>o</b>', '<p><b>Hello</b></p>');

    check('<ul><li><b>H</b><b>ello</b></li></ul><ul><li>World</li></ul>', '<ul><li><b>Hello</b></li><li>World</li></ul>');

    check('<ul><li>1</li></ul><ul><li>2</li></ul>', '<ul><li>1</li><li>2</li></ul>');
    check('<ul><li>1</li></ul><ul><li>2</li></ul><ul><li>3</li></ul>', '<ul><li>1</li><li>2</li><li>3</li></ul>');

    check('<ol><li>1</li></ol><ol><li>2</li></ol>', '<ol><li>1</li><li>2</li></ol>');
    check('<ol><li>1</li></ol><ol><li>2</li></ol><ol><li>3</li></ol>', '<ol><li>1</li><li>2</li><li>3</li></ol>');
});

test('fill empty and with br paragraphs and divs with non break space', function() {
    check('<p></p>', '<p>&nbsp;</p>');
    check('<p><br></p>', '<p>&nbsp;</p>');
    check('<div><br></div>', '<p>&nbsp;</p>');

    check('<p style="color:red" class="red"></p>', '<p>&nbsp;</p>');
    check('<p style="color:red" class="red"><br></p>', '<p>&nbsp;</p>');
    check('<div style="color:red" class="red"><br></div>', '<p>&nbsp;</p>');
});

test('property convert line breaks', function () {
    check('one<div><br></div><div>two</div>', '<p>one</p><p>&nbsp;</p><p>two</p>');
    check('<p>one</p><p>&nbsp;</p><p>two</p>', '<p>one</p><p>&nbsp;</p><p>two</p>');
    check('before<ul><li>item</li></ul><div><br></div>after<br>', '<p>before</p><ul><li>item</li></ul><p>&nbsp;</p><p>after</p>');
    check('before<div><ul><li>item</li></ul></div>', '<p>before</p><ul><li>item</li></ul>');
    check('<p>one</p><ul><li>two</li></ul>', '<p>one</p><ul><li>two</li></ul>');
});

test('should trim spaces inside tags', function () {
    check('<p> hello </p>', '<p>hello</p>');
    check('<p> hello <b>world</b> </p>', '<p>hello <b>world</b></p>');
});

test('should unwrap tables', function () {
    check('<table class="table"><tr><td>key</td><td>val</td></tr><tr><td>1</td><td>one</td></tr></table>',
        '<p>key</p><p>&nbsp;</p><p>val</p><p>&nbsp;</p><p>1</p><p>&nbsp;</p><p>one</p><p>&nbsp;</p>');

    check('<table class="table"><tr><td><p>hello</p></td></tr></table>',
        '<p>hello</p><p>&nbsp;</p>');

    check('<table class="table"><tr><td><b>hello</b></td></tr></table>',
        '<p><b>hello</b></p><p>&nbsp;</p>');
});

test('real world tests', function () {
    check('<font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt;" class="MsoNormal"><b style="mso-bidi-font-weight: normal;"><span style="line-height: 115%; font-size: 12pt; mso-bidi-font-size: 11.0pt;"><font color="#000000"><font face="Calibri">EMPLOYERS:<?xml:namespace prefix = o ns = "urn:schemas-microsoft-com:office:office" /><o:p></o:p></font></font></span></b></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">1.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of job ads for specialists and managers to the level that allowsrabota to outperform competitors;<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 3pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">2.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span><font face="Calibri"><font size="3">Increase employer engagement indicators throughmajor UX improvement. <o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt;" class="MsoListParagraph"><span style="color: rgb(127, 127, 127); mso-themecolor: text1; mso-themetint: 128;"><font size="3"><font face="Calibri">Indicators include: adding new jobposting, processing applications, CV Search<o:p></o:p></font></font></span></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">3.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of active clients serviced through Sales Force by 25% from 1.000 to 1.250(5* companies - from 600 to 700); increase the number of clients in the regionsby 50%.<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">4.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of eCommerce orders from 40 to 100 per month; add Hot Jobs and CVDBto the products offered through eCommerce; implement alternative paymentmethods.<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">5.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font size="3"><font face="Calibri">ImproveCC service to SMBs (response within 4 hours, telephone support, active CCtargeting companies that post good quality ads).<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font>',
          '<p><b>EMPLOYERS:</b></p><ol><li>Increasethe number of job ads for specialists and managers to the level that allowsrabota to outperform competitors;</li><li>Increase employer engagement indicators throughmajor UX improvement. </li></ol><p>Indicators include: adding new jobposting, processing applications, CV Search</p><ol><li>Increasethe number of active clients serviced through Sales Force by 25% from 1.000 to 1.250(5* companies - from 600 to 700); increase the number of clients in the regionsby 50%.</li><li>Increasethe number of eCommerce orders from 40 to 100 per month; add Hot Jobs and CVDBto the products offered through eCommerce; implement alternative paymentmethods.</li><li>ImproveCC service to SMBs (response within 4 hours, telephone support, active CCtargeting companies that post good quality ads).</li></ol>');

    check('<b style="color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"><u>Our Requirements</u></b><p style="margin-top: 2px; margin-bottom: 2px; background-color: rgb(238, 238, 238); color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"><b>Mandatory:</b></p><p style="margin-top: 2px; margin-bottom: 2px; background-color: rgb(238, 238, 238); color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"></p><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of accounting principles</li></ul><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Good knowledge of MS Excel</li><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of 1С: Enterprise 8</li><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of accounting software or ERP systems, experience in implementing projects is a plus</li></ul><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Professional certification is a plus</li></ul><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Good command of spoken and written English, Ukrainian and Russian</li></ul><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Positive attitude, excellent communication and interpersonal skilllated to</li>',
          '<p><b><u>Our Requirements</u></b></p><p><b>Mandatory:</b></p><p>&nbsp;</p><ul><li>Knowledge of accounting principles</li><li>Good knowledge of MS Excel</li><li>Knowledge of 1С: Enterprise 8</li><li>Knowledge of accounting software or ERP systems, experience in implementing projects is a plus</li><li>Professional certification is a plus</li><li>Good command of spoken and written English, Ukrainian and Russian</li><li>Positive attitude, excellent communication and interpersonal skilllated to</li></ul>');

    check('<b style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);">Обязанности</b><br style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><ul style="margin-bottom: 0px; margin-left: 0px; padding-right: 15px; padding-left: 15px; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><li style="list-style-position: inside;"><span style="font-family: Helv; color: black; font-size: 10pt;"><span style="font-family: Arial;">Увеличение уровня и объёмов продаж в альтернативных каналах (АПП, дилеры, М2М);</span></span></li></ul>',
          '<p><b>Обязанности</b></p><ul><li>Увеличение уровня и объёмов продаж в альтернативных каналах (АПП, дилеры, М2М);</li></ul>');

    check('<p class="MsoNormal">В департамент маркетингатребуется <b>Менеджер по рекламе <o:p></o:p></b></p><p class="MsoNormal"><b>Основныефункциональные обязанности: <o:p></o:p></b></p><p class="MsoNormal">Размещение наружнойрекламы по всей Украине;<o:p></o:p></p><p class="MsoNormal">Организация&nbsp; работы промоутеров (с помощью рекламныхагенств)<o:p></o:p></p><p class="MsoNormal">Взаимодействие сподрядчиками по изготовлению и размещению постеров набордах.<o:p></o:p></p><p class="MsoNormal"><b>Требования :<o:p></o:p></b></p><p class="MsoNormal">Уверенный пользователь ПК<o:p></o:p></p><p class="MsoNormal">Высшее образование(желательно маркетинг), приветствуется дополнительное образование&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; в сферах рекламы<o:p></o:p></p><p class="MsoNormal">Опыт работы в маркетинге(желательно в ритейле ) от 2-х лет<o:p></o:p></p><p class="MsoNormal">Опыт размещения наружнойрекламы по Украине<o:p></o:p></p><p class="MsoNormal">Опыт организации проведенияпромо -&nbsp; мероприятий <o:p></o:p></p><p class="MsoNormal"><b>Личные качества:</b> организованность, усидчивость, ответственность, инициативность,исполнительность.<o:p></o:p></p><p class="MsoNormal"><b><span style="color:black;mso-ansi-language:RU">Компанияпредлагает:</span></b> интересную работу вкрупной стабильной развивающейся компании, в команде профессионалов&nbsp; возможность роста и развития.<o:p></o:p></p>',
        '<p>В департамент маркетингатребуется <b>Менеджер по рекламе </b></p><p><b>Основныефункциональные обязанности: </b></p><p>Размещение наружнойрекламы по всей Украине;</p><p>Организация&nbsp; работы промоутеров (с помощью рекламныхагенств)</p><p>Взаимодействие сподрядчиками по изготовлению и размещению постеров набордах.</p><p><b>Требования :</b></p><p>Уверенный пользователь ПК</p><p>Высшее образование(желательно маркетинг), приветствуется дополнительное образование&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; в сферах рекламы</p><p>Опыт работы в маркетинге(желательно в ритейле ) от 2-х лет</p><p>Опыт размещения наружнойрекламы по Украине</p><p>Опыт организации проведенияпромо -&nbsp; мероприятий</p><p><b>Личные качества:</b> организованность, усидчивость, ответственность, инициативность,исполнительность.</p><p><b>Компанияпредлагает:</b> интересную работу вкрупной стабильной развивающейся компании, в команде профессионалов&nbsp; возможность роста и развития.</p>');
});

/* TEST CASE EXAMPLE
test('<TEST CASE TITLE>', function () {
    var given = '<b>H</b><b>ello</b>';
    var expect = '<b>Hello</b>';
    equal(cleanupHtml(given), expect);
});
*/
