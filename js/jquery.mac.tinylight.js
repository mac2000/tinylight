(function ($) {
    'use strict';
    $.widget('mac.tinylight', {
        wasLength: 0,
        nowLength: 0,
        holder: undefined,
        toolbar: undefined,
        frame: undefined,
        wnd: undefined,
        doc: undefined,
        buttons: [],
        options: {
            cleanupLengthTrigger: 300,
            height: 300,
            fontSize: '100%',
            fontFamily: 'Helvetica,Arial,sans-serif',
            backgroundColor: 'white',
            blockTag: 'p',
            updateOnKeyUp: false
        },
        cleanupHtml: function (html) {
            var el,
                list_items;

            html = html.replace(/\u2122/g, 'TM').replace(/\u2026/g, '...').replace(/\x93|\x94|\u201c|\u201d/g, '"').replace(/\x60|\x91|\x92|\u2018|\u2019/g, "'").replace(/\u2013|\u2014|\u2015|\u2212/g, '-');

            // some basic replacements, we are:
            // removing multiple spaces
            // removing all non printable space characters
            // removing spaces between tags
            // converting all <br> tags to same format
            // removing <o:p></o:p>
            html = html.replace(/\s+/g, ' ').replace(/[\t\r\n\n]+/g, '').replace(/<br\s*\/?>/gi, '<br>').replace(/<\/?font[^>]*>/gi, '').replace(/<\/?o:p>/gi, '');
            html = html.replace(/<(div|p)[^>]*>(<br>)?<\/\1>/gi, '<p>&nbsp;</p>'); // Convert all kind of empty lines to <p>&nbsp;</p>
            html = html.replace(/<(div|p)><(ul|ol)>/gi, '<$2>').replace(/<\/(ul|ol)><\/(div|p)>/gi, '</$1>'); // lists can not be nested
            html = html.replace(/(&nbsp;)+/gi, '&nbsp;'); // strip white spaces

            el = $('<div>').html(html);
            el.find('applet, area, audio, base, basefont, button, canvas, col, colgroup, command, datalist, embed, fieldset, form, frame, frameset, head, hr, iframe, img, input, keygen, link, map, meta, noframes, noscript, object, optgroup, option, param, progress, script, select, source, style, textarea, track, video, wbr').remove(); // remove unsupported tags

            /*$('a', el).contents().unwrap(); // unwrap anchors
            $('pre', el).contents().unwrap();
            $('del', el).contents().unwrap();
            $('strike', el).contents().unwrap();*/

            $.each(['a', 'abbr', 'acronym', 'address', 'article', 'aside', 'bdi', 'bdo', 'big', 'caption', 'center', 'cite', 'code', 'dd', 'del', 'details', 'dfn', 'dialog', 'dl', 'dt', 'figcaption', 'figure', 'font', 'footer', 'header', 'hgroup', 'ins', 'kbd', 'label', 'legend', 'mark', 'menu', 'meter', 'nav', 'output', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'small', 'strike', 'sub', 'summary', 'sup', 'tfoot', 'time', 'title', 'tt', 'var'], function(index, tag){
                $(tag, el).contents().unwrap();
            });


            // Wrap all non block nodes into paragrahps
            do {
                var wrapMe = []; // will contain non block elements that should be wrapped with paragraph
                var firstNonBlockElement = jQuery(el.get(0).childNodes).filter(function(){ return !(this.nodeType === 1 && $.inArray(this.nodeName.toLowerCase(), ['address', 'article', 'aside', 'audio', 'blockquote', 'canvas', 'center', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'menu', 'nav', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'video']) > -1); }).first().get(0);
                if(firstNonBlockElement && firstNonBlockElement.nodeName.toLowerCase() !== 'p') {
                    wrapMe.push(firstNonBlockElement);
                    // traverse all next siblings until block element found
                    do {
                        var next = wrapMe[wrapMe.length - 1].nextSibling;
                        var add = !(next && next.nodeType === 1 && $(next).css('display') === 'block');
                        if(add) wrapMe.push(next);
                    } while(add && next);
                }

                if(wrapMe.length > 0) {
                    jQuery(wrapMe).wrapAll('<p />');
                }
            } while(firstNonBlockElement && firstNonBlockElement.nodeName.toLowerCase() !== 'p'); // repeat until there is some non wrapped elements


            // split pagargraph line breaks into separate paragraphs
            el.find('p > br').map(function(){ return this.parentNode }).each(function(){
                $(this).replaceWith('<p>' + this.innerHTML.replace(/<br[^>]*>/gi, '</p><p>') + '</p>');
            });
            el = $('<div>').html(el.html());

            while ($('*:empty:not(br)', el).size() > 0) {
                $('*:empty:not(br)', el).remove(); // remove empty non <br> nodes
            }

            //$('tr, thead, tbody, tfoot, table', el).contents().unwrap(); // must be done by one for IE8
            $('tr', el).contents().unwrap(); // unwrap tables and their rows
            $('tfoot', el).contents().unwrap();
            $('thead', el).contents().unwrap();
            $('tbody', el).contents().unwrap();
            $('table', el).contents().unwrap();
            $('td, th', el).each(function(){ $('<p>&nbsp;</p>').insertAfter(this); }); // insert empty paragraph after each cell
            $('td', el).contents().unwrap(); // unpwrap <td> if there is text nodes in them - they should be wrapped with <p> later

            el.find('br').filter(function () { return !this.parentNode || this.parentNode.nodeName.toLowerCase() !== 'li'; }).remove(); // remove all <br> except thous who in <li>
            $('*').filter(function () { return this.nodeType === 3 && /\s+/.test(this.nodeValue); }).remove(); // remove empty text nodes

            el.contents().filter(function () { return this.nodeType === 3 && /\S+/.test(this.nodeValue); }).wrap('<p />'); // wrap text nodes in paragraphs

            $('div, blockquote', el).each(function () {
                $(this).replaceWith('<p>' + $(this).html() + '</p>');
            });

            // Word lists
            list_items = $('p', el).filter(function (index, item) {
                return (new RegExp('mso-list', 'gi')).test($(item).attr('style'));
            });
            $.each(list_items, function (index, item) {
                var $content,
                    size = 0,
                    tagName = /^[0-9a-np-z]/i.test($.trim($(item).text()).replace(/(&lt;|<)!--\[if !supportLists\]--(&gt;|>)/gi, '')) ? 'ol' : 'ul';

                item.innerHTML = item.innerHTML.replace(new RegExp('(&lt;|<)!--\\[if !supportLists\\]--(&gt;|>).+\\1!--\\[endif\\]--\\2', 'gi'), '');
                item.innerHTML = item.innerHTML.replace(/&nbsp;+/gi, ' ');
                $(item).find('span').contents().unwrap();

                item.innerHTML = item.innerHTML.replace(/^[^0-9a-zа-я<]+/gi, '').replace(/^\d{1,2}\.\s+/, '').replace(/\s+/, ' ');

                $(item).replaceWith('<' + tagName + '><li>' + $.trim(item.innerHTML) + '</li></' + tagName + '>');
            });

            // Word 2003 OL list pasted into chrome <p>1.</p><p>hello</p>
            list_items = $('p', el).filter(function () {
                var text = '';
                if(this.previousSibling && this.previousSibling.nodeName && this.previousSibling.nodeName.toLowerCase() === 'p') {
                    text = $.trim($(this.previousSibling).text());
                    return text.match(/^\d+\.$/);
                }
            });
            $.each(list_items, function () {
                $(this.previousSibling).remove();
                $(this).replaceWith('<ol><li>' + $(this).html() + '</li></ol>');
            });

            // Word 2003 UL list pasted into chrome <p>o</p><p>hello</p>
            list_items = $('p', el).filter(function () {
                var text = '';
                if(this.previousSibling && this.previousSibling.nodeName && this.previousSibling.nodeName.toLowerCase() === 'p') {
                    text = $.trim($(this.previousSibling).text());
                    return -1 !== $.inArray(text, ['&bull;', '&#8226;', '&#x2022;', '%u2022', '%u8226', '%uF02D']) || -1 !== $.inArray(escape(text), ['&bull;', '&#8226;', '&#x2022;', '%u2022', '%u8226', '%uF02D']);
                }
            });
            $.each(list_items, function () {
                $(this.previousSibling).remove();
                $(this).replaceWith('<ul><li>' + $(this).html() + '</li></ul>');
            });

            // Word 2003 OL list in IE8 <p>1.hello</p>
            list_items = $('p', el).filter(function () {
                var text = $.trim($(this).text());
                return text.match(/^\d{1,2}\.\s*/);
            });
            $.each(list_items, function () {
                $(this).find('span').contents().unwrap();
                var text = $.trim($(this).html());
                text = text.replace(/^\d{1,2}\.\s*/, '');
                $(this).replaceWith('<ol><li>' + text + '</li></ol>');
            });

            // Word 2003 UL list in IE8 <p>ohello</p>
            list_items = $('p', el).filter(function () {
                var text = $.trim($(this).text());
                return text.match(/^(&bull;|&#8226;|&#x2022;|%u2022|%u8226|%uF02D)/) || escape(text).match(/^(&bull;|&#8226;|&#x2022;|%u2022|%u8226|%uF02D)/);
            });
            $.each(list_items, function () {
                $(this).find('span').contents().unwrap();
                var text = $.trim($(this).html());
                text = text.replace(/^(&bull;|&#8226;|&#x2022;|%u2022|%u8226|%uF02D)/i, '');
                text = unescape(escape(text).replace(/^(&bull;|&#8226;|&#x2022;|%u2022|%u8226|%uF02D)/i, ''));

                $(this).replaceWith('<ul><li>' + text + '</li></ul>');
            });

            // Nested lists
            list_items = $('li', el).filter(function (index, item) { return $(item).find('ul, ol').size() > 0; });
            list_items.each(function (index, item) {
                var list = $(item).find('ul:first, ol:first');
                $(list.html()).insertAfter(item);
                list.remove();
            });
            $('ul, ol', el).each(function (index, item) {
                var parent = $(item).parent()[0];
                if (parent !== el) {
                    $(parent).replaceWith($(parent).html());
                }
            });

            // Fix broken lists
            // <li> items after <ul> or <ol>
            do {
                list_items = $('li', el).filter(function(){
                    return this.parentNode.tagName.toLowerCase() !== 'ul' &&
                        this.parentNode.tagName.toLowerCase() !== 'ol' &&
                        this.previousSibling && (
                            this.previousSibling.nodeName.toLowerCase() === 'ul' || this.previousSibling.nodeName.toLowerCase() === 'ol'
                        );
                });

                list_items.each(function () { $(this).appendTo($(this).prev('ul, ol')); });
            } while(list_items.size() > 0);

            // <li> items before <ul> or <ol>
            do {
                list_items = $('li', el).filter(function(){
                    return this.parentNode.tagName.toLowerCase() !== 'ul' &&
                        this.parentNode.tagName.toLowerCase() !== 'ol' &&
                        this.nextSibling && (
                            this.nextSibling.nodeName.toLowerCase() === 'ul' || this.nextSibling.nodeName.toLowerCase() === 'ol'
                        );
                });

                list_items.each(function () { $(this).prependTo($(this).next('ul, ol')); });
            } while(list_items.size() > 0);

            // Single li items
            $('li', el).filter(function(){
                if(this.previousSibling && this.previousSibling.nodeType === 3) $(this.previousSibling).wrap('<p />');
                if(this.nextSibling && this.nextSibling.nodeType === 3) $(this.nextSibling).wrap('<p />');
                return this.parentNode && this.parentNode.nodeName.toLowerCase() !== 'ul' && this.parentNode.nodeName.toLowerCase() !== 'ol';
            }).wrap('<ul />');

            // Remove comments after dealing with lists
            $('*', el).contents().filter(function () { return this.nodeType == 8; }).remove(); // remove comments
            el.contents().filter(function () { return this.nodeType == 8; }).remove(); // remove comments

            // Cleanup li items
            $('li', el).each(function(){
                $(this).html($.trim($(this).html()));
            });


            // Replace long tags to short
            $('strong', el).replaceWith(function () {
                return '<b>' + $(this).html() + '</b>';
            });
            $('em', el).replaceWith(function () {
                return '<i>' + $(this).html() + '</i>';
            });
            $('h1, h2, h3, h4, h5, h6', el).replaceWith(function () {
                return '<p><b>' + $(this).html() + '</b></p>';
            });

            // Convert styled spans
            $('span', el).each(function (index, item) {
                var start = '',
                    end = '',
                    fontWeight = $(item).css('font-weight').toString() || '';
                if ((fontWeight === 'bold' || fontWeight === '700') && $(item).closest('b').size() === 0) {
                    start = '<b>';
                    end = '</b>';
                }
                if ($(item).css('font-style') === 'italic' && $(item).closest('i').size() === 0) {
                    start = start + '<i>';
                    end = '</i>' + end;
                }
                if ($(item).css('text-decoration') === 'underline' && $(item).closest('u').size() === 0) {
                    start = start + '<u>';
                    end = '</u>' + end;
                }
                $('span', item).contents().unwrap();
                $(item).replaceWith(start + $(item).html() + end);
            });

            // IE 9, got after test <b><i>span</i></b><i></i> - removing empty nodes
            while ($('*:empty:not(br):not(p)', el).size() > 0) {
                $('*:empty:not(br):not(p)', el).remove();
            }
            $('p:empty', el).html('&nbsp;');

            $('div', el).replaceWith(function () {
                return '<p>' + $(this).html() + '</p>';
            });

            // Remove repeated tags like: <b>H</b><b>ello</b>
            $('b, i, u, ol, ul', el).filter(function(){ return this.nextSibling && this.tagName === this.nextSibling.tagName; }).each(function(){
                $(this.nextSibling).prepend($(this).contents());
                $(this).remove();
            });

            $(el).contents().filter(function() { return this.nodeType === 1 && -1 === jQuery.inArray(this.tagName.toLowerCase(), ['p', 'div', 'ul', 'ol', 'table', 'li']); }).wrap('<p />'); // wrap non block tags into paragraphs

            jQuery('*:not(b, i, u, ol, ul, li, p, br)', el).remove(); // remove not allowed tags


            // Remove attributes
            $('*', el).each(function (index, item) {
                var attributes = item.attributes,
                    i = attributes.length;
                while (i > 0) {
                    i = i - 1;
                    item.removeAttributeNode(attributes[i]);
                }
            });

            // Trim tag contents
            $('*', el).each(function(){
                $(this).html($.trim($(this).html()));
            });

            html = el.html();

            //html = html.replace(/<\/(b|i|u|ol|ul)>\s*<\1>/gi, ''); // Remove repeated tags like: <b>H</b><b>ello</b>
            html = html.replace(/>\s+</g, '><'); // IE 8 fix, he had added some strange symbols not \r\n and not \n
            return html;
        },
        setHtml: function (html) {
            html = this.cleanupHtml(html);
            this.doc.body.innerHTML = html;
            this.element.val(html == '<p>&nbsp;</p>' ? '' : html);
            this.element.trigger('change');
        },
        getHtml: function () {
            return this.doc.body.innerHTML;
        },
        _selectedNode: function () {
            var sel,
                node,
                self = this;

            // IE
            if (self.doc.selection !== undefined) {
                return (self.doc.selection.createRange().parentElement());
            }
            /*if (self.doc.caretPos !== undefined && self.doc.caretPos.parentElement !== undefined) {
                return (self.doc.caretPos.parentElement());
            }*/

            // FF, O, S, C
            if (self.wnd.getSelection !== undefined) {
                sel = self.wnd.getSelection();
                node = sel.focusNode;
                if (node) {
                    return (node.nodeName === '#text') ? node.parentNode : node;
                }
            }

            return null;
        },
        _addButton: function (command) {
            var button,
                self = this;

            button = $('<span class="mac-tinylight-toolbar-button" data-command="' + command + '" unselectable="on">' + command + '</span>').appendTo(self.toolbar);
            button.on('mousedown', function (e) { // must be mousedown, not click, otherwise it will not work in Firefox, because before click, text in edit area is unselected
                e.preventDefault();
                var wrap_with_p = ((command === 'InsertUnorderedList' || command === 'InsertOrderedList') && self.doc.queryCommandState(command));
                self.doc.execCommand(command, false, null);
                if(wrap_with_p) {
                    self.doc.execCommand('FormatBlock', false, self.options.blockTag); //wrap with <p>
                }
                self._updateToolbar();
                return false;
            });
            self.buttons.push(button);
        },
        _updateToolbar: function () {
            var self = this;
            if (self.buttons.length > 0) {
                $.each(self.buttons, function (index, button) {
                    var command = button.data('command'),
                        enabled = self.doc.queryCommandEnabled(command),
                        state = self.doc.queryCommandState(command);
                    button.toggleClass('mac-tinylight-toolbar-button__active', state);
                    button.toggleClass('mac-tinylight-toolbar-button__disabled', !enabled);

                    if (enabled) {
                        button.removeAttr('disabled');
                    } else {
                        button.attr('disabled', 'disabled');
                    }
                });
            }
        },
        _create: function () {
            var self = this,
                buttons = ['Bold', 'Italic', 'Underline', 'InsertUnorderedList', 'InsertOrderedList'];
            // Hide textarea
            self.element.hide();

            // Create elements
            self.holder = $('<div class="mac-tinylight">').insertBefore(self.element).hide();
            self.holder.height(self.options.height);
            self.frame = $('<iframe class="mac-tinylight-frame" frameborder="0" dir="ltr" wrap="soft">').appendTo(self.holder);
            self.toolbar = $('<div class="mac-tinylight-toolbar" unselectable="on">').appendTo(self.holder);

            // Create toolbar buttons
            if (!navigator.userAgent.match(/MSIE/)) {
                buttons.push('Undo');
                buttons.push('Redo');
            }
            $.each(buttons, function (index, item) {
                self._addButton(item);
            });

            // Fill editor
            self.wnd = self.frame.get(0).contentWindow;
            self.doc = self.wnd.document;
            self.doc.open();
            self.doc.write('<!DOCTYPE html><title></title><meta charset="utf-8"><link rel="stylesheet" href="http://css.cdn.tl/normalize.css"><style>html{height:100%}html,body{min-height:94%;}body{margin:.5em;font-family:' + self.options.fontFamily + ';font-size:' + self.options.fontSize + ';background-color:' + self.options.backgroundColor + ';}p,ul,ol{margin:2px 0}p{background:#eee;}li{background:#ccc}</style><body></body>');// + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>'
            self.doc.close();

            self.setHtml($.trim(self.element.val()) === '' ? '<p>&nbsp;</p>' : self.element.val());

            // Make it editable
            if (self.doc.body.contentEditable) {
                self.doc.body.contentEditable = true;
            } else {
                self.doc.designMode = 'on';
            }

            // Make it use tags instead of styles
            try {
                self.doc.execCommand("styleWithCSS", 0, false);
            } catch (exStyleWithCSS) {
                try {
                    self.doc.execCommand("useCSS", 0, true);
                } catch (exUseCSS) {
                    try {
                        self.doc.execCommand('styleWithCSS', false, false);
                    } catch (exStyleWithCSS2) {}
                }
            }

            // Attach events
            $(self.doc).on('keyup', function (e) {
                var container,
                    name;

                if (e.keyCode === 13 && !e.shiftKey) { // RETURN key without shift
                    //RETURN key
                    //cleanup <br><br> between paragraphs
                    jQuery(self.doc.body).children('br').filter(function () {
                        return this.parentNode.nodeName !== 'li';
                    }).remove();

                    //fix PRE bug #73
                    container = self._selectedNode();
                    if (container && container.tagName.toLowerCase() === 'pre') {
                        self.doc.execCommand('FormatBlock', false, self.options.blockTag); //create P after PRE
                    }
                }

                //fix #112
                /*if(e.keyCode == 13 && e.shiftKey && navigator.userAgent.match(/WebKit/)) {
                 self.doc.execCommand('InsertLineBreak', false, null);
                 }*/

                //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
                //text nodes replaced by P
                if (e.keyCode !== 8 && e.keyCode !== 17 && e.keyCode !== 46 && e.keyCode !== 224 && !e.metaKey && !e.ctrlKey) {
                    container = self._selectedNode();
                    if(container){
                        name = container.tagName.toLowerCase();

                        //fix forbidden main containers
                        if (name === "strong" || name === "b" || name === "em" || name === "i" || name === "sub" || name === "sup" || name === "a") {
                            name = container.parentNode.tagName.toLowerCase();
                        }

                        if (name === 'body' || name === 'div' || name === 'p') {
                            self.doc.execCommand('FormatBlock', false, self.options.blockTag);
                        }
                    }
                }

                // Catch Ctrl+v and Shift+Ins and run cleanup
                if ((e.keyCode === 86 && e.ctrlKey) || (e.keyCode === 45 && e.shiftKey)) {
                    self.setHtml(self.getHtml());
                }
            });

            // On any change, check how much is changed and if it is greater than limit run cleanup
            self.wasLength = self.doc.body.innerHTML.length;
            $(navigator.userAgent.match(/MSIE/) ? self.doc : self.wnd).on('keyup mouseup', function (e) {
                var container = self._selectedNode();
                if(container && 'p' === container.tagName.toLowerCase() && '&nbsp;' === container.innerHTML) {
                    container.innerHTML = navigator.userAgent.match(/MSIE/) ? '' : '<br>';
                }

                self._updateToolbar();

                self.nowLength = self.doc.body.innerHTML.length;
                if (Math.abs(self.nowLength - self.wasLength) > self.options.cleanupLengthTrigger) {
                    self.setHtml(self.getHtml());
                }
                self.wasLength = self.nowLength;

                if (self.options.updateOnKeyUp) {
                    self.element.val(self.doc.body.innerHTML);
                }
            });

            $(navigator.userAgent.match(/MSIE/) ? self.doc : self.wnd).on('blur deactivate', function () {
                self.setHtml(self.getHtml());
                self.element.trigger('blur');
            });

            $(navigator.userAgent.match(/MSIE/) ? self.doc : self.wnd).on('focus activate', function () {
                self.element.trigger('focus');
            });

            self.holder.show();
        },
        _setOption: function (key, value) {
            var self = this;
            this._super('_setOption', key, value);

            switch (key) {
            case 'height':
                self.holder.height(value);
                break;
            case 'fontSize':
                self.doc.body.style.fontSize = value;
                break;
            case 'fontFamily':
                self.doc.body.style.fontFamily = value;
                break;
            case 'backgroundColor':
                self.doc.body.style.backgroundColor = value;
                break;
            default:
                break;
            }
        },
        destroy: function () {
            this.setHtml(this.getHtml());
            this.holder.remove();
            this.element.show();
            this._super('destroy');
        }
    });
}(jQuery));
