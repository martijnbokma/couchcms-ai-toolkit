---
id: comments
name: "Comments"
category: "user-features"
version: "2.x"
description: "User comments with moderation and spam prevention"
required: false
requires: [couchcms-core]
conflicts: []
---

# comments




## Comments

Comprehensive guide to enabling user comments on CouchCMS pages including comment forms, spam prevention with CAPTCHA, moderation workflow, and comment listing.

### blog.php

```php
<cms:template title='Blog' clonable='1' commentable='1'>
    <!-- The editable and folder tags can go here -->
</cms:template>
```

### config.php

```php
// 20.
// A setting of '1' will necessitate the admin to approve comments before they get published.
// '0' will publish comments immediately.
// A setting of '1' is strongly recommended in order to avoid spam.
define( 'K_COMMENTS_REQUIRE_APPROVAL', 1 );

// 21.
// Minimum time interval required between two comments posted by the same user (in seconds).
// Prevents comment flooding. A setting of 5 minutes (300 seconds) is recommended.
define( 'K_COMMENTS_INTERVAL', 5 * 60 );
```

### Comment Form Template

```php
<cms:if k_is_commentable >
<div class="comment-form" >
    <h3>Post a comment</h3>

    <cms:form method="post" class="k_form">

        <cms:if k_success >

            <cms:process_comment />

            <cms:if k_process_comment_success>
                <cms:send_mail from=k_email_from to=k_email_to subject='Comment posted'>
                    The following comment has been posted at your site:
                    <cms:show k_success />
                </cms:send_mail>

                <div class="k_successmessage">
                    <p>
                        Thank you for the feed back! <br>
                        Your comment awaits moderation and will be published as soon as reviewed by the Admin.
                    </p>
                </div>
            <cms:else />
                <div class="k_errormessage">
                    <p>
                        Could not post comment! <br>
                        The following error occured while processing your comment:<br>
                        <cms:show k_process_comment_error />
                    </p>
                </div>

            </cms:if>

        <cms:else />

            <cms:if k_error >
                <div class="k_errormessage">
                    <h2>Fields incomplete!</h2>
                    <ul>
                        <cms:each k_error >
                            <li><cms:show item /></li>
                        </cms:each>
                    </ul>
                </div>
            </cms:if>

            <cms:if k_logged_out >
                <p class="comment-input">
                    <cms:input type="text" name="k_author" size="22" tabindex="1" required="1"/>
                    <label for="author"><small>Name *</small></label>
                </p>

                <p class="comment-input">
                    <cms:input type="text" name="k_email" size="22" tabindex="2" validator="email" required="1"/>
                    <label for="email"><small>Email * (will not be published)</small></label>
                </p>

                <p class="comment-input">
                    <cms:input type="text" name="k_link" value="http://" size="22" tabindex="3" />
                    <label for="link"><small>Website</small></label>
                </p>
            <cms:else />
                <p>
                    Logged in as <b><cms:show k_user_title /></b>.
                    <a href="<cms:show k_logout_link />" onclick="if( confirm('Are you sure you want to logout?') ) { return true; } return false;">Logout &raquo;</a>
                </p>
            </cms:if>

            <p class="comment-input">
                <cms:input type="textarea" name="k_comment" style="width:93%" rows="10" cols="10" tabindex="4"
                    validator_msg="required=Please enter something as comment"
                    required="1" />

                <br>
                <small>
                <cms:html_encode>
                    You can use the following HTML tags: <a><br><strong><b><em><i><blockquote><code><ul><ol><li><del>
                </cms:html_encode>
                </small>
            </p>

            <cms:if k_logged_out >
                <p class="comment-input">
                    <label for="captcha"><small>Please enter this word in the textbox below</small></label><br>
                    <cms:input type="captcha" name="captcha" format='i-r-t' />
                </p>
            </cms:if>

            <cms:input type="submit" value="Submit" name="submit"/>

        </cms:if>
    </cms:form>

</div>
</cms:if>
```


## comments Tag

### Example

```php
<cms:comments masterpage='blog.php'></cms:comments>
```

### Example

```php
<cms:comments masterpage='blog.php, testimonial.php'></cms:comments>
```


---

## Comments

Comprehensive guide to enabling user comments on CouchCMS pages including comment forms, spam prevention with CAPTCHA, moderation workflow, and comment listing.

### blog.php

```php
<cms:template title='Blog' clonable='1' commentable='1'>
    <!-- The editable and folder tags can go here -->
</cms:template>
```

### config.php

```php
// 20.
// A setting of '1' will necessitate the admin to approve comments before they get published.
// '0' will publish comments immediately.
// A setting of '1' is strongly recommended in order to avoid spam.
define( 'K_COMMENTS_REQUIRE_APPROVAL', 1 );

// 21.
// Minimum time interval required between two comments posted by the same user (in seconds).
// Prevents comment flooding. A setting of 5 minutes (300 seconds) is recommended.
define( 'K_COMMENTS_INTERVAL', 5 * 60 );
```

### Comment Form Template

```php
<cms:if k_is_commentable >
<div class="comment-form" >
    <h3>Post a comment</h3>

    <cms:form method="post" class="k_form">

        <cms:if k_success >

            <cms:process_comment />

            <cms:if k_process_comment_success>
                <cms:send_mail from=k_email_from to=k_email_to subject='Comment posted'>
                    The following comment has been posted at your site:
                    <cms:show k_success />
                </cms:send_mail>

                <div class="k_successmessage">
                    <p>
                        Thank you for the feed back! <br>
                        Your comment awaits moderation and will be published as soon as reviewed by the Admin.
                    </p>
                </div>
            <cms:else />
                <div class="k_errormessage">
                    <p>
                        Could not post comment! <br>
                        The following error occured while processing your comment:<br>
                        <cms:show k_process_comment_error />
                    </p>
                </div>

            </cms:if>

        <cms:else />

            <cms:if k_error >
                <div class="k_errormessage">
                    <h2>Fields incomplete!</h2>
                    <ul>
                        <cms:each k_error >
                            <li><cms:show item /></li>
                        </cms:each>
                    </ul>
                </div>
            </cms:if>

            <cms:if k_logged_out >
                <p class="comment-input">
                    <cms:input type="text" name="k_author" size="22" tabindex="1" required="1"/>
                    <label for="author"><small>Name *</small></label>
                </p>

                <p class="comment-input">
                    <cms:input type="text" name="k_email" size="22" tabindex="2" validator="email" required="1"/>
                    <label for="email"><small>Email * (will not be published)</small></label>
                </p>

                <p class="comment-input">
                    <cms:input type="text" name="k_link" value="http://" size="22" tabindex="3" />
                    <label for="link"><small>Website</small></label>
                </p>
            <cms:else />
                <p>
                    Logged in as <b><cms:show k_user_title /></b>.
                    <a href="<cms:show k_logout_link />" onclick="if( confirm('Are you sure you want to logout?') ) { return true; } return false;">Logout &raquo;</a>
                </p>
            </cms:if>

            <p class="comment-input">
                <cms:input type="textarea" name="k_comment" style="width:93%" rows="10" cols="10" tabindex="4"
                    validator_msg="required=Please enter something as comment"
                    required="1" />

                <br>
                <small>
                <cms:html_encode>
                    You can use the following HTML tags: <a><br><strong><b><em><i><blockquote><code><ul><ol><li><del>
                </cms:html_encode>
                </small>
            </p>

            <cms:if k_logged_out >
                <p class="comment-input">
                    <label for="captcha"><small>Please enter this word in the textbox below</small></label><br>
                    <cms:input type="captcha" name="captcha" format='i-r-t' />
                </p>
            </cms:if>

            <cms:input type="submit" value="Submit" name="submit"/>

        </cms:if>
    </cms:form>

</div>
</cms:if>
```


## comments Tag

### Example

```php
<cms:comments masterpage='blog.php'></cms:comments>
```

### Example

```php
<cms:comments masterpage='blog.php, testimonial.php'></cms:comments>
```
