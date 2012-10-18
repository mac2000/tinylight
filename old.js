function tinyfocus() {

    var frm = document.getElementById('frmData');
    if (frm == null) return;

    var tinybody = frm.contentWindow.document.body;
    tinybody.style.color = '#333';

    if (typeof (tinyDefText) != 'undefined') {

        var tt = tinybody.innerHTML+'';
        tt = tt.replace(new RegExp('<\/?[^>]+>', 'gi'), '');
        tt = tt.replace(new RegExp('[^a-zA-Zа-яА-я0-9]', 'gi'), '');
        tt = tt.replace(new RegExp('nbsp', 'gi'), '');
        tt = tt.replace(new RegExp('acute', 'gi'), '');

        var tdt = tinyDefText+'';
        tdt = tdt.replace(new RegExp('<\/?[^>]+>', 'gi'), '');
        tdt = tdt.replace(new RegExp('[^a-zA-Zа-яА-я0-9]', 'gi'), '');
        tdt = tdt.replace(new RegExp('nbsp', 'gi'), '');
        tdt = tdt.replace(new RegExp('acute', 'gi'), '');
        //alert(tt + '\n-----------------\n' + tdt);
        if (tt == tdt) {
            tinybody.innerHTML = '<p>&nbsp;</p>';
        }

    }
}

function setTinyText(text) {
    var frm = document.getElementById('frmData');
    if (frm) {
        if (frm.contentWindow.document.body.contentEditable) frm.contentWindow.document.body.contentEditable = false;
        else frm.contentWindow.document.designMode = 'off';
        frm.contentWindow.document.body.innerHTML = text;
        if (typeof (tinyDefText) != 'undefined') {
            if (text == tinyDefText) frm.contentWindow.document.body.style.color = '#999';
        }
//cleanupHTML();
        if (frm.contentWindow.document.body.contentEditable) frm.contentWindow.document.body.contentEditable = true;
        else frm.contentWindow.document.designMode = 'on';
    }
}

function setTinyFocus() {
    document.getElementById("frmData").contentWindow.document.body.focus();
}

function cleanupHTML() {
    if(!document.getElementById("frmData")) return;
    var html = document.getElementById("frmData").contentWindow.document.body.innerHTML;

    var content = html;
    var bull = String.fromCharCode(8226);
    var middot = String.fromCharCode(183);
    var rl = '\u2122,<sup>TM</sup>,\u2026,...,\x93|\x94|\u201c|\u201d,",\x60|\x91|\x92|\u2018|\u2019,\',\u2013|\u2014|\u2015|\u2212,-';
    var r = rl.split(',');
    for (var i = 0; i < r.length; i += 2)    content = content.replace(new RegExp(r[i], 'gi'), r[i + 1]);

    ///////////////////////// for Chrome and Safari - гады лепят спаны бум их заменять
    var isWebKit = /WebKit/.test(navigator.userAgent);
    var isGecko = !isWebKit && /Gecko/.test(navigator.userAgent);
    if(!isGecko)
    {
        content = content.replace(/<span class="Apple-style-span" style="text-decoration: underline;">([\s\S]+)<\/span>/gi, "<u>$1</u>");
        content = content.replace(/<span class="Apple-style-span" style="font-weight: bold;">([\s\S]+)<\/span>/gi, "<b>$1</b>");
        content = content.replace(/<span class="Apple-style-span" style="font-style: italic;">([\s\S]+)<\/span>/gi, "<i>$1</i>");
    }
    else {
        content = content.replace(/<span style="text-decoration: underline;">([\s\S]+)<\/span>/gi, "<u>$1</u>");
        content = content.replace(/<span style="font-weight: bold;">([\s\S]+)<\/span>/gi, "<b>$1</b>");
        content = content.replace(/<span style="font-style: italic;">([\s\S]+)<\/span>/gi, "<i>$1</i>");
    }


    content = content.replace(new RegExp('<p class=MsoHeading.*?>(.*?)<\/p>', 'gi'), '<p><b>$1</b></p>');
    content = content.replace(new RegExp('tab-stops: list [0-9]+.0pt">', 'gi'), '">' + "--list--");
    content = content.replace(new RegExp(bull + "(.*?)<BR>", "gi"), "<p>" + middot + "$1</p>");
    content = content.replace(new RegExp('<SPAN style="mso-list: Ignore">', 'gi'), "<span>" + bull); // Covert to bull list
    content = content.replace(new RegExp('<p class="MsoListParagraph(.*?)>', 'gi'), "<p>" + bull); // Covert to bull list
    content = content.replace(/<o:p><\/o:p>/gi, "");
    content = content.replace(new RegExp('<br style="page-break-before: always;.*>', 'gi'), '-- page break --'); // Replace pagebreaks
    content = content.replace(/<!--([\s\S]*?)-->|<style>[\s\S]*?<\/style>/g, "");  // Word comments
    content = content.replace(/<(meta|link)[^>]+>/g, ""); // Header elements
    content = content.replace(/<\/?span[^>]*>/gi, "");
    content = content.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
    content = content.replace(/<\\?\?xml[^>]*>/gi, "");
    content = content.replace(/<\/?\w+:[^>]*>/gi, "");
    content = content.replace(/-- page break --\s*<p>&nbsp;<\/p>/gi, ""); // Remove pagebreaks
    content = content.replace(/-- page break --/gi, ""); // Remove pagebreaks



    content = content.replace(/&lt;!--([\s\S]*?)--&gt;/g, "");  // комменты с хитрыми кавычками

    //chrome делает таку гыдоту: p > ul
    content = content.replace(/<p>[\r\n\n\t\s ]*<ul>/g, '<ul>');
    content = content.replace(/<\/ul>[\r\n\n\t\s ]*<\/p>/g, '</ul>');


    //списки
    var div = document.createElement('DIV');
    div.innerHTML = content;//ed.dom.create("div", null, content);

    //if(testtinydebug) document.getElementById(testtinydebug).innerHTML += "<h3>before tiny UL</h3>"+htmlspecialchars(div.innerHTML);
    // Convert all middot paragraphs to li elements
    while (_convertMiddots(div, "--list--")) ; // bull
    while (_convertMiddots(div, middot)) ; // Middot
    while (_convertMiddots(div, bull)) ; // bull

    //if(testtinydebug) document.getElementById(testtinydebug).innerHTML += "<h3>after tiny UL</h3>"+ htmlspecialchars(div.innerHTML);

    fixNestedLists(div);
    fixOL(div);

    //fix, chrome делает #text, div...., надо обернуть первый текст в div
    if(div.childNodes && div.childNodes.length > 1) {
        if(div.childNodes[0].nodeType == 3 && div.childNodes[1].nodeType != 3 && div.childNodes[1].tagName.toUpperCase() == 'DIV') {
            /*var rep = document.createElement('DIV');
             rep.innerHTML = ''+div.childNodes[0];*/

            console.log(div.childNodes[0]);

            var txt = div.childNodes[0].nodeValue;
            //div.replaceChild(div.childNodes[0], rep);

            div.removeChild(div.childNodes[0]);
            div.innerHTML = '<div>'+txt+'</div>' + div.innerHTML;
            console.log(div.innerHTML);
        }
    }




    //if(testtinydebug) document.getElementById(testtinydebug).innerHTML += "<h3>after OL</h3>"+ htmlspecialchars(div.innerHTML);

    content = div.innerHTML;

    //убираем нафиг все атрибуты тегов
    // !!важный момент - у одиночных тегов, таких как <img .... />
    // киляется знак деления вконце - но нам не страшно так как у нас таких тегов быть не должно
    // плюсь облегчаетсyя последняя функция по зачистке тегов
    content = content.replace(/(<\w+) [^>]*(>)/gi, "$1$2");
    //на всяк случай киляем стили и скрипты сюдаже нужно будет добавить все остальное
    //комменты удаляются выше
    content = content.replace(/<style>[\s\S]*?<\/style>|<script>[\s\S]*?<\/script>/g, "");

    //Из СЕОшных соображений заменяем все заголовки на жирный текст
    content = content.replace(/<h[1-6]>/gi, '<p><b>');
    content = content.replace(/<\/h[1-6]>/gi, '</b></p>');

    content = content.replace(/<div>/gi, '<p>');
    content = content.replace(/<\/div>/gi, '</p>');

    content = content.replace(/<strong>/gi, '<b>');
    content = content.replace(/<\/strong>/gi, '</b>');

    //киляем любой тег кроме....
    content = content.replace(/<\/?(?!p|br|u|b|strong|i|em|ul|ol|li)\w+>/gi, "");

    //content = content.replace(/<(?!(\/?br|\/?p|\/?b|\/?i|\/?u|\/?ul|\/?ol|\/?li|\/?a))[^>]+>/gi, "");

    //зачищаем непечатаемые символы
    content = content.replace(/[\s]+/gi, " ");

    //киляем дубликаты
    content = content.replace(/<\/u><u>/gi, "");
    content = content.replace(/<\/b><b>/gi, "");
    content = content.replace(/<\/strong><strong>/gi, "");
    content = content.replace(/<\/i><i>/gi, "");
    content = content.replace(/<\/em><em>/gi, "");
    //киляем пустые теги
    content = content.replace(/<u><\/u>/gi, "");
    content = content.replace(/<b><\/b>/gi, "");
    content = content.replace(/<strong><\/strong>/gi, "");
    content = content.replace(/<i><\/i>/gi, "");
    content = content.replace(/<em><\/em>/gi, "");
    content = content.replace(/<ul><\/ul>/gi, "");
    content = content.replace(/<ol><\/ol>/gi, "");
    content = content.replace(/<li><\/li>/gi, "");

    //киляем теги <img>
    content = content.replace(/<img>/gi, "");

    //киляем теги <b></b> - RUA-2837
    content = content.replace(/<b><\/b>/gi, "");

    content = content.replace(/<input ?\/?>/gi, "");
    content = content.replace(/<\/?select ?\/?>/gi, "");
    content = content.replace(/<\/?option ?\/?>/gi, "");
    content = content.replace(/<\/?iframe ?\/?>/gi, "");

    content = content.replace(/<\/?pre ?\/?>/gi, "");


    //ЗАЧИЩАЕМ ПОСЛЕДНИЕ <BR> и им подобную фигню
    content = content.replace(/[\r\n\t]/gi, ''); //киляем служебные символы
    content = content.replace(/>\s+</gi, '><'); //киляем пробелы между тегами
    content = content.replace(/<br\/>/gi, '<br>'); //превращаем свю лабуду типа <p>&nbsp;<\/p> в обычные <br>
    content = content.replace(/<br \/>/gi, '<br>');
    content = content.replace(/<p><\/p>/gi, '<br>');
    content = content.replace(/<p>&nbsp;<\/p>/gi, '<br>');
    content = content.replace(/<p><br><\/p>/gi, '<br>');

    var trimmedText = '<br>';

    do {
        var pos = content.indexOf(trimmedText, content.length - trimmedText.length);
        if (pos != -1) {
            content = content.substr(0, pos);
        }
    } while (pos != -1);
    //EO: ЗАЧИЩАЕМ ПОСЛЕДНИЕ <BR> и им подобную фигню

    //КИЛЯЕМ ВЛОЖЕНЫЕ <UL>
    //content = content.replace(/<ul>(.*?)<ul>(.*?)<\/ul>(.*?)<\/ul>/gi, '<ul>$1$2$3</ul>');
    //while (content != (content = content.replace(/<ul>(.*?)<\/ul>/gi, '$1')));
    //content = content.replace(/((<li>.*?<\/li>)+)/gi, '<ul>$1</ul>');
    //EO: КИЛЯЕМ ВЛОЖЕНЫЕ <UL>

    //КИЛЯЕМ ПУСТЫЕ <LI>
    content = content.replace(/<li><\/li>/gi, '');
    content = content.replace(/<li>&nbsp;<\/li>/gi, '');
    //EO: КИЛЯЕМ ПУСТЫЕ <LI>

    //ЗАМЕНЯЕМ НАФИК ВСЕ &nbsp; НА ПРОБЕЛЫ
    content = content.replace(/&nbsp;/gi, ' ');


    document.getElementById("frmData").contentWindow.document.body.innerHTML = content;

    document.getElementById(txtBoxId).value = content;

    //document.body.style.background ='rgb('+Math.floor(Math.random()*155+100)+', '+Math.floor(Math.random()*155+100)+', '+Math.floor(Math.random()*155+100)+')';

    if (typeof(tinyDefText) != 'undefined') {

        var tt = content+'';
        tt = tt.replace(new RegExp('<\/?[^>]+>', 'gi'), '');
        tt = tt.replace(new RegExp('[^a-zA-Zа-яА-я0-9]', 'gi'), '');
        tt = tt.replace(new RegExp('nbsp', 'gi'), '');
        tt = tt.replace(new RegExp('acute', 'gi'), '');

        var tdt = tinyDefText+'';
        tdt = tdt.replace(new RegExp('<\/?[^>]+>', 'gi'), '');
        tdt = tdt.replace(new RegExp('[^a-zA-Zа-яА-я0-9]', 'gi'), '');
        tdt = tdt.replace(new RegExp('nbsp', 'gi'), '');
        tdt = tdt.replace(new RegExp('acute', 'gi'), '');

        var notEmptyTiny = content.replace(new RegExp('<\/?[^>]+>', 'gi'), '').replace(new RegExp('&nbsp;', 'gi'), '').match(/.*?[\S].*?/);
        if (notEmptyTiny && tt != tdt) {
            document.getElementById("frmData").contentWindow.document.body.style.color = '#333';
        }
        else {
            document.getElementById("frmData").contentWindow.document.body.style.color = '#999';
            document.getElementById("frmData").contentWindow.document.body.innerHTML = tinyDefText;
            //for ie6
            setTimeout("document.getElementById('frmData').contentWindow.document.body.style.color = '#999';",0);
        }

    }

    var funcExists = typeof(tinyOnBlurFunction) != "undefined";
    if(funcExists) tinyOnBlurFunction();

}

//tinymce func добывает списки из вордовской кучи
function _convertMiddots(div, search) {
    var mdot = String.fromCharCode(183);
    var bull = String.fromCharCode(8226);
    var nodes, prevul, i, p, ul, li, np, cp, li;

    nodes = div.getElementsByTagName("p");
    for (i = 0; i < nodes.length; i++) {
        p = nodes[i];

        // Is middot
        if (p.innerHTML.indexOf(search) == 0) {
            ul = document.createElement('UL');

            // Add the first one
            li = document.createElement('LI');
            li.innerHTML = p.innerHTML.replace(new RegExp('' + mdot + '|' + bull + '|--list--|&nbsp;', "gi"), '');
            ul.appendChild(li);

            // Add the rest
            np = p.nextSibling;
            while (np) {
                // If the node is whitespace, then
                // ignore it and continue on.
                if (np.nodeType == 3 && new RegExp('^\\s$', 'm').test(np.nodeValue)) {
                    np = np.nextSibling;
                    continue;
                }

                if (search == mdot) {
                    if (np.nodeType == 1 && new RegExp('^o(\\s+|&nbsp;)').test(np.innerHTML)) {
                        // Second level of nesting
                        if (!prevul) {
                            prevul = ul;
                            ul = document.createElement('UL');
                            prevul.appendChild(ul);
                        }
                        np.innerHTML = np.innerHTML.replace(/^o/, '');
                    } else {
                        // Pop the stack if we're going back up to the first level
                        if (prevul) {
                            ul = prevul;
                            prevul = null;
                        }
                        // Not element or middot paragraph
                        if (np.nodeType != 1 || np.innerHTML.indexOf(search) != 0)
                            break;
                    }
                } else {
                    // Not element or middot paragraph
                    if (np.nodeType != 1 || np.innerHTML.indexOf(search) != 0)
                        break;
                }

                cp = np.nextSibling;
                li = document.createElement('LI');
                li.innerHTML = np.innerHTML.replace(new RegExp('' + mdot + '|' + bull + '|--list--|&nbsp;', "gi"), '');
                np.parentNode.removeChild(np);
                ul.appendChild(li);
                np = cp;
            }

            p.parentNode.replaceChild(ul, p);

            return true;
        }
    }
    return false;
}

function fixNestedLists(div) {
    if (typeof document.body.style.maxHeight == "undefined") return;
    var ul = div.getElementsByTagName('UL');

    if (ul == null || ul.length == 0) return;

    for (var i = 0; i < ul.length; i++) {
        if (ul[i]) {
            ul[i].innerHTML = ul[i].innerHTML.replace(/<\/?ul>/gi, '');
        }
    }

}


function fixOL(div) {
    var ul = div.getElementsByTagName('UL');

    for (var i = 0; i < ul.length; i++)
    {
        var li = ul[i].getElementsByTagName('LI');
        var isOL = true;
        for (var x = 0; x < li.length; x++)
        {
            if (new RegExp('^[0-9]+. .*$', 'm').test(li[x].innerHTML)) {  //'^[0-9]+. .*$'
            }
            else {
                isOL = false;
                break;
            }
        }

        if (isOL)
        {
            //удаляем цыфры
            for (var x = 0; x < li.length; x++)
            {
                li[x].innerHTML = li[x].innerHTML.replace(new RegExp('^[0-9A-Za-z]+.?[ ]+(.*)$'), '$1');   //'^[0-9]+. (.*)$'
            }

            //Заменяем ul на ol
            var ol = document.createElement('OL');
            ol.innerHTML = ul[i].innerHTML;
            ul[i].parentNode.replaceChild(ol, ul[i]);
        }
    }
}

if (!Array.prototype.map) {
    Array.prototype.map = function(fun) {
        var collect = [];
        for (var ix = 0; ix < this.length; ix++) {
            collect[ix] = fun(this[ix]);
        }
        return collect;
    }
}

function bindEvent(target, eventName, fun) {
    if (target.addEventListener) {
        target.addEventListener(eventName, fun, false);
    } else {
        target.attachEvent("on" + eventName, function() {
            fun(event);
        });
    }
}

/*
 Editlib.js
 ----------
 Various functions for manipulating selections, used by editing commands
 */

var getContaining = (window.getSelection) ? w3_getContaining : ie_getContaining;
var overwriteWithNode = (window.getSelection) ? w3_overwriteWithNode : ie_overwriteWithNode;

function createElementFilter(tagName) {
    return function(elem) {
        return elem.tagName == tagName;
    }
}

/* walks up the hierachy until an element with the tagName if found.
 Returns null if no element is found before BODY */
function getAncestor(elem, filter) {
    while (elem.tagName != "BODY") {
        if (filter(elem)) return elem;
        elem = elem.parentNode;
    }
    return null;
}

function includes(elem1, elem2) {
    if (elem2 == elem1) return true;
    while (elem2.parentNode && elem2.parentNode) {
        if (elem2 == elem1) return true;
        elem2 = elem2.parentNode;
    }
    return false;
}

function ie_getContaining(editWindow, filter) {
    var selection = editWindow.document.selection;
    if (selection.type == "Control") {
        // control selection
        var range = selection.createRange();
        if (range.length == 1) {
            var elem = range.item(0);
        }
        else {
            // multiple control selection
            return null;
        }
    } else {
        var range = selection.createRange();
        var elem = range.parentElement();
    }
    return getAncestor(elem, filter);
}

function ie_overwriteWithNode(editWindow, node) {
    var rng = editWindow.document.selection.createRange();
    var marker = writeMarkerNode(editWindow, rng);
    marker.appendChild(node);
    marker.removeNode(); // removes node but not children
}

// writes a marker node on a range and returns the node.
function writeMarkerNode(editWindow, rng) {
    var id = editWindow.document.uniqueID;
    var html = "<span id='" + id + "'></span>";
    rng.pasteHTML(html);
    var node = editWindow.document.getElementById(id);
    return node;
}

// overwrites the current selection with a node
function w3_overwriteWithNode(editWindow, node) {
    var rng = editWindow.getSelection().getRangeAt(0);
    rng.deleteContents();
    if (isTextNode(rng.startContainer)) {
        var refNode = rightPart(rng.startContainer, rng.startOffset)
        refNode.parentNode.insertBefore(node, refNode);
    } else {
        if (rng.startOffset == rng.startContainer.childNodes.length) {
            refNode.parentNode.appendChild(node);
        } else {
            var refNode = rng.startContainer.childNodes[rng.startOffset];
            refNode.parentNode.insertBefore(node, refNode);
        }
    }
}

function w3_getContaining(editWindow, filter) {
    var range = editWindow.getSelection().getRangeAt(0);
    var container = range.commonAncestorContainer;
    return getAncestor(container, filter);
}

function isTextNode(node) {
    return node.nodeType == 3;
}

function rightPart(node, ix) {
    return node.splitText(ix);
}
function leftPart(node, ix) {
    node.splitText(ix);
    return node;
}


function createEditor() {

    /*
     Commands
     --------
     */

    function Command(command, editDoc) {
        this.execute = function() {
            editDoc.execCommand(command, false, null);
        };
        this.queryState = function() {
            return editDoc.queryCommandState(command);
        };
    }
    function TogglCommandController(command, elem) {
        this.updateUI = function() {
            var state = command.queryState();
            elem.className = state ? "active" : "";
        }
        var self = this;
        elem.unselectable = "on"; // IE, prevent focus
        bindEvent(elem, "mousedown", function(evt) {
            // we cancel the mousedown default to prevent the button from getting focus
            // (doesn't work in IE)
            if (evt.preventDefault) evt.preventDefault();
        });
        bindEvent(elem, "click", function(evt) {
            command.execute();
            updateToolbar();
        });
    }

    var editFrame = document.getElementById("frmData");

    var iframe = editFrame.contentWindow.document;
    /**
     * ЗДЕСЬ ВАЖНЫЙ МОМЕНТ - В iFRAME загоняются стили
     * и содержимое текстового поля - если таковое имеется
     */
    var content = '<head><style>html,body {height:90%;padding:0;margin:0}body{padding:5px;font:12px Verdana} p {margin:0} ul, ol {margin:0;padding:0;padding-left:30px}</style></head><body>' + document.getElementById(txtBoxId).value + '</body>';
    iframe.open();
    iframe.write(content);
    iframe.close();


    /*if(document.getElementById(txtBoxId).value.length)
     if(document.getElementById(txtBoxId).value.length>0) cleanupHTML();*/

    document.getElementById(txtBoxId).style.display='none';

    if (editFrame.contentWindow.document.body.contentEditable) editFrame.contentWindow.document.body.contentEditable = true;
    else editFrame.contentWindow.document.designMode = 'on';

    // styleWithCSS, not supported in IE and Opera
    if (!isIE() && !window.opera)
        document.getElementById("frmData").contentWindow.document.execCommand('styleWithCSS', false, false);

    var editWindow = editFrame.contentWindow;
    var editDoc = editWindow.document;
    var updateListeners = [];

    var toolbarCommands = [
        ["boldButton", TogglCommandController, new Command("Bold", editDoc)],
        ["italicButton", TogglCommandController, new Command("Italic", editDoc)],
        ["underlineButton", TogglCommandController, new Command("Underline", editDoc)],
        ["ulButton", TogglCommandController, new Command("InsertUnorderedList", editDoc)],
        ["olButton", TogglCommandController, new Command("InsertOrderedList", editDoc)]
    ];

    //for (var ix=0; ix<toolbarCommands.length;ix++) {
    //	var binding = toolbarCommands[ix];
    toolbarCommands.map(function(binding) {
        var elemId = binding[0], ControllerConstructor = binding[1], command = binding[2];
        var elem = document.getElementById(elemId);
        var controller = new ControllerConstructor(command, elem);
        updateListeners.push(controller);
    });

    function updateToolbar() {
        updateListeners.map(function(controller) {
            controller.updateUI();
        });

        var nowLength = document.getElementById("frmData").contentWindow.document.body.innerHTML.length
        //!!!!! Если количество измененных символов в редакторе больше 100 - вызываеться зачистка
        if (nowLength > wasLength)
            if ((nowLength - wasLength) > 100) cleanupHTML();

        wasLength = document.getElementById("frmData").contentWindow.document.body.innerHTML.length;

        document.getElementById(txtBoxId).value = document.getElementById("frmData").contentWindow.document.body.innerHTML;
    }
    ;



    bindEvent(editWindow, "focus", tinyfocus);

    bindEvent(editDoc, "keyup", updateToolbar);
    bindEvent(editDoc, "mouseup", updateToolbar);

    if(!navigator.userAgent.match('Opera\/9\.27.*'))
    {
        bindEvent(editDoc, "blur", cleanupHTML);
        bindEvent(editWindow, "blur", cleanupHTML);
    }

    bindEvent(editDoc, "deactivate", cleanupHTML); //for IE

    setTimeout('fixff36()', 500);
}
function isIE() {
    return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}


var wasLength = 0;
var txtBoxId = ""; //!!!!!!!!!!!! сюда идет id тексбокса
//bindEvent(window, "load", createEditor);

function fixff36() {
    if (!isIE() && !window.opera)
        document.getElementById("frmData").contentWindow.document.execCommand('styleWithCSS', false, false);
}