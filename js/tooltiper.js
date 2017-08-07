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
(function($, window, document, undefined) {
    $.fn.toolTiper = function(options) {
      var settings = {
        tooltipType: 'text',
        tooltipDisappear: false, // *
        tooltipAppearenceMode: 'fadeIn',
        tooltipDisappearenceMode: 'fadeOut',
        tooltipOffset: 10,
        tooltipBound: 'element', // *cursor
        tooltipShowSpeed: 'fast',
        tooltipHideSpeed: 5000,
        tooltipClass: "js-tooltiper",
        tooltipElement: "span",
        tooltipCss: {"display": "none", "white-space": "nowrap", "color": "black", "font-size": ".8em", "position": "absolute", "z-index": 9999, "background-color": "white", "padding": ".5em", "box-shadow": "0px 0px 4px 0px rgba(0,0,0,0.5)"}
      };

      $.extend(settings, options);
      if(!areSettingsValid(settings)) return;

      $("body").on( "mouseenter, mousemove", $(this).selector, function(event) {
        showToolTip( $(this), event );
      }).on( "mouseleave", $(this).selector, function(event) {
        hideToolTip( $(this) );
      });

      function checkSettings(settings) {
        var errs = [];
        if(!isNumeric(settings.tooltipOffset)) errs.push(new Error('Settings.tooltipOffset option should be of type Number!'));
        if(settings.tooltipType.toLowerCase() !== 'text' && settings.tooltipType.toLowerCase() !== 'html') errs.push(new Error('Settings.tooltipType option should be equal to either "text" or "html"!'));
        if(typeof(settings.tooltipClass).toLowerCase() !== 'string') errs.push(new Error('Settings.tooltipOffset option should be of type String!'));
        if(typeof(settings.tooltipElement).toLowerCase() !== 'string') errs.push(new Error('Settings.tooltipElement option should be of type String and contain tag name!'));
        if(!isNumeric(settings.tooltipShowSpeed) && !~$.inArray(settings.tooltipShowSpeed.toLowerCase(), ['fast', 'normal', 'slow'])) errs.push(new Error('Settings.tooltipShowSpeed option should be of type Number or equal to "fast", "normal" or "slow"!'));
        if(!isNumeric(settings.tooltipHideSpeed) && !~$.inArray(settings.tooltipHideSpeed.toLowerCase(), ['fast', 'normal', 'slow'])) errs.push(new Error('Settings.tooltipHideSpeed option should be of type Number or equal to "fast", "normal" or "slow"!'));
        if(!~$.inArray(settings.tooltipAppearenceMode, ['show', 'fadeIn', 'slideDown'])) errs.push(new Error('Settings.tooltipAppearenceMode option should be of type Number or equal to "show", "fadeIn" or "slideDown"!'));
        if(!~$.inArray(settings.tooltipDisappearenceMode, ['hide', 'fadeOut', 'slideUp'])) errs.push(new Error('Settings.tooltipDisappearenceMode option should be of type Number or equal to "hide", "fadeOut" or "slideUp"!'));
        showError(errs);
        return errs;
      }
      function areSettingsValid(settings) {
        return  checkSettings(settings).length ? false : true;
      }
      function isNumeric(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
      }
      function showError(errs) {
        for(var i = 0; i < errs.length; i++) console.log('Tooltiper did nothing because an error occured! ' + errs[i].message);
      }
      function showToolTip(element, event) {
        var title = element.attr('title');
        if(!title || isToolTipShown(element)) return;
        element.data("tooltiperData", title);
        element.attr('title', "");
        var tooltip = createToolTip(title, setTooltipCoords(element));
        element.append(tooltip);
        tooltip[settings.tooltipAppearenceMode](settings.tooltipShowSpeed);
      }
      function hideToolTip(element) {
        var title = element.data("tooltiperData");
        if(!title || !isToolTipShown(element)) return;
        getToolTip(element)[settings.tooltipDisappearenceMode](settings.tooltipHideSpeed, function() {
          element.find(settings.tooltipElement + "." + settings.tooltipClass).remove();
          element.attr('title', title);
          element.removeData("tooltiperData");
        });
      }
      function createToolTip(title, coords) {
        return $("<" + settings.tooltipElement + ">").addClass(settings.tooltipClass)[settings.tooltipType](title).css($.extend(settings.tooltipCss, {"top": coords.top, "left": coords.left}));
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
        var box = element.getBoundingClientRect(), body = document.body, doc = document.documentElement;
        var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || doc.scrollLeft || body.scrollLeft;
        var clientTop = doc.clientTop || body.clientTop || 0;
        var clientLeft = doc.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: top, left: left };
      }
      return this;
    }
})(jQuery, window, document);