// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
$(document).ready(function() {
    $('.example1 a').tooltiper();
    $('.example2 a').tooltiper({
      tooltipType: 'html'
    });
    $('.example3 a').tooltiper({
      tooltipAppearenceMode: 'slideDown',
      tooltipDisappearenceMode: 'slideUp'
    });
    $('.example4 a').tooltiper({
      tooltipShowSpeed: 300,
      tooltipHideSpeed: 800
    });
    $('.example5 a').tooltiper({
      tooltipBound: 'cursor'
    });
    $('.example6 a').tooltiper({
      tooltipClass: "js-fancy-class",
      tooltipElement: "div",
      tooltipCss: {"color": "red"}
    });
    $(".example7 a").tooltiper().on('click', function(event) {
      event.preventDefault();
      alert("This click-event handler has been chained to the Tooltiper!");
    });
});
