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
    function fastLineBreak(textInput, separators, textEl, maxWidth, fontSize, minFontSize, maxHeight) {
        var bestSize = fontSize;
        var linesFit = fastTryTextLayout(textEl, maxWidth, maxHeight, fontSize);
        var biggestFitting = -1;

        if (linesFit) {
            biggestFitting = fontSize;
        } else {
            bestSize = binaryChop(minFontSize, fontSize - 1, function (fontSize) {
                linesFit = fastTryTextLayout(textEl, maxWidth, maxHeight, fontSize);
                if (linesFit && fontSize > biggestFitting) {
                    biggestFitting = fontSize;
                }
                return linesFit;
            });
        }

        var fit = biggestFitting > 0;

        if (fit) {
            textEl.css({
                'font-size': biggestFitting
            })

            var text = '', yOffset, spans = textEl.children();

            for (var idx = 0, max = spans.length; idx < max; ++idx) {
                var el = spans[idx],
                    newOffsetTop = el.offsetTop;
                if (yOffset && newOffsetTop !== yOffset) {
                    text += separators[idx] + '\n' + textInput[idx];
                }
                else {
                    text += separators[idx] + textInput[idx];
                }
                yOffset = newOffsetTop;
            }

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

    function fastTryTextLayout(textEl, maxWidth, maxHeight, fontSize) {
        textEl.css({
            'font-size': fontSize
        })

        var dom = textEl[0];

        return dom.clientHeight <= maxHeight && dom.scrollWidth <= maxWidth;
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
        // A browser will line break either on whitespace or after the hyphen/en-dash/em-dash in a hyphenated word.
        // We use character classes not word boundary \b to allow matching non-ASCII characters, e.g. 'cat-àt'.
        var regex = /\s+|([^\-\s]+)([\-\u2013\u2014])(?=[^\-\s]+)/g, idx = 0, match, trimmed = $.trim(text);

        // List of words
        var terms = [];
        // List of separator prefix before each word
        var separators = [''];

        while (match = regex.exec(trimmed)) {
            if (idx < match.index) {
                terms.push(trimmed.slice(idx, match.index))
            }

            // We insert the em/en/hyphen if appropriate, otherwise we'll replace all whitespace with single space.
            if (match[1]) {
                terms.push(match[1])
                separators.push(match[2])
            }
            else {
                separators.push(' ')
            }

            idx = regex.lastIndex
        }

        if (idx < trimmed.length) {
            terms.push(trimmed.slice(idx))
        }

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

        var lineAttrs = fastLineBreak(terms, separators, layoutEl, maxWidth, fontSize, minFontSize, maxHeight);

        return {
            fit: lineAttrs.fit,
            text: lineAttrs.text,
            fontSize: lineAttrs['font-size']
        };
    }
}));
