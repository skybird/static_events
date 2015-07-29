/*!
 * jQuery Migrate - 1.2.1
 * https://github.com/jquery/jquery-migrate
 */
(function(jQuery, window, undefined) {




    var warnedAbout = {};
    jQuery.migrateWarnings = [];
    if (!jQuery.migrateMute && window.console && window.console.log) {
        window.console.log("JQMIGRATE: Logging is active")
    }
    if (jQuery.migrateTrace === undefined) {
        jQuery.migrateTrace = true
    }
    jQuery.migrateReset = function() {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0
    };

    function migrateWarn(msg) {
        var console = window.console;
        if (!warnedAbout[msg]) {
            warnedAbout[msg] = true;
            jQuery.migrateWarnings.push(msg);
            if (console && console.warn && !jQuery.migrateMute) {
                console.warn("JQMIGRATE: " + msg);
                if (jQuery.migrateTrace && console.trace) {
                    console.trace()
                }
            }
        }
    }

    function migrateWarnProp(obj, prop, value, msg) {
        if (Object.defineProperty) {
            try {
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        migrateWarn(msg);
                        return value
                    },
                    set: function(newValue) {
                        migrateWarn(msg);
                        value = newValue
                    }
                });
                return
            } catch (err) {}
        }
        jQuery._definePropertyBroken = true;
        obj[prop] = value
    }
    if (document.compatMode === "BackCompat") {
        migrateWarn("jQuery is not compatible with Quirks Mode")
    }
    var attrFn = jQuery("<input/>", {
            size: 1
        }).attr("size") && jQuery.attrFn,
        oldAttr = jQuery.attr,
        valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get || function() {
            return null
        },
        valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set || function() {
            return undefined
        },
        rnoType = /^(?:input|button)$/i,
        rnoAttrNodeType = /^[238]$/,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        ruseDefault = /^(?:checked|selected)$/i;
    migrateWarnProp(jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated");
    jQuery.attr = function(elem, name, value, pass) {
        var lowerName = name.toLowerCase(),
            nType = elem && elem.nodeType;
        if (pass) {
            if (oldAttr.length < 4) {
                migrateWarn("jQuery.fn.attr( props, pass ) is deprecated")
            }
            if (elem && !rnoAttrNodeType.test(nType) && (attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name]))) {
                return jQuery(elem)[name](value)
            }
        }
        if (name === "type" && value !== undefined && rnoType.test(elem.nodeName) && elem.parentNode) {
            migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8")
        }
        if (!jQuery.attrHooks[lowerName] && rboolean.test(lowerName)) {
            jQuery.attrHooks[lowerName] = {
                get: function(elem, name) {
                    var attrNode, property = jQuery.prop(elem, name);
                    return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined
                },
                set: function(elem, value, name) {
                    var propName;
                    if (value === false) {
                        jQuery.removeAttr(elem, name)
                    } else {
                        propName = jQuery.propFix[name] || name;
                        if (propName in elem) {
                            elem[propName] = true
                        }
                        elem.setAttribute(name, name.toLowerCase())
                    }
                    return name
                }
            };
            if (ruseDefault.test(lowerName)) {
                migrateWarn("jQuery.fn.attr('" + lowerName + "') may use property instead of attribute")
            }
        }
        return oldAttr.call(jQuery, elem, name, value)
    };
    jQuery.attrHooks.value = {
        get: function(elem, name) {
            var nodeName = (elem.nodeName || "").toLowerCase();
            if (nodeName === "button") {
                return valueAttrGet.apply(this, arguments)
            }
            if (nodeName !== "input" && nodeName !== "option") {
                migrateWarn("jQuery.fn.attr('value') no longer gets properties")
            }
            return name in elem ? elem.value : null
        },
        set: function(elem, value) {
            var nodeName = (elem.nodeName || "").toLowerCase();
            if (nodeName === "button") {
                return valueAttrSet.apply(this, arguments)
            }
            if (nodeName !== "input" && nodeName !== "option") {
                migrateWarn("jQuery.fn.attr('value', val) no longer sets properties")
            }
            elem.value = value
        }
    };
    var matched, browser, oldInit = jQuery.fn.init,
        oldParseJSON = jQuery.parseJSON,
        rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
    jQuery.fn.init = function(selector, context, rootjQuery) {
        var match;
        if (selector && typeof selector === "string" && !jQuery.isPlainObject(context) && (match = rquickExpr.exec(jQuery.trim(selector))) && match[0]) {
            if (selector.charAt(0) !== "<") {
                migrateWarn("$(html) HTML strings must start with '<' character")
            }
            if (match[3]) {
                migrateWarn("$(html) HTML text after last tag is ignored")
            }
            if (match[0].charAt(0) === "#") {
                migrateWarn("HTML string cannot start with a '#' character");
                jQuery.error("JQMIGRATE: Invalid selector string (XSS)")
            }
            if (context && context.context) {
                context = context.context
            }
            if (jQuery.parseHTML) {
                return oldInit.call(this, jQuery.parseHTML(match[2], context, true), context, rootjQuery)
            }
        }
        return oldInit.apply(this, arguments)
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.parseJSON = function(json) {
        if (!json && json !== null) {
            migrateWarn("jQuery.parseJSON requires a valid JSON string");
            return null
        }
        return oldParseJSON.apply(this, arguments)
    };
    jQuery.uaMatch = function(ua) {
        ua = ua.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        }
    };
    if (!jQuery.browser) {
        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};
        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version
        }
        if (browser.chrome) {
            browser.webkit = true
        } else if (browser.webkit) {
            browser.safari = true
        }
        jQuery.browser = browser
    }
    migrateWarnProp(jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated");
    jQuery.sub = function() {
        function jQuerySub(selector, context) {
            return new jQuerySub.fn.init(selector, context)
        }
        jQuery.extend(true, jQuerySub, this);
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init(selector, context) {
            if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
                context = jQuerySub(context)
            }
            return jQuery.fn.init.call(this, selector, context, rootjQuerySub)
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        migrateWarn("jQuery.sub() is deprecated");
        return jQuerySub
    };
    jQuery.ajaxSetup({
        converters: {
            "text json": jQuery.parseJSON
        }
    });
    var oldFnData = jQuery.fn.data;
    jQuery.fn.data = function(name) {
        var ret, evt, elem = this[0];
        if (elem && name === "events" && arguments.length === 1) {
            ret = jQuery.data(elem, name);
            evt = jQuery._data(elem, name);
            if ((ret === undefined || ret === evt) && evt !== undefined) {
                migrateWarn("Use of jQuery.fn.data('events') is deprecated");
                return evt
            }
        }
        return oldFnData.apply(this, arguments)
    };
    var rscriptType = /\/(java|ecma)script/i,
        oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;
    jQuery.fn.andSelf = function() {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
        return oldSelf.apply(this, arguments)
    };
    if (!jQuery.clean) {
        jQuery.clean = function(elems, context, fragment, scripts) {
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;
            migrateWarn("jQuery.clean() is deprecated");
            var i, elem, handleScript, jsTags, ret = [];
            jQuery.merge(ret, jQuery.buildFragment(elems, context).childNodes);
            if (fragment) {
                handleScript = function(elem) {
                    if (!elem.type || rscriptType.test(elem.type)) {
                        return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem)
                    }
                };
                for (i = 0;
                    (elem = ret[i]) != null; i++) {
                    if (!(jQuery.nodeName(elem, "script") && handleScript(elem))) {
                        fragment.appendChild(elem);
                        if (typeof elem.getElementsByTagName !== "undefined") {
                            jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                            i += jsTags.length
                        }
                    }
                }
            }
            return ret
        }
    }
    var eventAdd = jQuery.event.add,
        eventRemove = jQuery.event.remove,
        eventTrigger = jQuery.event.trigger,
        oldToggle = jQuery.fn.toggle,
        oldLive = jQuery.fn.live,
        oldDie = jQuery.fn.die,
        ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
        rajaxEvent = new RegExp("\\b(?:" + ajaxEvents + ")\\b"),
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        hoverHack = function(events) {
            if (typeof(events) !== "string" || jQuery.event.special.hover) {
                return events
            }
            if (rhoverHack.test(events)) {
                migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'")
            }
            return events && events.replace(rhoverHack, "mouseenter$1 mouseleave$1")
        };
    if (jQuery.event.props && jQuery.event.props[0] !== "attrChange") {
        jQuery.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement")
    }
    if (jQuery.event.dispatch) {
        migrateWarnProp(jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated")
    }
    jQuery.event.add = function(elem, types, handler, data, selector) {
        if (elem !== document && rajaxEvent.test(types)) {
            migrateWarn("AJAX events should be attached to document: " + types)
        }
        eventAdd.call(this, elem, hoverHack(types || ""), handler, data, selector)
    };
    jQuery.event.remove = function(elem, types, handler, selector, mappedTypes) {
        eventRemove.call(this, elem, hoverHack(types) || "", handler, selector, mappedTypes)
    };
    jQuery.fn.error = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        migrateWarn("jQuery.fn.error() is deprecated");
        args.splice(0, 0, "error");
        if (arguments.length) {
            return this.bind.apply(this, args)
        }
        this.triggerHandler.apply(this, args);
        return this
    };
    jQuery.fn.toggle = function(fn, fn2) {
        if (!jQuery.isFunction(fn) || !jQuery.isFunction(fn2)) {
            return oldToggle.apply(this, arguments)
        }
        migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function(event) {
                var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);
                event.preventDefault();
                return args[lastToggle].apply(this, arguments) || false
            };
        toggler.guid = guid;
        while (i < args.length) {
            args[i++].guid = guid
        }
        return this.click(toggler)
    };
    jQuery.fn.live = function(types, data, fn) {
        migrateWarn("jQuery.fn.live() is deprecated");
        if (oldLive) {
            return oldLive.apply(this, arguments)
        }
        jQuery(this.context).on(types, this.selector, data, fn);
        return this
    };
    jQuery.fn.die = function(types, fn) {
        migrateWarn("jQuery.fn.die() is deprecated");
        if (oldDie) {
            return oldDie.apply(this, arguments)
        }
        jQuery(this.context).off(types, this.selector || "**", fn);
        return this
    };
    jQuery.event.trigger = function(event, data, elem, onlyHandlers) {
        if (!elem && !rajaxEvent.test(event)) {
            migrateWarn("Global events are undocumented and deprecated")
        }
        return eventTrigger.call(this, event, data, elem || document, onlyHandlers)
    };
    jQuery.each(ajaxEvents.split("|"), function(_, name) {
        jQuery.event.special[name] = {
            setup: function() {
                var elem = this;
                if (elem !== document) {
                    jQuery.event.add(document, name + "." + jQuery.guid, function() {
                        jQuery.event.trigger(name, null, elem, true)
                    });
                    jQuery._data(this, name, jQuery.guid++)
                }
                return false
            },
            teardown: function() {
                if (this !== document) {
                    jQuery.event.remove(document, name + "." + jQuery._data(this, name))
                }
                return false
            }
        }
    })
})(jQuery, window);
/*!
 * CSS Browser Selector - 0.4.0
 * http://rafael.adm.br/css_browser_selector
 */
function css_browser_selector(u) {
    var ua = u.toLowerCase(),
        is = function(t) {
            return ua.indexOf(t) > -1
        },
        g = 'gecko',
        w = 'webkit',
        s = 'safari',
        o = 'opera',
        m = 'mobile',
        h = document.documentElement,
        b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua)) ? ('ie ie' + RegExp.$1) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3.6') ? g + ' ff3 ff3_6' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? o + (/version\/(\d+)/.test(ua) ? ' ' + o + RegExp.$1 : (/opera(\s|\/)(\d+)/.test(ua) ? ' ' + o + RegExp.$2 : '')) : is('konqueror') ? 'konqueror' : is('blackberry') ? m + ' blackberry' : is('android') ? m + ' android' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.$1 : '') : is('mozilla/') ? g : '', is('j2me') ? m + ' j2me' : is('iphone') ? m + ' iphone' : is('ipod') ? m + ' ipod' : is('ipad') ? m + ' ipad' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' + (is('windows nt 6.0') ? ' vista' : '') : is('freebsd') ? 'freebsd' : (is('x11') || is('linux')) ? 'linux' : '', 'js'];
    c = b.join(' ');
    h.className += ' ' + c;
    return c;
};
css_browser_selector(navigator.userAgent);
/*!
 * jQuery.browser.mobile
 * http://detectmobilebrowser.com
 */
(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);
/*!
 * css3pie - 1.0.0
 * http://css3pie.com
 */
if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
    (function() {
        var doc = document;
        var f = window.PIE;
        if (!f) {
            f = window.PIE = {
                F: "-pie-",
                nb: "Pie",
                La: "pie_",
                Ac: {
                    TD: 1,
                    TH: 1
                },
                cc: {
                    TABLE: 1,
                    THEAD: 1,
                    TBODY: 1,
                    TFOOT: 1,
                    TR: 1,
                    INPUT: 1,
                    TEXTAREA: 1,
                    SELECT: 1,
                    OPTION: 1,
                    IMG: 1,
                    HR: 1
                },
                fc: {
                    A: 1,
                    INPUT: 1,
                    TEXTAREA: 1,
                    SELECT: 1,
                    BUTTON: 1
                },
                Gd: {
                    submit: 1,
                    button: 1,
                    reset: 1
                },
                aa: function() {}
            };
            try {
                doc.execCommand("BackgroundImageCache", false, true)
            } catch (aa) {}
            for (var ba = 4, Z = doc.createElement("div"), ca = Z.getElementsByTagName("i"), ga; Z.innerHTML = "<!--[if gt IE " + ++ba + "]><i></i><![endif]--\>", ca[0];);
            f.O = ba;
            if (ba === 6) f.F = f.F.replace(/^-/, "");
            f.ja = doc.documentMode || f.O;
            Z.innerHTML = '<v:shape adj="1"/>';
            ga = Z.firstChild;
            ga.style.behavior = "url(#default#VML)";
            f.zc = typeof ga.adj === "object";
            (function() {
                var a, b = 0,
                    c = {};
                f.p = {
                    Za: function(d) {
                        if (!a) {
                            a = doc.createDocumentFragment();
                            a.namespaces.add("css3vml", "urn:schemas-microsoft-com:vml")
                        }
                        return a.createElement("css3vml:" + d)
                    },
                    Ba: function(d) {
                        return d && d._pieId || (d._pieId = "_" + ++b)
                    },
                    Eb: function(d) {
                        var e, g, j, i, h = arguments;
                        e = 1;
                        for (g = h.length; e < g; e++) {
                            i = h[e];
                            for (j in i)
                                if (i.hasOwnProperty(j)) d[j] = i[j]
                        }
                        return d
                    },
                    Rb: function(d, e, g) {
                        var j = c[d],
                            i, h;
                        if (j) Object.prototype.toString.call(j) === "[object Array]" ? j.push([e, g]) : e.call(g, j);
                        else {
                            h = c[d] = [
                                [e, g]
                            ];
                            i = new Image;
                            i.onload = function() {
                                j = c[d] = {
                                    h: i.width,
                                    f: i.height
                                };
                                for (var k = 0, n = h.length; k < n; k++) h[k][0].call(h[k][1], j);
                                i.onload = null
                            };
                            i.src = d
                        }
                    }
                }
            })();
            f.Na = {
                gc: function(a, b, c, d) {
                    function e() {
                        k = j >= 90 && j < 270 ? b : 0;
                        n = j < 180 ? c : 0;
                        m = b - k;
                        p = c - n
                    }

                    function g() {
                        for (; j < 0;) j += 360;
                        j %= 360
                    }
                    var j = d.sa;
                    d = d.zb;
                    var i, h, k, n, m, p, r, t;
                    if (d) {
                        d = d.coords(a, b, c);
                        i = d.x;
                        h = d.y
                    }
                    if (j) {
                        j = j.jd();
                        g();
                        e();
                        if (!d) {
                            i = k;
                            h = n
                        }
                        d = f.Na.tc(i, h, j, m, p);
                        a = d[0];
                        d = d[1]
                    } else if (d) {
                        a = b - i;
                        d = c - h
                    } else {
                        i = h = a = 0;
                        d = c
                    }
                    r = a - i;
                    t = d - h;
                    if (j === void 0) {
                        j = !r ? t < 0 ? 90 : 270 : !t ? r < 0 ? 180 : 0 : -Math.atan2(t, r) / Math.PI * 180;
                        g();
                        e()
                    }
                    return {
                        sa: j,
                        xc: i,
                        yc: h,
                        td: a,
                        ud: d,
                        Wd: k,
                        Xd: n,
                        rd: m,
                        sd: p,
                        kd: r,
                        ld: t,
                        rc: f.Na.dc(i, h, a, d)
                    }
                },
                tc: function(a, b, c, d, e) {
                    if (c === 0 || c === 180) return [d, b];
                    else if (c === 90 || c === 270) return [a, e];
                    else {
                        c = Math.tan(-c * Math.PI / 180);
                        a = c * a - b;
                        b = -1 / c;
                        d = b * d - e;
                        e = b - c;
                        return [(d - a) / e, (c * d - b * a) / e]
                    }
                },
                dc: function(a, b, c, d) {
                    a = c - a;
                    b = d - b;
                    return Math.abs(a === 0 ? b : b === 0 ? a : Math.sqrt(a * a + b * b))
                }
            };
            f.ea = function() {
                this.Gb = [];
                this.oc = {}
            };
            f.ea.prototype = {
                ba: function(a) {
                    var b = f.p.Ba(a),
                        c = this.oc,
                        d = this.Gb;
                    if (!(b in c)) {
                        c[b] = d.length;
                        d.push(a)
                    }
                },
                Ha: function(a) {
                    a = f.p.Ba(a);
                    var b = this.oc;
                    if (a && a in b) {
                        delete this.Gb[b[a]];
                        delete b[a]
                    }
                },
                xa: function() {
                    for (var a = this.Gb, b = a.length; b--;) a[b] && a[b]()
                }
            };
            f.Oa = new f.ea;
            f.Oa.Rd = function() {
                var a = this,
                    b;
                if (!a.Sd) {
                    b = doc.documentElement.currentStyle.getAttribute(f.F + "poll-interval") || 250;
                    (function c() {
                        a.xa();
                        setTimeout(c, b)
                    })();
                    a.Sd = 1
                }
            };
            (function() {
                function a() {
                    f.L.xa();
                    window.detachEvent("onunload", a);
                    window.PIE = null
                }
                f.L = new f.ea;
                window.attachEvent("onunload", a);
                f.L.ta = function(b, c, d) {
                    b.attachEvent(c, d);
                    this.ba(function() {
                        b.detachEvent(c, d)
                    })
                }
            })();
            f.Qa = new f.ea;
            f.L.ta(window, "onresize", function() {
                f.Qa.xa()
            });
            (function() {
                function a() {
                    f.mb.xa()
                }
                f.mb = new f.ea;
                f.L.ta(window, "onscroll", a);
                f.Qa.ba(a)
            })();
            (function() {
                function a() {
                    c = f.kb.md()
                }

                function b() {
                    if (c) {
                        for (var d = 0, e = c.length; d < e; d++) f.attach(c[d]);
                        c = 0
                    }
                }
                var c;
                if (f.ja < 9) {
                    f.L.ta(window, "onbeforeprint", a);
                    f.L.ta(window, "onafterprint", b)
                }
            })();
            f.lb = new f.ea;
            f.L.ta(doc, "onmouseup", function() {
                f.lb.xa()
            });
            f.he = function() {
                function a(h) {
                    this.Y = h
                }
                var b = doc.createElement("length-calc"),
                    c = doc.body || doc.documentElement,
                    d = b.style,
                    e = {},
                    g = ["mm", "cm", "in", "pt", "pc"],
                    j = g.length,
                    i = {};
                d.position = "absolute";
                d.top = d.left = "-9999px";
                for (c.appendChild(b); j--;) {
                    d.width = "100" + g[j];
                    e[g[j]] = b.offsetWidth / 100
                }
                c.removeChild(b);
                d.width = "1em";
                a.prototype = {
                    Kb: /(px|em|ex|mm|cm|in|pt|pc|%)$/,
                    ic: function() {
                        var h = this.Jd;
                        if (h === void 0) h = this.Jd = parseFloat(this.Y);
                        return h
                    },
                    yb: function() {
                        var h = this.ae;
                        if (!h) h = this.ae = (h = this.Y.match(this.Kb)) && h[0] || "px";
                        return h
                    },
                    a: function(h, k) {
                        var n = this.ic(),
                            m = this.yb();
                        switch (m) {
                            case "px":
                                return n;
                            case "%":
                                return n * (typeof k === "function" ? k() : k) / 100;
                            case "em":
                                return n * this.xb(h);
                            case "ex":
                                return n * this.xb(h) / 2;
                            default:
                                return n * e[m]
                        }
                    },
                    xb: function(h) {
                        var k = h.currentStyle.fontSize,
                            n, m;
                        if (k.indexOf("px") > 0) return parseFloat(k);
                        else if (h.tagName in f.cc) {
                            m = this;
                            n = h.parentNode;
                            return f.n(k).a(n, function() {
                                return m.xb(n)
                            })
                        } else {
                            h.appendChild(b);
                            k = b.offsetWidth;
                            b.parentNode === h && h.removeChild(b);
                            return k
                        }
                    }
                };
                f.n = function(h) {
                    return i[h] || (i[h] = new a(h))
                };
                return a
            }();
            f.Ja = function() {
                function a(e) {
                    this.X = e
                }
                var b = f.n("50%"),
                    c = {
                        top: 1,
                        center: 1,
                        bottom: 1
                    },
                    d = {
                        left: 1,
                        center: 1,
                        right: 1
                    };
                a.prototype = {
                    zd: function() {
                        if (!this.ac) {
                            var e = this.X,
                                g = e.length,
                                j = f.v,
                                i = j.qa,
                                h = f.n("0");
                            i = i.na;
                            h = ["left", h, "top", h];
                            if (g === 1) {
                                e.push(new j.ob(i, "center"));
                                g++
                            }
                            if (g === 2) {
                                i & (e[0].k | e[1].k) && e[0].d in c && e[1].d in d && e.push(e.shift());
                                if (e[0].k & i)
                                    if (e[0].d === "center") h[1] = b;
                                    else h[0] = e[0].d;
                                else if (e[0].W()) h[1] = f.n(e[0].d);
                                if (e[1].k & i)
                                    if (e[1].d === "center") h[3] = b;
                                    else h[2] = e[1].d;
                                else if (e[1].W()) h[3] = f.n(e[1].d)
                            }
                            this.ac = h
                        }
                        return this.ac
                    },
                    coords: function(e, g, j) {
                        var i = this.zd(),
                            h = i[1].a(e, g);
                        e = i[3].a(e, j);
                        return {
                            x: i[0] === "right" ? g - h : h,
                            y: i[2] === "bottom" ? j - e : e
                        }
                    }
                };
                return a
            }();
            f.Ka = function() {
                function a(b, c) {
                    this.h = b;
                    this.f = c
                }
                a.prototype = {
                    a: function(b, c, d, e, g) {
                        var j = this.h,
                            i = this.f,
                            h = c / d;
                        e = e / g;
                        if (j === "contain") {
                            j = e > h ? c : d * e;
                            i = e > h ? c / e : d
                        } else if (j === "cover") {
                            j = e < h ? c : d * e;
                            i = e < h ? c / e : d
                        } else if (j === "auto") {
                            i = i === "auto" ? g : i.a(b, d);
                            j = i * e
                        } else {
                            j = j.a(b, c);
                            i = i === "auto" ? j / e : i.a(b, d)
                        }
                        return {
                            h: j,
                            f: i
                        }
                    }
                };
                a.Kc = new a("auto", "auto");
                return a
            }();
            f.Ec = function() {
                function a(b) {
                    this.Y = b
                }
                a.prototype = {
                    Kb: /[a-z]+$/i,
                    yb: function() {
                        return this.ad || (this.ad = this.Y.match(this.Kb)[0].toLowerCase())
                    },
                    jd: function() {
                        var b = this.Vc,
                            c;
                        if (b === undefined) {
                            b = this.yb();
                            c = parseFloat(this.Y, 10);
                            b = this.Vc = b === "deg" ? c : b === "rad" ? c / Math.PI * 180 : b === "grad" ? c / 400 * 360 : b === "turn" ? c * 360 : 0
                        }
                        return b
                    }
                };
                return a
            }();
            f.Jc = function() {
                function a(c) {
                    this.Y = c
                }
                var b = {};
                a.Qd = /\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|\d*\.\d+)\s*\)\s*/;
                a.Fb = {
                    aliceblue: "F0F8FF",
                    antiquewhite: "FAEBD7",
                    aqua: "0FF",
                    aquamarine: "7FFFD4",
                    azure: "F0FFFF",
                    beige: "F5F5DC",
                    bisque: "FFE4C4",
                    black: "000",
                    blanchedalmond: "FFEBCD",
                    blue: "00F",
                    blueviolet: "8A2BE2",
                    brown: "A52A2A",
                    burlywood: "DEB887",
                    cadetblue: "5F9EA0",
                    chartreuse: "7FFF00",
                    chocolate: "D2691E",
                    coral: "FF7F50",
                    cornflowerblue: "6495ED",
                    cornsilk: "FFF8DC",
                    crimson: "DC143C",
                    cyan: "0FF",
                    darkblue: "00008B",
                    darkcyan: "008B8B",
                    darkgoldenrod: "B8860B",
                    darkgray: "A9A9A9",
                    darkgreen: "006400",
                    darkkhaki: "BDB76B",
                    darkmagenta: "8B008B",
                    darkolivegreen: "556B2F",
                    darkorange: "FF8C00",
                    darkorchid: "9932CC",
                    darkred: "8B0000",
                    darksalmon: "E9967A",
                    darkseagreen: "8FBC8F",
                    darkslateblue: "483D8B",
                    darkslategray: "2F4F4F",
                    darkturquoise: "00CED1",
                    darkviolet: "9400D3",
                    deeppink: "FF1493",
                    deepskyblue: "00BFFF",
                    dimgray: "696969",
                    dodgerblue: "1E90FF",
                    firebrick: "B22222",
                    floralwhite: "FFFAF0",
                    forestgreen: "228B22",
                    fuchsia: "F0F",
                    gainsboro: "DCDCDC",
                    ghostwhite: "F8F8FF",
                    gold: "FFD700",
                    goldenrod: "DAA520",
                    gray: "808080",
                    green: "008000",
                    greenyellow: "ADFF2F",
                    honeydew: "F0FFF0",
                    hotpink: "FF69B4",
                    indianred: "CD5C5C",
                    indigo: "4B0082",
                    ivory: "FFFFF0",
                    khaki: "F0E68C",
                    lavender: "E6E6FA",
                    lavenderblush: "FFF0F5",
                    lawngreen: "7CFC00",
                    lemonchiffon: "FFFACD",
                    lightblue: "ADD8E6",
                    lightcoral: "F08080",
                    lightcyan: "E0FFFF",
                    lightgoldenrodyellow: "FAFAD2",
                    lightgreen: "90EE90",
                    lightgrey: "D3D3D3",
                    lightpink: "FFB6C1",
                    lightsalmon: "FFA07A",
                    lightseagreen: "20B2AA",
                    lightskyblue: "87CEFA",
                    lightslategray: "789",
                    lightsteelblue: "B0C4DE",
                    lightyellow: "FFFFE0",
                    lime: "0F0",
                    limegreen: "32CD32",
                    linen: "FAF0E6",
                    magenta: "F0F",
                    maroon: "800000",
                    mediumauqamarine: "66CDAA",
                    mediumblue: "0000CD",
                    mediumorchid: "BA55D3",
                    mediumpurple: "9370D8",
                    mediumseagreen: "3CB371",
                    mediumslateblue: "7B68EE",
                    mediumspringgreen: "00FA9A",
                    mediumturquoise: "48D1CC",
                    mediumvioletred: "C71585",
                    midnightblue: "191970",
                    mintcream: "F5FFFA",
                    mistyrose: "FFE4E1",
                    moccasin: "FFE4B5",
                    navajowhite: "FFDEAD",
                    navy: "000080",
                    oldlace: "FDF5E6",
                    olive: "808000",
                    olivedrab: "688E23",
                    orange: "FFA500",
                    orangered: "FF4500",
                    orchid: "DA70D6",
                    palegoldenrod: "EEE8AA",
                    palegreen: "98FB98",
                    paleturquoise: "AFEEEE",
                    palevioletred: "D87093",
                    papayawhip: "FFEFD5",
                    peachpuff: "FFDAB9",
                    peru: "CD853F",
                    pink: "FFC0CB",
                    plum: "DDA0DD",
                    powderblue: "B0E0E6",
                    purple: "800080",
                    red: "F00",
                    rosybrown: "BC8F8F",
                    royalblue: "4169E1",
                    saddlebrown: "8B4513",
                    salmon: "FA8072",
                    sandybrown: "F4A460",
                    seagreen: "2E8B57",
                    seashell: "FFF5EE",
                    sienna: "A0522D",
                    silver: "C0C0C0",
                    skyblue: "87CEEB",
                    slateblue: "6A5ACD",
                    slategray: "708090",
                    snow: "FFFAFA",
                    springgreen: "00FF7F",
                    steelblue: "4682B4",
                    tan: "D2B48C",
                    teal: "008080",
                    thistle: "D8BFD8",
                    tomato: "FF6347",
                    turquoise: "40E0D0",
                    violet: "EE82EE",
                    wheat: "F5DEB3",
                    white: "FFF",
                    whitesmoke: "F5F5F5",
                    yellow: "FF0",
                    yellowgreen: "9ACD32"
                };
                a.prototype = {
                    parse: function() {
                        if (!this.Ua) {
                            var c = this.Y,
                                d;
                            if (d = c.match(a.Qd)) {
                                this.Ua = "rgb(" + d[1] + "," + d[2] + "," + d[3] + ")";
                                this.Yb = parseFloat(d[4])
                            } else {
                                if ((d = c.toLowerCase()) in a.Fb) c = "#" + a.Fb[d];
                                this.Ua = c;
                                this.Yb = c === "transparent" ? 0 : 1
                            }
                        }
                    },
                    U: function(c) {
                        this.parse();
                        return this.Ua === "currentColor" ? c.currentStyle.color : this.Ua
                    },
                    fa: function() {
                        this.parse();
                        return this.Yb
                    }
                };
                f.ha = function(c) {
                    return b[c] || (b[c] = new a(c))
                };
                return a
            }();
            f.v = function() {
                function a(c) {
                    this.$a = c;
                    this.ch = 0;
                    this.X = [];
                    this.Ga = 0
                }
                var b = a.qa = {
                    Ia: 1,
                    Wb: 2,
                    z: 4,
                    Lc: 8,
                    Xb: 16,
                    na: 32,
                    K: 64,
                    oa: 128,
                    pa: 256,
                    Ra: 512,
                    Tc: 1024,
                    URL: 2048
                };
                a.ob = function(c, d) {
                    this.k = c;
                    this.d = d
                };
                a.ob.prototype = {
                    Ca: function() {
                        return this.k & b.K || this.k & b.oa && this.d === "0"
                    },
                    W: function() {
                        return this.Ca() || this.k & b.Ra
                    }
                };
                a.prototype = {
                    de: /\s/,
                    Kd: /^[\+\-]?(\d*\.)?\d+/,
                    url: /^url\(\s*("([^"]*)"|'([^']*)'|([!#$%&*-~]*))\s*\)/i,
                    nc: /^\-?[_a-z][\w-]*/i,
                    Yd: /^("([^"]*)"|'([^']*)')/,
                    Bd: /^#([\da-f]{6}|[\da-f]{3})/i,
                    be: {
                        px: b.K,
                        em: b.K,
                        ex: b.K,
                        mm: b.K,
                        cm: b.K,
                        "in": b.K,
                        pt: b.K,
                        pc: b.K,
                        deg: b.Ia,
                        rad: b.Ia,
                        grad: b.Ia
                    },
                    fd: {
                        rgb: 1,
                        rgba: 1,
                        hsl: 1,
                        hsla: 1
                    },
                    next: function(c) {
                        function d(p, r) {
                            p = new a.ob(p, r);
                            if (!c) {
                                k.X.push(p);
                                k.Ga++
                            }
                            return p
                        }

                        function e() {
                            k.Ga++;
                            return null
                        }
                        var g, j, i, h, k = this;
                        if (this.Ga < this.X.length) return this.X[this.Ga++];
                        for (; this.de.test(this.$a.charAt(this.ch));) this.ch++;
                        if (this.ch >= this.$a.length) return e();
                        j = this.ch;
                        g = this.$a.substring(this.ch);
                        i = g.charAt(0);
                        switch (i) {
                            case "#":
                                if (h = g.match(this.Bd)) {
                                    this.ch += h[0].length;
                                    return d(b.z, h[0])
                                }
                                break;
                            case '"':
                            case "'":
                                if (h = g.match(this.Yd)) {
                                    this.ch += h[0].length;
                                    return d(b.Tc, h[2] || h[3] || "")
                                }
                                break;
                            case "/":
                            case ",":
                                this.ch++;
                                return d(b.pa, i);
                            case "u":
                                if (h = g.match(this.url)) {
                                    this.ch += h[0].length;
                                    return d(b.URL, h[2] || h[3] || h[4] || "")
                                }
                        }
                        if (h = g.match(this.Kd)) {
                            i = h[0];
                            this.ch += i.length;
                            if (g.charAt(i.length) === "%") {
                                this.ch++;
                                return d(b.Ra, i + "%")
                            }
                            if (h = g.substring(i.length).match(this.nc)) {
                                i += h[0];
                                this.ch += h[0].length;
                                return d(this.be[h[0].toLowerCase()] || b.Lc, i)
                            }
                            return d(b.oa, i)
                        }
                        if (h = g.match(this.nc)) {
                            i = h[0];
                            this.ch += i.length;
                            if (i.toLowerCase() in f.Jc.Fb || i === "currentColor" || i === "transparent") return d(b.z, i);
                            if (g.charAt(i.length) === "(") {
                                this.ch++;
                                if (i.toLowerCase() in this.fd) {
                                    g = function(p) {
                                        return p && p.k & b.oa
                                    };
                                    h = function(p) {
                                        return p && p.k & (b.oa | b.Ra)
                                    };
                                    var n = function(p, r) {
                                            return p && p.d === r
                                        },
                                        m = function() {
                                            return k.next(1)
                                        };
                                    if ((i.charAt(0) === "r" ? h(m()) : g(m())) && n(m(), ",") && h(m()) && n(m(), ",") && h(m()) && (i === "rgb" || i === "hsa" || n(m(), ",") && g(m())) && n(m(), ")")) return d(b.z, this.$a.substring(j, this.ch));
                                    return e()
                                }
                                return d(b.Xb, i)
                            }
                            return d(b.na, i)
                        }
                        this.ch++;
                        return d(b.Wb, i)
                    },
                    D: function() {
                        return this.X[this.Ga-- - 2]
                    },
                    all: function() {
                        for (; this.next(););
                        return this.X
                    },
                    ma: function(c, d) {
                        for (var e = [], g, j; g = this.next();) {
                            if (c(g)) {
                                j = true;
                                this.D();
                                break
                            }
                            e.push(g)
                        }
                        return d && !j ? null : e
                    }
                };
                return a
            }();
            var ha = function(a) {
                this.e = a
            };
            ha.prototype = {
                Z: 0,
                Od: function() {
                    var a = this.qb,
                        b;
                    return !a || (b = this.o()) && (a.x !== b.x || a.y !== b.y)
                },
                Td: function() {
                    var a = this.qb,
                        b;
                    return !a || (b = this.o()) && (a.h !== b.h || a.f !== b.f)
                },
                hc: function() {
                    var a = this.e,
                        b = a.getBoundingClientRect(),
                        c = f.ja === 9,
                        d = f.O === 7,
                        e = b.right - b.left;
                    return {
                        x: b.left,
                        y: b.top,
                        h: c || d ? a.offsetWidth : e,
                        f: c || d ? a.offsetHeight : b.bottom - b.top,
                        Hd: d && e ? a.offsetWidth / e : 1
                    }
                },
                o: function() {
                    return this.Z ? this.Va || (this.Va = this.hc()) : this.hc()
                },
                Ad: function() {
                    return !!this.qb
                },
                cb: function() {
                    ++this.Z
                },
                hb: function() {
                    if (!--this.Z) {
                        if (this.Va) this.qb = this.Va;
                        this.Va = null
                    }
                }
            };
            (function() {
                function a(b) {
                    var c = f.p.Ba(b);
                    return function() {
                        if (this.Z) {
                            var d = this.$b || (this.$b = {});
                            return c in d ? d[c] : (d[c] = b.call(this))
                        } else return b.call(this)
                    }
                }
                f.B = {
                    Z: 0,
                    ka: function(b) {
                        function c(d) {
                            this.e = d;
                            this.Zb = this.ia()
                        }
                        f.p.Eb(c.prototype, f.B, b);
                        c.$c = {};
                        return c
                    },
                    j: function() {
                        var b = this.ia(),
                            c = this.constructor.$c;
                        return b ? b in c ? c[b] : (c[b] = this.la(b)) : null
                    },
                    ia: a(function() {
                        var b = this.e,
                            c = this.constructor,
                            d = b.style;
                        b = b.currentStyle;
                        var e = this.wa,
                            g = this.Fa,
                            j = c.Yc || (c.Yc = f.F + e);
                        c = c.Zc || (c.Zc = f.nb + g.charAt(0).toUpperCase() + g.substring(1));
                        return d[c] || b.getAttribute(j) || d[g] || b.getAttribute(e)
                    }),
                    i: a(function() {
                        return !!this.j()
                    }),
                    H: a(function() {
                        var b = this.ia(),
                            c = b !== this.Zb;
                        this.Zb = b;
                        return c
                    }),
                    va: a,
                    cb: function() {
                        ++this.Z
                    },
                    hb: function() {
                        --this.Z || delete this.$b
                    }
                }
            })();
            f.Sb = f.B.ka({
                wa: f.F + "background",
                Fa: f.nb + "Background",
                cd: {
                    scroll: 1,
                    fixed: 1,
                    local: 1
                },
                fb: {
                    "repeat-x": 1,
                    "repeat-y": 1,
                    repeat: 1,
                    "no-repeat": 1
                },
                sc: {
                    "padding-box": 1,
                    "border-box": 1,
                    "content-box": 1
                },
                Pd: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1,
                    center: 1
                },
                Ud: {
                    contain: 1,
                    cover: 1
                },
                eb: {
                    Ma: "backgroundClip",
                    z: "backgroundColor",
                    da: "backgroundImage",
                    Pa: "backgroundOrigin",
                    S: "backgroundPosition",
                    T: "backgroundRepeat",
                    Sa: "backgroundSize"
                },
                la: function(a) {
                    function b(s) {
                        return s && s.W() || s.k & k && s.d in t
                    }

                    function c(s) {
                        return s && (s.W() && f.n(s.d) || s.d === "auto" && "auto")
                    }
                    var d = this.e.currentStyle,
                        e, g, j, i = f.v.qa,
                        h = i.pa,
                        k = i.na,
                        n = i.z,
                        m, p, r = 0,
                        t = this.Pd,
                        v, l, q = {
                            M: []
                        };
                    if (this.wb()) {
                        e = new f.v(a);
                        for (j = {}; g = e.next();) {
                            m = g.k;
                            p = g.d;
                            if (!j.P && m & i.Xb && p === "linear-gradient") {
                                v = {
                                    ca: [],
                                    P: p
                                };
                                for (l = {}; g = e.next();) {
                                    m = g.k;
                                    p = g.d;
                                    if (m & i.Wb && p === ")") {
                                        l.color && v.ca.push(l);
                                        v.ca.length > 1 && f.p.Eb(j, v);
                                        break
                                    }
                                    if (m & n) {
                                        if (v.sa || v.zb) {
                                            g = e.D();
                                            if (g.k !== h) break;
                                            e.next()
                                        }
                                        l = {
                                            color: f.ha(p)
                                        };
                                        g = e.next();
                                        if (g.W()) l.db = f.n(g.d);
                                        else e.D()
                                    } else if (m & i.Ia && !v.sa && !l.color && !v.ca.length) v.sa = new f.Ec(g.d);
                                    else if (b(g) && !v.zb && !l.color && !v.ca.length) {
                                        e.D();
                                        v.zb = new f.Ja(e.ma(function(s) {
                                            return !b(s)
                                        }, false))
                                    } else if (m & h && p === ",") {
                                        if (l.color) {
                                            v.ca.push(l);
                                            l = {}
                                        }
                                    } else break
                                }
                            } else if (!j.P && m & i.URL) {
                                j.Ab = p;
                                j.P = "image"
                            } else if (b(g) && !j.$) {
                                e.D();
                                j.$ = new f.Ja(e.ma(function(s) {
                                    return !b(s)
                                }, false))
                            } else if (m & k)
                                if (p in this.fb && !j.bb) j.bb = p;
                                else if (p in this.sc && !j.Wa) {
                                j.Wa = p;
                                if ((g = e.next()) && g.k & k && g.d in this.sc) j.ub = g.d;
                                else {
                                    j.ub = p;
                                    e.D()
                                }
                            } else if (p in this.cd && !j.bc) j.bc = p;
                            else return null;
                            else if (m & n && !q.color) q.color = f.ha(p);
                            else if (m & h && p === "/" && !j.Xa && j.$) {
                                g = e.next();
                                if (g.k & k && g.d in this.Ud) j.Xa = new f.Ka(g.d);
                                else if (g = c(g)) {
                                    m = c(e.next());
                                    if (!m) {
                                        m = g;
                                        e.D()
                                    }
                                    j.Xa = new f.Ka(g, m)
                                } else return null
                            } else if (m & h && p === "," && j.P) {
                                j.Hb = a.substring(r, e.ch - 1);
                                r = e.ch;
                                q.M.push(j);
                                j = {}
                            } else return null
                        }
                        if (j.P) {
                            j.Hb = a.substring(r);
                            q.M.push(j)
                        }
                    } else this.Bc(f.ja < 9 ? function() {
                        var s = this.eb,
                            o = d[s.S + "X"],
                            u = d[s.S + "Y"],
                            x = d[s.da],
                            y = d[s.z];
                        if (y !== "transparent") q.color = f.ha(y);
                        if (x !== "none") q.M = [{
                            P: "image",
                            Ab: (new f.v(x)).next().d,
                            bb: d[s.T],
                            $: new f.Ja((new f.v(o + " " + u)).all())
                        }]
                    } : function() {
                        var s = this.eb,
                            o = /\s*,\s*/,
                            u = d[s.da].split(o),
                            x = d[s.z],
                            y, z, B, E, D, C;
                        if (x !== "transparent") q.color = f.ha(x);
                        if ((E = u.length) && u[0] !== "none") {
                            x = d[s.T].split(o);
                            y = d[s.S].split(o);
                            z = d[s.Pa].split(o);
                            B = d[s.Ma].split(o);
                            s = d[s.Sa].split(o);
                            q.M = [];
                            for (o = 0; o < E; o++)
                                if ((D = u[o]) && D !== "none") {
                                    C = s[o].split(" ");
                                    q.M.push({
                                        Hb: D + " " + x[o] + " " + y[o] + " / " + s[o] + " " + z[o] + " " + B[o],
                                        P: "image",
                                        Ab: (new f.v(D)).next().d,
                                        bb: x[o],
                                        $: new f.Ja((new f.v(y[o])).all()),
                                        Wa: z[o],
                                        ub: B[o],
                                        Xa: new f.Ka(C[0], C[1])
                                    })
                                }
                        }
                    });
                    return q.color || q.M[0] ? q : null
                },
                Bc: function(a) {
                    var b = f.ja > 8,
                        c = this.eb,
                        d = this.e.runtimeStyle,
                        e = d[c.da],
                        g = d[c.z],
                        j = d[c.T],
                        i, h, k, n;
                    if (e) d[c.da] = "";
                    if (g) d[c.z] = "";
                    if (j) d[c.T] = "";
                    if (b) {
                        i = d[c.Ma];
                        h = d[c.Pa];
                        n = d[c.S];
                        k = d[c.Sa];
                        if (i) d[c.Ma] = "";
                        if (h) d[c.Pa] = "";
                        if (n) d[c.S] = "";
                        if (k) d[c.Sa] = ""
                    }
                    a = a.call(this);
                    if (e) d[c.da] = e;
                    if (g) d[c.z] = g;
                    if (j) d[c.T] = j;
                    if (b) {
                        if (i) d[c.Ma] = i;
                        if (h) d[c.Pa] = h;
                        if (n) d[c.S] = n;
                        if (k) d[c.Sa] = k
                    }
                    return a
                },
                ia: f.B.va(function() {
                    return this.wb() || this.Bc(function() {
                        var a = this.e.currentStyle,
                            b = this.eb;
                        return a[b.z] + " " + a[b.da] + " " + a[b.T] + " " + a[b.S + "X"] + " " + a[b.S + "Y"]
                    })
                }),
                wb: f.B.va(function() {
                    var a = this.e;
                    return a.style[this.Fa] || a.currentStyle.getAttribute(this.wa)
                }),
                qc: function() {
                    var a = 0;
                    if (f.O < 7) {
                        a = this.e;
                        a = "" + (a.style[f.nb + "PngFix"] || a.currentStyle.getAttribute(f.F + "png-fix")) === "true"
                    }
                    return a
                },
                i: f.B.va(function() {
                    return (this.wb() || this.qc()) && !!this.j()
                })
            });
            f.Vb = f.B.ka({
                wc: ["Top", "Right", "Bottom", "Left"],
                Id: {
                    thin: "1px",
                    medium: "3px",
                    thick: "5px"
                },
                la: function() {
                    var a = {},
                        b = {},
                        c = {},
                        d = false,
                        e = true,
                        g = true,
                        j = true;
                    this.Cc(function() {
                        for (var i = this.e.currentStyle, h = 0, k, n, m, p, r, t, v; h < 4; h++) {
                            m = this.wc[h];
                            v = m.charAt(0).toLowerCase();
                            k = b[v] = i["border" + m + "Style"];
                            n = i["border" + m + "Color"];
                            m = i["border" + m + "Width"];
                            if (h > 0) {
                                if (k !== p) g = false;
                                if (n !== r) e = false;
                                if (m !== t) j = false
                            }
                            p = k;
                            r = n;
                            t = m;
                            c[v] = f.ha(n);
                            m = a[v] = f.n(b[v] === "none" ? "0" : this.Id[m] || m);
                            if (m.a(this.e) > 0) d = true
                        }
                    });
                    return d ? {
                        J: a,
                        Zd: b,
                        gd: c,
                        ee: j,
                        hd: e,
                        $d: g
                    } : null
                },
                ia: f.B.va(function() {
                    var a = this.e,
                        b = a.currentStyle,
                        c;
                    a.tagName in f.Ac && a.offsetParent.currentStyle.borderCollapse === "collapse" || this.Cc(function() {
                        c = b.borderWidth + "|" + b.borderStyle + "|" + b.borderColor
                    });
                    return c
                }),
                Cc: function(a) {
                    var b = this.e.runtimeStyle,
                        c = b.borderWidth,
                        d = b.borderColor;
                    if (c) b.borderWidth = "";
                    if (d) b.borderColor = "";
                    a = a.call(this);
                    if (c) b.borderWidth = c;
                    if (d) b.borderColor = d;
                    return a
                }
            });
            (function() {
                f.jb = f.B.ka({
                    wa: "border-radius",
                    Fa: "borderRadius",
                    la: function(b) {
                        var c = null,
                            d, e, g, j, i = false;
                        if (b) {
                            e = new f.v(b);
                            var h = function() {
                                for (var k = [], n;
                                    (g = e.next()) && g.W();) {
                                    j = f.n(g.d);
                                    n = j.ic();
                                    if (n < 0) return null;
                                    if (n > 0) i = true;
                                    k.push(j)
                                }
                                return k.length > 0 && k.length < 5 ? {
                                    tl: k[0],
                                    tr: k[1] || k[0],
                                    br: k[2] || k[0],
                                    bl: k[3] || k[1] || k[0]
                                } : null
                            };
                            if (b = h()) {
                                if (g) {
                                    if (g.k & f.v.qa.pa && g.d === "/") d = h()
                                } else d = b;
                                if (i && b && d) c = {
                                    x: b,
                                    y: d
                                }
                            }
                        }
                        return c
                    }
                });
                var a = f.n("0");
                a = {
                    tl: a,
                    tr: a,
                    br: a,
                    bl: a
                };
                f.jb.Dc = {
                    x: a,
                    y: a
                }
            })();
            f.Ub = f.B.ka({
                wa: "border-image",
                Fa: "borderImage",
                fb: {
                    stretch: 1,
                    round: 1,
                    repeat: 1,
                    space: 1
                },
                la: function(a) {
                    var b = null,
                        c, d, e, g, j, i, h = 0,
                        k = f.v.qa,
                        n = k.na,
                        m = k.oa,
                        p = k.Ra;
                    if (a) {
                        c = new f.v(a);
                        b = {};
                        for (var r = function(l) {
                                return l && l.k & k.pa && l.d === "/"
                            }, t = function(l) {
                                return l && l.k & n && l.d === "fill"
                            }, v = function() {
                                g = c.ma(function(l) {
                                    return !(l.k & (m | p))
                                });
                                if (t(c.next()) && !b.fill) b.fill = true;
                                else c.D();
                                if (r(c.next())) {
                                    h++;
                                    j = c.ma(function(l) {
                                        return !l.W() && !(l.k & n && l.d === "auto")
                                    });
                                    if (r(c.next())) {
                                        h++;
                                        i = c.ma(function(l) {
                                            return !l.Ca()
                                        })
                                    }
                                } else c.D()
                            }; a = c.next();) {
                            d = a.k;
                            e = a.d;
                            if (d & (m | p) && !g) {
                                c.D();
                                v()
                            } else if (t(a) && !b.fill) {
                                b.fill = true;
                                v()
                            } else if (d & n && this.fb[e] && !b.repeat) {
                                b.repeat = {
                                    f: e
                                };
                                if (a = c.next())
                                    if (a.k & n && this.fb[a.d]) b.repeat.Ob = a.d;
                                    else c.D()
                            } else if (d & k.URL && !b.src) b.src = e;
                            else return null
                        }
                        if (!b.src || !g || g.length < 1 || g.length > 4 || j && j.length > 4 || h === 1 && j.length < 1 || i && i.length > 4 || h === 2 && i.length < 1) return null;
                        if (!b.repeat) b.repeat = {
                            f: "stretch"
                        };
                        if (!b.repeat.Ob) b.repeat.Ob = b.repeat.f;
                        a = function(l, q) {
                            return {
                                t: q(l[0]),
                                r: q(l[1] || l[0]),
                                b: q(l[2] || l[0]),
                                l: q(l[3] || l[1] || l[0])
                            }
                        };
                        b.slice = a(g, function(l) {
                            return f.n(l.k & m ? l.d + "px" : l.d)
                        });
                        if (j && j[0]) b.J = a(j, function(l) {
                            return l.W() ? f.n(l.d) : l.d
                        });
                        if (i && i[0]) b.Da = a(i, function(l) {
                            return l.Ca() ? f.n(l.d) : l.d
                        })
                    }
                    return b
                }
            });
            f.Ic = f.B.ka({
                wa: "box-shadow",
                Fa: "boxShadow",
                la: function(a) {
                    var b, c = f.n,
                        d = f.v.qa,
                        e;
                    if (a) {
                        e = new f.v(a);
                        b = {
                            Da: [],
                            Bb: []
                        };
                        for (a = function() {
                                for (var g, j, i, h, k, n; g = e.next();) {
                                    i = g.d;
                                    j = g.k;
                                    if (j & d.pa && i === ",") break;
                                    else if (g.Ca() && !k) {
                                        e.D();
                                        k = e.ma(function(m) {
                                            return !m.Ca()
                                        })
                                    } else if (j & d.z && !h) h = i;
                                    else if (j & d.na && i === "inset" && !n) n = true;
                                    else return false
                                }
                                g = k && k.length;
                                if (g > 1 && g < 5) {
                                    (n ? b.Bb : b.Da).push({
                                        fe: c(k[0].d),
                                        ge: c(k[1].d),
                                        blur: c(k[2] ? k[2].d : "0"),
                                        Vd: c(k[3] ? k[3].d : "0"),
                                        color: f.ha(h || "currentColor")
                                    });
                                    return true
                                }
                                return false
                            }; a(););
                    }
                    return b && (b.Bb.length || b.Da.length) ? b : null
                }
            });
            f.Uc = f.B.ka({
                ia: f.B.va(function() {
                    var a = this.e.currentStyle;
                    return a.visibility + "|" + a.display
                }),
                la: function() {
                    var a = this.e,
                        b = a.runtimeStyle;
                    a = a.currentStyle;
                    var c = b.visibility,
                        d;
                    b.visibility = "";
                    d = a.visibility;
                    b.visibility = c;
                    return {
                        ce: d !== "hidden",
                        nd: a.display !== "none"
                    }
                },
                i: function() {
                    return false
                }
            });
            f.u = {
                R: function(a) {
                    function b(c, d, e, g) {
                        this.e = c;
                        this.s = d;
                        this.g = e;
                        this.parent = g
                    }
                    f.p.Eb(b.prototype, f.u, a);
                    return b
                },
                Cb: false,
                Q: function() {
                    return false
                },
                Ea: f.aa,
                Lb: function() {
                    this.m();
                    this.i() && this.V()
                },
                ib: function() {
                    this.Cb = true
                },
                Mb: function() {
                    this.i() ? this.V() : this.m()
                },
                sb: function(a, b) {
                    this.vc(a);
                    for (var c = this.ra || (this.ra = []), d = a + 1, e = c.length, g; d < e; d++)
                        if (g = c[d]) break;
                    c[a] = b;
                    this.I().insertBefore(b, g || null)
                },
                za: function(a) {
                    var b = this.ra;
                    return b && b[a] || null
                },
                vc: function(a) {
                    var b = this.za(a),
                        c = this.Ta;
                    if (b && c) {
                        c.removeChild(b);
                        this.ra[a] = null
                    }
                },
                Aa: function(a, b, c, d) {
                    var e = this.rb || (this.rb = {}),
                        g = e[a];
                    if (!g) {
                        g = e[a] = f.p.Za("shape");
                        if (b) g.appendChild(g[b] = f.p.Za(b));
                        if (d) {
                            c = this.za(d);
                            if (!c) {
                                this.sb(d, doc.createElement("group" + d));
                                c = this.za(d)
                            }
                        }
                        c.appendChild(g);
                        a = g.style;
                        a.position = "absolute";
                        a.left = a.top = 0;
                        a.behavior = "url(#default#VML)"
                    }
                    return g
                },
                vb: function(a) {
                    var b = this.rb,
                        c = b && b[a];
                    if (c) {
                        c.parentNode.removeChild(c);
                        delete b[a]
                    }
                    return !!c
                },
                kc: function(a) {
                    var b = this.e,
                        c = this.s.o(),
                        d = c.h,
                        e = c.f,
                        g, j, i, h, k, n;
                    c = a.x.tl.a(b, d);
                    g = a.y.tl.a(b, e);
                    j = a.x.tr.a(b, d);
                    i = a.y.tr.a(b, e);
                    h = a.x.br.a(b, d);
                    k = a.y.br.a(b, e);
                    n = a.x.bl.a(b, d);
                    a = a.y.bl.a(b, e);
                    d = Math.min(d / (c + j), e / (i + k), d / (n + h), e / (g + a));
                    if (d < 1) {
                        c *= d;
                        g *= d;
                        j *= d;
                        i *= d;
                        h *= d;
                        k *= d;
                        n *= d;
                        a *= d
                    }
                    return {
                        x: {
                            tl: c,
                            tr: j,
                            br: h,
                            bl: n
                        },
                        y: {
                            tl: g,
                            tr: i,
                            br: k,
                            bl: a
                        }
                    }
                },
                ya: function(a, b, c) {
                    b = b || 1;
                    var d, e, g = this.s.o();
                    e = g.h * b;
                    g = g.f * b;
                    var j = this.g.G,
                        i = Math.floor,
                        h = Math.ceil,
                        k = a ? a.Jb * b : 0,
                        n = a ? a.Ib * b : 0,
                        m = a ? a.tb * b : 0;
                    a = a ? a.Db * b : 0;
                    var p, r, t, v, l;
                    if (c || j.i()) {
                        d = this.kc(c || j.j());
                        c = d.x.tl * b;
                        j = d.y.tl * b;
                        p = d.x.tr * b;
                        r = d.y.tr * b;
                        t = d.x.br * b;
                        v = d.y.br * b;
                        l = d.x.bl * b;
                        b = d.y.bl * b;
                        e = "m" + i(a) + "," + i(j) + "qy" + i(c) + "," + i(k) + "l" + h(e - p) + "," + i(k) + "qx" + h(e - n) + "," + i(r) + "l" + h(e - n) + "," + h(g - v) + "qy" + h(e - t) + "," + h(g - m) + "l" + i(l) + "," + h(g - m) + "qx" + i(a) + "," + h(g - b) + " x e"
                    } else e = "m" + i(a) + "," + i(k) + "l" + h(e - n) + "," + i(k) + "l" + h(e - n) + "," + h(g - m) + "l" + i(a) + "," + h(g - m) + "xe";
                    return e
                },
                I: function() {
                    var a = this.parent.za(this.N),
                        b;
                    if (!a) {
                        a = doc.createElement(this.Ya);
                        b = a.style;
                        b.position = "absolute";
                        b.top = b.left = 0;
                        this.parent.sb(this.N, a)
                    }
                    return a
                },
                mc: function() {
                    var a = this.e,
                        b = a.currentStyle,
                        c = a.runtimeStyle,
                        d = a.tagName,
                        e = f.O === 6,
                        g;
                    if (e && (d in f.cc || d === "FIELDSET") || d === "BUTTON" || d === "INPUT" && a.type in f.Gd) {
                        c.borderWidth = "";
                        d = this.g.w.wc;
                        for (g = d.length; g--;) {
                            e = d[g];
                            c["padding" + e] = "";
                            c["padding" + e] = f.n(b["padding" + e]).a(a) + f.n(b["border" + e + "Width"]).a(a) + (f.O !== 8 && g % 2 ? 1 : 0)
                        }
                        c.borderWidth = 0
                    } else if (e) {
                        if (a.childNodes.length !== 1 || a.firstChild.tagName !== "ie6-mask") {
                            b = doc.createElement("ie6-mask");
                            d = b.style;
                            d.visibility = "visible";
                            for (d.zoom = 1; d = a.firstChild;) b.appendChild(d);
                            a.appendChild(b);
                            c.visibility = "hidden"
                        }
                    } else c.borderColor = "transparent"
                },
                ie: function() {},
                m: function() {
                    this.parent.vc(this.N);
                    delete this.rb;
                    delete this.ra
                }
            };
            f.Rc = f.u.R({
                i: function() {
                    var a = this.ed;
                    for (var b in a)
                        if (a.hasOwnProperty(b) && a[b].i()) return true;
                    return false
                },
                Q: function() {
                    return this.g.Pb.H()
                },
                ib: function() {
                    if (this.i()) {
                        var a = this.jc(),
                            b = a,
                            c;
                        a = a.currentStyle;
                        var d = a.position,
                            e = this.I().style,
                            g = 0,
                            j = 0;
                        j = this.s.o();
                        var i = j.Hd;
                        if (d === "fixed" && f.O > 6) {
                            g = j.x * i;
                            j = j.y * i;
                            b = d
                        } else {
                            do b = b.offsetParent; while (b && b.currentStyle.position === "static");
                            if (b) {
                                c = b.getBoundingClientRect();
                                b = b.currentStyle;
                                g = (j.x - c.left) * i - (parseFloat(b.borderLeftWidth) || 0);
                                j = (j.y - c.top) * i - (parseFloat(b.borderTopWidth) || 0)
                            } else {
                                b = doc.documentElement;
                                g = (j.x + b.scrollLeft - b.clientLeft) * i;
                                j = (j.y + b.scrollTop - b.clientTop) * i
                            }
                            b = "absolute"
                        }
                        e.position = b;
                        e.left = g;
                        e.top = j;
                        e.zIndex = d === "static" ? -1 : a.zIndex;
                        this.Cb = true
                    }
                },
                Mb: f.aa,
                Nb: function() {
                    var a = this.g.Pb.j();
                    this.I().style.display = a.ce && a.nd ? "" : "none"
                },
                Lb: function() {
                    this.i() ? this.Nb() : this.m()
                },
                jc: function() {
                    var a = this.e;
                    return a.tagName in f.Ac ? a.offsetParent : a
                },
                I: function() {
                    var a = this.Ta,
                        b;
                    if (!a) {
                        b = this.jc();
                        a = this.Ta = doc.createElement("css3-container");
                        a.style.direction = "ltr";
                        this.Nb();
                        b.parentNode.insertBefore(a, b)
                    }
                    return a
                },
                ab: f.aa,
                m: function() {
                    var a = this.Ta,
                        b;
                    if (a && (b = a.parentNode)) b.removeChild(a);
                    delete this.Ta;
                    delete this.ra
                }
            });
            f.Fc = f.u.R({
                N: 2,
                Ya: "background",
                Q: function() {
                    var a = this.g;
                    return a.C.H() || a.G.H()
                },
                i: function() {
                    var a = this.g;
                    return a.q.i() || a.G.i() || a.C.i() || a.ga.i() && a.ga.j().Bb
                },
                V: function() {
                    var a = this.s.o();
                    if (a.h && a.f) {
                        this.od();
                        this.pd()
                    }
                },
                od: function() {
                    var a = this.g.C.j(),
                        b = this.s.o(),
                        c = this.e,
                        d = a && a.color,
                        e, g;
                    if (d && d.fa() > 0) {
                        this.lc();
                        a = this.Aa("bgColor", "fill", this.I(), 1);
                        e = b.h;
                        b = b.f;
                        a.stroked = false;
                        a.coordsize = e * 2 + "," + b * 2;
                        a.coordorigin = "1,1";
                        a.path = this.ya(null, 2);
                        g = a.style;
                        g.width = e;
                        g.height = b;
                        a.fill.color = d.U(c);
                        c = d.fa();
                        if (c < 1) a.fill.opacity = c
                    } else this.vb("bgColor")
                },
                pd: function() {
                    var a = this.g.C.j(),
                        b = this.s.o();
                    a = a && a.M;
                    var c, d, e, g, j;
                    if (a) {
                        this.lc();
                        d = b.h;
                        e = b.f;
                        for (j = a.length; j--;) {
                            b = a[j];
                            c = this.Aa("bgImage" + j, "fill", this.I(), 2);
                            c.stroked = false;
                            c.fill.type = "tile";
                            c.fillcolor = "none";
                            c.coordsize = d * 2 + "," + e * 2;
                            c.coordorigin = "1,1";
                            c.path = this.ya(0, 2);
                            g = c.style;
                            g.width = d;
                            g.height = e;
                            if (b.P === "linear-gradient") this.bd(c, b);
                            else {
                                c.fill.src = b.Ab;
                                this.Nd(c, j)
                            }
                        }
                    }
                    for (j = a ? a.length : 0; this.vb("bgImage" + j++););
                },
                Nd: function(a, b) {
                    var c = this;
                    f.p.Rb(a.fill.src, function(d) {
                        var e = c.e,
                            g = c.s.o(),
                            j = g.h;
                        g = g.f;
                        if (j && g) {
                            var i = a.fill,
                                h = c.g,
                                k = h.w.j(),
                                n = k && k.J;
                            k = n ? n.t.a(e) : 0;
                            var m = n ? n.r.a(e) : 0,
                                p = n ? n.b.a(e) : 0;
                            n = n ? n.l.a(e) : 0;
                            h = h.C.j().M[b];
                            e = h.$ ? h.$.coords(e, j - d.h - n - m, g - d.f - k - p) : {
                                x: 0,
                                y: 0
                            };
                            h = h.bb;
                            p = m = 0;
                            var r = j + 1,
                                t = g + 1,
                                v = f.O === 8 ? 0 : 1;
                            n = Math.round(e.x) + n + 0.5;
                            k = Math.round(e.y) + k + 0.5;
                            i.position = n / j + "," + k / g;
                            i.size.x = 1;
                            i.size = d.h + "px," + d.f + "px";
                            if (h && h !== "repeat") {
                                if (h === "repeat-x" || h === "no-repeat") {
                                    m = k + 1;
                                    t = k + d.f + v
                                }
                                if (h === "repeat-y" || h === "no-repeat") {
                                    p = n + 1;
                                    r = n + d.h + v
                                }
                                a.style.clip = "rect(" + m + "px," + r + "px," + t + "px," + p + "px)"
                            }
                        }
                    })
                },
                bd: function(a, b) {
                    var c = this.e,
                        d = this.s.o(),
                        e = d.h,
                        g = d.f;
                    a = a.fill;
                    d = b.ca;
                    var j = d.length,
                        i = Math.PI,
                        h = f.Na,
                        k = h.tc,
                        n = h.dc;
                    b = h.gc(c, e, g, b);
                    h = b.sa;
                    var m = b.xc,
                        p = b.yc,
                        r = b.Wd,
                        t = b.Xd,
                        v = b.rd,
                        l = b.sd,
                        q = b.kd,
                        s = b.ld;
                    b = b.rc;
                    e = h % 90 ? Math.atan2(q * e / g, s) / i * 180 : h + 90;
                    e += 180;
                    e %= 360;
                    v = k(r, t, h, v, l);
                    g = n(r, t, v[0], v[1]);
                    i = [];
                    v = k(m, p, h, r, t);
                    n = n(m, p, v[0], v[1]) / g * 100;
                    k = [];
                    for (h = 0; h < j; h++) k.push(d[h].db ? d[h].db.a(c, b) : h === 0 ? 0 : h === j - 1 ? b : null);
                    for (h = 1; h < j; h++) {
                        if (k[h] === null) {
                            m = k[h - 1];
                            b = h;
                            do p = k[++b]; while (p === null);
                            k[h] = m + (p - m) / (b - h + 1)
                        }
                        k[h] = Math.max(k[h], k[h - 1])
                    }
                    for (h = 0; h < j; h++) i.push(n + k[h] / g * 100 + "% " + d[h].color.U(c));
                    a.angle = e;
                    a.type = "gradient";
                    a.method = "sigma";
                    a.color = d[0].color.U(c);
                    a.color2 = d[j - 1].color.U(c);
                    if (a.colors) a.colors.value = i.join(",");
                    else a.colors = i.join(",")
                },
                lc: function() {
                    var a = this.e.runtimeStyle;
                    a.backgroundImage = "url(about:blank)";
                    a.backgroundColor = "transparent"
                },
                m: function() {
                    f.u.m.call(this);
                    var a = this.e.runtimeStyle;
                    a.backgroundImage = a.backgroundColor = ""
                }
            });
            f.Gc = f.u.R({
                N: 4,
                Ya: "border",
                Q: function() {
                    var a = this.g;
                    return a.w.H() || a.G.H()
                },
                i: function() {
                    var a = this.g;
                    return a.G.i() && !a.q.i() && a.w.i()
                },
                V: function() {
                    var a = this.e,
                        b = this.g.w.j(),
                        c = this.s.o(),
                        d = c.h;
                    c = c.f;
                    var e, g, j, i, h;
                    if (b) {
                        this.mc();
                        b = this.wd(2);
                        i = 0;
                        for (h = b.length; i < h; i++) {
                            j = b[i];
                            e = this.Aa("borderPiece" + i, j.stroke ? "stroke" : "fill", this.I());
                            e.coordsize = d * 2 + "," + c * 2;
                            e.coordorigin = "1,1";
                            e.path = j.path;
                            g = e.style;
                            g.width = d;
                            g.height = c;
                            e.filled = !!j.fill;
                            e.stroked = !!j.stroke;
                            if (j.stroke) {
                                e = e.stroke;
                                e.weight = j.Qb + "px";
                                e.color = j.color.U(a);
                                e.dashstyle = j.stroke === "dashed" ? "2 2" : j.stroke === "dotted" ? "1 1" : "solid";
                                e.linestyle = j.stroke === "double" && j.Qb > 2 ? "ThinThin" : "Single"
                            } else e.fill.color = j.fill.U(a)
                        }
                        for (; this.vb("borderPiece" + i++););
                    }
                },
                wd: function(a) {
                    var b = this.e,
                        c, d, e, g = this.g.w,
                        j = [],
                        i, h, k, n, m = Math.round,
                        p, r, t;
                    if (g.i()) {
                        c = g.j();
                        g = c.J;
                        r = c.Zd;
                        t = c.gd;
                        if (c.ee && c.$d && c.hd) {
                            if (t.t.fa() > 0) {
                                c = g.t.a(b);
                                k = c / 2;
                                j.push({
                                    path: this.ya({
                                        Jb: k,
                                        Ib: k,
                                        tb: k,
                                        Db: k
                                    }, a),
                                    stroke: r.t,
                                    color: t.t,
                                    Qb: c
                                })
                            }
                        } else {
                            a = a || 1;
                            c = this.s.o();
                            d = c.h;
                            e = c.f;
                            c = m(g.t.a(b));
                            k = m(g.r.a(b));
                            n = m(g.b.a(b));
                            b = m(g.l.a(b));
                            var v = {
                                t: c,
                                r: k,
                                b: n,
                                l: b
                            };
                            b = this.g.G;
                            if (b.i()) p = this.kc(b.j());
                            i = Math.floor;
                            h = Math.ceil;
                            var l = function(o, u) {
                                    return p ? p[o][u] : 0
                                },
                                q = function(o, u, x, y, z, B) {
                                    var E = l("x", o),
                                        D = l("y", o),
                                        C = o.charAt(1) === "r";
                                    o = o.charAt(0) === "b";
                                    return E > 0 && D > 0 ? (B ? "al" : "ae") + (C ? h(d - E) : i(E)) * a + "," + (o ? h(e - D) : i(D)) * a + "," + (i(E) - u) * a + "," + (i(D) - x) * a + "," + y * 65535 + "," + 2949075 * (z ? 1 : -1) : (B ? "m" : "l") + (C ? d - u : u) * a + "," + (o ? e - x : x) * a
                                },
                                s = function(o, u, x, y) {
                                    var z = o === "t" ? i(l("x", "tl")) * a + "," + h(u) * a : o === "r" ? h(d - u) * a + "," + i(l("y", "tr")) * a : o === "b" ? h(d - l("x", "br")) * a + "," + i(e - u) * a : i(u) * a + "," + h(e - l("y", "bl")) * a;
                                    o = o === "t" ? h(d - l("x", "tr")) * a + "," + h(u) * a : o === "r" ? h(d - u) * a + "," + h(e - l("y", "br")) * a : o === "b" ? i(l("x", "bl")) * a + "," + i(e - u) * a : i(u) * a + "," + i(l("y", "tl")) * a;
                                    return x ? (y ? "m" + o : "") + "l" + z : (y ? "m" + z : "") + "l" + o
                                };
                            b = function(o, u, x, y, z, B) {
                                var E = o === "l" || o === "r",
                                    D = v[o],
                                    C, F;
                                if (D > 0 && r[o] !== "none" && t[o].fa() > 0) {
                                    C = v[E ? o : u];
                                    u = v[E ? u : o];
                                    F = v[E ? o : x];
                                    x = v[E ? x : o];
                                    if (r[o] === "dashed" || r[o] === "dotted") {
                                        j.push({
                                            path: q(y, C, u, B + 45, 0, 1) + q(y, 0, 0, B, 1, 0),
                                            fill: t[o]
                                        });
                                        j.push({
                                            path: s(o, D / 2, 0, 1),
                                            stroke: r[o],
                                            Qb: D,
                                            color: t[o]
                                        });
                                        j.push({
                                            path: q(z, F, x, B, 0, 1) + q(z, 0, 0, B - 45, 1, 0),
                                            fill: t[o]
                                        })
                                    } else j.push({
                                        path: q(y, C, u, B + 45, 0, 1) + s(o, D, 0, 0) + q(z, F, x, B, 0, 0) + (r[o] === "double" && D > 2 ? q(z, F - i(F / 3), x - i(x / 3), B - 45, 1, 0) + s(o, h(D / 3 * 2), 1, 0) + q(y, C - i(C / 3), u - i(u / 3), B, 1, 0) + "x " + q(y, i(C / 3), i(u / 3), B + 45, 0, 1) + s(o, i(D / 3), 1, 0) + q(z, i(F / 3), i(x / 3), B, 0, 0) : "") + q(z, 0, 0, B - 45, 1, 0) + s(o, 0, 1, 0) + q(y, 0, 0, B, 1, 0),
                                        fill: t[o]
                                    })
                                }
                            };
                            b("t", "l", "r", "tl", "tr", 90);
                            b("r", "t", "b", "tr", "br", 0);
                            b("b", "r", "l", "br", "bl", -90);
                            b("l", "b", "t", "bl", "tl", -180)
                        }
                    }
                    return j
                },
                m: function() {
                    if (this.ec || !this.g.q.i()) this.e.runtimeStyle.borderColor = "";
                    f.u.m.call(this)
                }
            });
            f.Tb = f.u.R({
                N: 5,
                Md: ["t", "tr", "r", "br", "b", "bl", "l", "tl", "c"],
                Q: function() {
                    return this.g.q.H()
                },
                i: function() {
                    return this.g.q.i()
                },
                V: function() {
                    this.I();
                    var a = this.g.q.j(),
                        b = this.g.w.j(),
                        c = this.s.o(),
                        d = this.e,
                        e = this.uc;
                    f.p.Rb(a.src, function(g) {
                        function j(s, o, u, x, y) {
                            s = e[s].style;
                            var z = Math.max;
                            s.width = z(o, 0);
                            s.height = z(u, 0);
                            s.left = x;
                            s.top = y
                        }

                        function i(s, o, u) {
                            for (var x = 0, y = s.length; x < y; x++) e[s[x]].imagedata[o] = u
                        }
                        var h = c.h,
                            k = c.f,
                            n = f.n("0"),
                            m = a.J || (b ? b.J : {
                                t: n,
                                r: n,
                                b: n,
                                l: n
                            });
                        n = m.t.a(d);
                        var p = m.r.a(d),
                            r = m.b.a(d);
                        m = m.l.a(d);
                        var t = a.slice,
                            v = t.t.a(d),
                            l = t.r.a(d),
                            q = t.b.a(d);
                        t = t.l.a(d);
                        j("tl", m, n, 0, 0);
                        j("t", h - m - p, n, m, 0);
                        j("tr", p, n, h - p, 0);
                        j("r", p, k - n - r, h - p, n);
                        j("br", p, r, h - p, k - r);
                        j("b", h - m - p, r, m, k - r);
                        j("bl", m, r, 0, k - r);
                        j("l", m, k - n - r, 0, n);
                        j("c", h - m - p, k - n - r, m, n);
                        i(["tl", "t", "tr"], "cropBottom", (g.f - v) / g.f);
                        i(["tl", "l", "bl"], "cropRight", (g.h - t) / g.h);
                        i(["bl", "b", "br"], "cropTop", (g.f - q) / g.f);
                        i(["tr", "r", "br"], "cropLeft", (g.h - l) / g.h);
                        i(["l", "r", "c"], "cropTop", v / g.f);
                        i(["l", "r", "c"], "cropBottom", q / g.f);
                        i(["t", "b", "c"], "cropLeft", t / g.h);
                        i(["t", "b", "c"], "cropRight", l / g.h);
                        e.c.style.display = a.fill ? "" : "none"
                    }, this)
                },
                I: function() {
                    var a = this.parent.za(this.N),
                        b, c, d, e = this.Md,
                        g = e.length;
                    if (!a) {
                        a = doc.createElement("border-image");
                        b = a.style;
                        b.position = "absolute";
                        this.uc = {};
                        for (d = 0; d < g; d++) {
                            c = this.uc[e[d]] = f.p.Za("rect");
                            c.appendChild(f.p.Za("imagedata"));
                            b = c.style;
                            b.behavior = "url(#default#VML)";
                            b.position = "absolute";
                            b.top = b.left = 0;
                            c.imagedata.src = this.g.q.j().src;
                            c.stroked = false;
                            c.filled = false;
                            a.appendChild(c)
                        }
                        this.parent.sb(this.N, a)
                    }
                    return a
                },
                Ea: function() {
                    if (this.i()) {
                        var a = this.e,
                            b = a.runtimeStyle,
                            c = this.g.q.j().J;
                        b.borderStyle = "solid";
                        if (c) {
                            b.borderTopWidth = c.t.a(a) + "px";
                            b.borderRightWidth = c.r.a(a) + "px";
                            b.borderBottomWidth = c.b.a(a) + "px";
                            b.borderLeftWidth = c.l.a(a) + "px"
                        }
                        this.mc()
                    }
                },
                m: function() {
                    var a = this.e.runtimeStyle;
                    a.borderStyle = "";
                    if (this.ec || !this.g.w.i()) a.borderColor = a.borderWidth = "";
                    f.u.m.call(this)
                }
            });
            f.Hc = f.u.R({
                N: 1,
                Ya: "outset-box-shadow",
                Q: function() {
                    var a = this.g;
                    return a.ga.H() || a.G.H()
                },
                i: function() {
                    var a = this.g.ga;
                    return a.i() && a.j().Da[0]
                },
                V: function() {
                    function a(C, F, O, H, M, P, I) {
                        C = b.Aa("shadow" + C + F, "fill", d, j - C);
                        F = C.fill;
                        C.coordsize = n * 2 + "," + m * 2;
                        C.coordorigin = "1,1";
                        C.stroked = false;
                        C.filled = true;
                        F.color = M.U(c);
                        if (P) {
                            F.type = "gradienttitle";
                            F.color2 = F.color;
                            F.opacity = 0
                        }
                        C.path = I;
                        l = C.style;
                        l.left = O;
                        l.top = H;
                        l.width = n;
                        l.height = m;
                        return C
                    }
                    var b = this,
                        c = this.e,
                        d = this.I(),
                        e = this.g,
                        g = e.ga.j().Da;
                    e = e.G.j();
                    var j = g.length,
                        i = j,
                        h, k = this.s.o(),
                        n = k.h,
                        m = k.f;
                    k = f.O === 8 ? 1 : 0;
                    for (var p = ["tl", "tr", "br", "bl"], r, t, v, l, q, s, o, u, x, y, z, B, E, D; i--;) {
                        t = g[i];
                        q = t.fe.a(c);
                        s = t.ge.a(c);
                        h = t.Vd.a(c);
                        o = t.blur.a(c);
                        t = t.color;
                        u = -h - o;
                        if (!e && o) e = f.jb.Dc;
                        u = this.ya({
                            Jb: u,
                            Ib: u,
                            tb: u,
                            Db: u
                        }, 2, e);
                        if (o) {
                            x = (h + o) * 2 + n;
                            y = (h + o) * 2 + m;
                            z = x ? o * 2 / x : 0;
                            B = y ? o * 2 / y : 0;
                            if (o - h > n / 2 || o - h > m / 2)
                                for (h = 4; h--;) {
                                    r = p[h];
                                    E = r.charAt(0) === "b";
                                    D = r.charAt(1) === "r";
                                    r = a(i, r, q, s, t, o, u);
                                    v = r.fill;
                                    v.focusposition = (D ? 1 - z : z) + "," + (E ? 1 - B : B);
                                    v.focussize = "0,0";
                                    r.style.clip = "rect(" + ((E ? y / 2 : 0) + k) + "px," + (D ? x : x / 2) + "px," + (E ? y : y / 2) + "px," + ((D ? x / 2 : 0) + k) + "px)"
                                } else {
                                    r = a(i, "", q, s, t, o, u);
                                    v = r.fill;
                                    v.focusposition = z + "," + B;
                                    v.focussize = 1 - z * 2 + "," + (1 - B * 2)
                                }
                        } else {
                            r = a(i, "", q, s, t, o, u);
                            q = t.fa();
                            if (q < 1) r.fill.opacity = q
                        }
                    }
                }
            });
            f.Pc = f.u.R({
                N: 6,
                Ya: "imgEl",
                Q: function() {
                    var a = this.g;
                    return this.e.src !== this.Xc || a.G.H()
                },
                i: function() {
                    var a = this.g;
                    return a.G.i() || a.C.qc()
                },
                V: function() {
                    this.Xc = j;
                    this.Cd();
                    var a = this.Aa("img", "fill", this.I()),
                        b = a.fill,
                        c = this.s.o(),
                        d = c.h;
                    c = c.f;
                    var e = this.g.w.j(),
                        g = e && e.J;
                    e = this.e;
                    var j = e.src,
                        i = Math.round,
                        h = e.currentStyle,
                        k = f.n;
                    if (!g || f.O < 7) {
                        g = f.n("0");
                        g = {
                            t: g,
                            r: g,
                            b: g,
                            l: g
                        }
                    }
                    a.stroked = false;
                    b.type = "frame";
                    b.src = j;
                    b.position = (d ? 0.5 / d : 0) + "," + (c ? 0.5 / c : 0);
                    a.coordsize = d * 2 + "," + c * 2;
                    a.coordorigin = "1,1";
                    a.path = this.ya({
                        Jb: i(g.t.a(e) + k(h.paddingTop).a(e)),
                        Ib: i(g.r.a(e) + k(h.paddingRight).a(e)),
                        tb: i(g.b.a(e) + k(h.paddingBottom).a(e)),
                        Db: i(g.l.a(e) + k(h.paddingLeft).a(e))
                    }, 2);
                    a = a.style;
                    a.width = d;
                    a.height = c
                },
                Cd: function() {
                    this.e.runtimeStyle.filter = "alpha(opacity=0)"
                },
                m: function() {
                    f.u.m.call(this);
                    this.e.runtimeStyle.filter = ""
                }
            });
            f.Oc = f.u.R({
                ib: f.aa,
                Mb: f.aa,
                Nb: f.aa,
                Lb: f.aa,
                Ld: /^,+|,+$/g,
                Fd: /,+/g,
                gb: function(a, b) {
                    (this.pb || (this.pb = []))[a] = b || void 0
                },
                ab: function() {
                    var a = this.pb,
                        b;
                    if (a && (b = a.join(",").replace(this.Ld, "").replace(this.Fd, ",")) !== this.Wc) this.Wc = this.e.runtimeStyle.background = b
                },
                m: function() {
                    this.e.runtimeStyle.background = "";
                    delete this.pb
                }
            });
            f.Mc = f.u.R({
                ua: 1,
                Q: function() {
                    return this.g.C.H()
                },
                i: function() {
                    var a = this.g;
                    return a.C.i() || a.q.i()
                },
                V: function() {
                    var a = this.g.C.j(),
                        b, c, d = 0,
                        e, g;
                    if (a) {
                        b = [];
                        if (c = a.M)
                            for (; e = c[d++];)
                                if (e.P === "linear-gradient") {
                                    g = this.vd(e.Wa);
                                    g = (e.Xa || f.Ka.Kc).a(this.e, g.h, g.f, g.h, g.f);
                                    b.push("url(data:image/svg+xml," + escape(this.xd(e, g.h, g.f)) + ") " + this.dd(e.$) + " / " + g.h + "px " + g.f + "px " + (e.bc || "") + " " + (e.Wa || "") + " " + (e.ub || ""))
                                } else b.push(e.Hb);
                        a.color && b.push(a.color.Y);
                        this.parent.gb(this.ua, b.join(","))
                    }
                },
                dd: function(a) {
                    return a ? a.X.map(function(b) {
                        return b.d
                    }).join(" ") : "0 0"
                },
                vd: function(a) {
                    var b = this.e,
                        c = this.s.o(),
                        d = c.h;
                    c = c.f;
                    var e;
                    if (a !== "border-box")
                        if ((e = this.g.w.j()) && (e = e.J)) {
                            d -= e.l.a(b) + e.l.a(b);
                            c -= e.t.a(b) + e.b.a(b)
                        }
                    if (a === "content-box") {
                        a = f.n;
                        e = b.currentStyle;
                        d -= a(e.paddingLeft).a(b) + a(e.paddingRight).a(b);
                        c -= a(e.paddingTop).a(b) + a(e.paddingBottom).a(b)
                    }
                    return {
                        h: d,
                        f: c
                    }
                },
                xd: function(a, b, c) {
                    var d = this.e,
                        e = a.ca,
                        g = e.length,
                        j = f.Na.gc(d, b, c, a);
                    a = j.xc;
                    var i = j.yc,
                        h = j.td,
                        k = j.ud;
                    j = j.rc;
                    var n, m, p, r, t;
                    n = [];
                    for (m = 0; m < g; m++) n.push(e[m].db ? e[m].db.a(d, j) : m === 0 ? 0 : m === g - 1 ? j : null);
                    for (m = 1; m < g; m++)
                        if (n[m] === null) {
                            r = n[m - 1];
                            p = m;
                            do t = n[++p]; while (t === null);
                            n[m] = r + (t - r) / (p - m + 1)
                        }
                    b = ['<svg width="' + b + '" height="' + c + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="' + a / b * 100 + '%" y1="' + i / c * 100 + '%" x2="' + h / b * 100 + '%" y2="' + k / c * 100 + '%">'];
                    for (m = 0; m < g; m++) b.push('<stop offset="' + n[m] / j + '" stop-color="' + e[m].color.U(d) + '" stop-opacity="' + e[m].color.fa() + '"/>');
                    b.push('</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>');
                    return b.join("")
                },
                m: function() {
                    this.parent.gb(this.ua)
                }
            });
            f.Nc = f.u.R({
                T: "repeat",
                Sc: "stretch",
                Qc: "round",
                ua: 0,
                Q: function() {
                    return this.g.q.H()
                },
                i: function() {
                    return this.g.q.i()
                },
                V: function() {
                    var a = this,
                        b = a.g.q.j(),
                        c = a.g.w.j(),
                        d = a.s.o(),
                        e = b.repeat,
                        g = e.f,
                        j = e.Ob,
                        i = a.e,
                        h = 0;
                    f.p.Rb(b.src, function(k) {
                        function n(Q, R, U, V, W, Y, X, S, w, A) {
                            K.push('<pattern patternUnits="userSpaceOnUse" id="pattern' + G + '" x="' + (g === l ? Q + U / 2 - w / 2 : Q) + '" y="' + (j === l ? R + V / 2 - A / 2 : R) + '" width="' + w + '" height="' + A + '"><svg width="' + w + '" height="' + A + '" viewBox="' + W + " " + Y + " " + X + " " + S + '" preserveAspectRatio="none"><image xlink:href="' + v + '" x="0" y="0" width="' + r + '" height="' + t + '" /></svg></pattern>');
                            J.push('<rect x="' + Q + '" y="' + R + '" width="' + U + '" height="' + V + '" fill="url(#pattern' + G + ')" />');
                            G++
                        }
                        var m = d.h,
                            p = d.f,
                            r = k.h,
                            t = k.f,
                            v = a.Dd(b.src, r, t),
                            l = a.T,
                            q = a.Sc;
                        k = a.Qc;
                        var s = Math.ceil,
                            o = f.n("0"),
                            u = b.J || (c ? c.J : {
                                t: o,
                                r: o,
                                b: o,
                                l: o
                            });
                        o = u.t.a(i);
                        var x = u.r.a(i),
                            y = u.b.a(i);
                        u = u.l.a(i);
                        var z = b.slice,
                            B = z.t.a(i),
                            E = z.r.a(i),
                            D = z.b.a(i);
                        z = z.l.a(i);
                        var C = m - u - x,
                            F = p - o - y,
                            O = r - z - E,
                            H = t - B - D,
                            M = g === q ? C : O * o / B,
                            P = j === q ? F : H * x / E,
                            I = g === q ? C : O * y / D;
                        q = j === q ? F : H * u / z;
                        var K = [],
                            J = [],
                            G = 0;
                        if (g === k) {
                            M -= (M - (C % M || M)) / s(C / M);
                            I -= (I - (C % I || I)) / s(C / I)
                        }
                        if (j === k) {
                            P -= (P - (F % P || P)) / s(F / P);
                            q -= (q - (F % q || q)) / s(F / q)
                        }
                        k = ['<svg width="' + m + '" height="' + p + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'];
                        n(0, 0, u, o, 0, 0, z, B, u, o);
                        n(u, 0, C, o, z, 0, O, B, M, o);
                        n(m - x, 0, x, o, r - E, 0, E, B, x, o);
                        n(0, o, u, F, 0, B, z, H, u, q);
                        if (b.fill) n(u, o, C, F, z, B, O, H, M || I || O, q || P || H);
                        n(m - x, o, x, F, r - E, B, E, H, x, P);
                        n(0, p - y, u, y, 0, t - D, z, D, u, y);
                        n(u, p - y, C, y, z, t - D, O, D, I, y);
                        n(m - x, p - y, x, y, r - E, t - D, E, D, x, y);
                        k.push("<defs>" + K.join("\n") + "</defs>" + J.join("\n") + "</svg>");
                        a.parent.gb(a.ua, "url(data:image/svg+xml," + escape(k.join("")) + ") no-repeat border-box border-box");
                        h && a.parent.ab()
                    }, a);
                    h = 1
                },
                Dd: function() {
                    var a = {};
                    return function(b, c, d) {
                        var e = a[b],
                            g;
                        if (!e) {
                            e = new Image;
                            g = doc.createElement("canvas");
                            e.src = b;
                            g.width = c;
                            g.height = d;
                            g.getContext("2d").drawImage(e, 0, 0);
                            e = a[b] = g.toDataURL()
                        }
                        return e
                    }
                }(),
                Ea: f.Tb.prototype.Ea,
                m: function() {
                    var a = this.e.runtimeStyle;
                    this.parent.gb(this.ua);
                    a.borderColor = a.borderStyle = a.borderWidth = ""
                }
            });
            f.kb = function() {
                function a(l, q) {
                    l.className += " " + q
                }

                function b(l) {
                    var q = v.slice.call(arguments, 1),
                        s = q.length;
                    setTimeout(function() {
                        if (l)
                            for (; s--;) a(l, q[s])
                    }, 0)
                }

                function c(l) {
                    var q = v.slice.call(arguments, 1),
                        s = q.length;
                    setTimeout(function() {
                        if (l)
                            for (; s--;) {
                                var o = q[s];
                                o = t[o] || (t[o] = new RegExp("\\b" + o + "\\b", "g"));
                                l.className = l.className.replace(o, "")
                            }
                    }, 0)
                }

                function d(l) {
                    function q() {
                        if (!U) {
                            var w, A, L = f.ja,
                                T = l.currentStyle,
                                N = T.getAttribute(g) === "true",
                                da = T.getAttribute(i) !== "false",
                                ea = T.getAttribute(h) !== "false";
                            S = T.getAttribute(j);
                            S = L > 7 ? S !== "false" : S === "true";
                            if (!R) {
                                R = 1;
                                l.runtimeStyle.zoom = 1;
                                T = l;
                                for (var fa = 1; T = T.previousSibling;)
                                    if (T.nodeType === 1) {
                                        fa = 0;
                                        break
                                    }
                                fa && a(l, p)
                            }
                            J.cb();
                            if (N && (A = J.o()) && (w = doc.documentElement || doc.body) && (A.y > w.clientHeight || A.x > w.clientWidth || A.y + A.f < 0 || A.x + A.h < 0)) {
                                if (!Y) {
                                    Y = 1;
                                    f.mb.ba(q)
                                }
                            } else {
                                U = 1;
                                Y = R = 0;
                                f.mb.Ha(q);
                                if (L === 9) {
                                    G = {
                                        C: new f.Sb(l),
                                        q: new f.Ub(l),
                                        w: new f.Vb(l)
                                    };
                                    Q = [G.C, G.q];
                                    K = new f.Oc(l, J, G);
                                    w = [new f.Mc(l, J, G, K), new f.Nc(l, J, G, K)]
                                } else {
                                    G = {
                                        C: new f.Sb(l),
                                        w: new f.Vb(l),
                                        q: new f.Ub(l),
                                        G: new f.jb(l),
                                        ga: new f.Ic(l),
                                        Pb: new f.Uc(l)
                                    };
                                    Q = [G.C, G.w, G.q, G.G, G.ga, G.Pb];
                                    K = new f.Rc(l, J, G);
                                    w = [new f.Hc(l, J, G, K), new f.Fc(l, J, G, K), new f.Gc(l, J, G, K), new f.Tb(l, J, G, K)];
                                    l.tagName === "IMG" && w.push(new f.Pc(l, J, G, K));
                                    K.ed = w
                                }
                                I = [K].concat(w);
                                if (w = l.currentStyle.getAttribute(f.F + "watch-ancestors")) {
                                    w = parseInt(w, 10);
                                    A = 0;
                                    for (N = l.parentNode; N && (w === "NaN" || A++ < w);) {
                                        H(N, "onpropertychange", C);
                                        H(N, "onmouseenter", x);
                                        H(N, "onmouseleave", y);
                                        H(N, "onmousedown", z);
                                        if (N.tagName in f.fc) {
                                            H(N, "onfocus", E);
                                            H(N, "onblur", D)
                                        }
                                        N = N.parentNode
                                    }
                                }
                                if (S) {
                                    f.Oa.ba(o);
                                    f.Oa.Rd()
                                }
                                o(1)
                            }
                            if (!V) {
                                V = 1;
                                L < 9 && H(l, "onmove", s);
                                H(l, "onresize", s);
                                H(l, "onpropertychange", u);
                                ea && H(l, "onmouseenter", x);
                                if (ea || da) H(l, "onmouseleave", y);
                                da && H(l, "onmousedown", z);
                                if (l.tagName in f.fc) {
                                    H(l, "onfocus", E);
                                    H(l, "onblur", D)
                                }
                                f.Qa.ba(s);
                                f.L.ba(M)
                            }
                            J.hb()
                        }
                    }

                    function s() {
                        J && J.Ad() && o()
                    }

                    function o(w) {
                        if (!X)
                            if (U) {
                                var A, L = I.length;
                                F();
                                for (A = 0; A < L; A++) I[A].Ea();
                                if (w || J.Od())
                                    for (A = 0; A < L; A++) I[A].ib();
                                if (w || J.Td())
                                    for (A = 0; A < L; A++) I[A].Mb();
                                K.ab();
                                O()
                            } else R || q()
                    }

                    function u() {
                        var w, A = I.length,
                            L;
                        w = event;
                        if (!X && !(w && w.propertyName in r))
                            if (U) {
                                F();
                                for (w = 0; w < A; w++) I[w].Ea();
                                for (w = 0; w < A; w++) {
                                    L = I[w];
                                    L.Cb || L.ib();
                                    L.Q() && L.Lb()
                                }
                                K.ab();
                                O()
                            } else R || q()
                    }

                    function x() {
                        b(l, k)
                    }

                    function y() {
                        c(l, k, n)
                    }

                    function z() {
                        b(l, n);
                        f.lb.ba(B)
                    }

                    function B() {
                        c(l, n);
                        f.lb.Ha(B)
                    }

                    function E() {
                        b(l, m)
                    }

                    function D() {
                        c(l, m)
                    }

                    function C() {
                        var w = event.propertyName;
                        if (w === "className" || w === "id") u()
                    }

                    function F() {
                        J.cb();
                        for (var w = Q.length; w--;) Q[w].cb()
                    }

                    function O() {
                        for (var w = Q.length; w--;) Q[w].hb();
                        J.hb()
                    }

                    function H(w, A, L) {
                        w.attachEvent(A, L);
                        W.push([w, A, L])
                    }

                    function M() {
                        if (V) {
                            for (var w = W.length, A; w--;) {
                                A = W[w];
                                A[0].detachEvent(A[1], A[2])
                            }
                            f.L.Ha(M);
                            V = 0;
                            W = []
                        }
                    }

                    function P() {
                        if (!X) {
                            var w, A;
                            M();
                            X = 1;
                            if (I) {
                                w = 0;
                                for (A = I.length; w < A; w++) {
                                    I[w].ec = 1;
                                    I[w].m()
                                }
                            }
                            S && f.Oa.Ha(o);
                            f.Qa.Ha(o);
                            I = J = G = Q = l = null
                        }
                    }
                    var I, K, J = new ha(l),
                        G, Q, R, U, V, W = [],
                        Y, X, S;
                    this.Ed = q;
                    this.update = o;
                    this.m = P;
                    this.qd = l
                }
                var e = {},
                    g = f.F + "lazy-init",
                    j = f.F + "poll",
                    i = f.F + "track-active",
                    h = f.F + "track-hover",
                    k = f.La + "hover",
                    n = f.La + "active",
                    m = f.La + "focus",
                    p = f.La + "first-child",
                    r = {
                        background: 1,
                        bgColor: 1,
                        display: 1
                    },
                    t = {},
                    v = [];
                d.yd = function(l) {
                    var q = f.p.Ba(l);
                    return e[q] || (e[q] = new d(l))
                };
                d.m = function(l) {
                    l = f.p.Ba(l);
                    var q = e[l];
                    if (q) {
                        q.m();
                        delete e[l]
                    }
                };
                d.md = function() {
                    var l = [],
                        q;
                    if (e) {
                        for (var s in e)
                            if (e.hasOwnProperty(s)) {
                                q = e[s];
                                l.push(q.qd);
                                q.m()
                            }
                        e = {}
                    }
                    return l
                };
                return d
            }();
            f.supportsVML = f.zc;
            f.attach = function(a) {
                f.ja < 10 && f.zc && f.kb.yd(a).Ed()
            };
            f.detach = function(a) {
                f.kb.m(a)
            }
        };
    })();
};
/*!
 * ltIE9 placeholder - 2.0.8
 * https://github.com/mathiasbynens/jquery-placeholder
 */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof module && module.exports ? require("jquery") : jQuery)
}(function(a) {
    function b(b) {
        var c = {},
            d = /^jQuery\d+$/;
        return a.each(b.attributes, function(a, b) {
            b.specified && !d.test(b.name) && (c[b.name] = b.value)
        }), c
    }

    function c(b, c) {
        var d = this,
            f = a(d);
        if (d.value == f.attr("placeholder") && f.hasClass(m.customClass))
            if (f.data("placeholder-password")) {
                if (f = f.hide().nextAll('input[type="password"]:first').show().attr("id", f.removeAttr("id").data("placeholder-id")), b === !0) return f[0].value = c;
                f.focus()
            } else d.value = "", f.removeClass(m.customClass), d == e() && d.select()
    }

    function d() {
        var d, e = this,
            f = a(e),
            g = this.id;
        if ("" === e.value) {
            if ("password" === e.type) {
                if (!f.data("placeholder-textinput")) {
                    try {
                        d = f.clone().attr({
                            type: "text"
                        })
                    } catch (h) {
                        d = a("<input>").attr(a.extend(b(this), {
                            type: "text"
                        }))
                    }
                    d.removeAttr("name").data({
                        "placeholder-password": f,
                        "placeholder-id": g
                    }).bind("focus.placeholder", c), f.data({
                        "placeholder-textinput": d,
                        "placeholder-id": g
                    }).before(d)
                }
                f = f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id", g).show()
            }
            f.addClass(m.customClass), f[0].value = f.attr("placeholder")
        } else f.removeClass(m.customClass)
    }

    function e() {
        try {
            return document.activeElement
        } catch (a) {}
    }
    var f, g, h = "[object OperaMini]" == Object.prototype.toString.call(window.operamini),
        i = "placeholder" in document.createElement("input") && !h,
        j = "placeholder" in document.createElement("textarea") && !h,
        k = a.valHooks,
        l = a.propHooks;
    if (i && j) g = a.fn.placeholder = function() {
        return this
    }, g.input = g.textarea = !0;
    else {
        var m = {};
        g = a.fn.placeholder = function(b) {
            var e = {
                customClass: "placeholder"
            };
            m = a.extend({}, e, b);
            var f = this;
            return f.filter((i ? "textarea" : ":input") + "[placeholder]").not("." + m.customClass).bind({
                "focus.placeholder": c,
                "blur.placeholder": d
            }).data("placeholder-enabled", !0).trigger("blur.placeholder"), f
        }, g.input = i, g.textarea = j, f = {
            get: function(b) {
                var c = a(b),
                    d = c.data("placeholder-password");
                return d ? d[0].value : c.data("placeholder-enabled") && c.hasClass(m.customClass) ? "" : b.value
            },
            set: function(b, f) {
                var g = a(b),
                    h = g.data("placeholder-password");
                return h ? h[0].value = f : g.data("placeholder-enabled") ? ("" === f ? (b.value = f, b != e() && d.call(b)) : g.hasClass(m.customClass) ? c.call(b, !0, f) || (b.value = f) : b.value = f, g) : b.value = f
            }
        }, i || (k.input = f, l.value = f), j || (k.textarea = f, l.value = f), a(function() {
            a(document).delegate("form", "submit.placeholder", function() {
                var b = a("." + m.customClass, this).each(c);
                setTimeout(function() {
                    b.each(d)
                }, 10)
            })
        }), a(window).bind("beforeunload.placeholder", function() {
            a("." + m.customClass).each(function() {
                this.value = ""
            })
        })
    }
});
/*!
 * Semantic Select
 * http://wisniowski.pro
 */
(function($) {
    $.fn.semanticSelect = function() {
        $(this).each(function() {
            $(this).addClass('hidden').wrap('<div class="semantic-select-wrapper"></div>').after('<div class="semantic-select"><div class="input"><div class="text">' + $(this).children().first().html() + '</div><div class="ticker"></div></div><ul class="select-' + $(this).attr('id') + '"></ul></div>').find('option').each(function() {
                $(this).clone().appendTo($(this).parents('.semantic-select-wrapper').find('ul'))
            });
            if ($(this).children('option').size() > 7) {
                $(this).parents('.semantic-select-wrapper').find('.semantic-select').addClass('scrolled')
            }
        });
        $('.semantic-select').each(function() {
            if ($(this).find('[selected]').size()) {
                selectedText = $(this).find('[selected]').html();
                $(this).find('.text').html(selectedText)
            }
        });
        $('.semantic-select').children('.input').on('click', function() {
            if ($(this).parent().hasClass('active')) {
                $(this).parent().removeClass('active')
            } else {
                $('.semantic-select.active').removeClass('active');
                $(this).parent().addClass('active')
            }
        }).next().children('option').each(function() {
            if ($(this).is('[disabled]')) {
                $(this).replaceWith('<li class="hidden" data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            } else if ($(this).is('[selected]')) {
                $(this).replaceWith('<li class="active" data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            } else {
                $(this).replaceWith('<li data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            }
        });
        $('body').on('click touchstart', '.semantic-select', function(e) {
            e.stopPropagation()
        });
        $('body').on('click', '.semantic-select ul a', function() {
            $(this).parent('li').parent('ul').find('.active').removeClass('active');
            $(this).parent().addClass('active').parents('.semantic-select').removeClass('active').find('.text').text($(this).text()).parents('.semantic-select').addClass('selected').parents('.semantic-select-wrapper').find('select').attr('value', $(this).parents('.semantic-select-wrapper').find('select').children('option').attr('selected', false).prop('selected', false).parent().children(':eq(' + $(this).parents('ul').children('li').index($(this).parent()) + ')').attr('value')).children(':eq(' + $(this).parents('ul').children('li').index($(this).parent()) + ')').attr('selected', true).prop('selected', true).change().parents('form').addClass($(this).parent().attr('data-value') + '-chosen')
        }).parents('.semantic-select').find('ul').each(function() {
            if (!$(this).children('.active').size()) {
                $(this).children('li:first-child').addClass('active')
            }
        });
        $('html').on('click touchstart', function() {
            $('.semantic-select.active').removeClass('active')
        });
        $('.semantic-select-wrapper select').on('focus', function() {
            $(this).parent().children('.semantic-select').addClass('active')
        }).on('blur', function() {
            $(this).parent().children('.semantic-select').removeClass('active')
        });
        $('.semantic-select-wrapper select').keyup(function(e) {
            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90) {
                $(this).children('option:checked').click()
            }
        });
        $('.semantic-select-wrapper select option:not([disabled])').on('click', function() {
            $(this).parents('.semantic-select-wrapper').find('ul').children(':eq(' + $(this).index() + ')').children('a').click()
        })
    };
    $.fn.semanticSelectReload = function() {
        $(this).parents('.semantic-select-wrapper').find('ul').find('li').remove();
        $(this).find('option').each(function() {
            $(this).clone().appendTo($(this).parents('.semantic-select-wrapper').find('ul'))
        });
        $(this).parents('.semantic-select-wrapper').find('ul').find('option').each(function() {
            if ($(this).is('[disabled]')) {
                $(this).replaceWith('<li class="hidden" data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            } else if ($(this).is('[selected]')) {
                $(this).replaceWith('<li class="active" data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            } else {
                $(this).replaceWith('<li data-value="' + $(this).attr('value') + '"><a>' + $(this).text() + '</a></li>')
            }
        });
        if ($(this).children('option').size() > 7) {
            $(this).parents('.semantic-select-wrapper').find('.semantic-select').addClass('scrolled')
        }
    }
})(jQuery);
/*!
 * jQuery bxSlider - 4.1.2
 * http://bxslider.com
 */
! function(t) {
    var e = {},
        s = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "Next",
            prevText: "Prev",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "Start",
            stopText: "Stop",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4e3,
            autoStart: !0,
            autoDirection: "next",
            autoHover: !1,
            autoDelay: 0,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            onSliderLoad: function() {},
            onSlideBefore: function() {},
            onSlideAfter: function() {},
            onSlideNext: function() {},
            onSlidePrev: function() {},
            onSliderResize: function() {}
        };
    t.fn.bxSlider = function(n) {
        if (0 == this.length) return this;
        if (this.length > 1) return this.each(function() {
            t(this).bxSlider(n)
        }), this;
        var o = {},
            r = this;
        e.el = this;
        var a = t(window).width(),
            l = t(window).height(),
            d = function() {
                o.settings = t.extend({}, s, n), o.settings.slideWidth = parseInt(o.settings.slideWidth), o.children = r.children(o.settings.slideSelector), o.children.length < o.settings.minSlides && (o.settings.minSlides = o.children.length), o.children.length < o.settings.maxSlides && (o.settings.maxSlides = o.children.length), o.settings.randomStart && (o.settings.startSlide = Math.floor(Math.random() * o.children.length)), o.active = {
                    index: o.settings.startSlide
                }, o.carousel = o.settings.minSlides > 1 || o.settings.maxSlides > 1, o.carousel && (o.settings.preloadImages = "all"), o.minThreshold = o.settings.minSlides * o.settings.slideWidth + (o.settings.minSlides - 1) * o.settings.slideMargin, o.maxThreshold = o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin, o.working = !1, o.controls = {}, o.interval = null, o.animProp = "vertical" == o.settings.mode ? "top" : "left", o.usingCSS = o.settings.useCSS && "fade" != o.settings.mode && function() {
                    var t = document.createElement("div"),
                        e = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var i in e)
                        if (void 0 !== t.style[e[i]]) return o.cssPrefix = e[i].replace("Perspective", "").toLowerCase(), o.animProp = "-" + o.cssPrefix + "-transform", !0;
                    return !1
                }(), "vertical" == o.settings.mode && (o.settings.maxSlides = o.settings.minSlides), r.data("origStyle", r.attr("style")), r.children(o.settings.slideSelector).each(function() {
                    t(this).data("origStyle", t(this).attr("style"))
                }), c()
            },
            c = function() {
                r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'), o.viewport = r.parent(), o.loader = t('<div class="bx-loading" />'), o.viewport.prepend(o.loader), r.css({
                    width: "horizontal" == o.settings.mode ? 100 * o.children.length + 215 + "%" : "auto",
                    position: "relative"
                }), o.usingCSS && o.settings.easing ? r.css("-" + o.cssPrefix + "-transition-timing-function", o.settings.easing) : o.settings.easing || (o.settings.easing = "swing"), f(), o.viewport.css({
                    width: "100%",
                    overflow: "hidden",
                    position: "relative"
                }), o.viewport.parent().css({
                    maxWidth: p()
                }), o.settings.pager || o.viewport.parent().css({
                    margin: "0 auto 0px"
                }), o.children.css({
                    "float": "horizontal" == o.settings.mode ? "left" : "none",
                    listStyle: "none",
                    position: "relative"
                }), o.children.css("width", u()), "horizontal" == o.settings.mode && o.settings.slideMargin > 0 && o.children.css("marginRight", o.settings.slideMargin), "vertical" == o.settings.mode && o.settings.slideMargin > 0 && o.children.css("marginBottom", o.settings.slideMargin), "fade" == o.settings.mode && (o.children.css({
                    position: "absolute",
                    zIndex: 0,
                    display: "none"
                }), o.children.eq(o.settings.startSlide).css({
                    zIndex: o.settings.slideZIndex,
                    display: "block"
                })), o.controls.el = t('<div class="bx-controls" />'), o.settings.captions && P(), o.active.last = o.settings.startSlide == x() - 1, o.settings.video && r.fitVids();
                var e = o.children.eq(o.settings.startSlide);
                "all" == o.settings.preloadImages && (e = o.children), o.settings.ticker ? o.settings.pager = !1 : (o.settings.pager && T(), o.settings.controls && C(), o.settings.auto && o.settings.autoControls && E(), (o.settings.controls || o.settings.autoControls || o.settings.pager) && o.viewport.after(o.controls.el)), g(e, h)
            },
            g = function(e, i) {
                var s = e.find("img, iframe").length;
                if (0 == s) return i(), void 0;
                var n = 0;
                e.find("img, iframe").each(function() {
                    t(this).one("load", function() {
                        ++n == s && i()
                    }).each(function() {
                        this.complete && t(this).load()
                    })
                })
            },
            h = function() {
                if (o.settings.infiniteLoop && "fade" != o.settings.mode && !o.settings.ticker) {
                    var e = "vertical" == o.settings.mode ? o.settings.minSlides : o.settings.maxSlides,
                        i = o.children.slice(0, e).clone().addClass("bx-clone"),
                        s = o.children.slice(-e).clone().addClass("bx-clone");
                    r.append(i).prepend(s)
                }
                o.loader.remove(), S(), "vertical" == o.settings.mode && (o.settings.adaptiveHeight = !0), o.viewport.height(v()), r.redrawSlider(), o.settings.onSliderLoad(o.active.index), o.initialized = !0, o.settings.responsive && t(window).bind("resize", Z), o.settings.auto && o.settings.autoStart && H(), o.settings.ticker && L(), o.settings.pager && q(o.settings.startSlide), o.settings.controls && W(), o.settings.touchEnabled && !o.settings.ticker && O()
            },
            v = function() {
                var e = 0,
                    s = t();
                if ("vertical" == o.settings.mode || o.settings.adaptiveHeight)
                    if (o.carousel) {
                        var n = 1 == o.settings.moveSlides ? o.active.index : o.active.index * m();
                        for (s = o.children.eq(n), i = 1; i <= o.settings.maxSlides - 1; i++) s = n + i >= o.children.length ? s.add(o.children.eq(i - 1)) : s.add(o.children.eq(n + i))
                    } else s = o.children.eq(o.active.index);
                else s = o.children;
                return "vertical" == o.settings.mode ? (s.each(function() {
                    e += t(this).outerHeight()
                }), o.settings.slideMargin > 0 && (e += o.settings.slideMargin * (o.settings.minSlides - 1))) : e = Math.max.apply(Math, s.map(function() {
                    return t(this).outerHeight(!1)
                }).get()), e
            },
            p = function() {
                var t = "100%";
                return o.settings.slideWidth > 0 && (t = "horizontal" == o.settings.mode ? o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin : o.settings.slideWidth), t
            },
            u = function() {
                var t = o.settings.slideWidth,
                    e = o.viewport.width();
                return 0 == o.settings.slideWidth || o.settings.slideWidth > e && !o.carousel || "vertical" == o.settings.mode ? t = e : o.settings.maxSlides > 1 && "horizontal" == o.settings.mode && (e > o.maxThreshold || e < o.minThreshold && (t = (e - o.settings.slideMargin * (o.settings.minSlides - 1)) / o.settings.minSlides)), t
            },
            f = function() {
                var t = 1;
                if ("horizontal" == o.settings.mode && o.settings.slideWidth > 0)
                    if (o.viewport.width() < o.minThreshold) t = o.settings.minSlides;
                    else if (o.viewport.width() > o.maxThreshold) t = o.settings.maxSlides;
                else {
                    var e = o.children.first().width();
                    t = Math.floor(o.viewport.width() / e)
                } else "vertical" == o.settings.mode && (t = o.settings.minSlides);
                return t
            },
            x = function() {
                var t = 0;
                if (o.settings.moveSlides > 0)
                    if (o.settings.infiniteLoop) t = o.children.length / m();
                    else
                        for (var e = 0, i = 0; e < o.children.length;) ++t, e = i + f(), i += o.settings.moveSlides <= f() ? o.settings.moveSlides : f();
                else t = Math.ceil(o.children.length / f());
                return t
            },
            m = function() {
                return o.settings.moveSlides > 0 && o.settings.moveSlides <= f() ? o.settings.moveSlides : f()
            },
            S = function() {
                if (o.children.length > o.settings.maxSlides && o.active.last && !o.settings.infiniteLoop) {
                    if ("horizontal" == o.settings.mode) {
                        var t = o.children.last(),
                            e = t.position();
                        b(-(e.left - (o.viewport.width() - t.width())), "reset", 0)
                    } else if ("vertical" == o.settings.mode) {
                        var i = o.children.length - o.settings.minSlides,
                            e = o.children.eq(i).position();
                        b(-e.top, "reset", 0)
                    }
                } else {
                    var e = o.children.eq(o.active.index * m()).position();
                    o.active.index == x() - 1 && (o.active.last = !0), void 0 != e && ("horizontal" == o.settings.mode ? b(-e.left, "reset", 0) : "vertical" == o.settings.mode && b(-e.top, "reset", 0))
                }
            },
            b = function(t, e, i, s) {
                if (o.usingCSS) {
                    var n = "vertical" == o.settings.mode ? "translate3d(0, " + t + "px, 0)" : "translate3d(" + t + "px, 0, 0)";
                    r.css("-" + o.cssPrefix + "-transition-duration", i / 1e3 + "s"), "slide" == e ? (r.css(o.animProp, n), r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), D()
                    })) : "reset" == e ? r.css(o.animProp, n) : "ticker" == e && (r.css("-" + o.cssPrefix + "-transition-timing-function", "linear"), r.css(o.animProp, n), r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), b(s.resetValue, "reset", 0), N()
                    }))
                } else {
                    var a = {};
                    a[o.animProp] = t, "slide" == e ? r.animate(a, i, o.settings.easing, function() {
                        D()
                    }) : "reset" == e ? r.css(o.animProp, t) : "ticker" == e && r.animate(a, speed, "linear", function() {
                        b(s.resetValue, "reset", 0), N()
                    })
                }
            },
            w = function() {
                for (var e = "", i = x(), s = 0; i > s; s++) {
                    var n = "";
                    o.settings.buildPager && t.isFunction(o.settings.buildPager) ? (n = o.settings.buildPager(s), o.pagerEl.addClass("bx-custom-pager")) : (n = s + 1, o.pagerEl.addClass("bx-default-pager")), e += '<div class="bx-pager-item"><a href="" data-slide-index="' + s + '" class="bx-pager-link">' + n + "</a></div>"
                }
                o.pagerEl.html(e)
            },
            T = function() {
                o.settings.pagerCustom ? o.pagerEl = t(o.settings.pagerCustom) : (o.pagerEl = t('<div class="bx-pager" />'), o.settings.pagerSelector ? t(o.settings.pagerSelector).html(o.pagerEl) : o.controls.el.addClass("bx-has-pager").append(o.pagerEl), w()), o.pagerEl.on("click", "a", I)
            },
            C = function() {
                o.controls.next = t('<a class="bx-next" href="">' + o.settings.nextText + "</a>"), o.controls.prev = t('<a class="bx-prev" href="">' + o.settings.prevText + "</a>"), o.controls.next.bind("click", y), o.controls.prev.bind("click", z), o.settings.nextSelector && t(o.settings.nextSelector).append(o.controls.next), o.settings.prevSelector && t(o.settings.prevSelector).append(o.controls.prev), o.settings.nextSelector || o.settings.prevSelector || (o.controls.directionEl = t('<div class="bx-controls-direction" />'), o.controls.directionEl.append(o.controls.prev).append(o.controls.next), o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))
            },
            E = function() {
                o.controls.start = t('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + o.settings.startText + "</a></div>"), o.controls.stop = t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + o.settings.stopText + "</a></div>"), o.controls.autoEl = t('<div class="bx-controls-auto" />'), o.controls.autoEl.on("click", ".bx-start", k), o.controls.autoEl.on("click", ".bx-stop", M), o.settings.autoControlsCombine ? o.controls.autoEl.append(o.controls.start) : o.controls.autoEl.append(o.controls.start).append(o.controls.stop), o.settings.autoControlsSelector ? t(o.settings.autoControlsSelector).html(o.controls.autoEl) : o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl), A(o.settings.autoStart ? "stop" : "start")
            },
            P = function() {
                o.children.each(function() {
                    var e = t(this).find("img:first").attr("title");
                    void 0 != e && ("" + e).length && t(this).append('<div class="bx-caption"><span>' + e + "</span></div>")
                })
            },
            y = function(t) {
                o.settings.auto && r.stopAuto(), r.goToNextSlide(), t.preventDefault()
            },
            z = function(t) {
                o.settings.auto && r.stopAuto(), r.goToPrevSlide(), t.preventDefault()
            },
            k = function(t) {
                r.startAuto(), t.preventDefault()
            },
            M = function(t) {
                r.stopAuto(), t.preventDefault()
            },
            I = function(e) {
                o.settings.auto && r.stopAuto();
                var i = t(e.currentTarget),
                    s = parseInt(i.attr("data-slide-index"));
                s != o.active.index && r.goToSlide(s), e.preventDefault()
            },
            q = function(e) {
                var i = o.children.length;
                return "short" == o.settings.pagerType ? (o.settings.maxSlides > 1 && (i = Math.ceil(o.children.length / o.settings.maxSlides)), o.pagerEl.html(e + 1 + o.settings.pagerShortSeparator + i), void 0) : (o.pagerEl.find("a").removeClass("active"), o.pagerEl.each(function(i, s) {
                    t(s).find("a").eq(e).addClass("active")
                }), void 0)
            },
            D = function() {
                if (o.settings.infiniteLoop) {
                    var t = "";
                    0 == o.active.index ? t = o.children.eq(0).position() : o.active.index == x() - 1 && o.carousel ? t = o.children.eq((x() - 1) * m()).position() : o.active.index == o.children.length - 1 && (t = o.children.eq(o.children.length - 1).position()), t && ("horizontal" == o.settings.mode ? b(-t.left, "reset", 0) : "vertical" == o.settings.mode && b(-t.top, "reset", 0))
                }
                o.working = !1, o.settings.onSlideAfter(o.children.eq(o.active.index), o.oldIndex, o.active.index)
            },
            A = function(t) {
                o.settings.autoControlsCombine ? o.controls.autoEl.html(o.controls[t]) : (o.controls.autoEl.find("a").removeClass("active"), o.controls.autoEl.find("a:not(.bx-" + t + ")").addClass("active"))
            },
            W = function() {
                1 == x() ? (o.controls.prev.addClass("disabled"), o.controls.next.addClass("disabled")) : !o.settings.infiniteLoop && o.settings.hideControlOnEnd && (0 == o.active.index ? (o.controls.prev.addClass("disabled"), o.controls.next.removeClass("disabled")) : o.active.index == x() - 1 ? (o.controls.next.addClass("disabled"), o.controls.prev.removeClass("disabled")) : (o.controls.prev.removeClass("disabled"), o.controls.next.removeClass("disabled")))
            },
            H = function() {
                o.settings.autoDelay > 0 ? setTimeout(r.startAuto, o.settings.autoDelay) : r.startAuto(), o.settings.autoHover && r.hover(function() {
                    o.interval && (r.stopAuto(!0), o.autoPaused = !0)
                }, function() {
                    o.autoPaused && (r.startAuto(!0), o.autoPaused = null)
                })
            },
            L = function() {
                var e = 0;
                if ("next" == o.settings.autoDirection) r.append(o.children.clone().addClass("bx-clone"));
                else {
                    r.prepend(o.children.clone().addClass("bx-clone"));
                    var i = o.children.first().position();
                    e = "horizontal" == o.settings.mode ? -i.left : -i.top
                }
                b(e, "reset", 0), o.settings.pager = !1, o.settings.controls = !1, o.settings.autoControls = !1, o.settings.tickerHover && !o.usingCSS && o.viewport.hover(function() {
                    r.stop()
                }, function() {
                    var e = 0;
                    o.children.each(function() {
                        e += "horizontal" == o.settings.mode ? t(this).outerWidth(!0) : t(this).outerHeight(!0)
                    });
                    var i = o.settings.speed / e,
                        s = "horizontal" == o.settings.mode ? "left" : "top",
                        n = i * (e - Math.abs(parseInt(r.css(s))));
                    N(n)
                }), N()
            },
            N = function(t) {
                speed = t ? t : o.settings.speed;
                var e = {
                        left: 0,
                        top: 0
                    },
                    i = {
                        left: 0,
                        top: 0
                    };
                "next" == o.settings.autoDirection ? e = r.find(".bx-clone").first().position() : i = o.children.first().position();
                var s = "horizontal" == o.settings.mode ? -e.left : -e.top,
                    n = "horizontal" == o.settings.mode ? -i.left : -i.top,
                    a = {
                        resetValue: n
                    };
                b(s, "ticker", speed, a)
            },
            O = function() {
                o.touch = {
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    }
                }, o.viewport.bind("touchstart", X)
            },
            X = function(t) {
                if (o.working) t.preventDefault();
                else {
                    o.touch.originalPos = r.position();
                    var e = t.originalEvent;
                    o.touch.start.x = e.changedTouches[0].pageX, o.touch.start.y = e.changedTouches[0].pageY, o.viewport.bind("touchmove", Y), o.viewport.bind("touchend", V)
                }
            },
            Y = function(t) {
                var e = t.originalEvent,
                    i = Math.abs(e.changedTouches[0].pageX - o.touch.start.x),
                    s = Math.abs(e.changedTouches[0].pageY - o.touch.start.y);
                if (3 * i > s && o.settings.preventDefaultSwipeX ? t.preventDefault() : 3 * s > i && o.settings.preventDefaultSwipeY && t.preventDefault(), "fade" != o.settings.mode && o.settings.oneToOneTouch) {
                    var n = 0;
                    if ("horizontal" == o.settings.mode) {
                        var r = e.changedTouches[0].pageX - o.touch.start.x;
                        n = o.touch.originalPos.left + r
                    } else {
                        var r = e.changedTouches[0].pageY - o.touch.start.y;
                        n = o.touch.originalPos.top + r
                    }
                    b(n, "reset", 0)
                }
            },
            V = function(t) {
                o.viewport.unbind("touchmove", Y);
                var e = t.originalEvent,
                    i = 0;
                if (o.touch.end.x = e.changedTouches[0].pageX, o.touch.end.y = e.changedTouches[0].pageY, "fade" == o.settings.mode) {
                    var s = Math.abs(o.touch.start.x - o.touch.end.x);
                    s >= o.settings.swipeThreshold && (o.touch.start.x > o.touch.end.x ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto())
                } else {
                    var s = 0;
                    "horizontal" == o.settings.mode ? (s = o.touch.end.x - o.touch.start.x, i = o.touch.originalPos.left) : (s = o.touch.end.y - o.touch.start.y, i = o.touch.originalPos.top), !o.settings.infiniteLoop && (0 == o.active.index && s > 0 || o.active.last && 0 > s) ? b(i, "reset", 200) : Math.abs(s) >= o.settings.swipeThreshold ? (0 > s ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto()) : b(i, "reset", 200)
                }
                o.viewport.unbind("touchend", V)
            },
            Z = function() {
                var e = t(window).width(),
                    i = t(window).height();
                (a != e || l != i) && (a = e, l = i, r.redrawSlider(), o.settings.onSliderResize.call(r, o.active.index))
            };
        return r.goToSlide = function(e, i) {
            if (!o.working && o.active.index != e)
                if (o.working = !0, o.oldIndex = o.active.index, o.active.index = 0 > e ? x() - 1 : e >= x() ? 0 : e, o.settings.onSlideBefore(o.children.eq(o.active.index), o.oldIndex, o.active.index), "next" == i ? o.settings.onSlideNext(o.children.eq(o.active.index), o.oldIndex, o.active.index) : "prev" == i && o.settings.onSlidePrev(o.children.eq(o.active.index), o.oldIndex, o.active.index), o.active.last = o.active.index >= x() - 1, o.settings.pager && q(o.active.index), o.settings.controls && W(), "fade" == o.settings.mode) o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({
                    height: v()
                }, o.settings.adaptiveHeightSpeed), o.children.filter(":visible").fadeOut(o.settings.speed).css({
                    zIndex: 0
                }), o.children.eq(o.active.index).css("zIndex", o.settings.slideZIndex + 1).fadeIn(o.settings.speed, function() {
                    t(this).css("zIndex", o.settings.slideZIndex), D()
                });
                else {
                    o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({
                        height: v()
                    }, o.settings.adaptiveHeightSpeed);
                    var s = 0,
                        n = {
                            left: 0,
                            top: 0
                        };
                    if (!o.settings.infiniteLoop && o.carousel && o.active.last)
                        if ("horizontal" == o.settings.mode) {
                            var a = o.children.eq(o.children.length - 1);
                            n = a.position(), s = o.viewport.width() - a.outerWidth()
                        } else {
                            var l = o.children.length - o.settings.minSlides;
                            n = o.children.eq(l).position()
                        } else if (o.carousel && o.active.last && "prev" == i) {
                        var d = 1 == o.settings.moveSlides ? o.settings.maxSlides - m() : (x() - 1) * m() - (o.children.length - o.settings.maxSlides),
                            a = r.children(".bx-clone").eq(d);
                        n = a.position()
                    } else if ("next" == i && 0 == o.active.index) n = r.find("> .bx-clone").eq(o.settings.maxSlides).position(), o.active.last = !1;
                    else if (e >= 0) {
                        var c = e * m();
                        n = o.children.eq(c).position()
                    }
                    if ("undefined" != typeof n) {
                        var g = "horizontal" == o.settings.mode ? -(n.left - s) : -n.top;
                        b(g, "slide", o.settings.speed)
                    }
                }
        }, r.goToNextSlide = function() {
            if (o.settings.infiniteLoop || !o.active.last) {
                var t = parseInt(o.active.index) + 1;
                r.goToSlide(t, "next")
            }
        }, r.goToPrevSlide = function() {
            if (o.settings.infiniteLoop || 0 != o.active.index) {
                var t = parseInt(o.active.index) - 1;
                r.goToSlide(t, "prev")
            }
        }, r.startAuto = function(t) {
            o.interval || (o.interval = setInterval(function() {
                "next" == o.settings.autoDirection ? r.goToNextSlide() : r.goToPrevSlide()
            }, o.settings.pause), o.settings.autoControls && 1 != t && A("stop"))
        }, r.stopAuto = function(t) {
            o.interval && (clearInterval(o.interval), o.interval = null, o.settings.autoControls && 1 != t && A("start"))
        }, r.getCurrentSlide = function() {
            return o.active.index
        }, r.getCurrentSlideElement = function() {
            return o.children.eq(o.active.index)
        }, r.getSlideCount = function() {
            return o.children.length
        }, r.redrawSlider = function() {
            o.children.add(r.find(".bx-clone")).outerWidth(u()), o.viewport.css("height", v()), o.settings.ticker || S(), o.active.last && (o.active.index = x() - 1), o.active.index >= x() && (o.active.last = !0), o.settings.pager && !o.settings.pagerCustom && (w(), q(o.active.index))
        }, r.destroySlider = function() {
            o.initialized && (o.initialized = !1, t(".bx-clone", this).remove(), o.children.each(function() {
                void 0 != t(this).data("origStyle") ? t(this).attr("style", t(this).data("origStyle")) : t(this).removeAttr("style")
            }), void 0 != t(this).data("origStyle") ? this.attr("style", t(this).data("origStyle")) : t(this).removeAttr("style"), t(this).unwrap().unwrap(), o.controls.el && o.controls.el.remove(), o.controls.next && o.controls.next.remove(), o.controls.prev && o.controls.prev.remove(), o.pagerEl && o.settings.controls && o.pagerEl.remove(), t(".bx-caption", this).remove(), o.controls.autoEl && o.controls.autoEl.remove(), clearInterval(o.interval), o.settings.responsive && t(window).unbind("resize", Z))
        }, r.reloadSlider = function(t) {
            void 0 != t && (n = t), r.destroySlider(), d()
        }, d(), this
    }
}(jQuery);
/*!
 * MouseWheel - 3.0.6
 * http://brandonaaron.net
 */
(function(d) {
    function e(a) {
        var b = a || window.event,
            c = [].slice.call(arguments, 1),
            f = 0,
            e = 0,
            g = 0,
            a = d.event.fix(b);
        a.type = "mousewheel";
        b.wheelDelta && (f = b.wheelDelta / 120);
        b.detail && (f = -b.detail / 3);
        g = f;
        b.axis !== void 0 && b.axis === b.HORIZONTAL_AXIS && (g = 0, e = -1 * f);
        b.wheelDeltaY !== void 0 && (g = b.wheelDeltaY / 120);
        b.wheelDeltaX !== void 0 && (e = -1 * b.wheelDeltaX / 120);
        c.unshift(a, f, e, g);
        return (d.event.dispatch || d.event.handle).apply(this, c)
    }
    var c = ["DOMMouseScroll", "mousewheel"];
    if (d.event.fixHooks)
        for (var h = c.length; h;) d.event.fixHooks[c[--h]] = d.event.mouseHooks;
    d.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var a = c.length; a;) this.addEventListener(c[--a], e, false);
            else this.onmousewheel = e
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var a = c.length; a;) this.removeEventListener(c[--a], e, false);
            else this.onmousewheel = null
        }
    };
    d.fn.extend({
        mousewheel: function(a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        },
        unmousewheel: function(a) {
            return this.unbind("mousewheel", a)
        }
    })
})(jQuery);
/*!
 * FancyBox - 2.1.5
 * http://fancyapps.com
 */
(function(r, G, f, v) {
    var J = f("html"),
        n = f(r),
        p = f(G),
        b = f.fancybox = function() {
            b.open.apply(this, arguments)
        },
        I = navigator.userAgent.match(/msie/i),
        B = null,
        s = G.createTouch !== v,
        t = function(a) {
            return a && a.hasOwnProperty && a instanceof f
        },
        q = function(a) {
            return a && "string" === f.type(a)
        },
        E = function(a) {
            return q(a) && 0 < a.indexOf("%")
        },
        l = function(a, d) {
            var e = parseInt(a, 10) || 0;
            d && E(a) && (e *= b.getViewport()[d] / 100);
            return Math.ceil(e)
        },
        w = function(a, b) {
            return l(a, b) + "px"
        };
    f.extend(b, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !s,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: 0.5,
            leftRatio: 0.5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3E3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (I ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: f.noop,
            beforeLoad: f.noop,
            afterLoad: f.noop,
            beforeShow: f.noop,
            afterShow: f.noop,
            beforeChange: f.noop,
            beforeClose: f.noop,
            afterClose: f.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(a, d) {
            if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0))) return f.isArray(a) || (a = t(a) ? f(a).get() : [a]), f.each(a, function(e, c) {
                var k = {},
                    g, h, j, m, l;
                "object" === f.type(c) && (c.nodeType && (c = f(c)), t(c) ? (k = {
                    href: c.data("fancybox-href") || c.attr("href"),
                    title: c.data("fancybox-title") || c.attr("title"),
                    isDom: !0,
                    element: c
                }, f.metadata && f.extend(!0, k, c.metadata())) : k = c);
                g = d.href || k.href || (q(c) ? c : null);
                h = d.title !== v ? d.title : k.title || "";
                m = (j = d.content || k.content) ? "html" : d.type || k.type;
                !m && k.isDom && (m = c.data("fancybox-type"), m || (m = (m = c.prop("class").match(/fancybox\.(\w+)/)) ? m[1] : null));
                q(g) && (m || (b.isImage(g) ? m = "image" : b.isSWF(g) ? m = "swf" : "#" === g.charAt(0) ? m = "inline" : q(c) && (m = "html", j = c)), "ajax" === m && (l = g.split(/\s+/, 2), g = l.shift(), l = l.shift()));
                j || ("inline" === m ? g ? j = f(q(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : k.isDom && (j = c) : "html" === m ? j = g : !m && (!g && k.isDom) && (m = "inline", j = c));
                f.extend(k, {
                    href: g,
                    type: m,
                    content: j,
                    title: h,
                    selector: l
                });
                a[e] = k
            }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== v && (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1), b.group = a, b._start(b.opts.index)
        },
        cancel: function() {
            var a = b.coming;
            a && !1 !== b.trigger("onCancel") && (b.hideLoading(), b.ajaxLoad && b.ajaxLoad.abort(), b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), b.coming = null, b.current || b._afterZoomOut(a))
        },
        close: function(a) {
            b.cancel();
            !1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (!b.isOpen || !0 === a ? (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), b._afterZoomOut()) : (b.isOpen = b.isOpened = !1, b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), b.transitions[b.current.closeMethod]())))
        },
        play: function(a) {
            var d = function() {
                    clearTimeout(b.player.timer)
                },
                e = function() {
                    d();
                    b.current && b.player.isActive && (b.player.timer = setTimeout(b.next, b.current.playSpeed))
                },
                c = function() {
                    d();
                    p.unbind(".player");
                    b.player.isActive = !1;
                    b.trigger("onPlayEnd")
                };
            if (!0 === a || !b.player.isActive && !1 !== a) {
                if (b.current && (b.current.loop || b.current.index < b.group.length - 1)) b.player.isActive = !0, p.bind({
                    "onCancel.player beforeClose.player": c,
                    "onUpdate.player": e,
                    "beforeLoad.player": d
                }), e(), b.trigger("onPlayStart")
            } else c()
        },
        next: function(a) {
            var d = b.current;
            d && (q(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next"))
        },
        prev: function(a) {
            var d = b.current;
            d && (q(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev"))
        },
        jumpto: function(a, d, e) {
            var c = b.current;
            c && (a = l(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), a %= c.group.length), c.group[a] !== v && (b.cancel(), b._start(a)))
        },
        reposition: function(a, d) {
            var e = b.current,
                c = e ? e.wrap : null,
                k;
            c && (k = b._getPosition(d), a && "scroll" === a.type ? (delete k.position, c.stop(!0, !0).animate(k, 200)) : (c.css(k), e.pos = f.extend({}, e.dim, k)))
        },
        update: function(a) {
            var d = a && a.type,
                e = !d || "orientationchange" === d;
            e && (clearTimeout(B), B = null);
            b.isOpen && !B && (B = setTimeout(function() {
                var c = b.current;
                c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), B = null)
            }, e && !s ? 0 : 300))
        },
        toggle: function(a) {
            b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, s && (b.wrap.removeAttr("style").addClass("fancybox-tmp"), b.trigger("onUpdate")), b.update())
        },
        hideLoading: function() {
            p.unbind(".loading");
            f("#fancybox-loading").remove()
        },
        showLoading: function() {
            var a, d;
            b.hideLoading();
            a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");
            p.bind("keydown.loading", function(a) {
                if (27 === (a.which || a.keyCode)) a.preventDefault(), b.cancel()
            });
            b.defaults.fixed || (d = b.getViewport(), a.css({
                position: "absolute",
                top: 0.5 * d.h + d.y,
                left: 0.5 * d.w + d.x
            }))
        },
        getViewport: function() {
            var a = b.current && b.current.locked || !1,
                d = {
                    x: n.scrollLeft(),
                    y: n.scrollTop()
                };
            a ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = s && r.innerWidth ? r.innerWidth : n.width(), d.h = s && r.innerHeight ? r.innerHeight : n.height());
            return d
        },
        unbindEvents: function() {
            b.wrap && t(b.wrap) && b.wrap.unbind(".fb");
            p.unbind(".fb");
            n.unbind(".fb")
        },
        bindEvents: function() {
            var a = b.current,
                d;
            a && (n.bind("orientationchange.fb" + (s ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), (d = a.keys) && p.bind("keydown.fb", function(e) {
                var c = e.which || e.keyCode,
                    k = e.target || e.srcElement;
                if (27 === c && b.coming) return !1;
                !e.ctrlKey && (!e.altKey && !e.shiftKey && !e.metaKey && (!k || !k.type && !f(k).is("[contenteditable]"))) && f.each(d, function(d, k) {
                    if (1 < a.group.length && k[c] !== v) return b[d](k[c]), e.preventDefault(), !1;
                    if (-1 < f.inArray(c, k)) return b[d](), e.preventDefault(), !1
                })
            }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function(d, c, k, g) {
                for (var h = f(d.target || null), j = !1; h.length && !j && !h.is(".fancybox-skin") && !h.is(".fancybox-wrap");) j = h[0] && !(h[0].style.overflow && "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight), h = f(h).parent();
                if (0 !== c && !j && 1 < b.group.length && !a.canShrink) {
                    if (0 < g || 0 < k) b.prev(0 < g ? "down" : "left");
                    else if (0 > g || 0 > k) b.next(0 > g ? "up" : "right");
                    d.preventDefault()
                }
            }))
        },
        trigger: function(a, d) {
            var e, c = d || b.coming || b.current;
            if (c) {
                f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1)));
                if (!1 === e) return !1;
                c.helpers && f.each(c.helpers, function(d, e) {
                    if (e && b.helpers[d] && f.isFunction(b.helpers[d][a])) b.helpers[d][a](f.extend(!0, {}, b.helpers[d].defaults, e), c)
                });
                p.trigger(a)
            }
        },
        isImage: function(a) {
            return q(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
        },
        isSWF: function(a) {
            return q(a) && a.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function(a) {
            var d = {},
                e, c;
            a = l(a);
            e = b.group[a] || null;
            if (!e) return !1;
            d = f.extend(!0, {}, b.opts, e);
            e = d.margin;
            c = d.padding;
            "number" === f.type(e) && (d.margin = [e, e, e, e]);
            "number" === f.type(c) && (d.padding = [c, c, c, c]);
            d.modal && f.extend(!0, d, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            });
            d.autoSize && (d.autoWidth = d.autoHeight = !0);
            "auto" === d.width && (d.autoWidth = !0);
            "auto" === d.height && (d.autoHeight = !0);
            d.group = b.group;
            d.index = a;
            b.coming = d;
            if (!1 === b.trigger("beforeLoad")) b.coming = null;
            else {
                c = d.type;
                e = d.href;
                if (!c) return b.coming = null, b.current && b.router && "jumpto" !== b.router ? (b.current.index = a, b[b.router](b.direction)) : !1;
                b.isActive = !0;
                if ("image" === c || "swf" === c) d.autoHeight = d.autoWidth = !1, d.scrolling = "visible";
                "image" === c && (d.aspectRatio = !0);
                "iframe" === c && s && (d.scrolling = "scroll");
                d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (s ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body");
                f.extend(d, {
                    skin: f(".fancybox-skin", d.wrap),
                    outer: f(".fancybox-outer", d.wrap),
                    inner: f(".fancybox-inner", d.wrap)
                });
                f.each(["Top", "Right", "Bottom", "Left"], function(a, b) {
                    d.skin.css("padding" + b, w(d.padding[a]))
                });
                b.trigger("onReady");
                if ("inline" === c || "html" === c) {
                    if (!d.content || !d.content.length) return b._error("content")
                } else if (!e) return b._error("href");
                "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad()
            }
        },
        _error: function(a) {
            f.extend(b.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: a,
                content: b.coming.tpl.error
            });
            b._afterLoad()
        },
        _loadImage: function() {
            var a = b.imgPreload = new Image;
            a.onload = function() {
                this.onload = this.onerror = null;
                b.coming.width = this.width / b.opts.pixelRatio;
                b.coming.height = this.height / b.opts.pixelRatio;
                b._afterLoad()
            };
            a.onerror = function() {
                this.onload = this.onerror = null;
                b._error("image")
            };
            a.src = b.coming.href;
            !0 !== a.complete && b.showLoading()
        },
        _loadAjax: function() {
            var a = b.coming;
            b.showLoading();
            b.ajaxLoad = f.ajax(f.extend({}, a.ajax, {
                url: a.href,
                error: function(a, e) {
                    b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading()
                },
                success: function(d, e) {
                    "success" === e && (a.content = d, b._afterLoad())
                }
            }))
        },
        _loadIframe: function() {
            var a = b.coming,
                d = f(a.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", s ? "auto" : a.iframe.scrolling).attr("src", a.href);
            f(a.wrap).bind("onReset", function() {
                try {
                    f(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (a) {}
            });
            a.iframe.preload && (b.showLoading(), d.one("load", function() {
                f(this).data("ready", 1);
                s || f(this).bind("load.fb", b.update);
                f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                b._afterLoad()
            }));
            a.content = d.appendTo(a.inner);
            a.iframe.preload || b._afterLoad()
        },
        _preloadImages: function() {
            var a = b.group,
                d = b.current,
                e = a.length,
                c = d.preload ? Math.min(d.preload, e - 1) : 0,
                f, g;
            for (g = 1; g <= c; g += 1) f = a[(d.index + g) % e], "image" === f.type && f.href && ((new Image).src = f.href)
        },
        _afterLoad: function() {
            var a = b.coming,
                d = b.current,
                e, c, k, g, h;
            b.hideLoading();
            if (a && !1 !== b.isActive)
                if (!1 === b.trigger("afterLoad", a, d)) a.wrap.stop(!0).trigger("onReset").remove(), b.coming = null;
                else {
                    d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                    b.unbindEvents();
                    e = a.content;
                    c = a.type;
                    k = a.scrolling;
                    f.extend(b, {
                        wrap: a.wrap,
                        skin: a.skin,
                        outer: a.outer,
                        inner: a.inner,
                        current: a,
                        previous: d
                    });
                    g = a.href;
                    switch (c) {
                        case "inline":
                        case "ajax":
                        case "html":
                            a.selector ? e = f("<div>").html(e).find(a.selector) : t(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), e = e.show().detach(), a.wrap.bind("onReset", function() {
                                f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                            }));
                            break;
                        case "image":
                            e = a.tpl.image.replace("{href}", g);
                            break;
                        case "swf":
                            e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>', h = "", f.each(a.swf, function(a, b) {
                                e += '<param name="' + a + '" value="' + b + '"></param>';
                                h += " " + a + '="' + b + '"'
                            }), e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>"
                    }(!t(e) || !e.parent().is(a.inner)) && a.inner.append(e);
                    b.trigger("beforeShow");
                    a.inner.css("overflow", "yes" === k ? "scroll" : "no" === k ? "hidden" : k);
                    b._setDimension();
                    b.reposition();
                    b.isOpen = !1;
                    b.coming = null;
                    b.bindEvents();
                    if (b.isOpened) {
                        if (d.prevMethod) b.transitions[d.prevMethod]()
                    } else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();
                    b.transitions[b.isOpened ? a.nextMethod : a.openMethod]();
                    b._preloadImages()
                }
        },
        _setDimension: function() {
            var a = b.getViewport(),
                d = 0,
                e = !1,
                c = !1,
                e = b.wrap,
                k = b.skin,
                g = b.inner,
                h = b.current,
                c = h.width,
                j = h.height,
                m = h.minWidth,
                u = h.minHeight,
                n = h.maxWidth,
                p = h.maxHeight,
                s = h.scrolling,
                q = h.scrollOutside ? h.scrollbarWidth : 0,
                x = h.margin,
                y = l(x[1] + x[3]),
                r = l(x[0] + x[2]),
                v, z, t, C, A, F, B, D, H;
            e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");
            x = l(k.outerWidth(!0) - k.width());
            v = l(k.outerHeight(!0) - k.height());
            z = y + x;
            t = r + v;
            C = E(c) ? (a.w - z) * l(c) / 100 : c;
            A = E(j) ? (a.h - t) * l(j) / 100 : j;
            if ("iframe" === h.type) {
                if (H = h.content, h.autoHeight && 1 === H.data("ready")) try {
                    H[0].contentWindow.document.location && (g.width(C).height(9999), F = H.contents().find("body"), q && F.css("overflow-x", "hidden"), A = F.outerHeight(!0))
                } catch (G) {}
            } else if (h.autoWidth || h.autoHeight) g.addClass("fancybox-tmp"), h.autoWidth || g.width(C), h.autoHeight || g.height(A), h.autoWidth && (C = g.width()), h.autoHeight && (A = g.height()), g.removeClass("fancybox-tmp");
            c = l(C);
            j = l(A);
            D = C / A;
            m = l(E(m) ? l(m, "w") - z : m);
            n = l(E(n) ? l(n, "w") - z : n);
            u = l(E(u) ? l(u, "h") - t : u);
            p = l(E(p) ? l(p, "h") - t : p);
            F = n;
            B = p;
            h.fitToView && (n = Math.min(a.w - z, n), p = Math.min(a.h - t, p));
            z = a.w - y;
            r = a.h - r;
            h.aspectRatio ? (c > n && (c = n, j = l(c / D)), j > p && (j = p, c = l(j * D)), c < m && (c = m, j = l(c / D)), j < u && (j = u, c = l(j * D))) : (c = Math.max(m, Math.min(c, n)), h.autoHeight && "iframe" !== h.type && (g.width(c), j = g.height()), j = Math.max(u, Math.min(j, p)));
            if (h.fitToView)
                if (g.width(c).height(j), e.width(c + x), a = e.width(), y = e.height(), h.aspectRatio)
                    for (;
                        (a > z || y > r) && (c > m && j > u) && !(19 < d++);) j = Math.max(u, Math.min(p, j - 10)), c = l(j * D), c < m && (c = m, j = l(c / D)), c > n && (c = n, j = l(c / D)), g.width(c).height(j), e.width(c + x), a = e.width(), y = e.height();
                else c = Math.max(m, Math.min(c, c - (a - z))), j = Math.max(u, Math.min(j, j - (y - r)));
            q && ("auto" === s && j < A && c + x + q < z) && (c += q);
            g.width(c).height(j);
            e.width(c + x);
            a = e.width();
            y = e.height();
            e = (a > z || y > r) && c > m && j > u;
            c = h.aspectRatio ? c < F && j < B && c < C && j < A : (c < F || j < B) && (c < C || j < A);
            f.extend(h, {
                dim: {
                    width: w(a),
                    height: w(y)
                },
                origWidth: C,
                origHeight: A,
                canShrink: e,
                canExpand: c,
                wPadding: x,
                hPadding: v,
                wrapSpace: y - k.outerHeight(!0),
                skinSpace: k.height() - j
            });
            !H && (h.autoHeight && j > u && j < p && !c) && g.height("auto")
        },
        _getPosition: function(a) {
            var d = b.current,
                e = b.getViewport(),
                c = d.margin,
                f = b.wrap.width() + c[1] + c[3],
                g = b.wrap.height() + c[0] + c[2],
                c = {
                    position: "absolute",
                    top: c[0],
                    left: c[3]
                };
            d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, c.left += e.x);
            c.top = w(Math.max(c.top, c.top + (e.h - g) * d.topRatio));
            c.left = w(Math.max(c.left, c.left + (e.w - f) * d.leftRatio));
            return c
        },
        _afterZoomIn: function() {
            var a = b.current;
            a && (b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function(d) {
                !f(d.target).is("a") && !f(d.target).parent().is("a") && (d.preventDefault(), b[a.closeClick ? "close" : "next"]())
            }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function(a) {
                a.preventDefault();
                b.close()
            }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), b.trigger("afterShow"), !a.loop && a.index === a.group.length - 1 ? b.play(!1) : b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, b.play()))
        },
        _afterZoomOut: function(a) {
            a = a || b.current;
            f(".fancybox-wrap").trigger("onReset").remove();
            f.extend(b, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            b.trigger("afterClose", a)
        }
    });
    b.transitions = {
        getOrigPosition: function() {
            var a = b.current,
                d = a.element,
                e = a.orig,
                c = {},
                f = 50,
                g = 50,
                h = a.hPadding,
                j = a.wPadding,
                m = b.getViewport();
            !e && (a.isDom && d.is(":visible")) && (e = d.find("img:first"), e.length || (e = d));
            t(e) ? (c = e.offset(), e.is("img") && (f = e.outerWidth(), g = e.outerHeight())) : (c.top = m.y + (m.h - g) * a.topRatio, c.left = m.x + (m.w - f) * a.leftRatio);
            if ("fixed" === b.wrap.css("position") || a.locked) c.top -= m.y, c.left -= m.x;
            return c = {
                top: w(c.top - h * a.topRatio),
                left: w(c.left - j * a.leftRatio),
                width: w(f + j),
                height: w(g + h)
            }
        },
        step: function(a, d) {
            var e, c, f = d.prop;
            c = b.current;
            var g = c.wrapSpace,
                h = c.skinSpace;
            if ("width" === f || "height" === f) e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start), b.isClosing && (e = 1 - e), c = "width" === f ? c.wPadding : c.hPadding, c = a - c, b.skin[f](l("width" === f ? c : c - g * e)), b.inner[f](l("width" === f ? c : c - g * e - h * e))
        },
        zoomIn: function() {
            var a = b.current,
                d = a.pos,
                e = a.openEffect,
                c = "elastic" === e,
                k = f.extend({
                    opacity: 1
                }, d);
            delete k.position;
            c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = 0.1)) : "fade" === e && (d.opacity = 0.1);
            b.wrap.css(d).animate(k, {
                duration: "none" === e ? 0 : a.openSpeed,
                easing: a.openEasing,
                step: c ? this.step : null,
                complete: b._afterZoomIn
            })
        },
        zoomOut: function() {
            var a = b.current,
                d = a.closeEffect,
                e = "elastic" === d,
                c = {
                    opacity: 0.1
                };
            e && (c = this.getOrigPosition(), a.closeOpacity && (c.opacity = 0.1));
            b.wrap.animate(c, {
                duration: "none" === d ? 0 : a.closeSpeed,
                easing: a.closeEasing,
                step: e ? this.step : null,
                complete: b._afterZoomOut
            })
        },
        changeIn: function() {
            var a = b.current,
                d = a.nextEffect,
                e = a.pos,
                c = {
                    opacity: 1
                },
                f = b.direction,
                g;
            e.opacity = 0.1;
            "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", "down" === f || "right" === f ? (e[g] = w(l(e[g]) - 200), c[g] = "+=200px") : (e[g] = w(l(e[g]) + 200), c[g] = "-=200px"));
            "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, {
                duration: a.nextSpeed,
                easing: a.nextEasing,
                complete: b._afterZoomIn
            })
        },
        changeOut: function() {
            var a = b.previous,
                d = a.prevEffect,
                e = {
                    opacity: 0.1
                },
                c = b.direction;
            "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px");
            a.wrap.animate(e, {
                duration: "none" === d ? 0 : a.prevSpeed,
                easing: a.prevEasing,
                complete: function() {
                    f(this).trigger("onReset").remove()
                }
            })
        }
    };
    b.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !s,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        el: f("html"),
        create: function(a) {
            a = f.extend({}, this.defaults, a);
            this.overlay && this.close();
            this.overlay = f('<div class="fancybox-overlay"></div>').appendTo(b.coming ? b.coming.parent : a.parent);
            this.fixed = !1;
            a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function(a) {
            var d = this;
            a = f.extend({}, this.defaults, a);
            this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a);
            this.fixed || (n.bind("resize.overlay", f.proxy(this.update, this)), this.update());
            a.closeClick && this.overlay.bind("click.overlay", function(a) {
                if (f(a.target).hasClass("fancybox-overlay")) return b.isActive ? b.close() : d.close(), !1
            });
            this.overlay.css(a.css).show()
        },
        close: function() {
            var a, b;
            n.unbind("resize.overlay");
            this.el.hasClass("fancybox-lock") && (f(".fancybox-margin").removeClass("fancybox-margin"), a = n.scrollTop(), b = n.scrollLeft(), this.el.removeClass("fancybox-lock"), n.scrollTop(a).scrollLeft(b));
            f(".fancybox-overlay").remove().hide();
            f.extend(this, {
                overlay: null,
                fixed: !1
            })
        },
        update: function() {
            var a = "100%",
                b;
            this.overlay.width(a).height("100%");
            I ? (b = Math.max(G.documentElement.offsetWidth, G.body.offsetWidth), p.width() > b && (a = p.width())) : p.width() > n.width() && (a = p.width());
            this.overlay.width(a).height(p.height())
        },
        onReady: function(a, b) {
            var e = this.overlay;
            f(".fancybox-overlay").stop(!0, !0);
            e || this.create(a);
            a.locked && (this.fixed && b.fixed) && (e || (this.margin = p.height() > n.height() ? f("html").css("margin-right").replace("px", "") : !1), b.locked = this.overlay.append(b.wrap), b.fixed = !1);
            !0 === a.showEarly && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function(a, b) {
            var e, c;
            b.locked && (!1 !== this.margin && (f("*").filter(function() {
                return "fixed" === f(this).css("position") && !f(this).hasClass("fancybox-overlay") && !f(this).hasClass("fancybox-wrap")
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), e = n.scrollTop(), c = n.scrollLeft(), this.el.addClass("fancybox-lock"), n.scrollTop(e).scrollLeft(c));
            this.open(a)
        },
        onUpdate: function() {
            this.fixed || this.update()
        },
        afterClose: function(a) {
            this.overlay && !b.coming && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this))
        }
    };
    b.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(a) {
            var d = b.current,
                e = d.title,
                c = a.type;
            f.isFunction(e) && (e = e.call(d.element, d));
            if (q(e) && "" !== f.trim(e)) {
                d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>");
                switch (c) {
                    case "inside":
                        c = b.skin;
                        break;
                    case "outside":
                        c = b.wrap;
                        break;
                    case "over":
                        c = b.inner;
                        break;
                    default:
                        c = b.skin, d.appendTo("body"), I && d.width(d.width()), d.wrapInner('<span class="child"></span>'), b.current.margin[2] += Math.abs(l(d.css("margin-bottom")))
                }
                d["top" === a.position ? "prependTo" : "appendTo"](c)
            }
        }
    };
    f.fn.fancybox = function(a) {
        var d, e = f(this),
            c = this.selector || "",
            k = function(g) {
                var h = f(this).blur(),
                    j = d,
                    k, l;
                !g.ctrlKey && (!g.altKey && !g.shiftKey && !g.metaKey) && !h.is(".fancybox-wrap") && (k = a.groupAttr || "data-fancybox-group", l = h.attr(k), l || (k = "rel", l = h.get(0)[k]), l && ("" !== l && "nofollow" !== l) && (h = c.length ? f(c) : e, h = h.filter("[" + k + '="' + l + '"]'), j = h.index(this)), a.index = j, !1 !== b.open(h, a) && g.preventDefault())
            };
        a = a || {};
        d = a.index || 0;
        !c || !1 === a.live ? e.unbind("click.fb-start").bind("click.fb-start", k) : p.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", k);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    p.ready(function() {
        var a, d;
        f.scrollbarWidth === v && (f.scrollbarWidth = function() {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                b = a.children(),
                b = b.innerWidth() - b.height(99).innerWidth();
            a.remove();
            return b
        });
        if (f.support.fixedPosition === v) {
            a = f.support;
            d = f('<div style="position:fixed;top:20px;"></div>').appendTo("body");
            var e = 20 === d[0].offsetTop || 15 === d[0].offsetTop;
            d.remove();
            a.fixedPosition = e
        }
        f.extend(b.defaults, {
            scrollbarWidth: f.scrollbarWidth(),
            fixed: f.support.fixedPosition,
            parent: f("body")
        });
        a = f(r).width();
        J.addClass("fancybox-lock-test");
        d = f(r).width();
        J.removeClass("fancybox-lock-test");
        f("<style type='text/css'>.fancybox-margin{margin-right:" + (d - a) + "px;}</style>").appendTo("head")
    })
})(window, document, jQuery);
/*!
 * Buttons helper for fancyBox - 1.0.5
 * http://fancyapps.com
 */
(function($) {
    var F = $.fancybox;
    F.helpers.buttons = {
        defaults: {
            skipSingle: false,
            position: 'top',
            tpl: '<div id="fancybox-buttons"><ul><li><a class="btnPrev" title="Previous" href="javascript:;"></a></li><li><a class="btnPlay" title="Start slideshow" href="javascript:;"></a></li><li><a class="btnNext" title="Next" href="javascript:;"></a></li><li><a class="btnToggle" title="Toggle size" href="javascript:;"></a></li><li><a class="btnClose" title="Close" href="javascript:;"></a></li></ul></div>'
        },
        list: null,
        buttons: null,
        beforeLoad: function(opts, obj) {
            if (opts.skipSingle && obj.group.length < 2) {
                obj.helpers.buttons = false;
                obj.closeBtn = true;
                return
            }
            obj.margin[opts.position === 'bottom' ? 2 : 0] += 30
        },
        onPlayStart: function() {
            if (this.buttons) {
                this.buttons.play.attr('title', 'Pause slideshow').addClass('btnPlayOn')
            }
        },
        onPlayEnd: function() {
            if (this.buttons) {
                this.buttons.play.attr('title', 'Start slideshow').removeClass('btnPlayOn')
            }
        },
        afterShow: function(opts, obj) {
            var buttons = this.buttons;
            if (!buttons) {
                this.list = $(opts.tpl).addClass(opts.position).appendTo('body');
                buttons = {
                    prev: this.list.find('.btnPrev').click(F.prev),
                    next: this.list.find('.btnNext').click(F.next),
                    play: this.list.find('.btnPlay').click(F.play),
                    toggle: this.list.find('.btnToggle').click(F.toggle),
                    close: this.list.find('.btnClose').click(F.close)
                }
            }
            if (obj.index > 0 || obj.loop) {
                buttons.prev.removeClass('btnDisabled')
            } else {
                buttons.prev.addClass('btnDisabled')
            }
            if (obj.loop || obj.index < obj.group.length - 1) {
                buttons.next.removeClass('btnDisabled');
                buttons.play.removeClass('btnDisabled')
            } else {
                buttons.next.addClass('btnDisabled');
                buttons.play.addClass('btnDisabled')
            }
            this.buttons = buttons;
            this.onUpdate(opts, obj)
        },
        onUpdate: function(opts, obj) {
            var toggle;
            if (!this.buttons) {
                return
            }
            toggle = this.buttons.toggle.removeClass('btnDisabled btnToggleOn');
            if (obj.canShrink) {
                toggle.addClass('btnToggleOn')
            } else if (!obj.canExpand) {
                toggle.addClass('btnDisabled')
            }
        },
        beforeClose: function() {
            if (this.list) {
                this.list.remove()
            }
            this.list = null;
            this.buttons = null
        }
    }
}(jQuery));
/*!
 * Thumbnail helper for fancyBox - 1.0.7
 * http://fancyapps.com
 */
(function($) {
    var F = $.fancybox;
    F.helpers.thumbs = {
        defaults: {
            width: 50,
            height: 50,
            position: 'bottom',
            source: function(item) {
                var href;
                if (item.element) {
                    href = $(item.element).find('img').attr('src')
                }
                if (!href && item.type === 'image' && item.href) {
                    href = item.href
                }
                return href
            }
        },
        wrap: null,
        list: null,
        width: 0,
        init: function(opts, obj) {
            var that = this,
                list, thumbWidth = opts.width,
                thumbHeight = opts.height,
                thumbSource = opts.source;
            list = '';
            for (var n = 0; n < obj.group.length; n++) {
                list += '<li><a style="width:' + thumbWidth + 'px;height:' + thumbHeight + 'px;" href="javascript:jQuery.fancybox.jumpto(' + n + ');"></a></li>'
            }
            this.wrap = $('<div id="fancybox-thumbs"></div>').addClass(opts.position).appendTo('body');
            this.list = $('<ul>' + list + '</ul>').appendTo(this.wrap);
            $.each(obj.group, function(i) {
                var href = thumbSource(obj.group[i]);
                if (!href) {
                    return
                }
                $("<img />").load(function() {
                    var width = this.width,
                        height = this.height,
                        widthRatio, heightRatio, parent;
                    if (!that.list || !width || !height) {
                        return
                    }
                    widthRatio = width / thumbWidth;
                    heightRatio = height / thumbHeight;
                    parent = that.list.children().eq(i).find('a');
                    if (widthRatio >= 1 && heightRatio >= 1) {
                        if (widthRatio > heightRatio) {
                            width = Math.floor(width / heightRatio);
                            height = thumbHeight
                        } else {
                            width = thumbWidth;
                            height = Math.floor(height / widthRatio)
                        }
                    }
                    $(this).css({
                        width: width,
                        height: height,
                        top: Math.floor(thumbHeight / 2 - height / 2),
                        left: Math.floor(thumbWidth / 2 - width / 2)
                    });
                    parent.width(thumbWidth).height(thumbHeight);
                    $(this).hide().appendTo(parent).fadeIn(300)
                }).attr('src', href)
            });
            this.width = this.list.children().eq(0).outerWidth(true);
            this.list.width(this.width * (obj.group.length + 1)).css('left', Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5)))
        },
        beforeLoad: function(opts, obj) {
            if (obj.group.length < 2) {
                obj.helpers.thumbs = false;
                return
            }
            obj.margin[opts.position === 'top' ? 0 : 2] += ((opts.height) + 15)
        },
        afterShow: function(opts, obj) {
            if (this.list) {
                this.onUpdate(opts, obj)
            } else {
                this.init(opts, obj)
            }
            this.list.children().removeClass('active').eq(obj.index).addClass('active')
        },
        onUpdate: function(opts, obj) {
            if (this.list) {
                this.list.stop(true).animate({
                    'left': Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5))
                }, 150)
            }
        },
        beforeClose: function() {
            if (this.wrap) {
                this.wrap.remove()
            }
            this.wrap = null;
            this.list = null;
            this.width = 0
        }
    }
}(jQuery));
/*!
 * Media helper for fancyBox - 1.0.6
 * http://fancyapps.com
 */
(function($) {
    "use strict";
    var F = $.fancybox,
        format = function(url, rez, params) {
            params = params || '';
            if ($.type(params) === "object") {
                params = $.param(params, true)
            }
            $.each(rez, function(key, value) {
                url = url.replace('$' + key, value || '')
            });
            if (params.length) {
                url += (url.indexOf('?') > 0 ? '&' : '?') + params
            }
            return url
        };
    F.helpers.media = {
        defaults: {
            youtube: {
                matcher: /(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i,
                params: {
                    autoplay: 1,
                    autohide: 1,
                    fs: 1,
                    rel: 0,
                    hd: 1,
                    wmode: 'opaque',
                    enablejsapi: 1
                },
                type: 'iframe',
                url: '//www.youtube.com/embed/$3'
            },
            vimeo: {
                matcher: /(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,
                params: {
                    autoplay: 1,
                    hd: 1,
                    show_title: 1,
                    show_byline: 1,
                    show_portrait: 0,
                    fullscreen: 1
                },
                type: 'iframe',
                url: '//player.vimeo.com/video/$1'
            },
            metacafe: {
                matcher: /metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,
                params: {
                    autoPlay: 'yes'
                },
                type: 'swf',
                url: function(rez, params, obj) {
                    obj.swf.flashVars = 'playerVars=' + $.param(params, true);
                    return '//www.metacafe.com/fplayer/' + rez[1] + '/.swf'
                }
            },
            dailymotion: {
                matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
                params: {
                    additionalInfos: 0,
                    autoStart: 1
                },
                type: 'swf',
                url: '//www.dailymotion.com/swf/video/$1'
            },
            twitvid: {
                matcher: /twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,
                params: {
                    autoplay: 0
                },
                type: 'iframe',
                url: '//www.twitvid.com/embed.php?guid=$1'
            },
            twitpic: {
                matcher: /twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,
                type: 'image',
                url: '//twitpic.com/show/full/$1/'
            },
            instagram: {
                matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
                type: 'image',
                url: '//$1/p/$2/media/?size=l'
            },
            google_maps: {
                matcher: /maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,
                type: 'iframe',
                url: function(rez) {
                    return '//maps.google.' + rez[1] + '/' + rez[3] + '' + rez[4] + '&output=' + (rez[4].indexOf('layer=c') > 0 ? 'svembed' : 'embed')
                }
            }
        },
        beforeLoad: function(opts, obj) {
            var url = obj.href || '',
                type = false,
                what, item, rez, params;
            for (what in opts) {
                if (opts.hasOwnProperty(what)) {
                    item = opts[what];
                    rez = url.match(item.matcher);
                    if (rez) {
                        type = item.type;
                        params = $.extend(true, {}, item.params, obj[what] || ($.isPlainObject(opts[what]) ? opts[what].params : null));
                        url = $.type(item.url) === "function" ? item.url.call(this, rez, params, obj) : format(item.url, rez, params);
                        break
                    }
                }
            }
            if (type) {
                obj.href = url;
                obj.type = type;
                obj.autoHeight = false
            }
        }
    }
}(jQuery));
/*!
 * jQuery Waypoints - 2.0.3
 * http://imakewebthings.com/jquery-waypoints/
 */
(function() {
    var t = [].indexOf || function(t) {
            for (var e = 0, n = this.length; e < n; e++) {
                if (e in this && this[e] === t) return e
            }
            return -1
        },
        e = [].slice;
    (function(t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", ["jquery"], function(n) {
                return e(n, t)
            })
        } else {
            return e(t.jQuery, t)
        }
    })(this, function(n, r) {
        var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
        i = n(r);
        c = t.call(r, "ontouchstart") >= 0;
        s = {
            horizontal: {},
            vertical: {}
        };
        f = 1;
        a = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function() {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {
                    x: t.scrollLeft(),
                    y: t.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                t.data(u, this.id);
                a[this.id] = this;
                t.bind(y, function() {
                    var t;
                    if (!(e.didScroll || c)) {
                        e.didScroll = true;
                        t = function() {
                            e.doScroll();
                            return e.didScroll = false
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle)
                    }
                });
                t.bind(p, function() {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function() {
                            n[m]("refresh");
                            return e.didResize = false
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle)
                    }
                })
            }
            t.prototype.doScroll = function() {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh")
                }
                n.each(t, function(t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function(t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e)
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e)
                        }
                    });
                    l.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    if (!o) {
                        l.reverse()
                    }
                    return n.each(l, function(t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([i])
                        }
                    })
                });
                return this.oldScroll = {
                    x: t.horizontal.newScroll,
                    y: t.vertical.newScroll
                }
            };
            t.prototype.refresh = function() {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function(t, e) {
                    return n.each(i.waypoints[t], function(t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element)
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100)
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([e.backward])
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([e.forward])
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([e.forward])
                        }
                    })
                })
            };
            t.prototype.checkEmpty = function() {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([p, y].join(" "));
                    return delete a[this.id]
                }
            };
            return t
        }();
        l = function() {
            function t(t, e, r) {
                var i, o;
                r = n.extend({}, n.fn[g].defaults, r);
                if (r.offset === "bottom-in-view") {
                    r.offset = function() {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height()
                        }
                        return t - n(this).outerHeight()
                    }
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = t.data(w)) != null ? o : [];
                i.push(this.id);
                t.data(w, i)
            }
            t.prototype.trigger = function(t) {
                if (!this.enabled) {
                    return
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t)
                }
                if (this.options.triggerOnce) {
                    return this.destroy()
                }
            };
            t.prototype.disable = function() {
                return this.enabled = false
            };
            t.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true
            };
            t.prototype.destroy = function() {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty()
            };
            t.getWaypointsByElement = function(t) {
                var e, r;
                r = n(t).data(w);
                if (!r) {
                    return []
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function(t) {
                    return e[t]
                })
            };
            return t
        }();
        d = {
            init: function(t, e) {
                var r;
                if (e == null) {
                    e = {}
                }
                if ((r = e.handler) == null) {
                    e.handler = t
                }
                this.each(function() {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i)
                    }
                    i = n(i);
                    r = a[i.data(u)];
                    if (!r) {
                        r = new o(i)
                    }
                    return new l(t, r, e)
                });
                n[m]("refresh");
                return this
            },
            disable: function() {
                return d._invoke(this, "disable")
            },
            enable: function() {
                return d._invoke(this, "enable")
            },
            destroy: function() {
                return d._invoke(this, "destroy")
            },
            prev: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1])
                    }
                })
            },
            next: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1])
                    }
                })
            },
            _traverse: function(t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical"
                }
                if (e == null) {
                    e = r
                }
                l = h.aggregate(e);
                o = [];
                this.each(function() {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t])
                });
                return this.pushStack(o)
            },
            _invoke: function(t, e) {
                t.each(function() {
                    var t;
                    t = l.getWaypointsByElement(this);
                    return n.each(t, function(t, n) {
                        n[e]();
                        return true
                    })
                });
                return this
            }
        };
        n.fn[g] = function() {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t)
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments)
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [null, r])
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.")
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.")
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function() {
                return n.each(a, function(t, e) {
                    return e.refresh()
                })
            },
            viewportHeight: function() {
                var t;
                return (t = r.innerHeight) != null ? t : i.height()
            },
            aggregate: function(t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0
                }
                if (!e) {
                    return []
                }
                r = {
                    horizontal: [],
                    vertical: []
                };
                n.each(r, function(t, i) {
                    n.each(e[t], function(t, e) {
                        return i.push(e)
                    });
                    i.sort(function(t, e) {
                        return t.offset - e.offset
                    });
                    r[t] = n.map(i, function(t) {
                        return t.element
                    });
                    return r[t] = n.unique(r[t])
                });
                return r
            },
            above: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset <= t.oldScroll.y
                })
            },
            below: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset > t.oldScroll.y
                })
            },
            left: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset <= t.oldScroll.x
                })
            },
            right: function(t) {
                if (t == null) {
                    t = r
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset > t.oldScroll.x
                })
            },
            enable: function() {
                return h._invoke("enable")
            },
            disable: function() {
                return h._invoke("disable")
            },
            destroy: function() {
                return h._invoke("destroy")
            },
            extendFn: function(t, e) {
                return d[t] = e
            },
            _invoke: function(t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function(e, n) {
                    n[t]();
                    return true
                })
            },
            _filter: function(t, e, r) {
                var i, o;
                i = a[n(t).data(u)];
                if (!i) {
                    return []
                }
                o = [];
                n.each(i.waypoints[e], function(t, e) {
                    if (r(i, e)) {
                        return o.push(e)
                    }
                });
                o.sort(function(t, e) {
                    return t.offset - e.offset
                });
                return n.map(o, function(t) {
                    return t.element
                })
            }
        };
        n[m] = function() {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t)
            } else {
                return h.aggregate.call(null, n)
            }
        };
        n[m].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return i.load(function() {
            return n[m]("refresh")
        })
    })
}).call(this);
/*!
 * Lettering.js - 0.7.0
 * https://github.com/davatron5000/Lettering.js
 */
(function($) {


    function injector(t, splitter, klass, after) {
        var text = t.text(),
            a = text.split(splitter),
            inject = '';
        if (a.length) {
            $(a).each(function(i, item) {
                inject += '<span class="' + klass + (i + 1) + '" aria-hidden="true">' + item + '</span>' + after
            });
            t.attr('aria-label', text).empty().append(inject)
        }
    }
    var methods = {
        init: function() {
            return this.each(function() {
                injector($(this), '', 'ch', '')
            })
        },
        words: function() {
            return this.each(function() {
                injector($(this), ' ', 'word', ' ')
            })
        },
        lines: function() {
            return this.each(function() {
                var r = "eefec303079ad17405c889e092e105b0";
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '')
            })
        }
    };
    $.fn.lettering = function(method) {
        if (method && methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1))
        } else if (method === 'letters' || !method) {
            return methods.init.apply(this, [].slice.call(arguments, 0))
        }
        $.error('Method ' + method + ' does not exist on jQuery.lettering');
        return this
    }
})(jQuery);
/*!
 * jQuery animateNumber - 0.0.9
 * https://github.com/aishek/jquery-animateNumber
 */
(function(d) {
    var p = function(b) {
            return b.split("").reverse().join("")
        },
        l = {
            numberStep: function(b, a) {
                var e = Math.floor(b);
                d(a.elem).text(e)
            }
        },
        h = function(b) {
            var a = b.elem;
            a.nodeType && a.parentNode && (a = a._animateNumberSetter, a || (a = l.numberStep), a(b.now, b))
        };
    d.Tween && d.Tween.propHooks ? d.Tween.propHooks.number = {
        set: h
    } : d.fx.step.number = h;
    d.animateNumber = {
        numberStepFactories: {
            append: function(b) {
                return function(a, e) {
                    var k = Math.floor(a);
                    d(e.elem).prop("number", a).text(k + b)
                }
            },
            separator: function(b, a) {
                b = b || " ";
                a = a || 3;
                return function(e, k) {
                    var c = Math.floor(e).toString(),
                        s = d(k.elem);
                    if (c.length > a) {
                        for (var f = c, g = a, l = f.split("").reverse(), c = [], m, q, n, r = 0, h = Math.ceil(f.length / g); r < h; r++) {
                            m = "";
                            for (n = 0; n < g; n++) {
                                q = r * g + n;
                                if (q === f.length) break;
                                m += l[q]
                            }
                            c.push(m)
                        }
                        f = c.length - 1;
                        g = p(c[f]);
                        c[f] = p(parseInt(g, 10).toString());
                        c = (void 0).join(b);
                        c = p(c)
                    }
                    s.prop("number", e).text(c)
                }
            }
        }
    };
    d.fn.animateNumber = function() {
        for (var b = arguments[0], a = d.extend({}, l, b), e = d(this), k = [a], c = 1, h = arguments.length; c < h; c++) k.push(arguments[c]);
        if (b.numberStep) {
            var f = this.each(function() {
                    this._animateNumberSetter = b.numberStep
                }),
                g = a.complete;
            a.complete = function() {
                f.each(function() {
                    delete this._animateNumberSetter
                });
                g && g.apply(this, arguments)
            }
        }
        return e.animate.apply(e, k)
    }
})(jQuery);
/*!
 * jQuery Lens
 * http://www.dailycoding.com/ 
 */
(function($) {
    $.fn.imageLens = function(options) {
        var defaults = {
            lensSize: 100,
            borderSize: 4,
            borderColor: "#888"
        };
        var options = $.extend(defaults, options);
        var lensStyle = "background-position: 0px 0px;width: " + String(options.lensSize) + "px;height: " + String(options.lensSize) + "px;float: left;display: none;border-radius: " + String(options.lensSize / 2 + options.borderSize) + "px;border: " + String(options.borderSize) + "px solid " + options.borderColor + ";background-repeat: no-repeat;position: absolute;";
        return this.each(function() {
            obj = $(this);
            var offset = $(this).offset();
            var target = $("<div style='" + lensStyle + "' class='" + options.lensCss + "'>&nbsp;</div>").appendTo($("body"));
            var targetSize = target.size();
            var imageSrc = options.imageSrc ? options.imageSrc : $(this).attr("src");
            var imageTag = "<img style='display:none;' src='" + imageSrc + "' />";
            var widthRatio = 0;
            var heightRatio = 0;
            $(imageTag).load(function() {
                widthRatio = $(this).width() / obj.width();
                heightRatio = $(this).height() / obj.height()
            }).appendTo($(this).parent());
            target.css({
                backgroundImage: "url('" + imageSrc + "')"
            });
            target.mousemove(setPosition);
            $(this).mousemove(setPosition);

            function setPosition(e) {
                var leftPos = parseInt(e.pageX - offset.left);
                var topPos = parseInt(e.pageY - offset.top);
                if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
                    target.hide()
                } else {
                    target.show();
                    leftPos = String(((e.pageX - offset.left) * widthRatio - target.width() / 2) * (-1));
                    topPos = String(((e.pageY - offset.top) * heightRatio - target.height() / 2) * (-1));
                    target.css({
                        backgroundPosition: leftPos + 'px ' + topPos + 'px'
                    });
                    leftPos = String(e.pageX - target.width() / 2);
                    topPos = String(e.pageY - target.height() / 2);
                    target.css({
                        left: leftPos + 'px',
                        top: topPos + 'px'
                    })
                }
            }
        })
    }
})(jQuery);
/*!
 * Detect Element Resize - 0.5.3
 * https://github.com/sdecima/javascript-detect-element-resize
 */
(function() {
    var attachEvent = document.attachEvent,
        stylesCreated = false;
    if (!attachEvent) {
        var requestFrame = (function() {
            var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
                return window.setTimeout(fn, 20)
            };
            return function(fn) {
                return raf(fn)
            }
        })();
        var cancelFrame = (function() {
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
            return function(id) {
                return cancel(id)
            }
        })();

        function resetTriggers(element) {
            var triggers = element.__resizeTriggers__,
                expand = triggers.firstElementChild,
                contract = triggers.lastElementChild,
                expandChild = expand.firstElementChild;
            contract.scrollLeft = contract.scrollWidth;
            contract.scrollTop = contract.scrollHeight;
            expandChild.style.width = expand.offsetWidth + 1 + 'px';
            expandChild.style.height = expand.offsetHeight + 1 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight
        };

        function checkTriggers(element) {
            return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height
        }

        function scrollListener(e) {
            var element = this;
            resetTriggers(this);
            if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
            this.__resizeRAF__ = requestFrame(function() {
                if (checkTriggers(element)) {
                    element.__resizeLast__.width = element.offsetWidth;
                    element.__resizeLast__.height = element.offsetHeight;
                    element.__resizeListeners__.forEach(function(fn) {
                        fn.call(element, e)
                    })
                }
            })
        };
        var animation = false,
            animationstring = 'animation',
            keyframeprefix = '',
            animationstartevent = 'animationstart',
            domPrefixes = 'Webkit Moz O ms'.split(' '),
            startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
            pfx = ''; {
            var elm = document.createElement('fakeelement');
            if (elm.style.animationName !== undefined) {
                animation = true
            }
            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animationstartevent = startEvents[i];
                        animation = true;
                        break
                    }
                }
            }
        }
        var animationName = 'resizeanim';
        var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
        var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; '
    }

    function createStyles() {
        if (!stylesCreated) {
            var css = (animationKeyframes ? animationKeyframes : '') + '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' + '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css
            } else {
                style.appendChild(document.createTextNode(css))
            }
            head.appendChild(style);
            stylesCreated = true
        }
    }
    window.addResizeListener = function(element, fn) {
        if (attachEvent) element.attachEvent('onresize', fn);
        else {
            if (!element.__resizeTriggers__) {
                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                createStyles();
                element.__resizeLast__ = {};
                element.__resizeListeners__ = [];
                (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
                element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' + '<div class="contract-trigger"></div>';
                element.appendChild(element.__resizeTriggers__);
                resetTriggers(element);
                element.addEventListener('scroll', scrollListener, true);
                animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
                    if (e.animationName == animationName) resetTriggers(element)
                })
            }
            element.__resizeListeners__.push(fn)
        }
    };
    window.removeResizeListener = function(element, fn) {
        if (attachEvent) element.detachEvent('onresize', fn);
        else {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener('scroll', scrollListener);
                element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__)
            }
        }
    }
})();
/*! 
 * waitForImages - 2.0.0
 * https://github.com/alexanderdickson/waitForImages
 */
;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'))
    } else {
        factory(jQuery)
    }
}(function($) {
    var eventNamespace = 'waitForImages';
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage', 'cursor'],
        hasImageAttributes: ['srcset']
    };
    $.expr[':'].uncached = function(obj) {
        if (!$(obj).is('img[src][src!=""]')) {
            return false
        }
        return !obj.complete
    };
    $.fn.waitForImages = function() {
        var allImgsLength = 0;
        var allImgsLoaded = 0;
        var deferred = $.Deferred();
        var finishedCallback;
        var eachCallback;
        var waitForAll;
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            finishedCallback = arguments[0].finished
        } else {
            if (arguments.length === 1 && $.type(arguments[0]) === 'boolean') {
                waitForAll = arguments[0]
            } else {
                finishedCallback = arguments[0];
                eachCallback = arguments[1];
                waitForAll = arguments[2]
            }
        }
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;
        waitForAll = !!waitForAll;
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }
        this.each(function() {
            var obj = $(this);
            var allImgs = [];
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            var hasImageAttributes = $.waitForImages.hasImageAttributes || [];
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
            if (waitForAll) {
                obj.find('*').addBack().each(function() {
                    var element = $(this);
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        })
                    }
                    $.each(hasImgProperties, function(i, property) {
                        var propertyValue = element.css(property);
                        var match;
                        if (!propertyValue) {
                            return true
                        }
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            })
                        }
                    });
                    $.each(hasImageAttributes, function(i, attribute) {
                        var attributeValue = element.attr(attribute);
                        var attributeValues;
                        if (!attributeValue) {
                            return true
                        }
                        attributeValues = attributeValue.split(',');
                        $.each(attributeValues, function(i, value) {
                            value = $.trim(value).split(' ')[0];
                            allImgs.push({
                                src: value,
                                element: element[0]
                            })
                        })
                    })
                })
            } else {
                obj.find('img:uncached').each(function() {
                    allImgs.push({
                        src: this.src,
                        element: this
                    })
                })
            }
            allImgsLength = allImgs.length;
            allImgsLoaded = 0;
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
                deferred.resolveWith(obj[0])
            }
            $.each(allImgs, function(i, img) {
                var image = new Image();
                var events = 'load.' + eventNamespace + ' error.' + eventNamespace;
                $(image).one(events, function me(event) {
                    var eachArguments = [allImgsLoaded, allImgsLength, event.type == 'load'];
                    allImgsLoaded++;
                    eachCallback.apply(img.element, eachArguments);
                    deferred.notifyWith(img.element, eachArguments);
                    $(this).off(events, me);
                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        deferred.resolveWith(obj[0]);
                        return false
                    }
                });
                image.src = img.src
            })
        });
        return deferred.promise()
    }
}));
/*!
 * Modernizr - .8.3
 * http://modernizr.com
 */
window.Modernizr = (function(window, document, undefined) {
    var version = '2.8.3',
        Modernizr = {},
        enableClasses = true,
        docElement = document.documentElement,
        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,
        inputElem = document.createElement('input'),
        smile = ':)',
        toString = {}.toString,
        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
        omPrefixes = 'Webkit Moz O ms',
        cssomPrefixes = omPrefixes.split(' '),
        domPrefixes = omPrefixes.toLowerCase().split(' '),
        ns = {
            'svg': 'http://www.w3.org/2000/svg'
        },
        tests = {},
        inputs = {},
        attrs = {},
        classes = [],
        slice = classes.slice,
        featureName, injectElementWithStyles = function(rule, callback, nodes, testnames) {
            var style, ret, node, docOverflow, div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');
            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node)
                }
            }
            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody)
            }
            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow
            } else {
                div.parentNode.removeChild(div)
            }
            return !!ret
        },
        testMediaQuery = function(mq) {
            var matchMedia = window.matchMedia || window.msMatchMedia;
            if (matchMedia) {
                return matchMedia(mq) && matchMedia(mq).matches || false
            }
            var bool;
            injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function(node) {
                bool = (window.getComputedStyle ? getComputedStyle(node, null) : node.currentStyle)['position'] == 'absolute'
            });
            return bool
        },
        isEventSupported = (function() {
            var TAGNAMES = {
                'select': 'input',
                'change': 'input',
                'submit': 'form',
                'reset': 'form',
                'error': 'img',
                'load': 'img',
                'abort': 'img'
            };

            function isEventSupported(eventName, element) {
                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;
                var isSupported = eventName in element;
                if (!isSupported) {
                    if (!element.setAttribute) {
                        element = document.createElement('div')
                    }
                    if (element.setAttribute && element.removeAttribute) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');
                        if (!is(element[eventName], 'undefined')) {
                            element[eventName] = undefined
                        }
                        element.removeAttribute(eventName)
                    }
                }
                element = null;
                return isSupported
            }
            return isEventSupported
        })(),
        _hasOwnProperty = ({}).hasOwnProperty,
        hasOwnProp;
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property)
        }
    } else {
        hasOwnProp = function(object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'))
        }
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError();
            }
            var args = slice.call(arguments, 1),
                bound = function() {
                    if (this instanceof bound) {
                        var F = function() {};
                        F.prototype = target.prototype;
                        var self = new F();
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) {
                            return result
                        }
                        return self
                    } else {
                        return target.apply(that, args.concat(slice.call(arguments)))
                    }
                };
            return bound
        }
    }

    function setCss(str) {
        mStyle.cssText = str
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''))
    }

    function is(obj, type) {
        return typeof obj === type
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr)
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true
            }
        }
        return false
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {
                if (elem === false) return props[i];
                if (is(item, 'function')) {
                    return item.bind(elem || obj)
                }
                return item
            }
        }
        return false
    }

    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed)
        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem)
        }
    }
    tests['flexbox'] = function() {
        return testPropsAll('flexWrap')
    };
    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection')
    };
    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'))
    };
    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'))
    };
    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext
    };
    tests['touch'] = function() {
        var bool;
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
                bool = node.offsetTop === 9
            })
        }
        return bool
    };
    tests['geolocation'] = function() {
        return 'geolocation' in navigator
    };
    tests['postmessage'] = function() {
        return !!window.postMessage
    };
    tests['websqldatabase'] = function() {
        return !!window.openDatabase
    };
    tests['indexedDB'] = function() {
        return !!testPropsAll("indexedDB", window)
    };
    tests['hashchange'] = function() {
        return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7)
    };
    tests['history'] = function() {
        return !!(window.history && history.pushState)
    };
    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    };
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window
    };
    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');
        return contains(mStyle.backgroundColor, 'rgba')
    };
    tests['hsla'] = function() {
        setCss('background-color:hsla(120,40%,100%,.5)');
        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla')
    };
    tests['multiplebgs'] = function() {
        setCss('background:url(https://),url(https://),red url(https://)');
        return (/(url\s*\(.*?){3}/).test(mStyle.background)
    };
    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize')
    };
    tests['borderimage'] = function() {
        return testPropsAll('borderImage')
    };
    tests['borderradius'] = function() {
        return testPropsAll('borderRadius')
    };
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow')
    };
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === ''
    };
    tests['opacity'] = function() {
        setCssAll('opacity:.55');
        return (/^0.55$/).test(mStyle.opacity)
    };
    tests['cssanimations'] = function() {
        return testPropsAll('animationName')
    };
    tests['csscolumns'] = function() {
        return testPropsAll('columnCount')
    };
    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';
        setCss((str1 + '-webkit- '.split(' ').join(str2 + str1) + prefixes.join(str3 + str1)).slice(0, -str1.length));
        return contains(mStyle.backgroundImage, 'gradient')
    };
    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect')
    };
    tests['csstransforms'] = function() {
        return !!testPropsAll('transform')
    };
    tests['csstransforms3d'] = function() {
        var ret = !!testPropsAll('perspective');
        if (ret && 'webkitPerspective' in docElement.style) {
            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3
            })
        }
        return ret
    };
    tests['csstransitions'] = function() {
        return testPropsAll('transition')
    };
    tests['fontface'] = function() {
        var bool;
        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0
        });
        return bool
    };
    tests['generatedcontent'] = function() {
        var bool;
        injectElementWithStyles(['#', mod, '{font:0/0 a}#', mod, ':after{content:"', smile, '";visibility:hidden;font:3px/1 a}'].join(''), function(node) {
            bool = node.offsetHeight >= 3
        });
        return bool
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '')
            }
        } catch (e) {}
        return bool
    };
    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');
                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(/^no$/, '')
            }
        } catch (e) {}
        return bool
    };
    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true
        } catch (e) {
            return false
        }
    };
    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true
        } catch (e) {
            return false
        }
    };
    tests['webworkers'] = function() {
        return !!window.Worker
    };
    tests['applicationcache'] = function() {
        return !!window.applicationCache
    };
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect
    };
    tests['inlinesvg'] = function() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg
    };
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')))
    };
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')))
    };

    function webforms() {
        Modernizr['input'] = (function(props) {
            for (var i = 0, len = props.length; i < len; i++) {
                attrs[props[i]] = !!(props[i] in inputElem)
            }
            if (attrs.list) {
                attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement)
            }
            return attrs
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        Modernizr['inputtypes'] = (function(props) {
            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';
                if (bool) {
                    inputElem.value = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';
                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {
                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;
                        bool = defaultView.getComputedStyle && defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' && (inputElem.offsetHeight !== 0);
                        docElement.removeChild(inputElem)
                    } else if (/^(search|tel)$/.test(inputElemType)) {} else if (/^(url|email)$/.test(inputElemType)) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false
                    } else {
                        bool = inputElem.value != smile
                    }
                }
                inputs[props[i]] = !!bool
            }
            return inputs
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '))
    }
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();
            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName)
        }
    }
    Modernizr.input || webforms();
    Modernizr.addTest = function(feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key])
                }
            }
        } else {
            feature = feature.toLowerCase();
            if (Modernizr[feature] !== undefined) {
                return Modernizr
            }
            test = typeof test == 'function' ? test() : test;
            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature
            }
            Modernizr[feature] = test
        }
        return Modernizr
    };
    setCss('');
    modElem = inputElem = null;
    (function(window, document) {
        var version = '3.7.0';
        var options = window.html5 || {};
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
        var supportsHtml5Styles;
        var expando = '_html5shiv';
        var expanID = 0;
        var expandoData = {};
        var supportsUnknownElements;
        (function() {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                supportsHtml5Styles = ('hidden' in a);
                supportsUnknownElements = a.childNodes.length == 1 || (function() {
                    (document.createElement)('a');
                    var frag = document.createDocumentFragment();
                    return (typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined')
                }())
            } catch (e) {
                supportsHtml5Styles = true;
                supportsUnknownElements = true
            }
        }());

        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild)
        }

        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements
        }

        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data
            }
            return data
        }

        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName)
            }
            if (!data) {
                data = getExpandoData(ownerDocument)
            }
            var node;
            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode()
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode()
            } else {
                node = data.createElem(nodeName)
            }
            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node
        }

        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment()
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for (; i < l; i++) {
                clone.createElement(elems[i])
            }
            return clone
        }

        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag()
            }
            ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
                    return data.createElem(nodeName)
                }
                return createElement(nodeName, ownerDocument, data)
            };
            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' + getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                data.createElem(nodeName);
                data.frag.createElement(nodeName);
                return 'c("' + nodeName + '")'
            }) + ');return n}')(html5, data.frag)
        }

        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document
            }
            var data = getExpandoData(ownerDocument);
            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' + 'mark{background:#FF0;color:#000}' + 'template{display:none}')
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data)
            }
            return ownerDocument
        }
        var html5 = {
            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
            'version': version,
            'shivCSS': (options.shivCSS !== false),
            'supportsUnknownElements': supportsUnknownElements,
            'shivMethods': (options.shivMethods !== false),
            'type': 'default',
            'shivDocument': shivDocument,
            createElement: createElement,
            createDocumentFragment: createDocumentFragment
        };
        window.html5 = html5;
        shivDocument(document)
    }(this, document));
    Modernizr._version = version;
    Modernizr._prefixes = prefixes;
    Modernizr._domPrefixes = domPrefixes;
    Modernizr._cssomPrefixes = cssomPrefixes;
    Modernizr.mq = testMediaQuery;
    Modernizr.hasEvent = isEventSupported;
    Modernizr.testProp = function(prop) {
        return testProps([prop])
    };
    Modernizr.testAllProps = testPropsAll;
    Modernizr.testStyles = injectElementWithStyles;
    Modernizr.prefixed = function(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx')
        } else {
            return testPropsAll(prop, obj, elem)
        }
    };
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') + (enableClasses ? ' js ' + classes.join(' ') : '');
    return Modernizr
})(this, this.document);
/*! 
 * carousel-3d - 0.2.0
 * http://paio-co-kr.github.io/carousel-3d/
 */
! function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(a) {
            ! function() {
                "use strict";
                var b = window.jQuery,
                    c = a("./ChildrenWrapper"),
                    d = a("./Child"),
                    e = function(a) {
                        this.el = a, this._makeOption();
                        var d = b(a).children(),
                            e = new c(this),
                            f = 0;
                        this.appendChildrenWrapper(e), d.each(function(a, c) {
                            b(c).attr("selected") && (f = a), this.appendChild(c)
                        }.bind(this)), this._prevButton = b("<div data-prev-button></div>")[0], b(this.el).append(this._prevButton), b(this._prevButton).click(this.prev.bind(this)), this._nextButton = b("<div data-next-button></div>")[0], b(this.el).append(this._nextButton), b(this._nextButton).click(this.next.bind(this)), this.rotate(f)
                    };
                e.prototype.el = null, e.prototype.option = {
                    animationDuration: 1e3
                }, e.prototype._makeOption = function() {
                    (function() {
                        var a = b("<div data-children-wrapper></div>").hide().appendTo(this.el),
                            c = b("<div data-child></div>").hide().appendTo(a).css("transition-duration");
                        a.remove(), c && (c.indexOf("ms") > 0 ? this.option.animationDuration = parseInt(c) : c.indexOf("s") > 0 && (this.option.animationDuration = 1e3 * parseInt(c)))
                    }).bind(this)()
                }, e.prototype.appendChild = function(a) {
                    this._childrenWrapperObj.appendChild(new d(this._childrenWrapperObj, a))
                }, e.prototype.appendChildrenWrapper = function(a) {
                    this._childrenWrapperObj = a, b(this.el).append(a.el)
                }, e.prototype.rotate = function(a) {
                    for (var c = this._childrenWrapperObj.numChildren(), d = Math.floor(this._childrenWrapperObj.currentIndex() - c / 2), e = Math.ceil(this._childrenWrapperObj.currentIndex() + c / 2); d > a;) a += c;
                    for (; a > e;) a -= c;
                    this._childrenWrapperObj.rotate(a), window.setTimeout(function() {
                        for (var c = a; 0 > c;) c += this._childrenWrapperObj.numChildren();
                        b(this.el).trigger("select", c % this._childrenWrapperObj.numChildren())
                    }.bind(this), this.option.animationDuration)
                }, e.prototype.prev = function() {
                    this.rotate(this._childrenWrapperObj.currentIndex() - 1)
                }, e.prototype.next = function() {
                    this.rotate(this._childrenWrapperObj.currentIndex() + 1)
                }, b.fn.Carousel3d = function() {
                    var a, b = this,
                        c = arguments[0],
                        d = Array.prototype.slice.call(arguments, 1),
                        f = b.length,
                        g = 0;
                    for (g; f > g; g += 1)
                        if ("object" == typeof c || "undefined" == typeof c ? b[g].Carousel3d = new e(b[g], c) : a = b[g].Carousel3d[c].apply(b[g].Carousel3d, d), void 0 !== a) return a;
                    return b
                }, b(function() {
                    b("[data-carousel-3d]").Carousel3d()
                })
            }()
        }, {
            "./Child": 2,
            "./ChildrenWrapper": 3
        }],
        2: [function(a, b) {
            ! function() {
                "use strict";
                var a = window.jQuery,
                    c = window.Modernizr,
                    d = function(b, c) {
                        this._childrenWrapperObj = b, this._content = c, this.el = a("<div data-child />")[0], this._frame = a("<div data-child-frame />")[0], this._contentWrapper = a("<div data-content-wrapper />")[0], a(this.el).append(this._frame), a(this._frame).append(this._contentWrapper), a(this._contentWrapper).append(c), this._hideUntilLoad()
                    };
                d.prototype._childrenWrapperObj = null, d.prototype._content = null, d.prototype.el = null, d.prototype._contentWrapper = null, d.prototype._hideUntilLoad = function() {
                    a(this._content).css("visibility", "hidden"), a(this._contentWrapper).waitForImages(function() {
                        setTimeout(function() {
                            this._resize(), a(this._content).resize(this._resize.bind(this)), a(this.el).resize(this._resize.bind(this)), a(this._content).css("visibility", "visible")
                        }.bind(this), 1)
                    }.bind(this))
                }, d.prototype._resize = function() {
                    a(this._contentWrapper).width(a(this._content).outerWidth()), a(this._contentWrapper).height(a(this._content).outerHeight());
                    var b = a(this._frame).outerWidth() - a(this._frame).innerWidth(),
                        d = a(this._frame).outerHeight() - a(this._frame).innerHeight(),
                        e = (a(this.el).innerWidth() - b) / a(this._content).outerWidth(),
                        f = (a(this.el).innerHeight() - d) / a(this._content).outerHeight(),
                        g = Math.min(e, f),
                        h = Math.floor((a(this.el).innerWidth() - b - a(this._content).outerWidth() * g) / 2),
                        i = Math.floor((a(this.el).innerHeight() - d - a(this._content).outerHeight() * g) / 2);
                    a(this._frame).width(a(this._content).outerWidth() * g), a(this._frame).height(a(this._content).outerHeight() * g), a(this.el).css("padding-left", h + "px"), a(this.el).css("padding-top", i + "px"), c.csstransforms ? (a(this._contentWrapper).css("transform", "scale(" + g + ")"), a(this._contentWrapper).css("-ms-transform", "scale(" + g + ")"), a(this._contentWrapper).css("-moz-transform", "scale(" + g + ")"), a(this._contentWrapper).css("-webkit-transform", "scale(" + g + ")")) : (a(this._contentWrapper).css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + g + ", M12=0, M21=0, M22=" + g + ', SizingMethod="auto expand")'), a(this._contentWrapper).css("-ms-filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + g + ", M12=0, M21=0, M22=" + g + ', SizingMethod="auto expand")'))
                }, b.exports = d
            }()
        }, {}],
        3: [function(a, b) {
            ! function() {
                "use strict";
                var a = window.jQuery,
                    c = function(b) {
                        this._childObjArray = [], this._carousel3dObj = b, this.el = a("<div data-children-wrapper></div>")[0], a(b.el).resize(this._resize.bind(this))
                    };
                c.prototype.el = null, c.prototype._carousel3dObj = null, c.prototype._childObjArray = [], c.prototype._currentIndex = 0, c.prototype._tz = 0, c.prototype._spacing = .05, c.prototype.currentIndex = function(a) {
                    return "undefined" == typeof a || "object" == typeof a || isNaN(a) || (this._currentIndex = a), this._currentIndex
                }, c.prototype._resize = function() {
                    this._tz = a(this.el).outerWidth() / 2 / Math.tan(Math.PI / this._childObjArray.length), this.rotate(this._currentIndex)
                }, c.prototype.appendChild = function(b) {
                    this._childObjArray.push(b), a(this.el).append(b.el), this._resize()
                }, c.prototype.numChildren = function() {
                    return this._childObjArray.length
                }, c.prototype.rotate = function(b) {
                    this.currentIndex(b);
                    var c = 360 / this._childObjArray.length,
                        d = 0,
                        e = 0;
                    if (Modernizr.csstransforms3d)
                        for (d = 0; d < this._childObjArray.length; d += 1) {
                            e = c * (d - b);
                            var f = "";
                            f += " translateZ(" + -this._tz * (1 + this._spacing) + "px)", f += " rotateY(" + e + "deg)", f += " translateZ(" + this._tz * (1 + this._spacing) + "px)", a(this._childObjArray[d].el).css("transform", f), a(this._childObjArray[d].el).css("-ms-transform", f), a(this._childObjArray[d].el).css("-moz-transform", f), a(this._childObjArray[d].el).css("-webkit-transform", f), a(this._childObjArray[d].el).css("opacity", Math.cos(Math.PI / 180 * e)), a(this._childObjArray[d].el).css("z-index", Math.floor(100 * (Math.cos(Math.PI / 180 * e) + 1)))
                        } else {
                            var g = a(this.el).width(),
                                h = a(this.el).height(),
                                i = function(b, d) {
                                    if ("_degree" === d.prop) {
                                        var e = Math.sin(Math.PI / 180 * b),
                                            f = Math.cos(Math.PI / 180 * b),
                                            i = c / 2,
                                            j = Math.abs(Math.sin(Math.PI / 180 * (b + i)) - Math.sin(Math.PI / 180 * (b - i))) / (2 * Math.sin(Math.PI / 180 * i)) * f,
                                            k = (f + 1) / 2,
                                            l = (j + 1) / 2,
                                            m = (e * g / 2 + g * l / 2 * e) / 2;
                                        a(d.elem).css("z-index", Math.floor(100 * (f + 1))), Modernizr.csstransforms ? (a(d.elem).css("left", m + "px"), a(d.elem).css("opacity", f), a(d.elem).css("transform", "scale(" + l + ", " + k + ")"), a(d.elem).css("-ms-transform", "scale(" + l + ", " + k + ")"), a(d.elem).css("-moz-transform", "scale(" + l + ", " + k + ")"), a(d.elem).css("-webkit-transform", "scale(" + l + ", " + k + ")")) : (a(d.elem).css("top", Math.floor((h - h * k) / 2) + "px"), a(d.elem).css("left", (g - g * l) / 2 + m + "px"), a(d.elem).css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + l + ", M12=0, M21=0, M22=" + k + "), progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 100 * f + ")"), a(d.elem).css("-ms-filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + l + ", M12=0, M21=0, M22=" + k + "), progid:DXImageTransform.Microsoft.Alpha(Opacity=" + 100 * f + ")"))
                                    }
                                };
                            for (d = 0; d < this._childObjArray.length; d += 1) e = c * (d - b), a(this._childObjArray[d].el).animate({
                                _degree: e
                            }, {
                                duration: this._carousel3dObj.option.animationDuration,
                                step: i.bind(this)
                            })
                        }
                }, b.exports = c
            }()
        }, {}]
    }, {}, [1]),
    function() {
        "use strict";
        var a = $.fn.resize;
        $.fn.resize = function(b) {
            var c = $(this).width(),
                d = $(this).height();
            a.call(this, function() {
                ($(this).width() !== c || $(this).height() !== d) && (c = $(this).width(), d = $(this).height(), b(this))
            }.bind(this))
        }
    }();
/*!
 * jQuery Easing - 1.3
 * http://gsgd.co.uk/sandbox/jquery/easing/
 */
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});
/*!
 * Scripts
 */
head.ready(function() {
    (function(globals) {
        "use strict";
        globals.GLOB = {};
    }((1, eval)('this')));


    var Default = {
        utils: {
            links: function() {
                $('a[rel*=external]').on('click', function(e) {
                    e.preventDefault();
                    window.open($(this).attr('href'));
                });
            },
            mails: function() {
                $('.email').each(function(index) {
                    em = $(this).text().replace('//', '@').replace(/\//g, '.');
                    $(this).text(em).attr('href', 'mailto:' + em);
                });
            },
            forms: function() {
                $('.form-a input, .form-a textarea, .search-a input, #contact input, #contact textarea, .form-b input').each(function() {
                    if ($(this).val() !== '') $(this).parent().children('label').css('margin-top', '-3000em');
                }).on('focus', function() {
                    $(this).parent().children('label').css('margin-top', '-3000em');
                }).on('blur', function() {
                    if ($(this).val() === '') $(this).parent().children('label').css('margin-top', 0);
                });

                xa = $('fieldset > *, .nav-a');
                xb = parseInt(xa.size());
                xa.each(function() {
                    $(this).css({
                        'z-index': xb
                    });
                    xb--;
                });

                $('.form-a [required]').each(function() {
                    $(this).prev('label').append('<span class="scheme-a"> *</span>');
                });

                $('#ajax-form-send button').on('click', function() {
                    var url = "functions.php";
                    var send = true;
                    $("#ajax-form-send").find('[required]').each(function() {
                        if ($(this).val() == "") {
                            send = false;
                        }
                    });

                    if (send) {
                        $.post(
                            url, {
                                ajaxForm: "ajax_send_contact_email",
                                name: $("#ajax-form-send").find("#ca").val(),
                                email: $("#ajax-form-send").find("#cb").val(),
                                phone: $("#ajax-form-send").find("#cc").val(),
                                country: $("#ajax-form-send").find("#cd").val(),
                                message: $("#ajax-form-send").find("#ce").val()
                            },
                            function(response) {
                                if (response['status'] == true) {
                                    $("#ajax-form-send").find("#ca").val("");
                                    $("#ajax-form-send").find("#cb").val("");
                                    $("#ajax-form-send").find("#cc").val("");
                                    $("#ajax-form-send").find("#cd").val("");
                                    $("#ajax-form-send").find("#ce").val("");
                                    $("#ajax-form-send").parent().find("header").append('<div id="confirm-message" style="text-align:center"><span style="color:red;  font-size: 15px;">Your message has been sent.</span></div>');
                                } else {
                                    $("#ajax-form-send").children('fieldset').append('<div id="confirm-message" style="text-align:center"><span style="color:red;  font-size: 15px;">' + response.details + '</span></div>');
                                }
                            }, 'json');

                        return false;
                    }
                });
            },
            date: function() {
                $('#footer .date').text((new Date).getFullYear());
            },
            maps: function() {
                $('#contact').append('<div class="map" id="mapa"></div>');

                if ($('#mapa').size()) {
                    var mapa, styledMap, mapOptions, styles, markerOpts, infowindow;
                    var styles = [{
                        featureType: 'landscape',
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 65
                        }, {
                            visibility: 'on'
                        }]
                    }, {
                        featureType: 'poi',
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 51
                        }, {
                            visibility: 'off'
                        }]
                    }, {
                        featureType: 'road.highway',
                        stylers: [{
                            saturation: -100
                        }, {
                            visibility: 'simplified'
                        }]
                    }, {
                        featureType: 'road.arterial',
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 30
                        }, {
                            visibility: 'on'
                        }]
                    }, {
                        featureType: 'road.local',
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 40
                        }, {
                            visibility: 'on'
                        }]
                    }, {
                        featureType: 'transit',
                        stylers: [{
                            saturation: -100
                        }, {
                            visibility: 'simplified'
                        }]
                    }, {
                        featureType: 'administrative.province',
                        stylers: [{
                            visibility: 'off'
                        }]
                    }, {
                        featureType: 'water',
                        elementType: 'labels',
                        stylers: [{
                            visibility: 'on'
                        }, {
                            lightness: -25
                        }, {
                            saturation: -100
                        }]
                    }, {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{
                            hue: '#ffff00'
                        }, {
                            lightness: -25
                        }, {
                            saturation: -97
                        }]
                    }];
                    styledMap = new google.maps.StyledMapType(styles, {
                        name: 'Styled Map'
                    });
                    mapOptions = {
                        zoom: 16,
                        center: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                        mapTypeId: google.maps.MapTypeId.SATELLITE,
                        disableDefaultUI: true,
                        draggable: true,
                        zoomControl: false,
                        scrollwheel: false,
                        disableDoubleClickZoom: false,
                        mapTypeControlOptions: {
                            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                        }
                    };
                    mapa = new google.maps.Map(document.getElementById('mapa'), mapOptions);

                    mapa.mapTypes.set('map_style', styledMap);
                    mapa.setMapTypeId('map_style');
                    if ($('html').hasClass('theme-a')) {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin-theme-a.png'
                        }
                    } else if ($('html').hasClass('theme-b')) {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin-theme-b.png'
                        }
                    } else if ($('html').hasClass('theme-c')) {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin-theme-c.png'
                        }
                    } else if ($('html').hasClass('theme-d')) {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin-theme-d.png'
                        }
                    } else if ($('html').hasClass('theme-e')) {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin-theme-e.png'
                        }
                    } else {
                        markerOpts = {
                            position: new google.maps.LatLng(51.5073509, -0.12775829999998223),
                            map: mapa,
                            icon: 'images/pin.png'
                        }
                    }
                    new google.maps.Marker(markerOpts);
                }
            },
            responsive: function() {
                if (!$.browser.mobile) {
                    $('select').semanticSelect();
                    $('.module-a, .list-b').addClass('unscrolled').each(function() {
                        $(this).waypoint(function() {
                            $(this).addClass('shown');
                        }, {
                            offset: '65%'
                        });
                    });
                    $('[class*="mobile"], figure').parents('article').addClass('unscrolled').each(function() {
                        $(this).waypoint(function() {
                            $(this).addClass('shown');
                        }, {
                            offset: '65%'
                        });
                    });
                    $(window).each(function() {
                        $(this).waypoint(function() {
                            $('#clone').toggleClass('active').find('img').attr('src', 'img/logo2.png');;
                        }, {
                            offset: -$('#featured, #welcome').outerHeight()
                        });
                    });
                    $('html.csstransitions .counter').parents('article').each(function() {
                        $(this).waypoint(function() {
                            $('.counter .v').each(function() {
                                $(this).animateNumber({
                                    easing: 'easeOutSine',
                                    number: parseInt($(this).parents('.counter').text()),
                                    numberStep: function(now, tween) {
                                        var floored_number = Math.floor(now) / 1000,
                                            floored_number = floored_number.toFixed(3);
                                        floored_number = floored_number.toString().replace('.', '');
                                        $(tween.elem).html(floored_number).lettering();
                                    }
                                }, 3000).removeClass('v');
                            });
                        }, {
                            offset: '75%'
                        });
                    });
                };
            },
            miscellaneous: function() {
                $('#top, #content.a > .vid figure a, .gallery-b > li').append('<div class="fit-a"><div></div></div>');
                $('#nav li > ul').parent().addClass('sub');
                $('#top').each(function() {
                    $(this).clone().attr('id', 'clone').insertAfter('#featured, #welcome').find('#nav').removeAttr('id').parent().find('#skip').remove();
                });
                $('#top > .fit-a, #clone > .fit-a, .gallery-a > li > a').on('click', function() {
                    $(this).parent().toggleClass('active');
                });
                $('.list-a li').wrapInner('<span class="inner"></span>');
                $('.list-b').each(function() {
                    tn = 1;
                    $(this).children('li:not([class*=mobile])').each(function() {
                        $(this).addClass('c' + tn).prepend('<span class="no"></span> ');
                        tn++;
                    });
                });
                $('.gallery-a, .gallery-b').each(function() {
                    $(this).addClass('mobile-hide').clone().removeClass('mobile-hide').addClass('mobile-only').insertAfter($(this));
                });
                $('.gallery-c ul, .news-d').each(function() {
                    $(this).addClass('regular-hide').clone().removeClass('regular-hide').addClass('regular-only').insertAfter($(this));
                    $(this).addClass('regular-hide').clone().removeClass('regular-hide').addClass('tablet-only').insertAfter($(this));
                    $(this).addClass('regular-hide').clone().removeClass('regular-hide').addClass('mobile-only').insertAfter($(this));
                });
                $('.slider-a, .news-c > div, .gallery-c ul, .news-d').wrapInner('<div class="inner"></div>');
                $('.slider-a li .news-c > div article, .gallery-c li, .news-d article, .slider-a li').wrap('<div></div>');
                $('.slider-a > .inner').each(function() {
                    $(this).bxSlider({
                        pager: false,
                        controls: true,
                        useCSS: false,
                        adaptiveHeight: true
                    });
                });
                $('.news-c > div > .inner').each(function() {
                    $(this).bxSlider({
                        pager: true,
                        controls: true,
                        useCSS: false,
                        adaptiveHeight: true,
                        pagerType: 'short',
                        adaptiveHeight: true
                    });
                });
                $('.gallery-c ul > .inner').each(function() {
                    if ($(this).parent().hasClass('regular-hide')) {
                        $(this).bxSlider({
                            pager: true,
                            controls: false,
                            useCSS: false,
                            adaptiveHeight: true,
                            minSlides: 1,
                            maxSlides: 3,
                            moveSlides: 3,
                            slideWidth: $(window).width() / 3
                        });
                    }
                    if ($(this).parent().hasClass('regular-only')) {
                        $(this).bxSlider({
                            pager: true,
                            controls: false,
                            useCSS: false,
                            adaptiveHeight: true,
                            minSlides: 1,
                            maxSlides: 2,
                            moveSlides: 2,
                            slideWidth: $(window).width() / 2
                        });
                    }
                    if ($(this).parent().hasClass('tablet-only') || $(this).parent().hasClass('mobile-only')) {
                        $(this).bxSlider({
                            pager: true,
                            controls: false,
                            useCSS: false,
                            adaptiveHeight: true
                        });
                    }
                });
                $('.news-d').each(function() {
                    if ($(this).hasClass('regular-hide')) {
                        $(this).children('.inner').each(function() {
                            $(this).bxSlider({
                                pager: true,
                                controls: false,
                                useCSS: false,
                                adaptiveHeight: true,
                                minSlides: 1,
                                maxSlides: 3,
                                moveSlides: 3,
                                slideWidth: 310,
                                slideMargin: 34
                            });
                        });
                    }
                    if ($(this).hasClass('regular-only')) {
                        $(this).children('.inner').each(function() {
                            $(this).bxSlider({
                                pager: true,
                                controls: false,
                                useCSS: false,
                                adaptiveHeight: true,
                                minSlides: 1,
                                maxSlides: 3,
                                moveSlides: 3,
                                slideWidth: 297,
                                slideMargin: 34
                            });
                        });
                    }
                    if ($(this).hasClass('tablet-only')) {
                        $(this).children('.inner').each(function() {
                            $(this).bxSlider({
                                pager: true,
                                controls: false,
                                useCSS: false,
                                adaptiveHeight: true,
                                minSlides: 1,
                                maxSlides: 2,
                                moveSlides: 2,
                                slideWidth: 342,
                                slideMargin: 34
                            });
                        });
                    }
                    if ($(this).hasClass('mobile-only')) {
                        $(this).children('.inner').each(function() {
                            $(this).bxSlider({
                                pager: true,
                                controls: false,
                                useCSS: false,
                                adaptiveHeight: true,
                                slideMargin: 10
                            });
                        });
                    }
                });
                $('.gallery-a.mobile-only, .gallery-b.mobile-only').wrapInner('<div class="inner"></div>').children('.inner').each(function() {
                    $(this).bxSlider({
                        pager: true,
                        controls: false,
                        useCSS: false,
                        adaptiveHeight: true,
                        slideMargin: 10
                    });
                });
                $('a[href*=youtube], a[href*=vimeo], a[href*=metacafe], a[href*=dailymotion]').fancybox({
                    helpers: {
                        media: {}
                    }
                });
                $('.counter > span').addClass('v');
                $('#content.a > .vid figure a > .fit-a').each(function() {
                    $(this).css({
                        'background-image': 'url("' + $(this).parents('figure').find('img').attr('src') + '")'
                    });
                });
                $('html.csstransitions .slider-b').attr('data-carousel-3d', true);
                $('html.lt-ie9 .slider-b').removeClass('slider-b').addClass('slider-bb').wrapInner('<div class="inner"></div>');
                $('.gallery-b li > a > img').parent('a').each(function() {
                    $(this).clone().addClass('link').appendTo($(this).parents('li').find('div:not(.fit-a)'));
                    $(this).clone().addClass('link').appendTo($(this).parents('li'));
                });
                $('.gallery-c ul li > a').each(function() {
                    $(this).clone().wrap('<div class="link"></div>').parent().insertAfter($(this));
                    $(this).clone().addClass('main').insertAfter($(this));
                });
                $('.gallery-b li > div:not(.fit-a), .gallery-c ul li > div a, #top h1 a img, #clone h1 a img').each(function() {
                    $(this).css('margin-top', -$(this).outerHeight() * .5);
                });
                // $('.slider-b').addClass('mobile-hide').after('<div class="slider-ba mobile-only"><div class="inner"></div></div>').children('li').each(function() {
                //     $(this).clone().removeAttr('style').appendTo($(this).parents('.slider-b').next('.slider-ba').children('.inner'));
                // });
                $('.slider-ba > .inner, .slider-bb > .inner').each(function() {
                    $(this).bxSlider({
                        pager: false,
                        controls: true,
                        useCSS: false,
                        adaptiveHeight: true
                    });
                });
                $('img.zoomin, .zoomin img').imageLens({
                    lensSize: 333,
                    borderSize: 5,
                    borderColor: "#fff"
                });
                $('.news-d').parent().addClass('has-news-d');
                $('.nav-a :header [class*="icon"], .nav-a > ul li [class*="icon"]').parent().addClass('has-icon');
                $('.nav-a li span:not(.scheme-a)').parents('li').addClass('has-span');
                $('.news-e article').each(function() {
                    $(this).find('a:first').clone().addClass('link').appendTo($(this));
                }).find('a').parents('article').addClass('has-link');
                $('html[data-pattern]').each(function() {
                    $(this).find('#welcome, #featured, #content.a > .vb').addClass('data-pattern').css('background-image', 'url(' + $(this).attr('data-pattern') + ')')
                });
                $('.counter .v').lettering();
                $('.gallery-a li').each(function() {
                    if (!$(this).find('img').size()) {
                        $(this).addClass('plain');
                    }
                });
            }
        },
        ie: {
            css: function() {
                if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
                    $('body').append('<p class="lt-ie9">You are using an outdated browser. Please <a target="_blank" href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>').css('padding-top', '28px');
                    $('input[placeholder], textarea[placeholder]').placeholder();
                    $(':last-child').addClass('last-child');
                }
            },
            pie: function() {
                if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
                    if (window.PIE) {
                        $('input[type="color"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="range"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"], .news-a img, .news-a header ul li img, textarea, #clone nav > ul > li.a > a, .nav-a, .nav-a ul li a span, .social-a li a, .download-a li a, .list-a li i, .slider-a li img, .list-c > li, .comments-a li > span, .comments-a img, .gallery-c ul li a > span .link, .news-d article, .link-a.a a, .list-c > li > span span, .list-b li .no').each(function() {
                            PIE.attach(this);
                        });
                    }
                }
                if ($.browser.msie && parseInt($.browser.version, 10) == 8) {
                    if (window.PIE) {
                        $('button, input[type="button"], input[type="reset"], input[type="submit"]').each(function() {
                            PIE.attach(this);
                        });
                    }
                }
            }
        }
    };

    var countDown = 'http://wallstreetcn.com/operation/counter/get/14?callback=_counter';

    // function hasChance() {
    //     // get data
    //     $.ajax({
    //         url: countDown,
    //         type: 'get',
    //         dataType: 'jsonp',
    //         success: function(data) {
    //             $('#num').text(data);
    //             D
    //         },
    //         error: function(xhr, textStatus) {
    //             // 
    //         }
    //     })
    // };
    // hasChance()
    Default.utils.responsive();
    Default.utils.links();
    Default.utils.mails();
    Default.utils.forms();
    Default.utils.date();
    Default.utils.miscellaneous();

    Default.ie.css();
    Default.ie.pie();

    window.initialize = function() {
            Default.utils.maps();
        }
        // function loadScript(){
        //  var script = document.createElement('script');
        //  script.type = 'text/javascript';
        //  script.src = 'http://maps.google.com/maps/api/js?sensor=false&language=en&callback=initialize';
        //  document.body.appendChild(script);
        // }    
        // window.onload = loadScript;
});
