(function() {
    window.GoldenData || (window.GoldenData = {}), $(function() {
        return GoldenData.AddressSelector = function() {
            function e(e) {
                var t;
                this.data = e, this.provinces = function() {
                    var e;
                    e = [];
                    for (t in this.data)
                        e.push(t);
                    return e
                }.call(this)
            }
            return e.prototype.render = function(e, t, n, r, i, s) {
                var o, u, a, f, l;
                r == null && (r = ""), i == null && (i = ""), s == null && (s = ""), e.html("<option value=''> 省/自治区/直辖市 </option>"), l = this.provinces;
                for (a = 0, f = l.length; a < f; a++)
                    u = l[a], o = $("<option value='" + u + "'>" + u + "</option>"), u === r && o.attr("selected", "selected"), e.append(o);
                return this.renderCityOptions(r, t, i), this.renderDistrictOptions(r, i, n, s), e.on("change", function(r) {
                    return function() {
                        return r.renderCityOptions(e.val(), t), r.renderDistrictOptions(e.val(), "", n)
                    }
                }(this)), t.on("change", function(r) {
                    return function() {
                        return r.renderDistrictOptions(e.val(), t.val(), n)
                    }
                }(this))
            }, e.prototype.renderCityOptions = function(e, t, n) {
                var r, i, s, o, u, a;
                n == null && (n = ""), t.html("<option value=''> 市 </option>");
                if (this.data.hasOwnProperty(e)) {
                    u = _.keys(this.data[e]), a = [];
                    for (s = 0, o = u.length; s < o; s++)
                        r = u[s], i = $("<option value='" + r + "'>" + r + "</option>"), r === n && i.attr("selected", "selected"), a.push(t.append(i));
                    return a
                }
            }, e.prototype.renderDistrictOptions = function(e, t, n, r) {
                var i, s, o, u, a, f, l;
                r == null && (r = ""), n.html("<option value=''> 区/县 </option>");
                if ((a = this.data[e]) != null ? a[t] : void 0) {
                    f = this.data[e][t], l = [];
                    for (o = 0, u = f.length; o < u; o++)
                        i = f[o], s = $("<option value='" + i + "'>" + i + "</option>"), i === r && s.attr("selected", "selected"), l.push(n.append(s));
                    return l
                }
            }, e
        }(), GoldenData.initAddressSelector = function(e) {
            var t, n, r, i, s, o, u, a;
            if (GoldenData.addressSelector) {
                u = $(e).find("[data-role=address]"), a = [];
                for (s = 0, o = u.length; s < o; s++)
                    t = u[s], i = $(t).find("[data-role=province]"), n = $(t).find("[data-role=city]"), r = $(t).find("[data-role=district]"), a.push(GoldenData.addressSelector.render(i, n, r, i.data("value"), n.data("value"), r.data("value")));
                return a
            }
        }, $(document).on("ready page:load ajax:complete", function() {
            return GoldenData.initAddressSelector(document)
        })
    })
}).call(this);

(function() {
    var e = [].indexOf || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                if (t in this && this[t] === e)
                    return t;
            return -1
        };
    window.GoldenData || (window.GoldenData = {}), $(function() {
        var t, n, r;
        return r = function(e) {
            var t, n, r, i, s;
            n = $("[name='entry[" + e + "]']:visible").filter(":radio:checked, :not(:radio)").add("[name='entry[" + e + "][]']:visible:checked"), s = [];
            for (r = 0, i = n.length; r < i; r++)
                t = n[r], s.push($(t).val());
            return s
        }, n = function() {
            function e(e) {
                this.apiCode = e, this.targets = [], this.element = $("[name='entry[" + this.apiCode + "]']"), this.elementContainer = $(".field[data-api-code='" + this.apiCode + "']")
            }
            return e.prototype._informTargets = function(e) {
                var t, n, r, i, s;
                i = this.targets, s = [];
                for (n = 0, r = i.length; n < r; n++)
                    t = i[n], s.push(t.set(this.apiCode, e));
                return s
            }, e.prototype.run = function() {
                return this.element.on("change", function(e) {
                    return function(t) {
                        e._informTargets(r(e.apiCode));
                        if (!$(t.target).hasClass("with-other-choice"))
                            return t.stopPropagation()
                    }
                }(this)), this.elementContainer.on("change.formLogic", function(e) {
                    return function() {
                        return e._informTargets(r(e.apiCode))
                    }
                }(this))
            }, e
        }(), t = function() {
            function t(e, t) {
                var n;
                this.apiCode = e, this.triggerConditions = t, this.element = $("[name^='entry[" + this.apiCode + "]']"), this.elementContainer = $(".field[data-api-code='" + this.apiCode + "']");
                for (n in this.triggerConditions)
                    this.set(n, r(n))
            }
            return t.prototype._onElementContainerShowHide = function() {
                return this.elementContainer.trigger("change.formLogic"), GoldenData.recalcFormHeight()
            }, t.prototype.set = function(t, n) {
                var r, i, s, o;
                s = (o = this.elementContainer.data("triggered-by")) != null ? o : [], n && _.intersection(n, this.triggerConditions[t]).length > 0 ? e.call(s, t) < 0 && s.push(t) : s = _.without(s, t), this.elementContainer.data("triggered-by", s), r = this.elementContainer.is(":visible"), i = s.length > 0, i && !r && (this.elementContainer.show(), this.elementContainer.trigger("shown.logic"), this.elementContainer.find("textarea").autosize(), this.element.attr("disabled", !1), this._onElementContainerShowHide());
                if (!i && r)
                    return this.elementContainer.hide(), this.elementContainer.trigger("hidden.logic"), this.element.attr("disabled", !0), this._onElementContainerShowHide()
            }, t
        }(), GoldenData.FormLogic = function() {
            function e(e) {
                var r, i, s, o, u;
                this.triggers = {}, this.targets = {};
                for (r in e) {
                    s = e[r], (o = this.targets)[r] || (o[r] = new t(r, s));
                    for (i in s)
                        (u = this.triggers)[i] || (u[i] = new n(i)), this.triggers[i].targets.push(this.targets[r])
                }
            }
            return e.prototype.run = function() {
                var e, t, n, r;
                n = this.triggers, r = [];
                for (e in n)
                    t = n[e], r.push(t.run());
                return r
            }, e
        }()
    })
}).call(this);

var l = function(e, t) {
    return t == null && (t = {}), _.template(e.toLocaleString(), t)
};

(function() {
    window.GoldenData || (window.GoldenData = {}), $(function() {
        var e;
        return e = function(e, t) {
            var n, r, i, s, o, u, a, f, c;
            s = e.find("option:selected"), t.html("<option value=''>" + l("请选择") + "</option>"), f = (a = s.data("choices")) != null ? a : [];
            for (o = 0, u = f.length; o < u; o++)
                n = f[o], typeof n == "object" ? (r = n.name, i = (c = n.value) != null ? c : r) : (r = n, i = n), t.append("<option value='" + i + "'>" + r + "</option>");
            t.val(t.data("value"));
            if ($.mobile)
                return t.selectmenu("refresh", !0)
        }, GoldenData.initCascadeSelector = function(t) {
            var n, r, i, s, o, u;
            o = $(t).find("[data-role=cascade]"), u = [];
            for (i = 0, s = o.length; i < s; i++)
                n = o[i], r = $(n).find("[data-role=level_1]"), e(r, $(n).find("[data-role=level_2]")), u.push(r.on("change", function() {
                    var t;
                    return t = $(this).parents("[data-role=cascade]").find("[data-role=level_2]"), e($(this), t)
                }));
            return u
        }, $(document).on("ready page:load ajax:complete", function() {
            return GoldenData.initCascadeSelector(document)
        })
    })
}).call(this);