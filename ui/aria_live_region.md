# ARIA Live regions
Assistants announce dynamic changes in the content of a live region which has 'aria-live' attr or live region role (like 'role="alert"').
Simple content changes which are not interactive should be marked as live regions.
Don't try to control focus interrupting user's activity.
Make sure elements with these attr, roles is present in markup and just change its contents, but not generate an element itself dynamically.
@
aria-live:
  'off' (default) for supressing like 'role-"alert"'
  'polite' announce when the user is idle
  'assertive' annouce rapidly for time-sensitive/critical notifications

aria-atomic: boolean (default false) whether treats a live region as a whole even if only part of the region changes.

aria-relevant: combinations of "additions removals text all" decides what types of changes to a live region are announced.

aria-busy: Set true to tell a user that updates are done.(Use with 'progress','feed',...)

## roles
### alert
Only text content like error, warning message. `assertive aria-atomic="true"`
(Example) change alert's content dynamically
```html
Exp-1
<div id="expirationWarning" role="alert">
  <span class="display-none">Your log in session will expire in 2 minutes</span>
</div>
Exp-2
<div id="alertContainer" role="alert"></div>
```

### log
logs of chat, error, game. `polite`

### marquee
text which scrolls, stock ticker, ad banners `off`

### status
like status bar. `polite aria-atomic="true"`
Can be labelled by 'aria-label' or 'aria-labelledby'

### timer
`off`


## Related
### alertdialog
`alert`(usecase)+`dialog`(type) role. with controls which requires user interactions
Manage the focus to move to the control as it appears.
'aria-labelledby' or 'aria-label' -> title; 'aria-describedby' -> description
```html
<div
  role="alertdialog"
  aria-labelledby="dialog1Title"
  aria-describedby="dialog1Desc">
  <div role="document" tabindex="0">
    <h2 id="dialog1Title">Your login session is about to expire</h2>
    <p id="dialog1Desc">To extend your session, click the OK button</p>
    <button>OK</button>
  </div>
</div>
```

### dialog
Requires label
Manage the focus to move to controls.

### aria-modal
boolean whether it's modal (the main content in the background is like `aria-hidden` to assistants)
Use with `dialog`s
Disable this if it's not modal.
To deactivate actual DOM, should use `inert` html global attr.

```html
<div id="backdrop" class="no-scroll">
  <div
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="dialog_label"
    aria-describedby="dialog_desc">
    <h2 id="dialog_label">Confirmation</h2>
    <div id="dialog_desc">
      <p>Are you sure you want to delete this file?</p>
    </div>
    <button type="button" onclick="closeDialog(this)">
      No. Close this popup.
    </button>
    <button type="button" onclick="deleteFile(this)">
      Yes. Delete the file.
    </button>
  </div>
</div>
```

### <dialog>
- '.showModal()'
focus '<dialog>' itself would pass focus on the initial focusable element.
'::backdrop' css available
Press 'Escape' key fires 'close' and 'cancel' event.

- 'open' attr, '.show()'

Close with '.close(returnValue?)' or click '<form method="dialog"><button></button></form>', those fires 'close' event.
With 'method="dialog"' set on <form>, click '<button type="submit"></button>' closes the dialog, not reload the page.
With 'formmethod="dialog"' set on <button> in <form>. the form state are saved, not submitted, the <dialog> closes, and the 'returnValue' property set to this <button>'s value.


