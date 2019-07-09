# Tooltiper

**Tooltiper** is a jQuery tooltip plugin. It allows us to make customizable tooltips on webpages based on common `title` attribute that can be used with almost all tags.

HTML-code inside the tooltip, different animations & appearance/disappearance speed, binding to the cursor and more make Tooltiper quite handy.

## How to import

Use `npm i @curveballerpacks/tooltiper` to install the package. It has no standalone styles, all needed styles can be passed in to the plugin as settings.

Tooltiper makes use of Node's modules. It requires its only dependency - jQuery - and can be required itself in your script via `require("@curveballerpacks/tooltiper");`. NPM will manage possible duplicates/conflicts of jQuery versions in its dependency graph mostly on its own.

## Usage

Basically, the plugin can be used like this: `$('.example1 a').tooltiper();`. Also a number of settings listed below can be passed in like this:
```js
$('.example6 a').tooltiper({
  tooltipClass: "js-fancy-class",
  tooltipElement: "div",
  tooltipCss: {"color": "red"}
});
```
to adjust plugin's behaviour.

## Settings

The following settings can be passed in to the plugin as an object key/value pairs (default values go after =):

- `tooltipType` = text - tooltip's type: plain text or html.
- `tooltipAppearenceMode` = fadeIn - effect's name.
- `tooltipDisappearenceMode` = fadeOut - effect's name.
- `tooltipOffset` = 10 - distance between tooltip and element, in pixels.
- `tooltipBound` = element - is it bound to the element or the cursor.
- `tooltipShowSpeed` = fast - speed like 'fast'.
- `tooltipHideSpeed` = fast - speed like 'fast'.
- `tooltipClass` = js-tooltiper - default tooltiper calss.
- `tooltipElement` = span - default tooltiper HTML-element.
- `tooltipCss` - css key/value pairs object, see the defaults in the code.

## More examples

Examples in action and more detailed explanation can be found on [codepen](https://codepen.io/curveball/full/qXjGxO) or [example page](../example.html) inside this package.
