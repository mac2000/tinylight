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

    check('<ul><p>text</p><ol><li>item</li></ol>text.<br><li>item</li></ul>', '<p>text</p><ol><li>item</li></ol><p>text.</p><ul><li>item</li></ul>');
});

test('will fix broken lists items before', function() {
    check('<li>one</li><ul><li>two</li></ul>', '<ul><li>one</li><li>two</li></ul>');
    check('<li>one</li><li>two</li><ul><li>three</li></ul>', '<ul><li>one</li><li>two</li><li>three</li></ul>');
    check('<li>one</li><li>two</li><li>three</li><ul><li>four</li></ul>', '<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>');

    check('<li>one</li><ol><li>two</li></ol>', '<ol><li>one</li><li>two</li></ol>');
    check('<li>one</li><li>two</li><ol><li>three</li></ol>', '<ol><li>one</li><li>two</li><li>three</li></ol>');
    check('<li>one</li><li>two</li><li>three</li><ol><li>four</li></ol>', '<ol><li>one</li><li>two</li><li>three</li><li>four</li></ol>');

    check('<ul><p>text</p><li>item</li>text.<br><ol><li>item</li></ol></ul>', '<p>text</p><ul><li>item</li></ul><p>text.</p><ol><li>item</li></ol>');
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

test('paste list from word 2003', function() {
    check('1.<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">  </span></span>one', '<ol><li>one</li></ol>');
    check('•<span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">   </span></span>hello', '<ul><li>hello</li></ul>');
    check('<P style="TEXT-ALIGN: justify; TEXT-INDENT: -7.1pt; MARGIN: 0cm 0cm 0pt 42.55pt; mso-list: l0 level1 lfo1; tab-stops: 42.55pt" class=ListParagraph><FONT color=#000000><SPAN style="mso-fareast-font-family: Calibri; mso-ansi-language: RU"><SPAN style="mso-list: Ignore"><FONT size=3 face=Calibri>-</FONT><SPAN style="FONT: 7pt \'Times New Roman\'">&nbsp;&nbsp; </SPAN></SPAN></SPAN><SPAN style="mso-ansi-language: RU"><FONT size=3><FONT face=Calibri>hello <?xml:namespace prefix = o ns = "urn:schemas-microsoft-com:office:office" /><o:p></o:p></FONT></FONT></SPAN></FONT></P>', '<ul><li>hello</li></ul>');
    check('<div><span class="Apple-tab-span" style="white-space:pre"><span style="white-space: normal;">   </span></span>hello</div>', '<ul><li>hello</li></ul>');
});

test('should merge spans', function(){
    check('<P style="TEXT-INDENT: -18pt; MARGIN: 0cm 0cm 0pt 18pt; mso-list: l0 level1 lfo1; tab-stops: list 18.0pt" class=MsoNormal><SPAN style="FONT-FAMILY: Symbol; COLOR: black; FONT-SIZE: 10pt; mso-fareast-font-family: Symbol; mso-bidi-font-family: Symbol; mso-bidi-font-size: 9.0pt"><SPAN style="mso-list: Ignore">·<SPAN style="FONT: 7pt \'Times New Roman\'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </SPAN></SPAN></SPAN><FONT color=#000000><SPAN style="FONT-FAMILY: Arial; FONT-SIZE: 9pt; mso-ansi-language: EN-US" lang=EN-US>h</SPAN><SPAN style="FONT-FAMILY: Arial; FONT-SIZE: 9pt">ello<SPAN style="COLOR: black"> <?xml:namespace prefix = o ns = "urn:schemas-microsoft-com:office:office" /><o:p></o:p></SPAN></SPAN></FONT></P>', '<ul><li>hello</li></ul>');
});

test('should not convert not list strings', function() {
    check('1 one', '<p>1 one</p>');
    check('<p>1 one</p>', '<p>1 one</p>');
    check('044 234-12-12', '<p>044 234-12-12</p>');
});

test('should convert list paragraphs', function() {
    check('<p>1. one</p>', '<ol><li>one</li></ol>');
    check('<p>1. one</p><p>2. two</p>', '<ol><li>one</li><li>two</li></ol>');
    check('<p><b>title</b></p><p>1. one</p><p>2. two</p>', '<p><b>title</b></p><ol><li>one</li><li>two</li></ol>');
    check('<p class="MsoNormal" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal"><span lang="UK">- hello;<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal"><span lang="UK">- world;<o:p></o:p></span></p>',
    	'<ul><li>hello;</li><li>world;</li></ul>');
    check('<font color="#000000" face="Times New Roman" size="3"></font><p style="margin: 0cm 0cm 0pt; line-height: normal;"><span lang="UK"><font color="#000000" face="Calibri" size="3">- item;</font></span></p><font color="#000000" face="Times New Roman" size="3"></font><p style="margin: 0cm 0cm 0pt; line-height: normal;"><span lang="UK"><font color="#000000" face="Calibri" size="3">- item;</font></span></p><font color="#000000" face="Times New Roman" size="3"></font>',
        '<ul><li>item;</li><li>item;</li></ul>');
});

module('Html other');
test('unwrap anchor tags', function () {
    check('<a href="#">hello</a>', '<p>hello</p>');
    check('<p><a href="#">hello</a></p>', '<p>hello</p>');
});

test('replace long tags with short', function () {
    check('<strong>Item</strong>', '<p><b>Item</b></p>');
    check('<em>Item</em>', '<p><i>Item</i></p>');
});

test('unwrap font tags', function () {
    check('<p><font face="Arial">hello</font></p>', '<p>hello</p>');
    check('<p><b><font face="Arial">hello</font></b></p>', '<p><b>hello</b></p>');
    check('<p><font face="Arial"><b>hello</b></font></p>', '<p><b>hello</b></p>');
});

test('unwrap pre tags', function () {
    check('<pre>hello</pre>', '<p>hello</p>');
    check('<pre><b><font face="Arial">hello</font></b></pre>', '<p><b>hello</b></p>');
    check('<pre><font face="Arial"><b>hello</b></font></pre>', '<p><b>hello</b></p>');
});

test('unwrap strike tags', function () {
    check('<strike>hello</strike>', '<p>hello</p>');
    check('<strike><b><font face="Arial">hello</font></b></strike>', '<p><b>hello</b></p>');
    check('<strike><font face="Arial"><b>hello</b></font></strike>', '<p><b>hello</b></p>');
});

test('unwrap del tags', function () {
    check('<del>hello</del>', '<p>hello</p>');
    check('<del><b><font face="Arial">hello</font></b></del>', '<p><b>hello</b></p>');
    check('<del><font face="Arial"><b>hello</b></font></del>', '<p><b>hello</b></p>');
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

test('will remove b, i, u within empty paragraphs', function(){
    check('<p><b>&nbsp;</b></p>', '<p>&nbsp;</p>');
    check('<p><i>&nbsp;</i></p>', '<p>&nbsp;</p>');
    check('<p><u>&nbsp;</u></p>', '<p>&nbsp;</p>');
    check('<p><b><u>&nbsp;</u></b></p>', '<p>&nbsp;</p>');
    check('<p><b><i>&nbsp;</i></b></p>', '<p>&nbsp;</p>');
    check('<p><i><u>&nbsp;</u></i></p>', '<p>&nbsp;</p>');
    check('<p><i><b>&nbsp;</b></i></p>', '<p>&nbsp;</p>');
    check('<p><u><i>&nbsp;</i></u></p>', '<p>&nbsp;</p>');
    check('<p><u><b>&nbsp;</b></u></p>', '<p>&nbsp;</p>');
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

test('should combine lists separated by empty paragraph', function(){
    check('<ul><li>1</li></ul><p>&nbsp;</p><ul><li>2</li></ul>', '<ul><li>1</li><li>2</li></ul>');
});

test('should remove empty font tags', function(){
    check('<font></font>', '');
    check('<font face="Arial"></font>', '');
    check('<font face="Arial" size="7"></font>', '');
});

test('fill empty and with br paragraphs and divs with non break space', function() {
    check('<p></p>', '<p>&nbsp;</p>');
    check('<p><br></p>', '<p>&nbsp;</p>');
    check('<div><br></div>', '<p>&nbsp;</p>');

    check('<p style="color:red" class="red"></p>', '<p>&nbsp;</p>');
    check('<p style="color:red" class="red"><br></p>', '<p>&nbsp;</p>');
    check('<div style="color:red" class="red"><br></div>', '<p>&nbsp;</p>');

    check('<p><b><br></b></p>', '<p>&nbsp;</p>');
});

test('property convert line breaks', function () {
    check('one<div><br></div><div>two</div>', '<p>one</p><p>&nbsp;</p><p>two</p>');
    check('<p>one</p><p>&nbsp;</p><p>two</p>', '<p>one</p><p>&nbsp;</p><p>two</p>');
    check('before<ul><li>item</li></ul><div><br></div>after<br>', '<p>before</p><ul><li>item</li></ul><p>&nbsp;</p><p>after</p>');
    check('before<div><ul><li>item</li></ul></div>', '<p>before</p><ul><li>item</li></ul>');
    check('<p>one</p><ul><li>two</li></ul>', '<p>one</p><ul><li>two</li></ul>');
    check('<ul><li>one</li></ul><p>&nbsp;</p><p>two</p>', '<ul><li>one</li></ul><p>&nbsp;</p><p>two</p>');
    check('<ul><li><b>one</b></li></ul><p>&nbsp;</p><p><b>two</b></p>', '<ul><li><b>one</b></li></ul><p>&nbsp;</p><p><b>two</b></p>');
    check('<ul><li>one</li></ul><p><br></p><p>two</p>', '<ul><li>one</li></ul><p>&nbsp;</p><p>two</p>');
    check('<p>one<br>two</p>', '<p>one</p><p>two</p>');
});

test('should trim spaces inside tags', function () {
    check('<p> hello </p>', '<p>hello</p>');
    check('<p> hello <b>world</b> </p>', '<p>hello <b>world</b></p>');
    check('<b><span lang="RU" style="font-size:11.0pt;mso-bidi-font-size:12.0pt;font-family:&quot;Arial Unicode MS&quot;,&quot;sans-serif&quot;;mso-ascii-font-family:Helvetica;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#4C4C4C;mso-ansi-language:RU">Hello</span></b><b><span lang="RU" style="font-size:11.0pt;mso-bidi-font-size:12.0pt;font-family:&quot;Helvetica&quot;,&quot;sans-serif&quot;;mso-fareast-font-family:&quot;Arial Unicode MS&quot;;mso-hansi-font-family:&quot;Arial Unicode MS&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#4C4C4C;mso-ansi-language:RU"> </span></b><b><span lang="RU" style="font-size:11.0pt;mso-bidi-font-size:12.0pt;font-family:&quot;Arial Unicode MS&quot;,&quot;sans-serif&quot;;mso-ascii-font-family:Helvetica;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#4C4C4C;mso-ansi-language:RU">World</span></b>',
        '<p><b>Hello World</b></p>');
});

test('should unwrap divs with only one div or paragraph child', function(){
	check('<div><div>hello</div></div>', '<p>hello</p>');
	check('<div><div><p>hello</p></div></div>', '<p>hello</p>');
});

test('should unwrap tables', function () {
    check('<table class="table"><tr><td>key</td><td>val</td></tr><tr><td>1</td><td>one</td></tr></table>',
        '<p>key</p><p>&nbsp;</p><p>val</p><p>&nbsp;</p><p>1</p><p>&nbsp;</p><p>one</p><p>&nbsp;</p>');

    check('<table class="table"><tr><td><p>hello</p></td></tr></table>',
        '<p>hello</p><p>&nbsp;</p>');

    check('<table class="table"><tr><td><b>hello</b></td></tr></table>',
        '<p><b>hello</b></p><p>&nbsp;</p>');

    check('<div><table><tbody><tr><td><div><div><div><div><div><div><p><strong>hello</strong></p></div></div></div></div></div></div></td></tr></tbody></table></div>',
    	'<p><b>hello</b></p><p>&nbsp;</p>');

    check('<div><table><tbody><tr><td><div><div><div><div><div><div><p><strong>hello</strong></p><p>world</p></div></div></div></div></div></div></td></tr></tbody></table></div>',
    	'<p><b>hello</b></p><p>world</p><p>&nbsp;</p>');

    check('<div><table><tbody><tr><td><div><div><div><div><div><div><p><strong>hello</strong></p><p>world</p><p>lorem</p></div></div></div><p>&nbsp;</p></div></div></div></td></tr></tbody></table></div>',
    	'<p><b>hello</b></p><p>world</p><p>lorem</p><p>&nbsp;</p><p>&nbsp;</p>');
});

test('real world tests', function () {

    check('<font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt;" class="MsoNormal"><b style="mso-bidi-font-weight: normal;"><span style="line-height: 115%; font-size: 12pt; mso-bidi-font-size: 11.0pt;"><font color="#000000"><font face="Calibri">EMPLOYERS:<?xml:namespace prefix = o ns = "urn:schemas-microsoft-com:office:office" /><o:p></o:p></font></font></span></b></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">1.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of job ads for specialists and managers to the level that allowsrabota to outperform competitors;<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 3pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">2.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span><font face="Calibri"><font size="3">Increase employer engagement indicators throughmajor UX improvement. <o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt;" class="MsoListParagraph"><span style="color: rgb(127, 127, 127); mso-themecolor: text1; mso-themetint: 128;"><font size="3"><font face="Calibri">Indicators include: adding new jobposting, processing applications, CV Search<o:p></o:p></font></font></span></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">3.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of active clients serviced through Sales Force by 25% from 1.000 to 1.250(5* companies - from 600 to 700); increase the number of clients in the regionsby 50%.<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">4.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font face="Calibri"><font size="3">Increasethe number of eCommerce orders from 40 to 100 per month; add Hot Jobs and CVDBto the products offered through eCommerce; implement alternative paymentmethods.<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font><p style="margin: 0cm 0cm 10pt 35.7pt; text-indent: -17.85pt; mso-list: l0 level1 lfo1;" class="MsoListParagraph"><font color="#000000"><span style="mso-bidi-font-family: Calibri; mso-bidi-theme-font: minor-latin;"><span style="mso-list: Ignore;"><font size="3" face="Calibri">5.</font><span style=\'font: 7pt/normal "Times New Roman"; font-size-adjust: none; font-stretch: normal;\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><font size="3"><font face="Calibri">ImproveCC service to SMBs (response within 4 hours, telephone support, active CCtargeting companies that post good quality ads).<o:p></o:p></font></font></font></p><font color="#000000" size="3" face="Times New Roman"></font>',
          '<p><b>EMPLOYERS:</b></p><ol><li>Increasethe number of job ads for specialists and managers to the level that allowsrabota to outperform competitors;</li><li>Increase employer engagement indicators throughmajor UX improvement.</li></ol><p>Indicators include: adding new jobposting, processing applications, CV Search</p><ol><li>Increasethe number of active clients serviced through Sales Force by 25% from 1.000 to 1.250(5* companies - from 600 to 700); increase the number of clients in the regionsby 50%.</li><li>Increasethe number of eCommerce orders from 40 to 100 per month; add Hot Jobs and CVDBto the products offered through eCommerce; implement alternative paymentmethods.</li><li>ImproveCC service to SMBs (response within 4 hours, telephone support, active CCtargeting companies that post good quality ads).</li></ol>');

    check('<b style="color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"><u>Our Requirements</u></b><p style="margin-top: 2px; margin-bottom: 2px; background-color: rgb(238, 238, 238); color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"><b>Mandatory:</b></p><p style="margin-top: 2px; margin-bottom: 2px; background-color: rgb(238, 238, 238); color: rgb(0, 0, 0); font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal;"></p><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of accounting principles</li></ul><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Good knowledge of MS Excel</li><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of 1С: Enterprise 8</li><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Knowledge of accounting software or ERP systems, experience in implementing projects is a plus</li></ul><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Professional certification is a plus</li></ul><ul style="margin-top: 2px; margin-bottom: 2px; margin-left: 0px; padding-left: 40px;"><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Good command of spoken and written English, Ukrainian and Russian</li></ul><li style="background-color: rgb(204, 204, 204); background-position: initial initial; background-repeat: initial initial;">Positive attitude, excellent communication and interpersonal skilllated to</li>',
          '<p><b><u>Our Requirements</u></b></p><p><b>Mandatory:</b></p><p>&nbsp;</p><ul><li>Knowledge of accounting principles</li><li>Good knowledge of MS Excel</li><li>Knowledge of 1С: Enterprise 8</li><li>Knowledge of accounting software or ERP systems, experience in implementing projects is a plus</li><li>Professional certification is a plus</li><li>Good command of spoken and written English, Ukrainian and Russian</li><li>Positive attitude, excellent communication and interpersonal skilllated to</li></ul>');

    check('<b style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);">Обязанности</b><br style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><ul style="margin-bottom: 0px; margin-left: 0px; padding-right: 15px; padding-left: 15px; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><li style="list-style-position: inside;"><span style="font-family: Helv; color: black; font-size: 10pt;"><span style="font-family: Arial;">Увеличение уровня и объёмов продаж в альтернативных каналах (АПП, дилеры, М2М);</span></span></li></ul>',
          '<p><b>Обязанности</b></p><ul><li>Увеличение уровня и объёмов продаж в альтернативных каналах (АПП, дилеры, М2М);</li></ul>');

    check('<p class="MsoNormal">В департамент маркетингатребуется <b>Менеджер по рекламе <o:p></o:p></b></p><p class="MsoNormal"><b>Основныефункциональные обязанности: <o:p></o:p></b></p><p class="MsoNormal">Размещение наружнойрекламы по всей Украине;<o:p></o:p></p><p class="MsoNormal">Организация&nbsp; работы промоутеров (с помощью рекламныхагенств)<o:p></o:p></p><p class="MsoNormal">Взаимодействие сподрядчиками по изготовлению и размещению постеров набордах.<o:p></o:p></p><p class="MsoNormal"><b>Требования :<o:p></o:p></b></p><p class="MsoNormal">Уверенный пользователь ПК<o:p></o:p></p><p class="MsoNormal">Высшее образование(желательно маркетинг), приветствуется дополнительное образование&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; в сферах рекламы<o:p></o:p></p><p class="MsoNormal">Опыт работы в маркетинге(желательно в ритейле ) от 2-х лет<o:p></o:p></p><p class="MsoNormal">Опыт размещения наружнойрекламы по Украине<o:p></o:p></p><p class="MsoNormal">Опыт организации проведенияпромо -&nbsp; мероприятий <o:p></o:p></p><p class="MsoNormal"><b>Личные качества:</b> организованность, усидчивость, ответственность, инициативность,исполнительность.<o:p></o:p></p><p class="MsoNormal"><b><span style="color:black;mso-ansi-language:RU">Компанияпредлагает:</span></b> интересную работу вкрупной стабильной развивающейся компании, в команде профессионалов&nbsp; возможность роста и развития.<o:p></o:p></p>',
        '<p>В департамент маркетингатребуется <b>Менеджер по рекламе </b></p><p><b>Основныефункциональные обязанности: </b></p><p>Размещение наружнойрекламы по всей Украине;</p><p>Организация&nbsp; работы промоутеров (с помощью рекламныхагенств)</p><p>Взаимодействие сподрядчиками по изготовлению и размещению постеров набордах.</p><p><b>Требования :</b></p><p>Уверенный пользователь ПК</p><p>Высшее образование(желательно маркетинг), приветствуется дополнительное образование&nbsp; в сферах рекламы</p><p>Опыт работы в маркетинге(желательно в ритейле ) от 2-х лет</p><p>Опыт размещения наружнойрекламы по Украине</p><p>Опыт организации проведенияпромо -&nbsp; мероприятий</p><p><b>Личные качества:</b> организованность, усидчивость, ответственность, инициативность,исполнительность.</p><p><b>Компанияпредлагает:</b> интересную работу вкрупной стабильной развивающейся компании, в команде профессионалов&nbsp; возможность роста и развития.</p>');

    check('<P style="TEXT-ALIGN: justify; TEXT-INDENT: -18pt; MARGIN: 0cm 0cm 0pt 36pt; mso-margin-top-alt: auto; mso-margin-bottom-alt: auto; mso-list: l1 level1 lfo2" class=MsoNormal><SPAN style="FONT-FAMILY: Symbol; COLOR: #002060; FONT-SIZE: 11pt; mso-ansi-language: UK; mso-bidi-font-family: Symbol; mso-fareast-font-family: Symbol; mso-font-kerning: 9.0pt" lang=UK><SPAN style="mso-list: Ignore">·<SPAN style="FONT: 7pt \'Times New Roman\'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </SPAN></SPAN></SPAN><SPAN style="FONT-FAMILY: Calibri; COLOR: #002060; FONT-SIZE: 11pt; mso-ansi-language: UK; mso-bidi-font-family: Arial; mso-font-kerning: 9.0pt" lang=UK>координувати усі види діяльності між відділами в напрямку поповнення запасів продукції;<o:p></o:p></SPAN></P>',
        '<ul><li>координувати усі види діяльності між відділами в напрямку поповнення запасів продукції;</li></ul>');

    check('<p class="MsoNormal" style="margin-left:36.0pt;text-indent:-18.0pt;mso-list:l0 level1 lfo1;tab-stops:list 36.0pt"><!--[if !supportLists]--><span style="font-size:13.0pt;mso-bidi-font-size:15.5pt;font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:Symbol">-<span style="font-size: 7pt; line-height: normal; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--[endif]--><span style="font-size:13.0pt;mso-bidi-font-size:15.5pt;font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">уверенный пользователь ПК, знание1С (Кадры. Предприятие), отличное знание </span><span lang="EN-US" style="font-size:13.0pt;mso-bidi-font-size:15.5pt;font-family:&quot;Times New Roman&quot;,&quot;serif&quot;;mso-ansi-language:EN-US">Excel</span><span style="font-size:13.0pt;mso-bidi-font-size:15.5pt;font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">;<o:p></o:p></span></p>',
        '<ul><li>уверенный пользователь ПК, знание1С (Кадры. Предприятие), отличное знание Excel;</li></ul>');

    check('<p class="MsoNormal" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal"><span lang="UK">- item;<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal"><span lang="UK">- item;<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal"><span lang="UK">- item;<o:p></o:p></span></p>',
        '<ul><li>item;</li><li>item;</li><li>item;</li></ul>');

});

test('should proccess previously saved html', function(){
    check('Hello<i>, </i>World <b>!</b>. <br>', '<p>Hello<i>, </i>World <b>!</b>.</p>');
    check('Hello<i>, </i>World <b>!</b>. <br><p>paragraph</p>', '<p>Hello<i>, </i>World <b>!</b>.</p><p>paragraph</p>');
});

test('should strip spaces', function(){
    check('&nbsp;&nbsp;', '<p>&nbsp;</p>');
    check('<p>&nbsp;&nbsp;</p>', '<p>&nbsp;</p>');
    check('<p>&nbsp; </p>', '<p>&nbsp;</p>');
    check('<p> &nbsp;</p>', '<p>&nbsp;</p>');
    check('<p> &nbsp; </p>', '<p>&nbsp;</p>');
    check('<p> &nbsp;&nbsp; </p>', '<p>&nbsp;</p>');
    check('<p> <strong>&nbsp;&nbsp;</strong> </p>', '<p>&nbsp;</p>');
});

test('should strip repeated newlines', function () {
    check('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>', '<p>&nbsp;</p>');
    check('<p>&nbsp;</p>', '<p>&nbsp;</p>');
    check('<p>&nbsp;</p><p>hello</p><p>&nbsp;</p>', '<p>hello</p><p>&nbsp;</p>');
    check('<p>&nbsp;</p><p>hello</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>world</p><p>&nbsp;</p>', '<p>hello</p><p>&nbsp;</p><p>&nbsp;</p><p>world</p><p>&nbsp;</p>');
});

test('unwrap if all content is single list item', function () {
    check('<ul><li><ul><li>item</li></ul></li></ul>', '<ul><li>item</li></ul>');
});

test('buggy wrapped text should be fixed', function () {
    check('- item<p> </p>-item<p> </p>', '<ul><li>item</li><li>item</li></ul>');
    check('1. item<p> </p>2.item<p> </p>', '<ol><li>item</li><li>item</li></ol>');
});

test('remove empty paragraphs from beggining', function () {
    check('<p></p><p>item</p>', '<p>item</p>');
    check('<p></p><p></p><p>item</p>', '<p>item</p>');
    check('<p>&nbsp;</p><p>item</p>', '<p>item</p>');
    check('<p>&nbsp;</p><p>&nbsp;</p><p>item</p>', '<p>item</p>');
    check('<p>&nbsp;</p><p>&nbsp;</p><p>item</p><p>&nbsp;</p><p>item</p>', '<p>item</p><p>&nbsp;</p><p>item</p>');
});

test('remove empty paragraphs between list items', function () {
    check('<UL> <LI> item1 </LI> <LI> item2 </LI> <LI> item3</LI></UL>', '<ul><li>item1</li><li>item2</li><li>item3</li></ul>');
});

//- item<p> </p>-item<p> </p>


/* TEST CASE EXAMPLE
test('<TEST CASE TITLE>', function () {
    var given = '<b>H</b><b>ello</b>';
    var expect = '<b>Hello</b>';
    equal(cleanupHtml(given), expect);
});
*/
