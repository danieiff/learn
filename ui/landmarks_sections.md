## landmarks
'role="(landmark)"' or use specifc html tags.
Identifies Large overall sections of the document.
Don't use too many.
Use same labels with the different 'id's for repeated landmarks.

### banner
<header> of site-global, not descendant of <aside>, <article>, <main>, <nav>, <section>

### complementary
<aside>, a portion related to the document's *main* content.
Avoid "sidebar" like words included in label redundantly.

### contentinfo
<footer>, only one, not descendant of <aside>, <article>, <main>, <nav>, <section>
Avoid "footer" like words included in label redundantly.

### form
<form>

### search
Avoid "search" like words included in label redundantly.
```html
<form id="search" role="search" aria-label="Sitewide">
  <label for="search-input">Search this site</label>
  <input type="search" id="search-input" name="search" spellcheck="false">
  <input value="Submit" type="submit"> <!-- <button> -->
</form>
```

### main
<main>, the only one primary content of a document
Use 'aria-label', 'aria-labelledby'
(Example) Skip navigation
```html
<a href="#main-content">Skip to main content</a>
<!-- navigation and header content -->
<main id="main-content">
```

### navigation
<nav> only for a major navigation(site, infra-page nav) links (otherwise links not required in <nav>)
Avoid "navigation" like words included in label redundantly.
Links are not required to be list.

### region
generic landmark
<section>  with a label
(for such as a list of search results, a map display and its controls)
should be identified by having a heading, but omit for like a secondary navigation menu.
should only be used if there isn't a more specific element to represent it.

If a content overflows beyond the container, Add 'role="region"' to the container and 'tabindex="0"' to the content area within it.

- Usecases
<article>:
  a standalone, independently distrubutable or reusable.
  a forum post, magazine or newspaper article, blog entry, product card, comment, interactive widget
  should be identified by having a heading.
  Contents related (a blog post, comments) can be nested like <article><article></article></article>.
  Author information can be provided by <address>, but cannot for nested <article>.
<div>: just for a styling wrapper


## sectioning content
Elements here excluding <form> are 'sectioning content', normally should have a 'heading' (not necessary for <address>, and few exception).
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

### header, footer
Must not nest <header> and <footer>s
<footer> of a nearest ancentor sectioning content
<header> which is not 'banner' is just <section>
