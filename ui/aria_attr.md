- For label, title
aria-label: for a element which doesn't have a label in ui (like search input ui)
aria-labelledby: a label way other than '<label>'
- For description, content
aria-description: detailed description alt of 'aria-label'
aria-describedby: an element 'id' of a simple string of text

aria-details: an element 'id' of more structured data than 'aria-describedby'

### aria-owns
Takes space-separated list of elements's 'id's and makes them own children, used where JS or CSS(like 'order') makes the ui layout on screen differ from DOM.

### aria-controls
space-separated 'id' list

### aria-disabled
'disabled' attr of <input> controls disables them entirely; while 'aria-disabled' disables it and its descendants, only semantically.

Example: a button which is important to keep the focus order, like a form submit button, the header button element associated with non-collapsible accordion panel.

### aria-hidden
hides non-'interactive element's and its descendants from accessibility.
Example: purely decorative content like icons, collapsed content, duplicated content
DON'T: use on a focusable element
No effects if already have 'display: none', 'visibility: hidden', html 'hidden' attr.

### aria-colindextext, aria-rowindextext
A human-readable text alternative of 'aria-colindex'

### aria-current
"false, true, time, date, location, step, page"
Represents the current (value) within a context.
```html
<nav aria-label="Breadcrumb" class="breadcrumb">
  <ol>
    <li>
      <a href="../../../"> ARIA </a>
    </li>
    <li>
      <a href="../../"> ARIA States and Properties </a>
    </li>
    <li>
      <a href="./" aria-current="page"> ARIA: `aria-current` attribute </a>
    </li>
  </ol>
</nav>
```

### aria-flowto
Tells assistants which element comes next in reading order.
Use with tabindex, css 'order'.

### aria-invalid, aria-errormessage
Show validation status in inputs.
"false, true, grammer, spelling"

```html
<input type="email" name="email" id="email" aria-invalid="true" aria-errormessage="err1" /> 
<span id="err1" class="errormessage">Error: Enter a valid email address</span>
```

### aria-keyshortcuts
like "Control+P Shift+Space Q"

### aria-roledescription
Use with roles like 'group' or 'region' and to provide a more specific description.

### aria-braillelabel, aria-brailleroledescription
For the case a aria-label (,aria-roledescription) is excessively verbose when rendered in Braille.
