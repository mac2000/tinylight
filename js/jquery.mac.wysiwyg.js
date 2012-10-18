(function ($, undefined) {
    $.widget('mac.wysiwyg', {
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
            //TODO: grab from fresh tinymce

            // Regex cleanup
            //html = html.replace(/<div>/gi, '').replace(/<\/div>/gi, '<br>');

            // DOM cleanup
            var el = $('<div>').html(html);
            el.contents().filter(function(){ return this.nodeType == 8; }).remove(); // remove comments
            html = el.html();

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
            var button = $('<span class="mac-wysiwyg-toolbar-button" data-command="' + command + '" unselectable="on">' + command + '</span>').appendTo(self.toolbar);
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
                    button.toggleClass('mac-wysiwyg-toolbar-button__active', self.doc.queryCommandState(command));
                    button.toggleClass('mac-wysiwyg-toolbar-button__disabled', !enabled);

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
            self.holder = $('<div class="mac-wysiwyg">').insertAfter(self.element).hide();
            self.holder.height(self.options.height);
            self.frame = $('<iframe class="mac-wysiwyg-frame" frameborder="0" dir="ltr" wrap="soft">').appendTo(self.holder);
            self.toolbar = $('<div class="mac-wysiwyg-toolbar" unselectable="on">').appendTo(self.holder);

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
            self.doc.write('<!DOCTYPE html><title></title><meta charset="utf-8"><link rel="stylesheet" href="http://css.cdn.tl/normalize.css"><style>body{margin:.5em;font-family:' + self.options.fontFamily + ';font-size:' + self.options.fontSize + ';background-color:' + self.options.backgroundColor + ';}</style><body>' + self.element.val() + '</body>');// + '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>'
            self.doc.close();

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