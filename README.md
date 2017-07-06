# fcjax

Ajaxify your form without changing a lot of code.  
It submits your form via ajax and updates current page contents with matching page contents from ajax response.

## Usage

example.html
```
<form action="example-submit.php" method="post" id="my-form">
    ...
</form>

<script src="fcjax.js"></script>

<script>
    // fcjax(form selector, updatable element selector, event handlers object)
    fcjax('#my-form', '.fcjaxify', {
        onSubmit: function(submitEvent, form) {
            // called when submitting the form
            return false; // returning false won't send ajax request
        },
        onProgress: function(xhrEvent, xhrObject) {
            // called when there is progress status
        },
        onLoaded: function(xhrObject) {
            // called after ajax response is received
            return false; // returning false won't update page contents
        },
        onDone: function(xhrObject) {
            // called after page contents is updated
        },
        onError: function(xhrObject) {
            // called when there is an error
        },
        onAlways: function() {
            // always called after done or error
        },
    });
</script>
```

inside `form#my-form`
```
<div class="fcjaxify" id="message"></div>
<p>
    Username: <input type="text" name="username">
    <span class="fcjaxify" id="message-username"></span>
</p>
<p>
    Address: <input type="text" name="address">
</p>
<p><button>Submit</button></p>
```

Supposed that posting to `example-submit.php` in normal way produce a page with `form#my-form`...
```
<div class="fcjaxify" id="message">
    <p>Invalid username.</p>
    <script>console.log('scripts inside updateable components will be executed')</script>
</div>
<p>
    Username: <input type="text" name="username">
    <span class="fcjaxify" id="message-username">
        Username already exists
    </span>
</p>
<p>
    Address: <input type="text" name="address">
</p>
<p><button>Submit</button></p>
```
then the current `.fcjaxify` elements will be replaced.

## More

Run [example](https://rawgit.com/sumartoyo/fcjax/master/example.html) and read the source code for more information.
