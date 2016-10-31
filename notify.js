// notify.js
// AUTHOR: Karrick S. McDermott, 2014
// DEPENDENCIES: jQuery, Bootstrap

// KNOWN BUGS:
//
// 1. If window width shrinks and would clip right edge of note, then
//    the notes compensate by scrolling to another line, getting
//    shorter and taller. This causes them to have more distance
//    between the notes.

var Notify = (function($){
    var Note = (function(options){
        return function(options){
            if(options === undefined){
                document.dispatchEvent(new ErrorEvent('Notify', {
                    bubbles: true,
                    message: "cannot create note without options."
                }));
                return;
            }
            if(!options.hasOwnProperty('type')) {
                document.dispatchEvent(new ErrorEvent('Notify', {
                    bubbles: true,
                    message: "cannot create note without options."
                }));
                return;
            }
            if(options.type !== 'success' && options.type !== 'info' && options.type !== 'warning' && options.type !== 'danger') {
                document.dispatchEvent(new ErrorEvent('Notify', {
                    bubbles: true,
                    message: "cannot create note without options."
                }));
                return;
            }
            if(!options.hasOwnProperty('id')) {
                document.dispatchEvent(new ErrorEvent('Notify', {
                    bubbles: true,
                    message: "cannot create note without options."
                }));
                return;
            }
            if(options.caption === undefined && options.message === undefined) {
                document.dispatchEvent(new ErrorEvent('Notify', {
                    bubbles: true,
                    message: "cannot create note without options."
                }));
                return;
            }
            // options are valid
            if(options.caption !== undefined && options.message !== undefined){
                options.caption += ': ';
            }
            var closeCallback = options.closeCallback;
            var zIndex = 9;     // default zIndex
            if(options.zIndex !== undefined){
                zIndex = options.zIndex;
            }
            var that = this;
            that.id = options.id;
            that.caption = options.caption;
            that.message = options.message;
            var animateDuration = 500;

            var closeButtonElement = $('<button>')
                    .attr('type','button').attr('class','close').attr('data-dismiss','alert')
                    .append($('<span>').attr('aria-hidden','true').html('&times;'))
                    .append($('<span>').attr('class','sr-only').text('Close'))
                    .click(function(e){
                        that.remove();
                        e.preventDefault();
                        return false;
                    });
            var domElement = that.domElement = $('<div>')
                    .attr('class', 'alert alert-dismissible alert-' + options.type)
                    .attr('role','alert')
                    .append(closeButtonElement)
                    .append($('<strong>').text(options.caption))
                    .append($('<span>').html('&nbsp;'))
                    .append($('<span>').text(options.message))
                    .css('position','fixed')
                    .css('zIndex', zIndex);

            that.messageFadeout = function(delay){
                if(delay === undefined){
                    document.dispatchEvent(new ErrorEvent('Notify', {
                        bubbles: true,
                        message: "cannot create note without options."
                    }));
                    return;
                }
                window.setTimeout(function(){
                    domElement.fadeOut({always: function(){that.remove();}});
                }, delay);
            };
            that.moveTo = function(x, y){
                var offset = domElement.offset();
                domElement.stop().animate({left: '+=' + (x - offset.left), top: '+=' + (y - offset.top)}, animateDuration);
            };
            that.outerHeight = function(includeMargins){
                return domElement.outerHeight(includeMargins);
            };
            that.outerWidth = function(includeMargins){
                return domElement.outerWidth(includeMargins);
            };
            that.position = function(x, y){
                domElement.css({left: x, top: y});
            };
            that.remove = function(){
                domElement.remove();
                if(closeCallback !== undefined) closeCallback(that);
            };
        };
    })();
    // monotomically increasing numbers, starting at 0
    var getNextId = (function() {
        var nextId = 0;
        return function() {
            return nextId++;
        };
    })();
    var makeSorter = function(direction){
        var less;
        if(direction === 'ascending'){
            less = -1;
        } else if(direction === 'descending'){
            less = 1;
        } else {
            document.dispatchEvent(new ErrorEvent('Notify', {
                bubbles: true,
                message: "cannot create note without options."
            }));
        }
        return function(someHashOfIdToObjects){
            var sortedIdList = [];
            for(var id in someHashOfIdToObjects){
                if(someHashOfIdToObjects.hasOwnProperty(id)){
                    sortedIdList.push(parseInt(id, 10));
                }
            }
            sortedIdList.sort(function(a, b){
                if(a < b) {
                    return less;
                } else if(a > b) {
                    return -less;
                } else {
                    return 0;
                }
            });
            return sortedIdList;
        };
    };
    return function(options) {
        if(options === undefined){
            options = {};
        }
        this.body = $('body');
        var that = this;
        var notes = {};

        var horizontalPadding = 40;
        if(options.horizontalPadding !== undefined){
            horizontalPadding = options.horizontalPadding;
        }
        var verticalPadding = 100;
        if(options.verticalPadding !== undefined){
            verticalPadding = options.verticalPadding;
        }
        var zIndex = 9;
        if(options.zIndex !== undefined){
            zIndex = options.zIndex;
        }
        var moveNotes, initPosition, sortedIdList;
        if(options.corner === undefined){
            options.corner = 'bottomLeft';
        }
        switch(options.corner){
        case 'bottomLeft':
            moveNotes = function(){
                var xPos = horizontalPadding;
                var yPos = this.body.innerHeight() - verticalPadding;
                sortedIdList(notes).forEach(function(id){
                    var note = notes[id];
                    note.moveTo(xPos, yPos);
                    yPos -= note.outerHeight(true);
                });
            };
            initPosition = function(note){
                note.position(horizontalPadding, -note.outerHeight(true));
            };
            sortedIdList = makeSorter('descending');
            break;
        case 'bottomRight':
            moveNotes = function(){
                var fromX = this.body.innerWidth() - horizontalPadding;
                var yPos = this.body.innerHeight() - verticalPadding;
                sortedIdList(notes).forEach(function(id){
                    var note = notes[id];
                    var xPos = fromX - note.outerWidth(true);
                    note.moveTo(xPos, yPos);

                    xPos = fromX - note.outerWidth(true);
                    note.moveTo(xPos, yPos);

                    yPos -= note.outerHeight(true);
                });
            };
            initPosition = function(note){
                var xPos = this.body.innerWidth() - horizontalPadding - note.outerWidth(true);
                note.position(xPos, -note.outerHeight(true));
            };
            sortedIdList = makeSorter('descending');
            break;
        case 'topLeft':
            moveNotes = function(){
                var yPos = verticalPadding;
                sortedIdList(notes).forEach(function(id){
                    var note = notes[id];
                    note.moveTo(horizontalPadding, yPos);
                    yPos += note.outerHeight(true);
                });
            };
            initPosition = function(note){
                note.position(horizontalPadding, this.body.innerHeight());
            };
            sortedIdList = makeSorter('ascending');
            break;
        case 'topRight':
            moveNotes = function(){
                var fromX = this.body.innerWidth() - horizontalPadding;
                var yPos = verticalPadding;
                sortedIdList(notes).forEach(function(id){
                    var note = notes[id];
                    var xPos = fromX - note.outerWidth(true);
                    note.moveTo(xPos, yPos);
                    yPos += note.outerHeight(true);
                });
            };
            initPosition = function(note){
                var xPos = this.body.innerWidth() - horizontalPadding - note.outerWidth(true);
                console.debug(this.body, this.body.innerWidth(),horizontalPadding,note.outerWidth(true));
                console.debug(xPos);
                note.position(xPos, this.body.innerHeight());
            };
            sortedIdList = makeSorter('ascending');
            break;
        default:
            document.dispatchEvent(new ErrorEvent('Notify', {
                bubbles: true,
                message: "cannot create note without options."
            }));
            break;
        }
        var closeCallback = function(note){
            delete notes[note.id];
            moveNotes();
        };
        var createNote = function(options){
            options.id = getNextId();
            options.closeCallback = closeCallback;
            if(options.zIndex === undefined){
                options.zIndex = zIndex;
            }
            var note = new Note(options);
            notes[options.id] = note;
            initPosition(note);
            $('this.body').append(note.domElement);
            if(options.messageFadeout !== undefined){
                note.messageFadeout(options.messageFadeout);
            }
            moveNotes();
            return note;
        };
        that.success = function(options){
            options.type = 'success';
            console.debug(JSON.stringify(options));
            return createNote(options);
        };
        that.info = function(options){
            options.type = 'info';
            console.info(JSON.stringify(options));
            return createNote(options);
        };
        that.warning = function(options){
            options.type = 'warning';
            console.warn(JSON.stringify(options));
            return createNote(options);
        };
        that.danger = function(options){
            options.type = 'danger';
            return createNote(options);
        };
        // request callback when window size changed
        $(window).resize(function(){
            moveNotes();
        });
    };

    document.addEventListener('Notify', function(event){
        console.error('uncaught error: ' + event);
    });
})(jQuery);
