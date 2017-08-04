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
        tooltipDisappear: false, // *
        tooltipAppearenceMode: 'fadeIn',
        tooltipDisappearenceMode: 'fadeOut',
        tooltipOffset: 10,
        tooltipBound: 'element', // *cursor
        tooltipShowSpeed: 'fast',
        tooltipHideSpeed: 'fast',
        tooltipClass: "js-tooltiper",
        tooltipElement: "span",
        tooltipCss: {"display": "none", "white-space": "nowrap", "color": "black", "font-size": ".8em", "position": "absolute", "z-index": 9999, "background-color": "white", "padding": ".5em", "box-shadow": "0px 0px 4px 0px rgba(0,0,0,0.5)"}    // styles
      },
      title = null, selector = $(this).selector;

      $.extend(settings, options);

      $("body").on( "mouseenter", selector, function(event) {
        showToolTip( $(this), event );
      }).on( "mouseleave", selector, function(event) {
        hideToolTip( $(this) );
      });

      function showToolTip(element, event) {
        title = element.attr('title');
        if(isToolTipShown(element) || !title) return;
        element.attr('title', "");
        var tooltip = createToolTip(title, setTooltipCoords(element));
        element.append(tooltip);
        tooltip[settings.tooltipAppearenceMode](settings.tooltipShowSpeed);
      }
      function hideToolTip(element) {
        if(!isToolTipShown(element) || !title) return;
        element.attr('title', title);
        title = null;
        getToolTip(element)[settings.tooltipDisappearenceMode](settings.tooltipHideSpeed, function() {
          element.find(settings.tooltipElement + "." + settings.tooltipClass).remove();
        });
      }
      function createToolTip(title, coords) {
        return $("<" + settings.tooltipElement + ">").addClass(settings.tooltipClass).text(title).css($.extend(settings.tooltipCss, {"top": coords.top, "left": coords.left}));
      }
      function getToolTip(element) {
        return element.find(settings.tooltipElement + "." + settings.tooltipClass);
      }
      function isToolTipShown(element) {
        return element.find(settings.tooltipElement + "." + settings.tooltipClass).length !== 0;
      }
      function setTooltipCoords(element) {
        var positionedParent = getPositionedParent(element);
        var toolTipXCoord = getToolTipXCoord(event, positionedParent);
        var toolTipYCoord = getToolTipYCoord(element[0], positionedParent) + settings.tooltipOffset + element.height();
        return { top: toolTipYCoord, left: toolTipXCoord };
      }
      function getToolTipXCoord(event, positionedParent) {
        return positionedParent ? event.pageX - getElementCoords(positionedParent).left : event.pageX;
      }
      function getToolTipYCoord(element, positionedParent) {
        return positionedParent ? getElementCoords(element).top - getElementCoords(positionedParent).top : getElementCoords(element).top;
      }
      function getPositionedParent(element) {
        var parents = element.parents(), positions = ['absolute', 'relative', 'fixed'], positionedParent = null;
        $.each(parents, function(index, parent) {
          if(~$.inArray($.trim(parent.style.position), positions)) { positionedParent = parent; return; }
        });
        return positionedParent;
      }
      function getElementCoords(element) {
        var box = element.getBoundingClientRect(), body = document.body, docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: top, left: left };
      }
    }
})(jQuery);
