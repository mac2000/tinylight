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
            cleanupLengthTrigger: 100,
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

            var debug = html == '<b style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);">Обязанности</b><br style="color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><ul style="margin-bottom: 0px; margin-left: 0px; padding-right: 15px; padding-left: 15px; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; background-color: rgb(170, 15, 19);"><li style="list-style-position: inside;"><span style="font-family: Helv; color: black; font-size: 10pt;"><span style="font-family: Arial;">Увеличение уровня и объёмов продаж в альтернативных каналах (АПП, дилеры, М2М);</span></span></li></ul>';

            html = html.replace(/\u2122/g, 'TM').replace(/\u2026/g, '...').replace(/\x93|\x94|\u201c|\u201d/g, '"').replace(/\x60|\x91|\x92|\u2018|\u2019/g, "'").replace(/\u2013|\u2014|\u2015|\u2212/g, '-');

            // some basic replacements, we are:
            // removing multiple spaces
            // removing all non printable space characters
            // removing spaces between tags
            // converting all <br> tags to same format
            html = html.replace(/\s+/g, ' ').replace(/[\t\r\n\n]+/g, '').replace(/>\s+</g, '><').replace(/<br\s*\/?>/gi, '<br>').replace(/<\/?font[^>]*>/gi, '');

            html = html.replace(/<(div|p)[^>]*>(<br>)?<\/\1>/gi, '<p>&nbsp;</p>'); // Convert all kind of empty lines to <p>&nbsp;</p>
            html = html.replace(/<(div|p)><(ul|ol)>/gi, '<$2>').replace(/<\/(ul|ol)><\/(div|p)>/gi, '</$1>'); // lists can not be nested

            el = $('<div>').html(html);
            while ($('*:empty:not(br)', el).size() > 0) {
                $('*:empty:not(br)', el).remove(); // remove empty non <br> nodes
            }

            el.children('br').filter(function () { return !this.parentNode || this.parentNode.nodeName !== 'li'; }).remove(); // remove all <br> except thous who in <li>
            $('*').filter(function () { return this.nodeType === 3 && /\s+/.test(this.nodeValue); }).remove(); // remove empty text nodes

            el.contents().filter(function () { return this.nodeType === 3; }).wrap('<p />'); // wrap text nodes in paragraphs

            // Word lists
            list_items = $('p', el).filter(function (index, item) {
                return (new RegExp('mso-list', 'gi')).test($(item).attr('style'));
            });
            $.each(list_items, function (index, item) {
                var $content,
                    tagName = /^[0-9a-np-z]/i.test($.trim($(item).text()).replace(/(&lt;|<)!--\[if !supportLists\]--(&gt;|>)/gi, '')) ? 'ol' : 'ul';
                item.innerHTML = item.innerHTML.replace(new RegExp('(&lt;|<)!--\\[if !supportLists\\]--(&gt;|>).+\\1!--\\[endif\\]--\\2', 'gi'), '');
                $content = $(item).find('span[lang]:first').size() > 0 ? $(item).find('span[lang]:first') : $(item);

                // Remove mso spans with &nbsp;'es
                $('span', $content).filter(function (index, item) {
                    return (new RegExp('mso', 'gi')).test($(item).attr('style'));
                }).remove();

                $(item).replaceWith('<' + tagName + '><li>' + $content.html() + '</li></' + tagName + '>');
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
                            this.previousSibling.tagName.toLowerCase() === 'ul' || this.previousSibling.tagName.toLowerCase() === 'ol'
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
                            this.nextSibling.tagName.toLowerCase() === 'ul' || this.nextSibling.tagName.toLowerCase() === 'ol'
                        );
                });

                list_items.each(function () { $(this).prependTo($(this).next('ul, ol')); });
            } while(list_items.size() > 0);



            // Remove comments after dealing with lists
            $('*', el).contents().filter(function () { return this.nodeType == 8; }).remove(); // remove comments
            el.contents().filter(function () { return this.nodeType == 8; }).remove(); // remove comments


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
            while ($('*:empty:not(br)', el).size() > 0) {
                $('*:empty:not(br)', el).remove();
            }

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
            if (self.doc.caretPos !== undefined && self.doc.caretPos.parentElement !== undefined) {
                return (self.doc.caretPos.parentElement());
            }

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
                self.doc.execCommand(command);
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
                        enabled = self.doc.queryCommandEnabled(command);
                    button.toggleClass('mac-tinylight-toolbar-button__active', self.doc.queryCommandState(command));
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
            self.doc.write('<!DOCTYPE html><title></title><meta charset="utf-8"><link rel="stylesheet" href="http://css.cdn.tl/normalize.css"><!--[if lte IE 8]><style>html {height:100%}body{min-height:100%}</style><![endif]--><style>body{margin:.5em;font-family:' + self.options.fontFamily + ';font-size:' + self.options.fontSize + ';background-color:' + self.options.backgroundColor + ';}p,ul,ol{margin:2px 0}p{background:#eee;}li{background:#ccc}</style><body></body>');// + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>'
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
            $(self.doc).on('keyup mouseup', function (e) {
                var container = self._selectedNode();
                if(container && 'p' === container.tagName.toLowerCase() && '&nbsp;' === container.innerHTML) {
                    container.innerHTML = '<br>';
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
