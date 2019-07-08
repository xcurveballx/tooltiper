var $ = require("jquery");

require("./tooltiper.js");

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
