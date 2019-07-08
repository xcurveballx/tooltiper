/***
 * The only plugin's dependency - jQuery. It is required before
 * creating the plugin.
 */
var jQuery = require("jquery");

/**
 * There is an IIFE around the plugin.
 * The IIFE contains several helper functions.
 * The plugin gets assigned to `$.fn.tooltiper`.
 * @namespace TooltiperIIFE
 * @author Curveball <x.curveball.x@gmail.com>
 * @license MIT
 */
(function($, window, document, undefined) {
    "use strict";
    $.fn._init = $.fn.init;

    /**
     * Makes possible to get selector string later by attaching it to the jQuery object.
     * Wrapper around original init() function.
     * @function TooltiperIIFE~init
     * @param {string|*} selector selector string
     * @param {object} context an object serving as context for selectors search. The match will be searched for in its children instead of the entire page.
     * @param {object} root usually $(document).
     * @returns {object} a jQuery object
     */
    $.fn.init = function(selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };

    /**
     * Gets selector string passed to the plugin.
     * @function TooltiperIIFE~getSelector
     * @returns {string} selector string passed to the plugin.
     */
    $.fn.getSelector = function() {
        return $(this).data('selector');
    };

    /**
     * The plugin function assigned to `$.fn.tooltiper`.
     * Below go inner helper functions inside the plugin.
     * @namespace Tooltiper
     * @author Curveball <x.curveball.x@gmail.com>
     * @license MIT
     * @param {object.<string, *>} [options] object passed to the plugin upon calling
     * @returns {object} returns collection of matched elements.
     */
    $.fn.tooltiper = function(options) {

      var settings = $.extend({}, $.fn.tooltiper.settings, options);

      var selector = $(this).getSelector();

      if(!areSettingsValid(settings) || !selector) return;

      /*** Events setup */
      $("body").on( "mouseenter", selector, function(event) {
          showToolTip( $(this), event );
      }).on( "mouseleave", selector, function(event) {
          hideToolTip( $(this) );
      });

      if(settings.tooltipBound === 'cursor') {
          $("body").on( "mousemove", selector, function(event) {
              moveToolTip( $(this), event );
          });
      }

      /**
       * Descr
       * @function Tooltiper~areSettingsValid
       * @param {type} settings descr
       * @returns {boolean} descr
       */
      function areSettingsValid(settings) {
          var errs = [];

          if(!$.isNumeric(settings.tooltipOffset)) errs.push(new Error('Settings.tooltipOffset option should be of type Number!'));

          if(settings.tooltipType.toLowerCase() !== 'text' && settings.tooltipType.toLowerCase() !== 'html') errs.push(new Error('Settings.tooltipType option should be equal to either "text" or "html"!'));

          if(typeof(settings.tooltipClass).toLowerCase() !== 'string') errs.push(new Error('Settings.tooltipOffset option should be of type String!'));

          if(typeof(settings.tooltipElement).toLowerCase() !== 'string') errs.push(new Error('Settings.tooltipElement option should be of type String and contain tag name!'));

          if(!$.isNumeric(settings.tooltipShowSpeed) && !~$.inArray(settings.tooltipShowSpeed.toLowerCase(), ['fast', 'normal', 'slow'])) errs.push(new Error('Settings.tooltipShowSpeed option should be of type Number or equal to "fast", "normal" or "slow"!'));

          if(!$.isNumeric(settings.tooltipHideSpeed) && !~$.inArray(settings.tooltipHideSpeed.toLowerCase(), ['fast', 'normal', 'slow'])) errs.push(new Error('Settings.tooltipHideSpeed option should be of type Number or equal to "fast", "normal" or "slow"!'));

          if(!~$.inArray(settings.tooltipAppearenceMode, ['show', 'fadeIn', 'slideDown'])) errs.push(new Error('Settings.tooltipAppearenceMode option should be of type Number or equal to "show", "fadeIn" or "slideDown"!'));

          if(!~$.inArray(settings.tooltipDisappearenceMode, ['hide', 'fadeOut', 'slideUp'])) errs.push(new Error('Settings.tooltipDisappearenceMode option should be of type Number or equal to "hide", "fadeOut" or "slideUp"!'));

          if(settings.tooltipBound.toLowerCase() !== 'element' && settings.tooltipBound.toLowerCase() !== 'cursor') errs.push(new Error('Settings.tooltipBound option should be equal to either "element" or "cursor"!'));

          if((typeof settings.tooltipCss).toLowerCase() !== 'object') errs.push(new Error('Settings.tooltipCss option should be an object containing property-value pairs like {"property": "value", ...}!'));

          showError(errs);
          return errs.length ? false : true;
      }

      /**
       * Descr
       * @function Tooltiper~showError
       * @param {type} errs descr
       * @returns {undefined}
       */
      function showError(errs) {
          for(var i = 0; i < errs.length; i++) {
              console.error('Tooltiper did nothing because an error occured! ' + errs[i].message);
          }
      }

      /**
       * Descr
       * @function Tooltiper~moveToolTip
       * @param {type} element descr
       * @param {type} event descr
       * @returns {undefined}
       */
      function moveToolTip(element, event) {
          var tooltip = getToolTip(element);
          if(!tooltip.data('tooltiperCanMove')) return;

          var positionedParent = $(getPositionedParent(element)),
              tooltipX = positionedParent.length ? event.pageX - positionedParent.offset().left : event.pageX;

          tooltip.animate({"left": tooltipX}, 1000/60, 'swing');
      }

      /**
       * Descr
       * @function Tooltiper~resetToolTip
       * @param {type} element descr
       * @returns {string} descr
       */
      function resetToolTip(element) {
          element.data('tooltiperStop', element.data('tooltiperStop') ? false : true);

          element.next(settings.tooltipElement + "." + settings.tooltipClass).remove();

          element.attr('title', element.data("tooltiperTitle"));

          return element.attr('title');
      }

      /**
       * Descr
       * @function Tooltiper~showToolTip
       * @param {type} element descr
       * @param {type} event descr
       * @returns {undefined}
       */
      function showToolTip(element, event) {
          if($(event.target).hasClass(settings.tooltipClass)) return;

          var title = element.attr('title');
          element.data('tooltiperStop', false);

          if(isToolTipShown(element)) title = resetToolTip(element);
          if(!title) return;

          element.data("tooltiperTitle", title).attr('title', "");
          var tooltip = createToolTip(title);
          tooltip.data('tooltiperCanMove', true);

          setTooltipWidth(tooltip);
          setTooltipCoords(event, element, tooltip);
          element.after(tooltip);
          tooltip[settings.tooltipAppearenceMode](settings.tooltipShowSpeed);
      }

      /**
       * Descr
       * @function Tooltiper~hideToolTip
       * @param {type} element descr
       * @returns {undefined}
       */
      function hideToolTip(element) {
          var title = element.data("tooltiperTitle");
          if(!title || !isToolTipShown(element)) return;

          getToolTip(element)[settings.tooltipDisappearenceMode](settings.tooltipHideSpeed, function() {
              if(element.data('tooltiperStop')) {
                  element.data('tooltiperStop', false);
                  return;
              }

              element.next(settings.tooltipElement + "." + settings.tooltipClass).remove();
              element.attr('title', title);
              element.removeData("tooltiperTitle");
          });
      }

      /**
       * Descr
       * @function Tooltiper~createToolTip
       * @param {type} title descr
       * @returns {type} descr
       */
      function createToolTip(title) {
          return $("<" + settings.tooltipElement + ">").addClass(settings.tooltipClass)[settings.tooltipType](title).css(settings.tooltipCss);
      }

      /**
       * Descr
       * @function Tooltiper~getToolTip
       * @param {type} element descr
       * @returns {type} descr
       */
      function getToolTip(element) {
          return element.next(settings.tooltipElement + "." + settings.tooltipClass);
      }

      /**
       * Descr
       * @function Tooltiper~getToolTipDimensions
       * @param {type} tooltip descr
       * @returns {object} descr
       */
      function getToolTipDimensions(tooltip) {
          var clonedTooltip = tooltip.clone().off().css({"position": "fixed",  "display": "block", "z-index": -9999, "visibility": "hidden", "right": 0, "bottom": 0});

          clonedTooltip.appendTo("body");
          var tooltipHeight = clonedTooltip.outerHeight(),
              tooltipWidth = clonedTooltip.outerWidth();

          clonedTooltip.remove();

          return {width: tooltipWidth, height: tooltipHeight};
      }

      /**
       * Descr
       * @function Tooltiper~isToolTipShown
       * @param {type} element descr
       * @returns {boolean}
       */
      function isToolTipShown(element) {
         return element.next(settings.tooltipElement + "." + settings.tooltipClass).length !== 0;
      }

      /**
       * Descr
       * @function Tooltiper~setTooltipCoords
       * @param {type} event descr
       * @param {type} element descr
       * @param {type} tooltip descr
       * @returns {undefined}
       */
      function setTooltipCoords(event, element, tooltip) {
          var positionedParent = $(getPositionedParent(element));
          var tooltipWidth = tooltip.outerWidth();

          var elementOffsetTop = element.offset().top - $(window).scrollTop();
          var elementHeight = element.outerHeight();
          var elementOffsetBottom = $(window).height() - elementHeight - elementOffsetTop;

          if(elementOffsetTop > elementOffsetBottom) {
              var bottom = positionedParent.length ? positionedParent.outerHeight() - element.position().top + settings.tooltipOffset : $(window).height() - element.position().top + settings.tooltipOffset;
              tooltip.css({"bottom": bottom});
          } else {
              tooltip.css({"top": element.position().top +   settings.tooltipOffset + elementHeight});
          }

          var pointOfMouseEntryX = positionedParent.length ? event.pageX - positionedParent.offset().left : event.pageX;

          var pointOfMouseEntryOffsetLeft = positionedParent.length ? pointOfMouseEntryX + positionedParent.offset().left - $(window).scrollLeft() : pointOfMouseEntryX - $(window).scrollLeft();

          var pointOfMouseEntryOffsetRight = $(window).width() - pointOfMouseEntryOffsetLeft,
              diff = tooltipWidth - pointOfMouseEntryOffsetRight,
              toolTipXCoord = pointOfMouseEntryX;

          if(diff > 0) {
              tooltip.data('tooltiperCanMove', false);
              toolTipXCoord -= diff + settings.tooltipOffset/2;
              if(diff > pointOfMouseEntryOffsetLeft) {
                  toolTipXCoord = toolTipXCoord + (diff - pointOfMouseEntryOffsetLeft) + settings.tooltipOffset;

                  tooltip.css({"width": pointOfMouseEntryOffsetLeft + pointOfMouseEntryOffsetRight - settings.tooltipOffset});
              }
          }
          tooltip.css({"left": toolTipXCoord});
      }

      /**
       * Descr
       * @function Tooltiper~setTooltipWidth
       * @param {type} tooltip descr
       * @returns {undefined}
       */
      function setTooltipWidth(tooltip) {
          var maxWidth = parseFloat(tooltip.css("max-width")), tooltipDimensions = getToolTipDimensions(tooltip);

          if(tooltipDimensions.width < maxWidth) {
              tooltip.css({"width": tooltipDimensions.width + 1});
          } else {
              tooltip.css({"width": maxWidth});
          }
      }

      /**
       * Descr
       * @function Tooltiper~getPositionedParent
       * @param {type} element descr
       * @returns {type} descr
       */
      function getPositionedParent(element) {
          var parents = element.parents(),
              positions = ['absolute', 'relative', 'fixed'],
              positionedParent = null;

          $.each(parents, function(index, parent) {
              if(~$.inArray($.trim($(parent).css("position")), positions)) {
                  positionedParent = parent;
                  return false;
              }
          });
          return positionedParent;
      }

      return this;
    }

    /*** Plugin's default settings*/
    $.fn.tooltiper.settings = {
        tooltipType: 'text',
        tooltipAppearenceMode: 'fadeIn',
        tooltipDisappearenceMode: 'fadeOut',
        tooltipOffset: 10,
        tooltipBound: 'element',
        tooltipShowSpeed: 'fast',
        tooltipHideSpeed: 'fast',
        tooltipClass: "js-tooltiper",
        tooltipElement: "span",
        tooltipCss: {"display": "none", "max-width": "250px", "box-sizing": "border-box", "word-wrap": "break-word", "color": "black", "font-size": ".8em", "position": "absolute", "z-index": 9999, "background-color": "white", "padding": ".5em", "box-shadow": "0px 0px 4px 0px rgba(0,0,0,0.5)"}
    };
})(jQuery, window, document);
