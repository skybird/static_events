!function() {
    var t = {},
    e = {};
    t.context = function(t, n) {
        var i = arguments.length;
        if (i > 1) e[t] = n;
        else if (1 == i) {
            if ("object" != typeof t) return e[t];
            for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
        }
    },
    "F" in window || (window.F = t)
} ();
var require, define; !
function(t) {
    function e(t, e) {
        var r = i[t] || (i[t] = []);
        r.push(e);
        var o = s[t] || {},
        c = o.pkg ? u[o.pkg].url: o.url || t;
        if (! (c in a)) {
            a[c] = !0;
            var l = document.createElement("script");
            l.type = "text/javascript",
            l.src = c,
            n.appendChild(l)
        }
    }
    var n = document.getElementsByTagName("head")[0],
    i = {},
    r = {},
    o = {},
    a = {},
    s = {},
    u = {};
    define = function(t, e) {
        r[t] = e;
        var n = i[t];
        if (n) {
            for (var o = n.length - 1; o >= 0; --o) n[o]();
            delete i[t]
        }
    },
    require = function(t) {
        t = require.alias(t);
        var e = o[t];
        if (e) return e.exports;
        var n = r[t];
        if (!n) throw Error("Cannot find module `" + t + "`");
        e = o[t] = {
            exports: {}
        };
        var i = "function" == typeof n ? n.apply(e, [require, e.exports, e]) : n;
        return i && (e.exports = i),
        e.exports
    },
    require.async = function(n, i) {
        function o(t) {
            for (var n = t.length - 1; n >= 0; --n) {
                var i = t[n];
                if (! (i in r || i in c)) {
                    c[i] = !0,
                    l++,
                    e(i, a);
                    var u = s[i];
                    u && "deps" in u && o(u.deps)
                }
            }
        }
        function a() {
            if (0 == l--) {
                var e, r, o = [];
                for (e = 0, r = n.length; r > e; ++e) o[e] = require(n[e]);
                i && i.apply(t, o)
            }
        }
        "string" == typeof n && (n = [n]);
        for (var u = n.length - 1; u >= 0; --u) n[u] = require.alias(n[u]);
        var c = {},
        l = 0;
        o(n),
        a()
    },
    require.resourceMap = function(t) {
        var e, n;
        n = t.res;
        for (e in n) n.hasOwnProperty(e) && (s[e] = n[e]);
        n = t.pkg;
        for (e in n) n.hasOwnProperty(e) && (u[e] = n[e])
    },
    require.alias = function(t) {
        return t
    },
    define.amd = {
        jQuery: !0,
        version: "1.0.0"
    }
} (this),
define("zepto",
function(t, e, n) { !
    function(t) {
        String.prototype.trim === t && (String.prototype.trim = function() {
            return this.replace(/^\s+/, "").replace(/\s+$/, "")
        }),
        Array.prototype.reduce === t && (Array.prototype.reduce = function(e) {
            if (void 0 === this || null === this) throw new TypeError;
            var n, i = Object(this),
            r = i.length >>> 0,
            o = 0;
            if ("function" != typeof e) throw new TypeError;
            if (0 == r && 1 == arguments.length) throw new TypeError;
            if (arguments.length >= 2) n = arguments[1];
            else for (;;) {
                if (o in i) {
                    n = i[o++];
                    break
                }
                if (++o >= r) throw new TypeError
            }
            for (; r > o;) o in i && (n = e.call(t, n, i[o], o, i)),
            o++;
            return n
        })
    } ();
    var i = function() {
        function t(t) {
            return "[object Function]" == R.call(t)
        }
        function e(t) {
            return t instanceof Object
        }
        function n(e) {
            var n, i;
            if ("[object Object]" !== R.call(e)) return ! 1;
            if (i = t(e.constructor) && e.constructor.prototype, !i || !hasOwnProperty.call(i, "isPrototypeOf")) return ! 1;
            for (n in e);
            return n === v || hasOwnProperty.call(e, n)
        }
        function i(t) {
            return t instanceof Array
        }
        function r(t) {
            return "number" == typeof t.length
        }
        function o(t) {
            return t.filter(function(t) {
                return t !== v && null !== t
            })
        }
        function a(t) {
            return t.length > 0 ? [].concat.apply([], t) : t
        }
        function s(t) {
            return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
        }
        function u(t) {
            return t in S ? S[t] : S[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
        }
        function c(t, e) {
            return "number" != typeof e || O[s(t)] ? e: e + "px"
        }
        function l(t) {
            var e, n;
            return P[t] || (e = C.createElement(t), C.body.appendChild(e), n = A(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), P[t] = n),
            P[t]
        }
        function h(t, e, i) {
            for (g in e) i && n(e[g]) ? (n(t[g]) || (t[g] = {}), h(t[g], e[g], i)) : e[g] !== v && (t[g] = e[g])
        }
        function f(t, e) {
            return e === v ? y(t) : y(t).filter(e)
        }
        function p(e, n, i, r) {
            return t(n) ? n.call(e, i, r) : n
        }
        function d(t, e, n) {
            var i = t % 2 ? e: e.parentNode;
            i ? i.insertBefore(n, t ? 1 == t ? i.firstChild: 2 == t ? e: null: e.nextSibling) : y(n).remove()
        }
        function m(t, e) {
            e(t);
            for (var n in t.childNodes) m(t.childNodes[n], e)
        }
        var v, g, y, w, b, x, E = [],
        T = E.slice,
        C = window.document,
        P = {},
        S = {},
        A = C.defaultView.getComputedStyle,
        O = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        },
        j = /^\s*<(\w+|!)[^>]*>/,
        N = C.__proto__ ? 0 : 1,
        D = [1, 3, 8, 9, 11],
        k = ["after", "prepend", "before", "append"],
        q = C.createElement("table"),
        M = C.createElement("tr"),
        X = {
            tr: C.createElement("tbody"),
            tbody: q,
            thead: q,
            tfoot: q,
            td: M,
            th: M,
            "*": C.createElement("div")
        },
        Y = /complete|loaded|interactive/,
        F = /^\.([\w-]+)$/,
        L = /^#([\w-]+)$/,
        z = /^[\w-]+$/,
        R = {}.toString,
        B = {},
        $ = C.createElement("div");
        return B.matches = function(t, e) {
            if (!t || 1 !== t.nodeType) return ! 1;
            var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector || t.msMatchesSelector;
            if (n) return n.call(t, e);
            var i, r = t.parentNode,
            o = !r;
            return o && (r = $).appendChild(t),
            i = ~B.qsa(r, e).indexOf(t),
            o && $.removeChild(t),
            i
        },
        b = function(t) {
            return t.replace(/-+(.)?/g,
            function(t, e) {
                return e ? e.toUpperCase() : ""
            })
        },
        x = function(t) {
            return t.filter(function(e, n) {
                return t.indexOf(e) == n
            })
        },
        B.fragment = function(t, e) {
            e === v && (e = j.test(t) && RegExp.$1),
            e in X || (e = "*");
            var n = X[e];
            return n.innerHTML = "" + t,
            y.each(T.call(n.childNodes),
            function() {
                n.removeChild(this)
            })
        },
        B.Z = function(t, e) {
            return t = t || [],
            N ? y.extend(t, y.fn) : t.__proto__ = arguments.callee.prototype,
            t.selector = e || "",
            t.isZ = !0,
            t
        },
        B.isZ = function(t) {
            return t.isZ
        },
        B.init = function(e, r) {
            if (e) {
                if (t(e)) return y(C).ready(e);
                if (B.isZ(e)) return e;
                var a;
                if (i(e)) a = o(e);
                else if (n(e)) a = [y.extend({},
                e)],
                e = null;
                else if (D.indexOf(e.nodeType) >= 0 || e === window) a = [e],
                e = null;
                else if (j.test(e)) a = B.fragment(e.trim(), RegExp.$1),
                e = null;
                else {
                    if (r !== v) return y(r).find(e);
                    a = B.qsa(C, e)
                }
                return B.Z(a, e)
            }
            return B.Z()
        },
        y = function(t, e) {
            return B.init(t, e)
        },
        y.extend = function(t) {
            var e, n = T.call(arguments, 1);
            return "boolean" == typeof t && (e = t, t = n.shift()),
            n.forEach(function(n) {
                h(t, n, e)
            }),
            t
        },
        B.qsa = function(t, e) {
            var n;
            return t === C && L.test(e) ? (n = t.getElementById(RegExp.$1)) ? [n] : E: 1 !== t.nodeType && 9 !== t.nodeType ? E: T.call(F.test(e) ? t.getElementsByClassName(RegExp.$1) : z.test(e) ? t.getElementsByTagName(e) : t.querySelectorAll(e))
        },
        y.isFunction = t,
        y.isObject = e,
        y.isArray = i,
        y.isPlainObject = n,
        y.isWp = N,
        y.inArray = function(t, e, n) {
            return E.indexOf.call(e, t, n)
        },
        y.trim = function(t) {
            return t.trim()
        },
        y.uuid = 0,
        y.map = function(t, e) {
            var n, i, o, s = [];
            if (r(t)) for (i = 0; i < t.length; i++) n = e(t[i], i),
            null != n && s.push(n);
            else for (o in t) n = e(t[o], o),
            null != n && s.push(n);
            return a(s)
        },
        y.each = function(t, e) {
            var n, i;
            if (r(t)) {
                for (n = 0; n < t.length; n++) if (e.call(t[n], n, t[n]) === !1) return t
            } else for (i in t) if (e.call(t[i], i, t[i]) === !1) return t;
            return t
        },
        y.fn = {
            forEach: E.forEach,
            reduce: E.reduce,
            push: E.push,
            indexOf: E.indexOf,
            concat: E.concat,
            map: function(t) {
                return y.map(this,
                function(e, n) {
                    return t.call(e, n, e)
                })
            },
            slice: function() {
                return y(T.apply(this, arguments))
            },
            ready: function(t) {
                return ! Y.test(C.readyState) || N && "interactive" == C.readyState ? C.addEventListener("DOMContentLoaded",
                function() {
                    t(y)
                },
                !1) : t(y),
                this
            },
            get: function(t) {
                return t === v ? T.call(this) : this[t]
            },
            toArray: function() {
                return this.get()
            },
            size: function() {
                return this.length
            },
            remove: function() {
                return this.each(function() {
                    null != this.parentNode && this.parentNode.removeChild(this)
                })
            },
            each: function(t) {
                return this.forEach(function(e, n) {
                    t.call(e, n, e)
                }),
                this
            },
            filter: function(t) {
                return y([].filter.call(this,
                function(e) {
                    return B.matches(e, t)
                }))
            },
            add: function(t, e) {
                return y(x(this.concat(y(t, e))))
            },
            is: function(t) {
                return this.length > 0 && B.matches(this[0], t)
            },
            not: function(e) {
                var n = [];
                if (t(e) && e.call !== v) this.each(function(t) {
                    e.call(this, t) || n.push(this)
                });
                else {
                    var i = "string" == typeof e ? this.filter(e) : r(e) && t(e.item) ? T.call(e) : y(e);
                    this.forEach(function(t) {
                        i.indexOf(t) < 0 && n.push(t)
                    })
                }
                return y(n)
            },
            eq: function(t) {
                return - 1 === t ? this.slice(t) : this.slice(t, +t + 1)
            },
            first: function() {
                var t = this[0];
                return t && !e(t) ? t: y(t)
            },
            last: function() {
                var t = this[this.length - 1];
                return t && !e(t) ? t: y(t)
            },
            find: function(t) {
                var e;
                return e = 1 == this.length ? B.qsa(this[0], t) : this.map(function() {
                    return B.qsa(this, t)
                }),
                y(e)
            },
            closest: function(t, e) {
                for (var n = this[0]; n && !B.matches(n, t);) n = n !== e && n !== C && n.parentNode;
                return y(n)
            },
            parents: function(t) {
                for (var e = [], n = this; n.length > 0;) n = y.map(n,
                function(t) {
                    return (t = t.parentNode) && t !== C && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
                });
                return f(e, t)
            },
            parent: function(t) {
                return f(x(this.pluck("parentNode")), t)
            },
            children: function(t) {
                return f(this.map(function() {
                    return T.call(this.children)
                }), t)
            },
            siblings: function(t) {
                return f(this.map(function(t, e) {
                    return T.call(e.parentNode.children).filter(function(t) {
                        return t !== e
                    })
                }), t)
            },
            empty: function() {
                return this.each(function() {
                    this.innerHTML = ""
                })
            },
            pluck: function(t) {
                return this.map(function() {
                    return this[t]
                })
            },
            show: function() {
                return this.each(function() {
                    "none" == this.style.display && (this.style.display = ""),
                    "none" == A(this, "").getPropertyValue("display") && (this.style.display = l(this.nodeName))
                })
            },
            replaceWith: function(t) {
                return this.before(t).remove()
            },
            wrap: function(t) {
                return this.each(function() {
                    y(this).wrapAll(y(t)[0].cloneNode(!1))
                })
            },
            wrapAll: function(t) {
                return this[0] && (y(this[0]).before(t = y(t)), t.append(this)),
                this
            },
            unwrap: function() {
                return this.parent().each(function() {
                    y(this).replaceWith(y(this).children())
                }),
                this
            },
            clone: function() {
                return y(this.map(function() {
                    return this.cloneNode(!0)
                }))
            },
            hide: function() {
                return this.css("display", "none")
            },
            toggle: function(t) {
                return (t === v ? "none" == this.css("display") : t) ? this.show() : this.hide()
            },
            prev: function() {
                return y(this.pluck("previousElementSibling"))
            },
            next: function() {
                return y(this.pluck("nextElementSibling"))
            },
            html: function(t) {
                return t === v ? this.length > 0 ? this[0].innerHTML: null: this.each(function(e) {
                    var n = this.innerHTML;
                    y(this).empty().append(p(this, t, e, n))
                })
            },
            text: function(t) {
                return t === v ? this.length > 0 ? this[0].textContent: null: this.each(function() {
                    this.textContent = t
                })
            },
            attr: function(t, n) {
                var i;
                return "string" == typeof t && n === v ? 0 == this.length || 1 !== this[0].nodeType ? v: "value" == t && "INPUT" == this[0].nodeName ? this.val() : !(i = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : i: this.each(function(i) {
                    if (1 === this.nodeType) if (e(t)) for (g in t) this.setAttribute(g, t[g]);
                    else this.setAttribute(t, p(this, n, i, this.getAttribute(t)))
                })
            },
            removeAttr: function(t) {
                return this.each(function() {
                    1 === this.nodeType && this.removeAttribute(t)
                })
            },
            prop: function(t, e) {
                return e === v ? this[0] ? this[0][t] : v: this.each(function(n) {
                    this[t] = p(this, e, n, this[t])
                })
            },
            data: function(t, e) {
                var n = this.attr("data-" + s(t), e);
                return null !== n ? n: v
            },
            val: function(t) {
                return t === v ? this.length > 0 ? this[0].value: v: this.each(function(e) {
                    this.value = p(this, t, e, this.value)
                })
            },
            offset: function() {
                var t = function(e) {
                    return (t = "getBoundingClientRect" in e ?
                    function(t) {
                        return t.getBoundingClientRect()
                    }: function(t) {
                        for (var e = t.offsetTop,
                        n = t.offsetLeft,
                        i = t.offsetWidth,
                        r = t.offsetHeight; t.offsetParent;) t = t.offsetParent,
                        e += t.offsetTop,
                        n += t.offsetLeft;
                        return e -= window.pageYOffset,
                        n -= window.pageXOffset,
                        {
                            top: e,
                            left: n,
                            right: n + i,
                            bottom: e + r,
                            width: i,
                            height: r
                        }
                    })(e)
                };
                return function(e) {
                    if (!this.length) return null;
                    var n = t(this[0]),
                    i = e ? 0 : window.pageXOffset,
                    r = e ? 0 : window.pageYOffset;
                    return {
                        left: n.left + i,
                        top: n.top + r,
                        width: n.width,
                        height: n.height,
                        right: n.right + i,
                        bottom: n.bottom + r
                    }
                }
            } (),
            css: function(t, e) {
                if (e === v && "string" == typeof t) return 0 == this.length ? v: this[0].style[b(t)] || A(this[0], "").getPropertyValue(t);
                var n = "";
                for (g in t)"string" == typeof t[g] && "" == t[g] ? this.each(function() {
                    this.style.removeProperty(s(g))
                }) : n += s(g) + ":" + c(g, t[g]) + ";";
                return "string" == typeof t && ("" == e ? this.each(function() {
                    this.style.removeProperty(s(t))
                }) : n = s(t) + ":" + c(t, e)),
                this.each(function() {
                    this.style.cssText += ";" + n
                })
            },
            index: function(t) {
                return t ? this.indexOf(y(t)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function(t) {
                return this.length < 1 ? !1 : u(t).test(this[0].className)
            },
            addClass: function(t) {
                return this.each(function(e) {
                    w = [];
                    var n = this.className,
                    i = p(this, t, e, n);
                    i.split(/\s+/g).forEach(function(t) {
                        y(this).hasClass(t) || w.push(t)
                    },
                    this),
                    w.length && (this.className += (n ? " ": "") + w.join(" "))
                })
            },
            removeClass: function(t) {
                return this.each(function(e) {
                    return t === v ? this.className = "": (w = this.className, p(this, t, e, w).split(/\s+/g).forEach(function(t) {
                        w = w.replace(u(t), " ")
                    }), void(this.className = w.trim()))
                })
            },
            toggleClass: function(t, e) {
                return this.each(function(n) {
                    var i = p(this, t, n, this.className); (e === v ? !y(this).hasClass(i) : e) ? y(this).addClass(i) : y(this).removeClass(i)
                })
            }
        },
        ["width", "height"].forEach(function(t) {
            y.fn[t] = function(e) {
                var n, i = t.replace(/./,
                function(t) {
                    return t[0].toUpperCase()
                });
                return e === v ? this[0] == window ? window["inner" + i] : this[0] == C ? C.documentElement["offset" + i] : (n = this.offset()) && n[t] : this.each(function(n) {
                    var i = y(this);
                    i.css(t, p(this, e, n, i[t]()))
                })
            }
        }),
        k.forEach(function(t, n) {
            y.fn[t] = function() {
                var t = y.map(arguments,
                function(t) {
                    return e(t) ? t: B.fragment(t)
                });
                if (t.length < 1) return this;
                var i = this.length,
                r = i > 1,
                o = 2 > n;
                return this.each(function(e, a) {
                    for (var s = 0; s < t.length; s++) {
                        var u = t[o ? t.length - s - 1 : s];
                        m(u,
                        function(t) {
                            null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || window.eval.call(window, t.innerHTML)
                        }),
                        r && i - 1 > e && (u = u.cloneNode(!0)),
                        d(n, a, u)
                    }
                })
            },
            y.fn[n % 2 ? t + "To": "insert" + (n ? "Before": "After")] = function(e) {
                return y(e)[t](this),
                this
            }
        }),
        B.Z.prototype = y.fn,
        B.camelize = b,
        B.uniq = x,
        y.zepto = B,
        y
    } ();
    window.Zepto = i,
    "$" in window || (window.$ = i),
    function(t) {
        function e(t) {
            return t._zid || (t._zid = h++)
        }
        function n(t, n, o, a) {
            if (n = i(n), n.ns) var s = r(n.ns);
            return (l[e(t)] || []).filter(function(t) {
                return ! (!t || n.e && t.e != n.e || n.ns && !s.test(t.ns) || o && e(t.fn) !== e(o) || a && t.sel != a)
            })
        }
        function i(t) {
            var e = ("" + t).split(".");
            return {
                e: e[0],
                ns: e.slice(1).sort().join(" ")
            }
        }
        function r(t) {
            return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
        }
        function o(e, n, i) {
            t.isObject(e) ? t.each(e, i) : e.split(/\s/).forEach(function(t) {
                i(t, n)
            })
        }
        function a(n, r, a, s, u, c) {
            c = !!c;
            var h = e(n),
            f = l[h] || (l[h] = []);
            o(r, a,
            function(e, r) {
                var o = u && u(r, e),
                a = o || r,
                l = function(t) {
                    var e = a.apply(n, [t].concat(t.data));
                    return e === !1 && t.preventDefault(),
                    e
                },
                h = t.extend(i(e), {
                    fn: r,
                    proxy: l,
                    sel: s,
                    del: o,
                    i: f.length
                });
                f.push(h),
                n.addEventListener(h.e, l, c)
            })
        }
        function s(t, i, r, a) {
            var s = e(t);
            o(i || "", r,
            function(e, i) {
                n(t, e, i, a).forEach(function(e) {
                    delete l[s][e.i],
                    t.removeEventListener(e.e, e.proxy, !1)
                })
            })
        }
        function u(e) {
            var n = t.extend({
                originalEvent: e
            },
            e);
            return t.each(m,
            function(t, i) {
                n[t] = function() {
                    return this[i] = p,
                    e[t].apply(e, arguments)
                },
                n[i] = d
            }),
            n
        }
        function c(e) {
            if (! ("defaultPrevented" in e) || t.isWp) {
                e.defaultPrevented = !1;
                var n = e.preventDefault;
                e.preventDefault = function() {
                    this.defaultPrevented = !0,
                    this.defaultPrevented || (this.ieDefaultPrevented = !0),
                    n.call(this)
                }
            }
        }
        var l = (t.zepto.qsa, {}),
        h = 1,
        f = {};
        f.click = f.mousedown = f.mouseup = f.mousemove = "MouseEvents",
        t.event = {
            add: a,
            remove: s
        },
        t.proxy = function(n, i) {
            if (t.isFunction(n)) {
                var r = function() {
                    return n.apply(i, arguments)
                };
                return r._zid = e(n),
                r
            }
            if ("string" == typeof i) return t.proxy(n[i], n);
            throw new TypeError("expected function")
        },
        t.fn.bind = function(t, e) {
            return this.each(function() {
                a(this, t, e)
            })
        },
        t.fn.unbind = function(t, e) {
            return this.each(function() {
                s(this, t, e)
            })
        },
        t.fn.one = function(t, e) {
            return this.each(function(n, i) {
                a(this, t, e, null,
                function(t, e) {
                    return function() {
                        var n = t.apply(i, arguments);
                        return s(i, e, t),
                        n
                    }
                })
            })
        };
        var p = function() {
            return ! 0
        },
        d = function() {
            return ! 1
        },
        m = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        t.fn.delegate = function(e, n, i) {
            var r = !1;
            return ("blur" == n || "focus" == n) && (t.iswebkit ? n = "blur" == n ? "focusout": "focus" == n ? "focusin": n: r = !0),
            this.each(function(o, s) {
                a(s, n, i, e,
                function(n) {
                    return function(i) {
                        var r, o = t(i.target).closest(e, s).get(0);
                        return o ? (r = t.extend(u(i), {
                            currentTarget: o,
                            liveFired: s
                        }), n.apply(o, [r].concat([].slice.call(arguments, 1)))) : void 0
                    }
                },
                r)
            })
        },
        t.fn.undelegate = function(t, e, n) {
            return this.each(function() {
                s(this, e, n, t)
            })
        },
        t.fn.live = function(e, n) {
            return t(document.body).delegate(this.selector, e, n),
            this
        },
        t.fn.die = function(e, n) {
            return t(document.body).undelegate(this.selector, e, n),
            this
        },
        t.fn.on = function(e, n, i) {
            return void 0 == n || t.isFunction(n) ? this.bind(e, n || i) : this.delegate(n, e, i)
        },
        t.fn.off = function(e, n, i) {
            return void 0 == n || t.isFunction(n) ? this.unbind(e, n || i) : this.undelegate(n, e, i)
        },
        t.fn.trigger = function(e, i) {
            var r, o;
            return this.each(function(a, s) {
                r = u("string" == typeof e ? t.Event(e) : e),
                r.data = i,
                r.target = s,
                t.each(t(this).add(t(this).parents()).add(document),
                function(i, a) {
                    return t.each(n(a, e.type || e),
                    function(t, e) {
                        return o = e.proxy(r),
                        r.isDefaultPrevented && (r.defaultPrevented = !0),
                        r.isImmediatePropagationStopped() ? !1 : void 0
                    }),
                    r.isImmediatePropagationStopped() || r.isPropagationStopped() ? !1 : void 0
                })
            })
        },
        t.fn.triggerHandler = function(e, i) {
            var r, o;
            return this.each(function(a, s) {
                r = u("string" == typeof e ? t.Event(e) : e),
                r.data = i,
                r.target = s,
                t.each(n(s, e.type || e),
                function(t, e) {
                    return o = e.proxy(r),
                    r.isImmediatePropagationStopped() ? !1 : void 0
                })
            }),
            o
        },
        "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error".split(" ").forEach(function(e) {
            t.fn[e] = function(t) {
                return this.bind(e, t)
            }
        }),
        ["focus", "blur"].forEach(function(e) {
            t.fn[e] = function(t) {
                if (t) this.bind(e, t);
                else if (this.length) try {
                    this.get(0)[e]()
                } catch(n) {}
                return this
            }
        }),
        t.Event = function(t, e) {
            var n = document.createEvent(f[t] || "Events"),
            i = !0;
            if (e) for (var r in e)"bubbles" == r ? i = !!e[r] : n[r] = e[r];
            return n.initEvent(t, i, !0, null, null, null, null, null, null, null, null, null, null, null, null),
            c(n),
            n
        }
    } (i),
    function(t) {
        function e(t) {
            var e = this.os = {},
            n = this.browser = {},
            i = t.match(/WebKit\/([\d.]+)/),
            r = t.match(/(Android).*?([\d.]+)/) || /HTC/.test(t),
            o = t.match(/(iPad).*OS\s([\d_]+)/),
            a = !o && t.match(/(iPhone\sOS)\s([\d_]+)/),
            s = t.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            u = s && t.match(/TouchPad/),
            c = t.match(/Kindle\/([\d.]+)/),
            l = t.match(/Silk\/([\d._]+)/),
            h = t.match(/(BlackBerry).*Version\/([\d.]+)/); (n.webkit = !!i) && (n.version = i[1]),
            r && (e.android = !0, e.version = r[2]),
            a && (e.ios = e.iphone = !0, e.version = a[2].replace(/_/g, ".")),
            o && (e.ios = e.ipad = !0, e.version = o[2].replace(/_/g, ".")),
            s && (e.webos = !0, e.version = s[2]),
            u && (e.touchpad = !0),
            h && (e.blackberry = !0, e.version = h[2]),
            c && (e.kindle = !0, e.version = c[1]),
            l && (n.silk = !0, n.version = l[1]),
            !l && e.android && t.match(/Kindle Fire/) && (n.silk = !0)
        }
        e.call(t, navigator.userAgent),
        t.__detect = e
    } (i),
    function(t, e) {
        function n(t) {
            return t.toLowerCase()
        }
        function i(t) {
            return r ? r + t: n(t)
        }
        var r, o = "",
        a = {
            "": "",
            Webkit: "webkit",
            Moz: "",
            O: "o",
            ms: "MS"
        },
        s = window.document,
        u = s.createElement("div"),
        c = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        l = {};
        t.each(a,
        function(t, i) {
            return u.style[t + "TransitionProperty"] !== e ? (o = "-" + n(t) + "-", r = i, !1) : void 0
        }),
        l[o + "transition-property"] = l[o + "transition-duration"] = l[o + "transition-timing-function"] = l[o + "animation-name"] = l[o + "animation-duration"] = "",
        t.fx = {
            off: r === e && u.style.transitionProperty === e,
            cssPrefix: o,
            transitionEnd: i("TransitionEnd"),
            animationEnd: i("AnimationEnd")
        },
        t.fn.animate = function(e, n, i, r) {
            return t.isObject(n) && (i = n.easing, r = n.complete, n = n.duration),
            n && (n /= 1e3),
            this.anim(e, n, i, r)
        },
        t.fn.anim = function(n, i, r, a) {
            var s, u, h, f = {},
            p = this,
            d = t.fx.transitionEnd;
            if (i === e && (i = .4), t.fx.off && (i = 0), "string" == typeof n) f[o + "animation-name"] = n,
            f[o + "animation-duration"] = i + "s",
            d = t.fx.animationEnd;
            else {
                for (u in n) c.test(u) ? (s || (s = []), s.push(u + "(" + n[u] + ")"), delete n[u]) : f[u] = n[u];
                s && (f[o + "transform"] = s.join(" "), n.transform = "transform"),
                t.fx.off || "object" != typeof n || (f[o + "transition-property"] = Object.keys(n).join(", "), f[o + "transition-duration"] = i + "s", f[o + "transition-timing-function"] = r || "linear")
            }
            return h = function(e) {
                if ("undefined" != typeof e) {
                    if (e.target !== e.currentTarget) return;
                    t(e.target).unbind(d, arguments.callee)
                }
                t(this).css(l),
                a && a.call(this)
            },
            i > 0 && this.bind(d, h),
            setTimeout(function() {
                p.css(f),
                0 >= i && setTimeout(function() {
                    p.each(function() {
                        h.call(this)
                    })
                },
                0)
            },
            0),
            this
        },
        u = null
    } (i),
    function(t) {
        function e(e, n, i) {
            var r = t.Event(n);
            return t(e).trigger(r, i),
            void 0 !== r.ieDefaultPrevented ? !r.ieDefaultPrevented: !r.defaultPrevented
        }
        function n(t, n, i, r) {
            return t.global ? e(n || y, i, r) : void 0
        }
        function i(e) {
            e.global && 0 === t.active++&&n(e, null, "ajaxStart")
        }
        function r(e) {
            e.global && !--t.active && n(e, null, "ajaxStop")
        }
        function o(t, e) {
            var i = e.context;
            return e.beforeSend.call(i, t, e) === !1 || n(e, i, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void n(e, i, "ajaxSend", [t, e])
        }
        function a(t, e, i) {
            var r = i.context,
            o = "success";
            i.success.call(r, t, o, e),
            n(i, r, "ajaxSuccess", [e, i, t]),
            u(o, e, i)
        }
        function s(t, e, i, r) {
            var o = r.context;
            r.error.call(o, i, e, t),
            n(r, o, "ajaxError", [i, r, t]),
            u(e, i, r)
        }
        function u(t, e, i) {
            var o = i.context;
            i.complete.call(o, e, t),
            n(i, o, "ajaxComplete", [e, i]),
            r(i)
        }
        function c() {}
        function l(t) {
            return t && (t == T ? "html": t == E ? "json": b.test(t) ? "script": x.test(t) && "xml") || "text"
        }
        function h(t, e) {
            return (t + "&" + e).replace(/[&?]{1,2}/, "?")
        }
        function f(e) {
            g(e.data) && (e.data = t.param(e.data)),
            !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = h(e.url, e.data))
        }
        function p(e, n, i, r) {
            var o = t.isArray(n);
            t.each(n,
            function(n, a) {
                r && (n = i ? r: r + "[" + (o ? "": n) + "]"),
                !r && o ? e.add(a.name, a.value) : (i ? t.isArray(a) : g(a)) ? p(e, a, i, n) : e.add(n, a)
            })
        }
        var d, m, v = 0,
        g = t.isObject,
        y = window.document,
        w = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        b = /^(?:text|application)\/javascript/i,
        x = /^(?:text|application)\/xml/i,
        E = "application/json",
        T = "text/html",
        C = /^\s*$/;
        t.active = 0,
        t.ajaxJSONP = function(e) {
            var n, i = "jsonp" + ++v,
            r = y.createElement("script"),
            o = function() {
                t(r).remove(),
                i in window && (window[i] = c),
                u("abort", s, e)
            },
            s = {
                abort: o
            };
            return e.error && (r.onerror = function() {
                s.abort(),
                e.error()
            }),
            window[i] = function(o) {
                clearTimeout(n),
                t(r).remove(),
                delete window[i],
                a(o, s, e)
            },
            f(e),
            r.src = e.url.replace(/=\?/, "=" + i),
            t("head").append(r),
            e.timeout > 0 && (n = setTimeout(function() {
                s.abort(),
                u("timeout", s, e)
            },
            e.timeout)),
            s
        },
        t.ajaxSettings = {
            type: "GET",
            beforeSend: c,
            success: c,
            error: c,
            complete: c,
            context: null,
            global: !0,
            xhr: function() {
                return new window.XMLHttpRequest
            },
            accepts: {
                script: "text/javascript, application/javascript",
                json: E,
                xml: "application/xml, text/xml",
                html: T,
                text: "text/plain"
            },
            crossDomain: !1,
            timeout: 0
        },
        t.ajax = function(e) {
            var n = t.extend({},
            e || {});
            for (d in t.ajaxSettings)"undefined" == typeof n[d] && (n[d] = t.ajaxSettings[d]);
            i(n),
            n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != window.location.host);
            var r = n.dataType,
            u = /=\?/.test(n.url);
            if ("jsonp" == r || u) return u || (n.url = h(n.url, "callback=?")),
            t.ajaxJSONP(n);
            n.url || (n.url = window.location.toString()),
            f(n);
            var p, v = n.accepts[r],
            g = {},
            y = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1: window.location.protocol,
            w = t.ajaxSettings.xhr();
            n.crossDomain || (g["X-Requested-With"] = "XMLHttpRequest"),
            v && (g.Accept = v, v.indexOf(",") > -1 && (v = v.split(",", 2)[0]), w.overrideMimeType && w.overrideMimeType(v)),
            (n.contentType || n.data && "GET" != n.type.toUpperCase()) && (g["Content-Type"] = n.contentType || "application/x-www-form-urlencoded"),
            n.headers = t.extend(g, n.headers || {}),
            w.onreadystatechange = function() {
                if (4 == w.readyState) {
                    clearTimeout(p);
                    var t, e = !1;
                    if (w.status >= 200 && w.status < 300 || 304 == w.status || 0 == w.status && "file:" == y) {
                        r = r || l(w.getResponseHeader("content-type")),
                        t = w.responseText;
                        try {
                            "script" == r ? (1, eval)(t) : "xml" == r ? t = w.responseXML: "json" == r && (t = C.test(t) ? null: JSON.parse(t))
                        } catch(i) {
                            e = i
                        }
                        e ? s(e, "parsererror", w, n) : a(t, w, n)
                    } else s(null, "error", w, n)
                }
            };
            var b = "async" in n ? n.async: !0;
            w.open(n.type, n.url, b);
            for (m in n.headers) w.setRequestHeader(m, n.headers[m]);
            return o(w, n) === !1 ? (w.abort(), !1) : (n.timeout > 0 && (p = setTimeout(function() {
                w.onreadystatechange = c,
                w.abort(),
                s(null, "timeout", w, n)
            },
            n.timeout)), w.send(n.data ? n.data: null), w)
        },
        t.get = function(e, n) {
            return t.ajax({
                url: e,
                success: n
            })
        },
        t.post = function(e, n, i, r) {
            return t.isFunction(n) && (r = r || i, i = n, n = null),
            t.ajax({
                type: "POST",
                url: e,
                data: n,
                success: i,
                dataType: r
            })
        },
        t.getJSON = function(e, n) {
            return t.ajax({
                url: e,
                success: n,
                dataType: "json"
            })
        },
        t.fn.load = function(e, n) {
            if (!this.length) return this;
            var i, r = this,
            o = e.split(/\s/);
            return o.length > 1 && (e = o[0], i = o[1]),
            t.get(e,
            function(e) {
                r.html(i ? t(y.createElement("div")).html(e.replace(w, "")).find(i).html() : e),
                n && n.call(r)
            }),
            this
        };
        var P = encodeURIComponent;
        t.param = function(t, e) {
            var n = [];
            return n.add = function(t, e) {
                this.push(P(t) + "=" + P(e))
            },
            p(n, t, e),
            n.join("&").replace("%20", "+")
        }
    } (i),
    function(t) {
        t.fn.serializeArray = function() {
            var e, n = [];
            return t(Array.prototype.slice.call(this.get(0).elements)).each(function() {
                e = t(this);
                var i = e.attr("type");
                "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != i && "reset" != i && "button" != i && ("radio" != i && "checkbox" != i || this.checked) && n.push({
                    name: e.attr("name"),
                    value: e.val()
                })
            }),
            n
        },
        t.fn.serialize = function() {
            var t = [];
            return this.serializeArray().forEach(function(e) {
                t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
            }),
            t.join("&")
        },
        t.fn.submit = function(e) {
            if (e) this.bind("submit", e);
            else if (this.length) {
                var n = t.Event("submit");
                this.eq(0).trigger(n),
                n.defaultPrevented || this.get(0).submit()
            }
            return this
        }
    } (i),
    function(t) {
        function e(t) {
            return "tagName" in t ? t: t.parentNode
        }
        function n(t, e, n, i) {
            var r = Math.abs(t - e),
            o = Math.abs(n - i);
            return r >= o ? t - e > 0 ? "Left": "Right": n - i > 0 ? "Up": "Down"
        }
        function i() {
            a = null,
            s.last && (s.el.trigger("longTap"), s = {})
        }
        function r() {
            a && clearTimeout(a),
            a = null
        }
        var o, a, s = {},
        u = 750;
        t(document).ready(function() {
            var c, l;
            t(document.body).bind("touchstart",
            function(n) {
                c = Date.now(),
                l = c - (s.last || c),
                s.el = t(e(n.touches[0].target)),
                o && clearTimeout(o),
                s.x1 = n.touches[0].pageX,
                s.y1 = n.touches[0].pageY,
                l > 0 && 250 >= l && (s.isDoubleTap = !0),
                s.last = c,
                a = setTimeout(i, u)
            }).bind("touchmove",
            function(t) {
                r(),
                s.x2 = t.touches[0].pageX,
                s.y2 = t.touches[0].pageY
            }).bind("touchend",
            function() {
                r(),
                s.isDoubleTap ? (s.el.trigger("doubleTap"), s = {}) : s.x2 && Math.abs(s.x1 - s.x2) > 30 || s.y2 && Math.abs(s.y1 - s.y2) > 30 ? (s.el.trigger("swipe") && s.el.trigger("swipe" + n(s.x1, s.x2, s.y1, s.y2)), s = {}) : "last" in s && (s.el.trigger("tap"), o = setTimeout(function() {
                    o = null,
                    s.el.trigger("singleTap"),
                    s = {}
                },
                250))
            }).bind("touchcancel",
            function() {
                o && clearTimeout(o),
                a && clearTimeout(a),
                a = o = null,
                s = {}
            })
        }),
        ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(e) {
            t.fn[e] = function(t) {
                return this.bind(e, t)
            }
        })
    } (i),
    n.exports = i
});
var $ = require("zepto"); !
function(t) {
    if ("undefined" == typeof t) throw new Error("Parallax.js's script requires Zepto");
    t.fn.fullPage = function(e) {
        function n() {
            s.on("touchstart",
            function(t) {
                return d ? 0 : (t.preventDefault(), void(p = t.targetTouches[0].pageY))
            }),
            s.on("touchend",
            function(t) {
                if (d) return 0;
                t.preventDefault();
                var e = t.changedTouches[0].pageY - p,
                n = e > 30 || -30 > e ? e > 0 ? -1 : 1 : 0,
                o = f;
                f = i(f + n),
                r(f, o, !0)
            }),
            a.drag && s.on("touchmove",
            function(t) {
                if (d) return 0;
                t.preventDefault();
                var e = t.changedTouches[0].pageY - p;
                s.removeClass("anim").css("top", -f * h + e + "px")
            })
        }
        function i(t) {
            return 0 > t ? 0 : t >= l ? l - 1 : t
        }
        function r(t, e, n) {
            n ? (s.addClass("anim"), d = !0) : s.removeClass("anim"),
            s.css("top", -t * h + "px"),
            window.setTimeout(function() {
                d = !1,
                t !== e && (a.onchange({
                    cur: t
                }), c.removeClass("cur").eq(t).addClass("cur"))
            },
            a.duration)
        }
        function o() {
            h = u.height(),
            c.height(h),
            r(f, -1, !1),
            n()
        }
        var a = {
            page: ".page",
            start: 0,
            duration: 500,
            drag: !0,
            onchange: function() {}
        };
        t.extend(!0, a, e);
        var s = t(this).addClass("fullPage-wp"),
        u = s.parent(),
        c = s.find(a.page).addClass("fullPage-page"),
        l = c.length,
        h = u.height(),
        f = a.start,
        p = 0,
        d = !1;
        o()
    }
} (Zepto),
!
function(t, e, n) {
    "use strict";
    function i(t, e) {
        this.element = t,
        this.layers = t.getElementsByClassName("layer");
        var n = {
            calibrateX: this.data(this.element, "calibrate-x"),
            calibrateY: this.data(this.element, "calibrate-y"),
            invertX: this.data(this.element, "invert-x"),
            invertY: this.data(this.element, "invert-y"),
            limitX: this.data(this.element, "limit-x"),
            limitY: this.data(this.element, "limit-y"),
            scalarX: this.data(this.element, "scalar-x"),
            scalarY: this.data(this.element, "scalar-y"),
            frictionX: this.data(this.element, "friction-x"),
            frictionY: this.data(this.element, "friction-y")
        };
        for (var i in n) null === n[i] && delete n[i];
        this.extend(this, a, e, n),
        this.calibrationTimer = null,
        this.calibrationFlag = !0,
        this.enabled = !1,
        this.depths = [],
        this.raf = null,
        this.ox = 0,
        this.oy = 0,
        this.ow = 0,
        this.oh = 0,
        this.cx = 0,
        this.cy = 0,
        this.ix = 0,
        this.iy = 0,
        this.mx = 0,
        this.my = 0,
        this.vx = 0,
        this.vy = 0,
        this.onMouseMove = this.onMouseMove.bind(this),
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this),
        this.onOrientationTimer = this.onOrientationTimer.bind(this),
        this.onCalibrationTimer = this.onCalibrationTimer.bind(this),
        this.onAnimationFrame = this.onAnimationFrame.bind(this),
        this.onWindowResize = this.onWindowResize.bind(this),
        this.initialise()
    }
    var r = "Parallax",
    o = 30,
    a = {
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: !1,
        calibrateY: !0,
        invertX: !0,
        invertY: !0,
        limitX: !1,
        limitY: !1,
        scalarX: 10,
        scalarY: 10,
        frictionX: .1,
        frictionY: .1
    };
    i.prototype.extend = function() {
        if (arguments.length > 1) for (var t = arguments[0], e = 1, n = arguments.length; n > e; e++) {
            var i = arguments[e];
            for (var r in i) t[r] = i[r]
        }
    },
    i.prototype.data = function(t, e) {
        return this.deserialize(t.getAttribute("data-" + e))
    },
    i.prototype.deserialize = function(t) {
        return "true" === t ? !0 : "false" === t ? !1 : "null" === t ? null: !isNaN(parseFloat(t)) && isFinite(t) ? parseFloat(t) : t
    },
    i.prototype.offset = function(t) {
        for (var n, i, r = 0,
        o = 0; t && !isNaN(t.offsetLeft) && !isNaN(t.offsetTop);) t === e.body ? (n = e.documentElement.scrollLeft, i = e.documentElement.scrollTop) : (n = t.scrollLeft, i = t.scrollTop),
        r += t.offsetLeft - n,
        o += t.offsetTop - i,
        t = t.offsetParent;
        return {
            top: o,
            left: r
        }
    },
    i.prototype.camelCase = function(t) {
        return t.replace(/-+(.)?/g,
        function(t, e) {
            return e ? e.toUpperCase() : ""
        })
    },
    i.prototype.transformSupport = function(i) {
        for (var r = e.createElement("div"), o = !1, a = null, s = !1, u = null, c = null, l = 0, h = this.vendors.length; h > l; l++) if (null !== this.vendors[l] ? (u = this.vendors[l][0] + "transform", c = this.vendors[l][1] + "Transform") : (u = "transform", c = "transform"), r.style[c] !== n) {
            o = !0;
            break
        }
        switch (i) {
        case "2D":
            s = o;
            break;
        case "3D":
            o && (e.body.appendChild(r), r.style[c] = "translate3d(1px,1px,1px)", a = t.getComputedStyle(r).getPropertyValue(u), s = a !== n && a.length > 0 && "none" !== a, e.body.removeChild(r))
        }
        return s
    },
    i.prototype.ww = null,
    i.prototype.wh = null,
    i.prototype.hw = null,
    i.prototype.hh = null,
    i.prototype.portrait = null,
    i.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i),
    i.prototype.vendors = [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]],
    i.prototype.motionSupport = !!t.DeviceMotionEvent,
    i.prototype.orientationSupport = !!t.DeviceOrientationEvent,
    i.prototype.orientationStatus = 0,
    i.prototype.transform2DSupport = i.prototype.transformSupport("2D"),
    i.prototype.transform3DSupport = i.prototype.transformSupport("3D"),
    i.prototype.initialise = function() {
        this.transform3DSupport && this.accelerate(this.element);
        var e = t.getComputedStyle(this.element);
        "static" === e.getPropertyValue("position") && (this.element.style.position = "relative");
        for (var n = 0,
        i = this.layers.length; i > n; n++) {
            var r = this.layers[n];
            this.transform3DSupport && this.accelerate(r),
            r.style.position = n ? "absolute": "relative",
            r.style.display = "block",
            r.style.height = "100%",
            r.style.width = "100%",
            r.style.left = 0,
            r.style.top = 0,
            this.depths.push(this.data(r, "depth") || 0)
        }
        this.updateDimensions(),
        this.enable(),
        this.queueCalibration(this.calibrationDelay)
    },
    i.prototype.updateDimensions = function() {
        this.ox = this.offset(this.element).left,
        this.oy = this.offset(this.element).top,
        this.ow = this.element.offsetWidth,
        this.oh = this.element.offsetHeight,
        this.ww = t.innerWidth,
        this.wh = t.innerHeight,
        this.hw = this.ww / 2,
        this.hh = this.wh / 2
    },
    i.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer),
        this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    },
    i.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, t.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, t.addEventListener("mousemove", this.onMouseMove)), t.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    },
    i.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? t.removeEventListener("deviceorientation", this.onDeviceOrientation) : t.removeEventListener("mousemove", this.onMouseMove), t.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    },
    i.prototype.calibrate = function(t, e) {
        this.calibrateX = t === n ? this.calibrateX: t,
        this.calibrateY = e === n ? this.calibrateY: e
    },
    i.prototype.invert = function(t, e) {
        this.invertX = t === n ? this.invertX: t,
        this.invertY = e === n ? this.invertY: e
    },
    i.prototype.friction = function(t, e) {
        this.frictionX = t === n ? this.frictionX: t,
        this.frictionY = e === n ? this.frictionY: e
    },
    i.prototype.scalar = function(t, e) {
        this.scalarX = t === n ? this.scalarX: t,
        this.scalarY = e === n ? this.scalarY: e
    },
    i.prototype.limit = function(t, e) {
        this.limitX = t === n ? this.limitX: t,
        this.limitY = e === n ? this.limitY: e
    },
    i.prototype.clamp = function(t, e, n) {
        return t = Math.max(t, e),
        t = Math.min(t, n)
    },
    i.prototype.css = function(t, e, i) {
        for (var r = null,
        o = 0,
        a = this.vendors.length; a > o; o++) if (r = null !== this.vendors[o] ? this.camelCase(this.vendors[o][1] + "-" + e) : e, t.style[r] !== n) {
            t.style[r] = i;
            break
        }
    },
    i.prototype.accelerate = function(t) {
        this.css(t, "transform", "translate3d(0,0,0)"),
        this.css(t, "backface-visibility", "hidden")
    },
    i.prototype.setPosition = function(t, e, n) {
        e += "%",
        n += "%",
        this.transform3DSupport ? this.css(t, "transform", "translate3d(" + e + "," + n + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + e + "," + n + ")") : (t.style.left = e, t.style.top = n)
    },
    i.prototype.onOrientationTimer = function() {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    },
    i.prototype.onCalibrationTimer = function() {
        this.calibrationFlag = !0
    },
    i.prototype.onWindowResize = function() {
        this.updateDimensions()
    },
    i.prototype.onAnimationFrame = function() {
        var t = this.ix - this.cx,
        e = this.iy - this.cy; (Math.abs(t) > this.calibrationThreshold || Math.abs(e) > this.calibrationThreshold) && this.queueCalibration(0),
        this.portrait ? (this.mx = (this.calibrateX ? e: this.iy) * this.scalarX, this.my = (this.calibrateY ? t: this.ix) * this.scalarY) : (this.mx = (this.calibrateX ? t: this.ix) * this.scalarX, this.my = (this.calibrateY ? e: this.iy) * this.scalarY),
        isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)),
        isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)),
        this.vx += (this.mx - this.vx) * this.frictionX,
        this.vy += (this.my - this.vy) * this.frictionY;
        for (var n = 0,
        i = this.layers.length; i > n; n++) {
            var r = this.layers[n],
            o = this.depths[n],
            a = this.vx * o * (this.invertX ? -1 : 1),
            s = this.vy * o * (this.invertY ? -1 : 1);
            this.setPosition(r, a, s)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    },
    i.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var e = (t.beta || 0) / o,
            n = (t.gamma || 0) / o,
            i = this.wh > this.ww;
            this.portrait !== i && (this.portrait = i, this.calibrationFlag = !0),
            this.calibrationFlag && (this.calibrationFlag = !1, this.cx = e, this.cy = n),
            this.ix = e,
            this.iy = n
        }
    },
    i.prototype.onMouseMove = function(t) {
        this.ix = (t.pageX - this.hw) / this.hw,
        this.iy = (t.pageY - this.hh) / this.hh
    },
    t[r] = i
} (window, document),
function() {
    for (var t = 0,
    e = ["ms", "moz", "webkit", "o"], n = 0; n < e.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[e[n] + "RequestAnimationFrame"],
    window.cancelAnimationFrame = window[e[n] + "CancelAnimationFrame"] || window[e[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
        var n = (new Date).getTime(),
        i = Math.max(0, 16 - (n - t)),
        r = window.setTimeout(function() {
            e(n + i)
        },
        i);
        return t = n + i,
        r
    }),
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
} (),
define("bg",
function() {
    new Parallax(document.getElementById("bg-scene"))
}),
define("index",
function(t) {
    function e(t, e) {
        t.src = b + "/" + e,
        t.load()
    }
    function n(t) {
        o();
        for (var n = 0,
        r = v.length; r > n; n++) n !== t && (v[n].pause(), c(".audio").eq(n).removeClass("play"));
        return d !== t ? (g[t] || e(v[t], m[t]), v[t].play(), c(".audio").eq(t).addClass("play"), d = t, 0) : void i(t)
    }
    function i(t) {
        d = -1,
        v[t].pause(),
        c(".audio").eq(t).removeClass("play")
    }
    function r() {
        return y ? 0 : (w || e(l, "bgm1.mp3"), l.play(), y = !0, c("#music-btn").addClass("play"), void c("#music-text").text("关闭"))
    }
    function o() {
        l.pause(),
        y = !1,
        c("#music-btn").removeClass("play"),
        c("#music-text").text("开启")
    }
    function a() {
        c("body").one("touchstart",
        function() {
            e(l, "bgm1.mp3"),
            e(h, "one_9s.mp3"),
            e(p, "two_6s.mp3"),
            e(f, "three_7s.mp3")
        }),
        c("#music").on("touchstart",
        function(t) {
            return t.stopPropagation(),
            y ? (o(), 0) : (r(), 1)
        }),
        c("#download").on("tap",
        function() {
            window.location.replace(c(this).attr("href"))
        }),
        h.addEventListener("ended",
        function() {
            i(0)
        }),
        f.addEventListener("ended",
        function() {
            i(1)
        }),
        p.addEventListener("ended",
        function() {
            i(2)
        }),
        h.addEventListener("canplay",
        function() {
            g[0] = !0
        }),
        f.addEventListener("canplay",
        function() {
            g[1] = !0
        }),
        p.addEventListener("canplay",
        function() {
            g[2] = !0
        }),
        l.addEventListener("canplay",
        function() {
            w = !0,
            r()
        }),
        c(".ans-msg").on("tap",
        function() {
            var t = c(this),
            e = t.data("index");
            n(e)
        })
    }
    function s(t, e, n) {
        function i(t, e, r) {
            r >= t && (n(t), window.setTimeout(function() {
                i(t + 1, e, r)
            },
            e))
        }
        var r = t - e,
        o = 500 / r;
        i(0, o, r)
    }
    function u() {
        c("#wp-inner").fullPage({
            start: 0,
            onchange: function(t) {
                return 4 !== t.cur && (i(0), i(1), i(2)),
                2 === t.cur ? (c(".score").html("0"), window.setTimeout(function() {
                    c(".score").each(function() {
                        var t = c(this),
                        e = Number(t.data("score"));
                        s(e, 0,
                        function(e) {
                            t.html(e)
                        })
                    })
                },
                2e3), 2) : void 0
            }
        }),
                
                //此处会实例化每页的dom，不用的页要注释掉  -BU GY
                
        new Parallax(document.getElementById("page1-scene")),
        new Parallax(document.getElementById("page2-scene")),
        //new Parallax(document.getElementById("page3-scene")),
        //new Parallax(document.getElementById("page4-scene")),
        new Parallax(document.getElementById("page5-scene")),
        //new Parallax(document.getElementById("page6-scene")),
        a()
    }
    var c = t("zepto"),
    l = new Audio,
    h = new Audio,
    f = new Audio,
    p = new Audio,
    d = -1,
    m = ["one_9s.mp3", "two_6s.mp3", "three_7s.mp3"],
    v = [h, f, p],
    g = [!1, !1, !1],
    y = !1,
    w = !1,
    b = "http://activity.wallstreetcn.com/new_online";
    l.loop = !0,
    t("bg"),
    c(function() {
        u()
    })
}),
require("index");