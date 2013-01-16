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
            backgroundColor:'white'
        },
        cleanupHtml:function(html){
            // some basic replacements, we are:
            // removing &nbsp;
            // removing multiple spaces
            // removing all non printable space charactes
            // removing spaces between tags
            // converting all <br> tags to same format
            var debug = (html === 'Hello<div>d</div>');

            html = html.replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').replace(/[\t\r\n\n]+/g, '').replace(/>\s+</g, '><').replace(/<br\s*\/?>/gi, '<br>');

            // strtr()
            var strtr = '\u2122,<sup>TM</sup>,\u2026,...,\x93|\x94|\u201c|\u201d,",\x60|\x91|\x92|\u2018|\u2019,\',\u2013|\u2014|\u2015|\u2212,-'.split(',');
            for (var i = 0; i < strtr.length; i += 2) html = html.replace(new RegExp(strtr[i], 'gi'), strtr[i + 1]);


            var el = $('<div>').html(html);

            $('*:empty:not(br)', el).remove(); // remove empty nodes
            $('*', el).filter(function(){ return this.nodeType == 3 && /\s+/.test(this.nodeValue); }).remove(); // remove empty text nodes
            el.contents().filter(function(){ return this.nodeType == 8; }).remove(); // remove comments
            el.contents().filter(function(){ return this.nodeType != 1; }).wrap('<p />'); // wrap text nodes with paragraphs

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

            $('li', el).contents().filter(function(){ return this.nodeType != 1; }).wrap('<p />'); // wrap text nodes in li with paragraphs

            // Replace long tags to short
            $('strong', el).replaceWith(function(){
                return '<b>' + $(this).html() + '</b>';
            });
            $('em', el).replaceWith(function(){
                return '<i>' + $(this).html() + '</i>';
            });
            $('div', el).replaceWith(function(){
                return '<p>' + $(this).html() + '</p>';
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

            /*$('p, div', el).each(function(index, item){
                $('<br>').insertAfter(item);
                if(item.previousSibling && item.previousSibling.nodeType == 3 && !/\s+/.test(item.previousSibling.nodeValue)) {
                    $('<br>').insertBefore(item);
                }
                $(item).replaceWith($(item).html());
            });*/

            jQuery('*:not(b, i, u, ol, ul, li, p)', el).remove(); // remove not allowed tags



            // Remove attributes
            $('*', el).each(function(index, item){
                var attributes = item.attributes;
                var i = attributes.length;
                while(i--) item.removeAttributeNode(attributes[i]);
            });

            html = el.html();

            html = html.replace(/<\/(b|i|u)>\s*<\1>/gi, ''); // Remove repeated tags like: <b>H</b><b>ello</b>



            return html;
        },
        htmlEncode:function(html){
            return $('<span>').text(html).html();
        },
        htmlDecode:function(html){
            return $('<span>').html(html).text();
        },
        setHtml:function(html){
            html = this.cleanupHtml(html);
            this.doc.body.innerHTML = html;
            this.element.val(html);
        },
        getHtml:function(){
            return this.doc.body.innerHTML;
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
            if (!jQuery.browser.msie) {
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
            self.doc.write('<!DOCTYPE html><title></title><meta charset="utf-8"><link rel="stylesheet" href="http://css.cdn.tl/normalize.css"><style>body{margin:.5em;font-family:' + self.options.fontFamily + ';font-size:' + self.options.fontSize + ';background-color:' + self.options.backgroundColor + ';}</style><body></body>');// + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>'
            self.doc.close();

            self.setHtml(self.element.val());
            //' + self.element.val() + '

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
            $(self.doc).on('keyup mouseup', function(){
                self._updateToolbar();

                self.nowLength = self.doc.body.innerHTML.length;
                if(Math.abs(self.nowLength - self.wasLength) > self.options.cleanupLengthTrigger) self.setHtml(self.getHtml());
                self.wasLength = self.nowLength;
            });

            $($.browser.msie ? self.doc : self.wnd).on('blur deactivate', function(){
                //alert('blur');
                self.setHtml(self.getHtml());
            });

            //self._updateToolbar();
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
