(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // We're using AMD, e.g. require.js. Register as an anonymous module.
        define(['jquery', 'Raphael', 'underscore'], factory);
    } else {
        // We're using plain javascript imports, namespace everything in the Autn namespace.
        (function(scope, namespace){
            for (var key, words = namespace.split('.'); key = words.shift();) {
                scope = (scope[key] || (scope[key] = {}));
            }
        })(window, 'autn.vis.util');

        autn.vis.util.wordWrap = factory(jQuery, Raphael, _);
    }
}(function ($, Raphael, _) {
    function fastLineBreak(textInput, textEl, maxWidth, fontSize, minFontSize, maxHeight) {
        var bestSize = fontSize;
        var lines = fastTryTextLayout(textInput, textEl, maxWidth, maxHeight, fontSize);
        var biggestFitting = Number.MIN_VALUE;

        if (lines.fit) {
            biggestFitting = fontSize;
        } else {
            bestSize = binaryChop(minFontSize, fontSize - 1, function (fontSize) {
                lines = fastTryTextLayout(textInput, textEl, maxWidth, maxHeight, fontSize);
                if (lines.fit && fontSize > biggestFitting) {
                    biggestFitting = fontSize;
                }
                return lines.fit;
            });
        }

        var fit = biggestFitting > 0;

        if (fit) {
            textEl.css({
                'font-size': biggestFitting
            })

            var text = '', yOffset, spans = textEl.children();

            spans.each(function(idx, el) {
                var newOffsetTop = el.offsetTop;
                if (yOffset && newOffsetTop !== yOffset) {
                    text += '\n'
                }
                text += textInput[idx] + ' ';
                yOffset = newOffsetTop;
            })

            return {
                fit: fit,
                text: text,
                'font-size': bestSize
            };
        }

        return {
            fit: false
        }
    }

    function fastTryTextLayout(text, textEl, maxWidth, maxHeight, fontSize) {
        textEl.css({
            'font-size': fontSize
        })

        var dom = textEl[0];

        return {
            fit: dom.clientHeight <= maxHeight && dom.scrollWidth <= maxWidth,
            text: text
        }
    }

    // should return highest integer value which passes testFn, or lowest value otherwise
    function binaryChop(low, high, testFn) {
        while (low < high) {
            var mid = ((low + high) >> 1) + 1;
            if (testFn(mid)) {
                low = mid;
            }
            else {
                high = mid - 1;
            }
        }

        return low;
    }

    var layoutEl, lastFont;

    return function(paper, font, maxWidth, maxHeight, text, fontSize, minFontSize) {
        var terms = text.split(' ');

        if (!layoutEl) {
            // The layout element needs to be visibility: hidden not display: none so we can get clientHeight etc.
            layoutEl = $('<div>').css({ visibility: 'hidden', 'overflow-x': 'hidden', 'font-family': font, 'font-weight': 'bold'}).appendTo(document.body)
        }
        else if (lastFont !== font) {
            layoutEl.css('font-family', font);
        }

        layoutEl.css({
            width: maxWidth
        }).html(terms.map(function(term){
            return '<span>' + _.escape(term) + ' </span>'
        }).join(''));

        var lineAttrs = fastLineBreak(terms, layoutEl, maxWidth, fontSize, minFontSize, maxHeight);

        return {
            fit: lineAttrs.fit,
            text: lineAttrs.text,
            fontSize: lineAttrs['font-size']
        };
    }
}));
