(function ($, undefined) {
    $.widget('mac.tinylight', {
        wasLength:0,
        nowLength:0,
        holder:undefined,
        toolbar:undefined,
        frame:undefined,
        wnd:undefined,
        doc:undefined,
        buttons:[],
        options:{
            cleanupLengthTrigger:100,
            height:300,
            fontSize:'100%',
            fontFamily:'Helvetica,Arial,sans-serif',
            backgroundColor:'white',
            blockTag:'p',
            updateOnKeyUp:false
        },
        cleanupHtml:function(html){
            var debug = html === '<p class="MsoListParagraph" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US">1.<span style="font-size: 7pt; font-family: Times New Roman; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]--><span lang="EN-US">Item<o:p></o:p></span></p>';
            // some basic replacements, we are:
            // removing &nbsp;
            // removing multiple spaces
            // removing all non printable space charactes
            // removing spaces between tags
            // converting all <br> tags to same format
            // change <p>&nbsp;</p> to <br>
            html = html.replace(/\s+/g, ' ').replace(/[\t\r\n\n]+/g, '').replace(/>\s+</g, '><').replace(/<br\s*\/?>/gi, '<br>');

            html = html.replace(/<(div|p)><br><\/\1>/gi, '<p>&nbsp;</p>'); // convert line breaks
            html = html.replace(/<(div|p)><\/\1>/gi, '<p>&nbsp;</p>');
            html = html.replace(/<(div|p)><(ul|ol)>/gi, '<$2>').replace(/<\/(ul|ol)><\/(div|p)>/gi, '</$1>'); // lists can not be nested


            // strtr()
            var strtr = '\u2122,<sup>TM</sup>,\u2026,...,\x93|\x94|\u201c|\u201d,",\x60|\x91|\x92|\u2018|\u2019,\',\u2013|\u2014|\u2015|\u2212,-'.split(',');
            for (var i = 0; i < strtr.length; i += 2) html = html.replace(new RegExp(strtr[i], 'gi'), strtr[i + 1]);


            var el = $('<div>').html(html);
            $('p:empty', el).remove();
            $('*:empty:not(br)', el).remove(); // remove empty nodes
            el.children('br').filter(function(){ return !this.parentNode || this.parentNode.nodeName != 'li'; }).remove(); // remove all <br> except thous who in <li>
            $('*').filter(function(){ return this.nodeType == 3 && /\s+/.test(this.nodeValue); }).remove(); // remove empty text nodes
            el.contents().filter(function(){ return this.nodeType == 3; }).wrap('<p />');
            el.contents().filter(function(){ return this.nodeType == 8; }).remove(); // remove comments

            // Word lists
            var list_items = $('p', el).filter(function(index, item){
                return /mso-list/gi.test($(item).attr('style'));
            });
            $.each(list_items, function(index, item){
                var tagName = /^[0-9a-np-z]/i.test($.trim($(item).text())) ? 'ol' : 'ul';
                $(item).html($(item).html().replace(/<!--\[if !supportLists\]-->.+<!--\[endif\]-->/gi, ''));
                var content = $(item).find('span[lang]:first').size() > 0 ? $(item).find('span[lang]:first').html() : $(item).html();
                $(item).replaceWith('<' + tagName + '><li>' + content + '</li></' + tagName + '>');
            });
            el.html(el.html().replace(/<\/(o|u)l>\s*<(o|u)l>/gi, ''));

            // Nested lists
            list_items = $('li', el).filter(function(index, item){
                return $(item).find('ul, ol').size() > 0;
            });
            list_items.each(function(index, item){
                var list = $(item).find('ul:first, ol:first');
                $(list.html()).insertAfter(item);
                list.remove();
            });
            $('ul, ol', el).each(function(index, item){
                var parent = $(item).parent()[0];
                if(parent != el) $(parent).replaceWith($(parent).html());
            });

            // Replace long tags to short
            $('strong', el).replaceWith(function(){
                return '<b>' + $(this).html() + '</b>';
            });
            $('em', el).replaceWith(function(){
                return '<i>' + $(this).html() + '</i>';
            });
            $('h1, h2, h3, h4, h5, h6', el).replaceWith(function(){
                return '<p><b>' + $(this).html() + '</b></p>';
            });

            // Convert styled spans
            $('span', el).each(function(index, item){
                var start = '';
                var end = '';

                if(($(item).css('font-weight') == 'bold' || $(item).css('font-weight') == 700) && $(item).closest('b').size() == 0) {
                    start = '<b>';
                    end = '</b>';
                }
                if($(item).css('font-style') == 'italic' && $(item).closest('i').size() == 0) {
                    start += '<i>';
                    end += '</i>';
                }
                if($(item).css('text-decoration') == 'underline' && $(item).closest('u').size() == 0) {
                    start += '<u>';
                    end += '</u>';
                }
                $(item).replaceWith(start + $(item).html() + end);
            });

            $('div', el).replaceWith(function(){
                return '<p>' + $(this).html() + '</p>';
            });

            jQuery('*:not(b, i, u, ol, ul, li, p, br)', el).remove(); // remove not allowed tags


            // Remove attributes
            $('*', el).each(function(index, item){
                var attributes = item.attributes;
                var i = attributes.length;
                while(i--) item.removeAttributeNode(attributes[i]);
            });

            html = el.html();

            html = html.replace(/<\/(b|i|u)>\s*<\1>/gi, ''); // Remove repeated tags like: <b>H</b><b>ello</b>

            //html = html.replace(/([^>])<br><(ul|ol)>/gi, '$1<$2>'); // Remove unwanted <br> before lists

            //html = html.replace(/<br>\s*<br>\s*(<br>\s*)+/gi, '<br><br>');

            return html;
        },
        setHtml:function(html){
            html = this.cleanupHtml(html);
            this.doc.body.innerHTML = html;
            this.element.val(html);
        },
        getHtml:function(){
            return this.doc.body.innerHTML;
        },
        _selectedNode:function(){
            var self = this;

            // IE
            if(typeof self.doc.caretPos != 'undefined' && typeof self.doc.caretPos.parentElement != 'undefined') {
                return(self.doc.caretPos.parentElement());
            }

            // FF, O, S, C
            if(typeof self.wnd.getSelection != 'undefined') {
                var sel = self.wnd.getSelection();
                var node = sel.focusNode;
                if(node) {
                    return (node.nodeName == '#text') ? node.parentNode : node;
                }
            }

            return null;
        },
        _addButton:function (command) {
            var self = this;
            var button = $('<span class="mac-tinylight-toolbar-button" data-command="' + command + '" unselectable="on">' + command + '</span>').appendTo(self.toolbar);
            button.on('mousedown', function (e) { // must be mousedown, not click, otherwise it will not work in Firefox, because before click, text in edit area is unselected
                e.preventDefault();
                self.doc.execCommand(command);
                self._updateToolbar();
                return false;
            });
            self.buttons.push(button);
        },
        _updateToolbar:function () {
            var self = this;
            if (self.buttons.length > 0) {
                $.each(self.buttons, function (index, button) {
                    var command = button.data('command');
                    var enabled = self.doc.queryCommandEnabled(command);
                    button.toggleClass('mac-tinylight-toolbar-button__active', self.doc.queryCommandState(command));
                    button.toggleClass('mac-tinylight-toolbar-button__disabled', !enabled);

                    if (enabled) button.removeAttr('disabled');
                    else button.attr('disabled', 'disabled');
                });
            }
        },
        _create:function () {
            var self = this;
            // Hide textarea
            self.element.hide();

            // Create elements
            self.holder = $('<div class="mac-tinylight">').insertBefore(self.element).hide();
            self.holder.height(self.options.height);
            self.frame = $('<iframe class="mac-tinylight-frame" frameborder="0" dir="ltr" wrap="soft">').appendTo(self.holder);
            self.toolbar = $('<div class="mac-tinylight-toolbar" unselectable="on">').appendTo(self.holder);

            // Create toolbar buttons
            var buttons = ['Bold', 'Italic', 'Underline', 'InsertUnorderedList', 'InsertOrderedList'];
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
            self.doc.write('<!DOCTYPE html><title></title><meta charset="utf-8"><link rel="stylesheet" href="http://css.cdn.tl/normalize.css"><style>body{margin:.5em;font-family:' + self.options.fontFamily + ';font-size:' + self.options.fontSize + ';background-color:' + self.options.backgroundColor + ';}p,ul,ol{margin:2px 0}p{background:#eee;}li{background:#ccc}</style><body></body>');// + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>'
            self.doc.close();

            $.trim(self.element.val()) == '' ? self.setHtml('<p>&nbsp;</p>') : self.setHtml(self.element.val());

            // Make it editable
            if (self.doc.body.contentEditable) self.doc.body.contentEditable = true;
            else self.doc.designMode = 'on';

            // Make it use tags instead of styles
            try {
                self.doc.execCommand("styleWithCSS", 0, false);
            } catch (e) {
                try {
                    self.doc.execCommand("useCSS", 0, true);
                } catch (e) {
                    try {
                        self.doc.execCommand('styleWithCSS', false, false);
                    }
                    catch (e) {
                    }
                }
            }

            // Attach events
            $(self.doc).on('keyup', function(e){
                if(e.keyCode == 13 && !e.shiftKey) { // RETURN key without shift
                    //RETURN key
                    //cleanup <br><br> between paragraphs
                    jQuery(self.doc.body).children('br').filter(function(){ return this.parentNode.nodeName != 'li'; }).remove();

                    //fix PRE bug #73
                    container = self._selectedNode();
                    if(container && container.tagName.toLowerCase() == 'pre') {
                        self.doc.execCommand('FormatBlock', false, self.options.blockTag); //create P after PRE
                    }
                }

                //fix #112
                /*if(e.keyCode == 13 && e.shiftKey && navigator.userAgent.match(/WebKit/)) {
                    self.doc.execCommand('InsertLineBreak', false, null);
                }*/

                //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
                //text nodes replaced by P
                if(e.keyCode != 8
                    && e.keyCode != 17
                    && e.keyCode != 46
                    && e.keyCode != 224
                    && !e.metaKey
                    && !e.ctrlKey) {

                    container = self._selectedNode();

                    var name = container.tagName.toLowerCase();

                    //fix forbidden main containers
                    if(
                        name == "strong" ||
                        name == "b" ||
                        name == "em" ||
                        name == "i" ||
                        name == "sub" ||
                        name == "sup" ||
                        name == "a"
                    ) name = container.parentNode.tagName.toLowerCase();

                    if(name == 'body' || name == 'div' || name == 'p') self.doc.execCommand('FormatBlock', false, self.options.blockTag);

                }

                // Catch Ctrl+v and Shift+Ins and run cleanup
                if((e.keyCode == 86 && e.ctrlKey) || (e.keyCode == 45 && e.shiftKey)) {
                    self.setHtml(self.getHtml());
                }
            });

            // On any change, check how much is changed and if it is greater than limit run cleanup
            $(self.doc).on('keyup mouseup', function(e){
                self._updateToolbar();

                self.nowLength = self.doc.body.innerHTML.length;
                if(Math.abs(self.nowLength - self.wasLength) > self.options.cleanupLengthTrigger) self.setHtml(self.getHtml());
                self.wasLength = self.nowLength;

                if(self.options.updateOnKeyUp) {
                    self.element.val(self.doc.body.innerHTML);
                }
            });

            $(navigator.userAgent.match(/MSIE/) ? self.doc : self.wnd).on('blur deactivate', function(){
                self.setHtml(self.getHtml());
            });

            self.holder.show();
        },
        _setOption:function (key, value) {
            var self = this;
            this._super('_setOption', key, value);

            switch (key) {
                case 'height': self.holder.height(value); break;
                case 'fontSize': self.doc.body.style.fontSize = value; break;
                case 'fontFamily': self.doc.body.style.fontFamily = value; break;
                case 'backgroundColor': self.doc.body.style.backgroundColor = value; break;
                default:break;
            }
        },
        destroy:function () {
            this.setHtml(this.getHtml());
            this.holder.remove();
            this.element.show();
            this._super('destroy');
        }
    });
})(jQuery);
