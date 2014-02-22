(function (c, a) {
    var f = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    c.fn.imagesLoaded = function (g) {
        function h() {
            var b = c(j),
                a = c(k);
            d && (k.length ? d.reject(i, b, a) : d.resolve(i));
            c.isFunction(g) && g.call(e, i, b, a)
        }

        function b(b, a) {
            b.src === f || -1 !== c.inArray(b, l) || (l.push(b), a ? k.push(b) : j.push(b), c.data(b, "imagesLoaded", {
                isBroken: a,
                src: b.src
            }), m && d.notifyWith(c(b), [a, i, c(j), c(k)]), i.length === l.length && (setTimeout(h), i.unbind(".imagesLoaded")))
        }
        var e = this,
            d = c.isFunction(c.Deferred) ? c.Deferred() :
                0,
            m = c.isFunction(d.notify),
            i = e.find("img").add(e.filter("img")),
            l = [],
            j = [],
            k = [];
        i.length ? i.bind("load.imagesLoaded error.imagesLoaded", function (a) {
            b(a.target, "error" === a.type)
        }).each(function (d, e) {
            var g = e.src,
                i = c.data(e, "imagesLoaded");
            if (i && i.src === g) b(e, i.isBroken);
            else if (e.complete && e.naturalWidth !== a) b(e, 0 === e.naturalWidth || 0 === e.naturalHeight);
            else if (e.readyState || e.complete) e.src = f, e.src = g
        }) : h();
        return d ? d.promise(e) : e
    }
})(jQuery);
mnemone.infscr && (function (c, a, f) {
    a.infinitescroll = function (b, e, d) {
        this.element = a(d);
        this._create(b, e)
    };
    a.infinitescroll.defaults = {
        loading: {
            finished: f,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
            img: "http://www.infinite-scroll.com/loading.gif",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: "fast",
            start: f
        },
        state: {
            isDuringAjax: !1,
            isInvalidPage: !1,
            isDestroyed: !1,
            isDone: !1,
            isPaused: !1,
            currPage: 1
        },
        callback: f,
        debug: !1,
        behavior: f,
        binder: a(c),
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null,
        extraScrollPx: 150,
        itemSelector: "div.post",
        animate: !1,
        pathParse: f,
        dataType: "html",
        appendCallback: !0,
        bufferPx: 40,
        errorCallback: function () {},
        infid: 0,
        pixelsFromNavToBottom: f,
        path: f
    };
    a.infinitescroll.prototype = {
        _binding: function (b) {
            var a = this,
                d = a.options;
            if (d.behavior && this["_binding_" + d.behavior] !== f) this["_binding_" + d.behavior].call(this);
            else {
                if ("bind" !== b && "unbind" !== b) return this._debug("Binding value  " + b + " not valid"), !1;
                if ("unbind" == b) this.options.binder.unbind("smartscroll.infscr." + a.options.infid);
                else this.options.binder[b]("smartscroll.infscr." + a.options.infid, function () {
                    a.scroll()
                });
                this._debug("Binding", b)
            }
        },
        _create: function (b, e) {
            if (!this._validate(b)) return !1;
            var d = this.options = a.extend(!0, {}, a.infinitescroll.defaults, b),
                c = a(d.nextSelector).attr("href");
            d.contentSelector = d.contentSelector || this.element;
            d.loading.selector = d.loading.selector || d.contentSelector;
            c ? (d.path = this._determinepath(c), d.loading.msg =
                a('<div id="infscr-loading"><img alt="Loading..." src="' + d.loading.img + '" /><div>' + d.loading.msgText + "</div></div>"), (new Image).src = d.loading.img, d.pixelsFromNavToBottom = a(document).height() - a(d.navSelector).offset().top, d.loading.start = d.loading.start || function () {
                    a(d.navSelector).hide();
                    d.loading.msg.appendTo(d.loading.selector).show(d.loading.speed, function () {
                        beginAjax(d)
                    })
                }, d.loading.finished = d.loading.finished || function () {
                    d.loading.msg.fadeOut("normal")
                }, d.callback = function (b, c) {
                    d.behavior &&
                        b["_callback_" + d.behavior] !== f && b["_callback_" + d.behavior].call(a(d.contentSelector)[0], c);
                    e && e.call(a(d.contentSelector)[0], c)
                }, this._setup()) : this._debug("Navigation selector not found")
        },
        _debug: function () {
            if (this.options.debug) return c.console && console.log.call(console, arguments)
        },
        _determinepath: function (b) {
            var a = this.options;
            if (a.behavior && this["_determinepath_" + a.behavior] !== f) this["_determinepath_" + a.behavior].call(this, b);
            else {
                if (a.pathParse) return this._debug("pathParse manual"), a.pathParse;
                if (b.match(/^(.*?)\b2\b(.*?$)/)) b = b.match(/^(.*?)\b2\b(.*?$)/).slice(1);
                else if (b.match(/^(.*?)2(.*?$)/)) {
                    if (b.match(/^(.*?page=)2(\/.*|$)/)) return b = b.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    b = b.match(/^(.*?)2(.*?$)/).slice(1)
                } else {
                    if (b.match(/^(.*?page=)1(\/.*|$)/)) return b = b.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    this._debug("Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.");
                    a.state.isInvalidPage = !0
                }
                this._debug("determinePath", b);
                return b
            }
        },
        _error: function (b) {
            var a = this.options;
            a.behavior && this["_error_" + a.behavior] !== f ? this["_error_" + a.behavior].call(this, b) : ("destroy" !== b && "end" !== b && (b = "unknown"), this._debug("Error", b), "end" == b && this._showdonemsg(), a.state.isDone = !0, a.state.currPage = 1, a.state.isPaused = !1, this._binding("unbind"))
        },
        _loadcallback: function (b, e) {
            var d = this.options,
                g = this.options.callback,
                i = d.state.isDone ? "done" : !d.appendCallback ? "no-append" : "append";
            if (d.behavior &&
                this["_loadcallback_" + d.behavior] !== f) this["_loadcallback_" + d.behavior].call(this, b, e);
            else {
                switch (i) {
                case "done":
                    return this._showdonemsg(), !1;
                case "no-append":
                    "html" == d.dataType && (e = a("<div>" + e + "</div>").find(d.itemSelector));
                    break;
                case "append":
                    var h = b.children();
                    if (0 == h.length) return this._error("end");
                    for (i = document.createDocumentFragment(); b[0].firstChild;) i.appendChild(b[0].firstChild);
                    this._debug("contentSelector", a(d.contentSelector)[0]);
                    a(d.contentSelector)[0].appendChild(i);
                    e = h.get()
                }
                d.loading.finished.call(a(d.contentSelector)[0],
                    d);
                d.animate && (i = a(c).scrollTop() + a("#infscr-loading").height() + d.extraScrollPx + "px", a("html,body").animate({
                    scrollTop: i
                }, 800, function () {
                    d.state.isDuringAjax = !1
                }));
                d.animate || (d.state.isDuringAjax = !1);
                g(this, e)
            }
        },
        _nearbottom: function () {
            var b = this.options,
                e = 0 + a(document).height() - b.binder.scrollTop() - a(c).height();
            if (b.behavior && this["_nearbottom_" + b.behavior] !== f) this["_nearbottom_" + b.behavior].call(this);
            else return this._debug("math:", e, b.pixelsFromNavToBottom), e - b.bufferPx < b.pixelsFromNavToBottom
        },
        _pausing: function (b) {
            var a = this.options;
            if (a.behavior && this["_pausing_" + a.behavior] !== f) this["_pausing_" + a.behavior].call(this, b);
            else {
                "pause" !== b && ("resume" !== b && null !== b) && this._debug("Invalid argument. Toggling pause value instead");
                switch (b && ("pause" == b || "resume" == b) ? b : "toggle") {
                case "pause":
                    a.state.isPaused = !0;
                    break;
                case "resume":
                    a.state.isPaused = !1;
                    break;
                case "toggle":
                    a.state.isPaused = !a.state.isPaused
                }
                this._debug("Paused", a.state.isPaused);
                return !1
            }
        },
        _setup: function () {
            var a = this.options;
            if (a.behavior &&
                this["_setup_" + a.behavior] !== f) this["_setup_" + a.behavior].call(this);
            else return this._binding("bind"), !1
        },
        _showdonemsg: function () {
            var b = this.options;
            b.behavior && this["_showdonemsg_" + b.behavior] !== f ? this["_showdonemsg_" + b.behavior].call(this) : (b.loading.msg.find("img").hide().parent().find("div").html(b.loading.finishedMsg).animate({
                opacity: 1
            }, 2E3, function () {
                a(this).parent().fadeOut("normal")
            }), b.errorCallback.call(a(b.contentSelector)[0], "done"))
        },
        _validate: function (b) {
            for (var e in b) return e.indexOf && -1 < e.indexOf("Selector") && 0 === a(b[e]).length ? (this._debug("Your " + e + " found no elements."), !1) : !0
        },
        bind: function () {
            this._binding("bind")
        },
        destroy: function () {
            this.options.state.isDestroyed = !0;
            return this._error("destroy")
        },
        pause: function () {
            this._pausing("pause")
        },
        resume: function () {
            this._pausing("resume")
        },
        retrieve: function (b) {
            var e = this,
                d = e.options,
                c = d.path,
                g, h, j, k, b = b || null;
            beginAjax = function (b) {
                b.state.currPage++;
                e._debug("heading into ajax", c);
                g = a(b.contentSelector).is("table") ? a("<tbody/>") : a("<div/>");
                h = c.join(b.state.currPage);
                j = "html" == b.dataType || "json" == b.dataType ? b.dataType : "html+callback";
                b.appendCallback && "html" == b.dataType && (j += "+callback");
                switch (j) {
                case "html+callback":
                    e._debug("Using HTML via .load() method");
                    g.load(h + " " + b.itemSelector, null, function (b) {
                        e._loadcallback(g, b)
                    });
                    break;
                case "html":
                case "json":
                    e._debug("Using " + j.toUpperCase() + " via $.ajax() method"), a.ajax({
                        url: h,
                        dataType: b.dataType,
                        complete: function (b, a) {
                            (k = "undefined" !== typeof b.isResolved ? b.isResolved() : "success" === a ||
                                "notmodified" === a) ? e._loadcallback(g, b.responseText) : e._error("end")
                        }
                    })
                }
            };
            if (d.behavior && this["retrieve_" + d.behavior] !== f) this["retrieve_" + d.behavior].call(this, b);
            else {
                if (d.state.isDestroyed) return this._debug("Instance is destroyed"), !1;
                d.state.isDuringAjax = !0;
                d.loading.start.call(a(d.contentSelector)[0], d)
            }
        },
        scroll: function () {
            var b = this.options,
                a = b.state;
            b.behavior && this["scroll_" + b.behavior] !== f ? this["scroll_" + b.behavior].call(this) : !a.isDuringAjax && !a.isInvalidPage && !a.isDone && !a.isDestroyed && !a.isPaused && this._nearbottom() && this.retrieve()
        },
        toggle: function () {
            this._pausing()
        },
        unbind: function () {
            this._binding("unbind")
        },
        update: function (b) {
            a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
        }
    };
    a.fn.infinitescroll = function (b, c) {
        switch (typeof b) {
        case "string":
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var c = a.data(this, "infinitescroll");
                if (!c || !a.isFunction(c[b]) || "_" === b.charAt(0)) return !1;
                c[b].apply(c, d)
            });
            break;
        case "object":
            this.each(function () {
                var d = a.data(this,
                    "infinitescroll");
                d ? d.update(b) : a.data(this, "infinitescroll", new a.infinitescroll(b, c, this))
            })
        }
        return this
    };
    var g = a.event,
        h;
    g.special.smartscroll = {
        setup: function () {
            a(this).bind("scroll", g.special.smartscroll.handler)
        },
        teardown: function () {
            a(this).unbind("scroll", g.special.smartscroll.handler)
        },
        handler: function (b, c) {
            var d = this,
                f = arguments;
            b.type = "smartscroll";
            h && clearTimeout(h);
            h = setTimeout(function () {
                a.event.handle.apply(d, f)
            }, "execAsap" === c ? 0 : 100)
        }
    };
    a.fn.smartscroll = function (a) {
        return a ? this.bind("smartscroll",
            a) : this.trigger("smartscroll", ["execAsap"])
    }
}(window, jQuery), $(window).load(function () {
    $("#content").infinitescroll({
        navSelector: "#nav",
        nextSelector: "#nav a#next",
        itemSelector: "article:not(.noinfscr)",
        loading: {
            finishedMsg: "No more pages to load",
            msgText: "",
            img: "http://static.tumblr.com/gp7lr70/evLm3lndw/horizontal-loading.gif"
        },
        bufferPx: 1E3,
        extraScrollPx: 500,
        debug: !1,
        errorCallback: function () {
            $("#infscr-loading").animate({
                opacity: 0.8
            }, 2E3).fadeOut("normal")
        }
    }, function (c) {
        $(c).postify();
        mnemone.pad &&
            $(".pad").removeClass("pad")
    })
}));
jQuery.fn.topLink = function (c) {
    c = jQuery.extend({
        min: 1,
        fadeSpeed: 200
    }, c);
    return this.each(function () {
        var a = $(this);
        a.hide();
        $(window).scroll(function () {
            $(window).scrollTop() >= c.min ? a.fadeIn(c.fadeSpeed) : a.fadeOut(c.fadeSpeed)
        })
    })
};
$(document).ready(function () {
    $("#totop").topLink({
        min: 400,
        fadeSpeed: 500
    });
    $("#totop").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow")
    })
});

function fixaud(c) {
    var a = $("#" + c + " .audiobox");
    $.ajax({
        url: "http://" + mnemone.name + ".tumblr.com/api/read/json?id=" + c,
        dataType: "jsonp",
        timeout: 5E4,
        success: function (c) {
            c = c.posts[0]["audio-player"].replace("player", "player_black");
            a.html('<div class="audio_player">' + c + "</div>")
        }
    })
}

function fixvid(c, a) {
    $("#" + c + " embed, #" + c + " iframe, #" + c + " video").each(function () {
        $this = $(this);
        $this.height(a * ($this.height() / $this.width())).width(a)
    })
}

function fixps(c) {
    var a = $("#" + c + " .adjust-photoset"),
        f = a.attr("data-layout").split("");
    a.attr("data-count");
    var g = "",
        h = 0,
        b = 1;
    $.each(f, function (a, d) {
        g = g + ('<div class="phorow row' + d + ' unequal">');
        parseInt(h);
        for (parseInt(d); d > 0;) {
            g = g + $("#" + c + " .pic").eq(h).children().attr("data-number", b).parent().html();
            h++;
            b++;
            d--
        }
        g = g + "</div>"
    });
    a.html(g);
    $("#" + c + " .phorow.row1 img").each(function () {
        a.width() > 500 && $(this).attr("src", $(this).parent().attr("data-hd"))
    });
    equaliseWidths(c);
    a.imagesLoaded(equaliseHeights(c))
}

function equaliseWidths(c) {
    var a = $("#" + c).innerWidth();
    $("#" + c + " .phorow.row2 .sin").width(Math.ceil((a - 8) / 2));
    $("#" + c + " .phorow.row3 .sin").width(Math.ceil((a - 16) / 3));
    a > 500 && $("#" + c + " .row1 img").each(function () {
        $(this).attr("src", $(this).parent().attr("data-hd"))
    })
}

function equaliseHeights(c) {
    setTimeout(function () {
        $("#" + c + " .phorow:not(.row1)").each(function () {
            var a = $("div", this).eq(0).find("img").outerHeight();
            $("div", this).eq(1).find("img").outerHeight() > a && (a = $("div", this).eq(1).find("img").outerHeight());
            $(this).hasClass("row3") && $("div", this).eq(2).find("img").outerHeight() > a && (a = $("div", this).eq(2).find("img").outerHeight());
            if (a != 0) {
                $(this).height(a);
                $("img", this).remove()
            } else equaliseHeights(c)
        })
    }, 200)
}

function postwidth() {
    return Math.floor((parseInt(mnemone.maxwid) - parseInt(mnemone.minwid)) / 20 * Math.random()) * 20 + parseInt(mnemone.minwid)
}

function postmargin() {
    if (mnemone.margin == "thin") {
        maxint = "30";
        minint = "10"
    }
    if (mnemone.margin == "norm") {
        maxint = "60";
        minint = "10"
    }
    if (mnemone.margin == "thick") {
        maxint = "140";
        minint = "20"
    }
    return Math.floor((parseInt(maxint) - parseInt(minint)) / 5 * Math.random()) * 5 + parseInt(minint)
}
jQuery.fn.postify = function () {
    return this.each(function () {
        $this = $(this);
        var c = $this.attr("id"),
            a = postwidth(),
            f = Math.floor(Math.random() * 14) * 5 - 45 + "%";
        mnemone.expand && $this.hasClass(mnemone.expand) && (a = Math.floor((a + parseInt(mnemone.maxwid)) * parseFloat(mnemone.expanddeg) / 2));
        $this.hasClass("audio") && a > 227 && (a = 227);
        $this.width(a).css("margin", postmargin() + "px " + postmargin() + "px " + Math.floor(postmargin() * 0.6) + "px " + postmargin() + "px").css("vertical-align", f);
        a > "500" && $("img", this).each(function () {
            $(this).attr("src",
                $(this).attr("data-hd"))
        });
        $this.hasClass("photoset") && fixps(c);
        $this.hasClass("audio") && fixaud(c);
        $this.hasClass("video") && fixvid(c, a)
    })
};
$(document).ready(function () {
    function c() {
        $("#lightbox").click(function () {
            $("#lightbox").fadeOut()
        });
        $(document).keyup(function (a) {
            a.keyCode == 27 && $("#lightbox").fadeOut()
        })
    }
       mnemone.pad && $(".pad").removeClass("pad");
    mnemone.padd && $(".padd").removeClass("padd");
    mnemone.paddd && $(".paddd").removeClass("paddd");
    if (mnemone.index) {
        $("article:not(.noify)").postify();
        if (mnemone.twitter) {
            $.getJSON("http://twitter.com/statuses/user_timeline/" + mnemone.twitter + ".json?count=1&callback=?", function (c) {
                var g = c[0].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function (a) {
                    return '<a href="' + a + '">' + a + "</a>"
                }).replace(/\B@([_a-z0-9]+)/ig, function (a) {
                    return a.charAt(0) + '<a href="http://twitter.com/' +
                        a.substring(1) + '">' + a.substring(1) + "</a>"
                }),
                    h = c[0].user.screen_name,
                    b = "http://www.twitter.com/" + h;
                $("#twitter").html('<span class="status">' + g + '</span><span class="timestamp">' + a(c[0].created_at) + ' @<a href="' + b + '">' + h + "</a></span>")
            });
            var a = function (a) {
                var a = a.replace(/(\+[0-9]{4}\s)/ig, ""),
                    c = Date.parse(a),
                    c = parseInt(((arguments.length > 1 ? arguments[1] : new Date).getTime() - c) / 6E4);
                return c < 1 ? "less than a minute ago" : c < 2 ? "about a minute ago" : c < 45 ? parseInt(c).toString() + " minutes ago" : c < 90 ? "about an hour ago" :
                    c < 1440 ? "about " + parseInt(c / 60).toString() + " hours ago" : c < 2880 ? "1 day ago" : parseInt(c / 1440).toString() + " days ago"
            }
        }
    }
    $("#content").on("click", ".zoom", function () {
        $("body").prepend('<div id="lightbox" style="background-image: url(\'' + $(this).attr("href") + "'), url('http://static.tumblr.com/me5sfsd/3uilupq0q/loaderround.gif');\"></div>");
        $("#lightbox").fadeIn();
        c();
        return false
    })
});
