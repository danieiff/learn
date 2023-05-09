## landmarks
'role="(landmark)"' or use specifc html tags.
Identifies Large overall sections of the document.
Don't use too many.
Use same labels with the different 'id's for repeated landmarks.

### banner
<header> of site-global, not descendant of <aside>, <article>, <main>, <nav>, <section>

### complementary
Label required if this exists >1, and avoid "sidebar" like words included redundantly.
<aside>, a portion related to the document's *main* content.

### contentinfo
Label required if this exists >1, and avoid "footer" like words included redundantly.
<footer>, only one, not descendant of <aside>, <article>, <main>, <nav>, <section>

### form
Label required for each, and avoid "form" like words included redundantly.
<form> https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement

### search
Label required if this exists >1, and avoid "search" like words included redundantly.
```html
<form id="search" role="search" aria-label="Sitewide">
  <label for="search-input">Search this site</label>
  <input type="search" id="search-input" name="search" spellcheck="false">
  <input value="Submit" type="submit"> <!-- <button> -->
</form>
```

### main
<main>, the only one primary content of a document
(Example) Skip navigation
```html
<a href="#main-content">Skip to main content</a>
<!-- navigation and header content -->
<main id="main-content">
```

### navigation
Label required if this exists >1, and avoid "navigation" like words included redundantly.
<nav> is only for a major block of navigation links (site, infra-page nav)

### region
Labelled <section> becomes generic landmark.

If a content overflows beyond the container, add 'role="region"' to the container and 'tabindex="0"' to the content area within it to tell keyboard-only users its scrollable.


## Content sectioning
Think this of an outline in a document.

### heading
itself creates a 'section' in a document outline implicitly, or explicitly with a surround <section>.

### article
standalone, independently distrubutable or reusable, like a forum post, magazine or newspaper article, blog entry, product card, comment, interactive widget.
should be identified by having a 'heading'.
can be nested in <article>.

### section
should only be used if there isn't a more specific element to represent it, like a list of search results, a map display and its controls.
should be identified by having a 'heading', but can be omit for like some kind of secondary navigation or button bar 'section'.

<div>: just for a styling wrapper

### header, footer
Must not nest in <header> or <footer>.
Can be used in 'section' not as 'landmark', but no effects for accesibility.

<address> provides any form of author info for its nearest ancestor <article> <body>, usually in <footer>.

### body
- attr
onblur
onerror: when the document fails to load properly.
onfocus: when the document receives focus.
onload
onmessage: when the document has received a message.
onredo, onundo: when the user has moved forward (backward) in undo transaction history.
onresize: when the document has been resized.

- Event handlers
.onafterprint, .onbeforeprint: document has started printing or the print preview has been closed. (is about to be printed or previewed for printing.) (has same attr)
.onbeforeunload (has same attr)
.ongamepadconnected, .ongamepaddisconnected: when the browser detects that a gamepad has been connected or the first time a button/axis of the gamepad is used (| disconnected).
.onhashchange: when the fragment identifier part (starting with the hash ('#') character) of the document's current address has changed. (has same attr)
.onlanguagechange: when the preferred languages changed. (has same attr)
.onmessage: when the window receives a message, like 'Window.postMessage()' called from another browsing context.
.onmessageerror: when the window receives a message that can't be deserialized.
.onoffline, .ononline: lost (restored) network and 'Navigator.onLine' switched to false (true). (has same attr)
.onpagehide: when the browser hides the current page in the process of presenting a different page from the session's history.
.onpageshow: when the browser displays the window's document due to navigation.
.onpopstate: when the active history entry changes while the user navigates the session history. (has same attr)
.onstorage: 'localStorage' has been modified in the nother document ctx. (has same attr)
.onrejectionhandled, .onunhandledrejection
.onunload
