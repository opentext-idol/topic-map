(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // We're using AMD, e.g. require.js. Register as an anonymous module.
        define(['jquery', 'Raphael'], factory);
    } else {
        // We're using plain javascript imports, namespace everything in the Autn namespace.
        (function(scope, namespace){
            for (var key, words = namespace.split('.'); key = words.shift();) {
                scope = (scope[key] || (scope[key] = {}));
            }
        })(window, 'autn.vis.util');

        autn.vis.util.wordWrap = factory(jQuery, Raphael);
    }
}(function ($, Raphael) {
    function fastLineBreak(textInput, textEl, maxWidth, padPC, fontFamily, fontSize, minFontSize, maxHeight) {
        var bestSize = fontSize;
        var lines = fastTryTextLayout(textInput, textEl, maxWidth, padPC, fontFamily, fontSize, maxHeight);
        var biggestFitting = Number.MIN_VALUE;

        if (lines.fit) {
            biggestFitting = fontSize;
        } else {
            bestSize = binaryChop(minFontSize, fontSize - 1, function (fontSize) {
                lines = fastTryTextLayout(textInput, textEl, maxWidth, padPC, fontFamily, fontSize, maxHeight);
                if (lines.fit && fontSize > biggestFitting) {
                    biggestFitting = fontSize;
                }
                return lines.fit;
            });
        }

        var fit = biggestFitting > 0;

        if (fit) {
            textEl.css({
                'font-size': biggestFitting,
                width: maxWidth - padPC * biggestFitting
            })

            var linesWhichFit = [], yOffset, prevLine = [];

            textEl.children().each(function(idx, el) {
                if (yOffset && el.offsetTop !== yOffset) {
                    if (prevLine.length) {
                        linesWhichFit.push(prevLine.join(' '));
                        prevLine = [];
                    }
                }

                prevLine.push(textInput[idx]);
                yOffset = el.offsetTop;
            })

            if (prevLine.length) {
                linesWhichFit.push(prevLine.join(' '));
            }

            return {
                fit: fit,
                text: linesWhichFit.join('\n'),
                'font-size': bestSize
            };
        }

        return {
            fit: false
        }
    }

    function fastTryTextLayout(text, textEl, maxWidth, padPC, fontFamily, fontSize, maxHeight) {
        var reserved = padPC * fontSize;

        var availWidth = maxWidth - reserved;

        textEl.css({
            'font-size': fontSize,
            width: availWidth
        })

        var dom = textEl[0];
        var bounds = dom.getBoundingClientRect();
        return {
            fit: bounds.height < maxHeight - reserved && dom.scrollWidth <= Math.ceil(availWidth),
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

    var layoutEl, curPaper;

    Raphael.eve.on('raphael.clear', function() {
        if (curPaper === this) {
            if (layoutEl) {
                layoutEl.remove();
                layoutEl = null;
            }
        }
    });

    return function(paper, font, maxWidth, text, padPC, fontSize, minFontSize, maxHeight, textEl) {
        var terms = text.split(' ');

        if (!layoutEl) {
            layoutEl = $('<div>').css({ visibility: 'hidden', 'overflow-x': 'hidden'}).appendTo(document.body)
        }

        layoutEl.css('font-family', font).html(terms.map(function(term){
            return '<span>' + new Option(term).innerHTML + ' </span>'
        }).join(''));

        var lineAttrs = fastLineBreak(terms, layoutEl, maxWidth, padPC ? padPC + 1 : 0, font, fontSize, minFontSize, maxHeight);

        if (textEl) {
            textEl.attr(lineAttrs);
        }

        return {
            fit: lineAttrs.fit,
            text: lineAttrs.text,
            fontSize: lineAttrs['font-size']
        };
    }
}));
