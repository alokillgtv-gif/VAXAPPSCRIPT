window.BASEURL = window.location.origin;
window._$ = function(htmlOrBlock) {
    // 🔥 SỬA LỖI CHÍ MẠNG: Nếu vô tình bọc _$(this), trả về chính nó luôn chứ không bọc đè Object
    if (htmlOrBlock && typeof htmlOrBlock === 'object' && htmlOrBlock.elements) {
        return htmlOrBlock;
    }

    var instance = {
        sourceHtml: typeof htmlOrBlock === 'string' ? htmlOrBlock : '',
        elements: Array.isArray(htmlOrBlock) ? htmlOrBlock : (htmlOrBlock ? [htmlOrBlock] : []),

        find: function(selector) {
            var results = [];
            var contentFilter = "";
            if (selector.indexOf(":content(") !== -1) {
                var contentMatch = selector.match(/:content\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/);
                if (contentMatch) {
                    contentFilter = contentMatch[1] || contentMatch[2] || contentMatch[3] || "";
                    selector = selector.replace(/:content\((?:"[^"]*"|'[^']*'|[^)]*)\)/, "");
                }
            }

            var attrNameFilter = "";
            var attrValueFilter = "";
            var hasAttrFilter = false;
            var attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\]"']*))\]/);
            if (attrMatch) {
                hasAttrFilter = true;
                attrNameFilter = attrMatch[1];
                attrValueFilter = attrMatch[2] || attrMatch[3] || attrMatch[4] || "";
                selector = selector.replace(/\[.*?\]/, "");
            }

            var notSelector = "";
            if (selector.indexOf(":not(") !== -1) {
                var notMatch = selector.match(/:not\(([^)]+)\)/);
                if (notMatch) {
                    notSelector = notMatch[1];
                    selector = selector.replace(/:not\([^)]+\)/, "");
                }
            }

            var isFirstFilter = selector.indexOf(":first") !== -1;
            var isLastFilter = selector.indexOf(":last") !== -1;
            selector = selector.replace(/:first|:last/g, "");

            var isClass = selector.indexOf('.') === 0;
            var isId = selector.indexOf('#') === 0;
            var isAttrOnly = (selector === "" && hasAttrFilter);

            var targetClasses = [];
            var targetId = "";
            var targetTagName = "";

            if (isClass) {
                targetClasses = selector.split('.').filter(function(c) { return c.length > 0; });
            } else if (isId) {
                targetId = selector.substring(1);
            } else if (!isAttrOnly) {
                targetTagName = selector.toLowerCase();
            }

            for (var i = 0; i < this.elements.length; i++) {
                var currentHtml = this.elements[i];
                var pos = 0;
                var subResults = [];

                while ((pos = currentHtml.indexOf('<', pos)) !== -1) {
                    if (currentHtml.charAt(pos + 1) === '/' || currentHtml.charAt(pos + 1) === '!') {
                        pos++;
                        continue;
                    }

                    var endOpenTag = currentHtml.indexOf('>', pos);
                    if (endOpenTag === -1) break;

                    var fullOpenTag = currentHtml.substring(pos, endOpenTag + 1);
                    var spacePos = fullOpenTag.indexOf(' ');
                    var currentTagName = "";
                    if (spacePos === -1) {
                        currentTagName = fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase();
                    } else {
                        currentTagName = fullOpenTag.substring(1, spacePos).toLowerCase();
                    }

                    var isMatched = false;

                    if (isClass) {
                        var classMatchStr = "";
                        var classPos = fullOpenTag.indexOf('class="');
                        if (classPos !== -1) {
                            var startQuote = classPos + 7;
                            classMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf('"', startQuote));
                        } else {
                            classPos = fullOpenTag.indexOf("class='");
                            if (classPos !== -1) {
                                var startQuote = classPos + 7;
                                classMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf("'", startQuote));
                            }
                        }
                        if (classMatchStr) {
                            var currentClasses = classMatchStr.split(/\s+/);
                            var matchCount = 0;
                            for (var c = 0; c < targetClasses.length; c++) {
                                if (currentClasses.indexOf(targetClasses[c]) !== -1) matchCount++;
                            }
                            if (matchCount === targetClasses.length) isMatched = true;
                        }
                    } else if (isId) {
                        var idMatchStr = "";
                        var idPos = fullOpenTag.indexOf('id="');
                        if (idPos !== -1) {
                            var startQuote = idPos + 4;
                            idMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf('"', startQuote));
                        } else {
                            idPos = fullOpenTag.indexOf("id='");
                            if (idPos !== -1) {
                                var startQuote = idPos + 4;
                                idMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf("'", startQuote));
                            }
                        }
                        if (idMatchStr === targetId) isMatched = true;
                    } else if (isAttrOnly) {
                        isMatched = true;
                    } else {
                        if (currentTagName === targetTagName) isMatched = true;
                    }

                    if (isMatched && hasAttrFilter) {
                        var searchStr1 = attrNameFilter + '="' + attrValueFilter + '"';
                        var searchStr2 = attrNameFilter + "='" + attrValueFilter + "'";
                        if (fullOpenTag.indexOf(searchStr1) === -1 && fullOpenTag.indexOf(searchStr2) === -1) {
                            isMatched = false;
                        }
                    }

                    if (isMatched) {
                        var startTagPos = pos;
                        var endTagPos = endOpenTag + 1;
                        var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

                        if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
                            var depth = 1;
                            var scanPos = endOpenTag + 1;
                            var openStr = '<' + currentTagName;
                            var closeStr = '</' + currentTagName + '>';

                            while (depth > 0 && scanPos < currentHtml.length) {
                                var nextOpen = currentHtml.indexOf(openStr, scanPos);
                                var nextClose = currentHtml.indexOf(closeStr, scanPos);
                                if (nextClose === -1) { scanPos = currentHtml.length; break; }

                                if (nextOpen !== -1 && nextOpen < nextClose) {
                                    depth++;
                                    scanPos = nextOpen + openStr.length;
                                } else {
                                    depth--;
                                    scanPos = nextClose + closeStr.length;
                                    if (depth === 0) endTagPos = nextClose + closeStr.length;
                                }
                            }
                        }

                        var foundBlock = currentHtml.substring(startTagPos, endTagPos);

                        if (contentFilter) {
                            var pureText = foundBlock.replace(/<[^>]+>/g, "").trim();
                            if (pureText.indexOf(contentFilter) === -1) {
                                pos = endTagPos;
                                continue;
                            }
                        }

                        if (notSelector) {
                            var isNotClass = notSelector.indexOf('.') === 0;
                            var isNotId = notSelector.indexOf('#') === 0;
                            var notValue = notSelector.substring(1);

                            var hasNot = false;
                            if (isNotClass && fullOpenTag.indexOf('class="') !== -1 && fullOpenTag.indexOf(notValue) !== -1) hasNot = true;
                            if (isNotId && fullOpenTag.indexOf('id="') !== -1 && fullOpenTag.indexOf(notValue) !== -1) hasNot = true;

                            if (!hasNot) subResults.push(foundBlock);
                        } else {
                            subResults.push(foundBlock);
                        }

                        pos = endTagPos;
                    } else {
                        pos++;
                    }
                }

                if (isFirstFilter && subResults.length > 0) subResults = [subResults[0]];
                if (isLastFilter && subResults.length > 0) subResults = [subResults[subResults.length - 1]];

                results = results.concat(subResults);
            }

            var newInstance = _$(results);
            newInstance.sourceHtml = this.sourceHtml || currentHtml;
            return newInstance;
        },

        // 🎯 CHUẨN HÓA HÀM EACH: Hỗ trợ cả 2 cách viết (gọi thẳng `this` hoặc bọc `_$(el)`)
        each: function(callback) {
            for (var i = 0; i < this.elements.length; i++) {
                var childInstance = _$(this.elements[i]);
                childInstance.sourceHtml = this.sourceHtml;
                
                // Chuẩn jQuery: truyền vào (index, rawHtmlString)
                // Context 'this' vẫn giữ nguyên là childInstance để gọi trực tiếp phương thức
                callback.call(childInstance, i, this.elements[i]);
            }
            return this;
        },

        eq: function(index) {
            if (index < 0) index = this.elements.length + index;
            var matchedElement = this.elements[index];
            this.elements = matchedElement ? [matchedElement] : [];
            return this;
        },

        attr: function(attrName) {
            if (this.elements.length === 0) return "";
            var elem = this.elements[0];
            var searchStr = attrName + '="';
            var pos = elem.indexOf(searchStr);
            if (pos === -1) {
                searchStr = attrName + "='";
                pos = elem.indexOf(searchStr);
            }
            if (pos === -1) return "";

            var start = pos + searchStr.length;
            var quoteType = elem.charAt(start - 1);
            var end = elem.indexOf(quoteType, start);
            return end === -1 ? "" : elem.substring(start, end);
        },

        html: function() {
            if (this.elements.length === 0) return "";
            var elem = this.elements[0];
            var start = elem.indexOf('>') + 1;
            var end = elem.lastIndexOf('</');
            if (start > 0 && end > start) return elem.substring(start, end);
            return "";
        },

        text: function() {
            if (this.elements.length === 0) return "";
            var elem = this.elements[0];
            var start = elem.indexOf('>') + 1;
            var end = elem.lastIndexOf('</');
            if (start > 0 && end > start) {
                var content = elem.substring(start, end);
                return content.replace(/<\/?[^>]+(>|$)/g, "").trim();
            }
            return "";
        },

        next: function() {
            var results = [];
            if (!this.sourceHtml) return this;
            for (var i = 0; i < this.elements.length; i++) {
                var elem = this.elements[i];
                var idx = this.sourceHtml.indexOf(elem);
                if (idx === -1) continue;

                var scanPos = idx + elem.length;
                var nextOpen = this.sourceHtml.indexOf('<', scanPos);
                if (nextOpen !== -1) {
                    if (this.sourceHtml.charAt(nextOpen + 1) === '/') continue;

                    var endOpenTag = this.sourceHtml.indexOf('>', nextOpen);
                    if (endOpenTag === -1) continue;

                    var fullOpenTag = this.sourceHtml.substring(nextOpen, endOpenTag + 1);
                    var spacePos = fullOpenTag.indexOf(' ');
                    var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase();

                    var startTagPos = nextOpen;
                    var endTagPos = endOpenTag + 1;
                    var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

                    if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
                        var depth = 1;
                        var sPos = endOpenTag + 1;
                        var openStr = '<' + currentTagName;
                        var closeStr = '</' + currentTagName + '>';

                        while (depth > 0 && sPos < this.sourceHtml.length) {
                            var nOpen = this.sourceHtml.indexOf(openStr, sPos);
                            var nClose = this.sourceHtml.indexOf(closeStr, sPos);
                            if (nClose === -1) break;

                            if (nOpen !== -1 && nOpen < nClose) {
                                depth++;
                                sPos = nOpen + openStr.length;
                            } else {
                                depth--;
                                sPos = nClose + closeStr.length;
                                if (depth === 0) endTagPos = nClose + closeStr.length;
                            }
                        }
                    }
                    results.push(this.sourceHtml.substring(startTagPos, endTagPos));
                }
            }
            var nextInstance = _$(results);
            nextInstance.sourceHtml = this.sourceHtml;
            this.elements = results;
            return this;
        },

        parent: function() {
            var results = [];
            if (!this.sourceHtml) return this;
            for (var i = 0; i < this.elements.length; i++) {
                var elem = this.elements[i];
                var idx = this.sourceHtml.indexOf(elem);
                if (idx <= 0) continue;

                var scanPos = idx - 1;
                while (scanPos >= 0) {
                    var openTagPos = this.sourceHtml.lastIndexOf('<', scanPos);
                    if (openTagPos === -1) break;

                    if (this.sourceHtml.charAt(openTagPos + 1) !== '/' && this.sourceHtml.charAt(openTagPos + 1) !== '!') {
                        var endOpenTag = this.sourceHtml.indexOf('>', openTagPos);
                        if (endOpenTag !== -1 && endOpenTag > openTagPos) {
                            var fullOpenTag = this.sourceHtml.substring(openTagPos, endOpenTag + 1);
                            var spacePos = fullOpenTag.indexOf(' ');
                            var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase();

                            var endTagPos = endOpenTag + 1;
                            var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

                            if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
                                var depth = 1;
                                var sPos = endOpenTag + 1;
                                var openStr = '<' + currentTagName;
                                var closeStr = '</' + currentTagName + '>';

                                while (depth > 0 && sPos < this.sourceHtml.length) {
                                    var nOpen = this.sourceHtml.indexOf(openStr, sPos);
                                    var nClose = this.sourceHtml.indexOf(closeStr, sPos);
                                    if (nClose === -1) break;

                                    if (nOpen !== -1 && nOpen < nClose) {
                                        depth++;
                                        sPos = nOpen + openStr.length;
                                    } else {
                                        depth--;
                                        sPos = nClose + closeStr.length;
                                        if (depth === 0) endTagPos = nClose + closeStr.length;
                                    }
                                }
                            }

                            if (endTagPos >= idx + elem.length) {
                                var parentBlock = this.sourceHtml.substring(openTagPos, endTagPos);
                                if (results.indexOf(parentBlock) === -1) results.push(parentBlock);
                                break;
                            }
                        }
                    }
                    scanPos = openTagPos - 1;
                }
            }
            var parentInstance = _$(results);
            parentInstance.sourceHtml = this.sourceHtml;
            this.elements = results;
            return this;
        }
    };

    return instance;
};
