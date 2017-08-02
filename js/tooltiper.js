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

// Place any jQuery/helper plugins in here.
(function($) {
    $.fn.toolTiper = function(options) {
      var settings = {
        tooltipType: 'text', // html
        tooltipCss: null,    // styles
        tooltipDisappear: false,
        tooltipOffset: 10,
        tooltipBound: 'element', // cursor
        tooltipShowSpeed: 'fast',
        tooltipHideSpeed: 'fast',
        tooltipClass: "js-tooltiper",
        tooltipElement: "span"
      },
      title = null,
      selector = $(this).selector;

      $.extend(settings, options);

      $("body").on( "mouseenter", selector, function() {
        showToolTip( $(this) );
      }).on( "mouseleave", selector, function() {
        hideToolTip( $(this) );
      });
      
      function showToolTip(element) {
        if(isToolTipShown(element)) return;
        title = element.attr('title');
        if(!title) return;
        element.attr('title', "");
        var tooltip = createToolTip(title);
        element.append(tooltip);
        tooltip.show(settings.tooltipShowSpeed);
      }
      function hideToolTip(element) {
        if(!isToolTipShown(element)) return;
        getToolTip(element).hide(settings.tooltipHideSpeed);
        element.attr('title', title);
        title = null;
        element.find(settings.tooltipElement + "." + settings.tooltipClass).remove();
      }
      function createToolTip(title) {
        var tooltip = $("<" + settings.tooltipElement + ">").addClass(settings.tooltipClass).css({ "display": "none"}).text(title);
        return tooltip;
      }
      function getToolTip(element) {
        return element.find(settings.tooltipElement + "." + settings.tooltipClass);
      }
      function isToolTipShown(element) {
        return element.find(settings.tooltipElement + "." + settings.tooltipClass).length !== 0;
      }
    }
})(jQuery);
