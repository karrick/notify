# notify.js

Notify is a JavaScript library for managing notifications in a web
application. It has a clean API. It requires
[jQuery](http://jquery.com), [jQuery UI](http://jqueryui.com/), and
[Bootstrap](http://getbootstrap.com/javascript/).

## Simple Example:

```JavaScript
    // instantiate the notify manager
    var notify = new Notify();

    // create some notes
    notify.success({caption:"notify.js", message:"has an easy-to-use api"});
    notify.success({caption:"some notes automatically fadeout",message:"this one after 5 seconds", messageFadeout:5000});
    notify.info({caption:"some notes just have a caption"});
    notify.warning({message:"some notes just have a message"});
    notify.danger({caption:"but when you have both", message:"captions are bold and messages are regular fonts"});
```

## Complex Example:

This example demonstrates a mini library for wrapping AJAX calls. When
the call completes, the note is removed. If the call resulted in an
error, however, the note is replaced by a new note informing the user
of the error message.

```JavaScript
    // instantiate the notify manager
    var notify = new Notify();

    // invoke .success, .info, .warning, and .danger methods on the notification object:
    var getJsonWithStatus = function(message, uri, data, fn){
        var note = notify.info({message: message});
        return $.getJSON(uri, data)
            .done(function(results){
                if(fn !== undefined){
                    fn(results);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                var msg = errorThrown || textStatus;
                notify.danger({caption: message, message: msg, messageFadeout: errorMessageTimeout});
            })
            .always(function(){
                note.remove();
            });
    };
```

## Setup

Include jQuery, jQuery UI, Bootstrap, and notify.js in your HTML file.

```HTML
    <!DOCTYPE html>
    <meta charset="utf-8">
    <html lang="en">
      <head>
        <title>notify.js example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- jQuery & jQuery UI -->
        <script type="text/javascript" charset="utf-8" src="/js/jquery-2.1.1.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="/js/jquery.mousewheel.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="/jquery-ui-1.11.2/jquery-ui.min.js"></script>
        <link rel="stylesheet" type="text/css" href="/jquery-ui-1.11.2/jquery-ui.min.css">
        <!-- Bootstrap -->
        <script type="text/javascript" charset="utf-8" src="/bootstrap/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-theme.min.css">
        <!-- notify.js -->
        <script type="text/javascript" charset="utf-8" src="/js/notify.js"></script>
      </head>
      <body></body>
    </html>
```

# API

## Notification manager

The notifaction manager can manage notes in either the `bottomLeft`,
`bottomRight`, `topLeft`, or `topRight` corners of the browser's
window. Simply specify which corner when creating the notification
manager object. The default is `bottomLeft`.

```JavaScript
    bl = new Notify({corner:'bottomLeft'});
    br = new Notify({corner:'bottomRight'});
    tl = new Notify({corner:'topLeft'});
    tr = new Notify({corner:'topRight'});
```

After the notification manager is created, it will install a hook for
window resize events, and move any notes in the window to the
specified corner of the window after resize events.

The notification manager has four methods for creating new notes:
`.success`, `.info`, `.warning`, and `.danger`. Pass a parameter
object to these methods to specify the note's `caption`, `message`,
and `messageFadeout` values.

Either or both of `caption` and `message` must be set. The `caption`
will be shown with a bold font. If both `caption` and `message` are
both set, they will be seperated by a colon and a space.

The `messageFadeout` parameter allows you to specify how many
milliseconds until the note fades out and is removed from the browser
window. Leave undefined to keep the note on the browser window until
removed programmatically or by the user clicking the `X` button inside
the note. A note can be programmatically removed from the browser window
by calling its `.remove` method.

```JavaScript
    notify.success({caption:"test", message:"It worked!", messageFadeout:3000});
```
