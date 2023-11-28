'use strict';
function _typeof(e) {
  return (
    (_typeof =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (n) {
            return typeof n;
          }
        : function (n) {
            return n &&
              typeof Symbol == 'function' &&
              n.constructor === Symbol &&
              n !== Symbol.prototype
              ? 'symbol'
              : typeof n;
          }),
    _typeof(e)
  );
}
function _classCallCheck(e, n) {
  if (!(e instanceof n))
    throw new TypeError('Cannot call a class as a function');
}
function _defineProperties(e, n) {
  for (var r = 0; r < n.length; r++) {
    var t = n[r];
    (t.enumerable = t.enumerable || !1),
      (t.configurable = !0),
      'value' in t && (t.writable = !0),
      Object.defineProperty(e, t.key, t);
  }
}
function _createClass(e, n, r) {
  return (
    n && _defineProperties(e.prototype, n),
    r && _defineProperties(e, r),
    Object.defineProperty(e, 'prototype', { writable: !1 }),
    e
  );
}
function _inherits(e, n) {
  if (typeof n != 'function' && n !== null)
    throw new TypeError('Super expression must either be null or a function');
  (e.prototype = Object.create(n && n.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, 'prototype', { writable: !1 }),
    n && _setPrototypeOf(e, n);
}
function _createSuper(e) {
  var n = _isNativeReflectConstruct();
  return function () {
    var t = _getPrototypeOf(e),
      i;
    if (n) {
      var s = _getPrototypeOf(this).constructor;
      i = Reflect.construct(t, arguments, s);
    } else i = t.apply(this, arguments);
    return _possibleConstructorReturn(this, i);
  };
}
function _possibleConstructorReturn(e, n) {
  if (n && (_typeof(n) === 'object' || typeof n == 'function')) return n;
  if (n !== void 0)
    throw new TypeError(
      'Derived constructors may only return object or undefined'
    );
  return _assertThisInitialized(e);
}
function _assertThisInitialized(e) {
  if (e === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return e;
}
function _wrapNativeSuper(e) {
  var n = typeof Map == 'function' ? new Map() : void 0;
  return (
    (_wrapNativeSuper = function (t) {
      if (t === null || !_isNativeFunction(t)) return t;
      if (typeof t != 'function')
        throw new TypeError(
          'Super expression must either be null or a function'
        );
      if (typeof n != 'undefined') {
        if (n.has(t)) return n.get(t);
        n.set(t, i);
      }
      function i() {
        return _construct(t, arguments, _getPrototypeOf(this).constructor);
      }
      return (
        (i.prototype = Object.create(t.prototype, {
          constructor: {
            value: i,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
        _setPrototypeOf(i, t)
      );
    }),
    _wrapNativeSuper(e)
  );
}
function _construct(e, n, r) {
  return (
    _isNativeReflectConstruct()
      ? (_construct = Reflect.construct)
      : (_construct = function (i, s, a) {
          var o = [null];
          o.push.apply(o, s);
          var l = Function.bind.apply(i, o),
            d = new l();
          return a && _setPrototypeOf(d, a.prototype), d;
        }),
    _construct.apply(null, arguments)
  );
}
function _isNativeReflectConstruct() {
  if (
    typeof Reflect == 'undefined' ||
    !Reflect.construct ||
    Reflect.construct.sham
  )
    return !1;
  if (typeof Proxy == 'function') return !0;
  try {
    return (
      Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {})
      ),
      !0
    );
  } catch (e) {
    return !1;
  }
}
function _isNativeFunction(e) {
  return Function.toString.call(e).indexOf('[native code]') !== -1;
}
function _setPrototypeOf(e, n) {
  return (
    (_setPrototypeOf =
      Object.setPrototypeOf ||
      function (t, i) {
        return (t.__proto__ = i), t;
      }),
    _setPrototypeOf(e, n)
  );
}
function _getPrototypeOf(e) {
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    _getPrototypeOf(e)
  );
}
function _defineProperty(e, n, r) {
  return (
    n in e
      ? Object.defineProperty(e, n, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[n] = r),
    e
  );
}
function _createForOfIteratorHelper(e, n) {
  var r =
    (typeof Symbol != 'undefined' && e[Symbol.iterator]) || e['@@iterator'];
  if (!r) {
    if (
      Array.isArray(e) ||
      (r = _unsupportedIterableToArray(e)) ||
      (n && e && typeof e.length == 'number')
    ) {
      r && (e = r);
      var t = 0,
        i = function () {};
      return {
        s: i,
        n: function () {
          return t >= e.length ? { done: !0 } : { done: !1, value: e[t++] };
        },
        e: function (d) {
          throw d;
        },
        f: i,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  var s = !0,
    a = !1,
    o;
  return {
    s: function () {
      r = r.call(e);
    },
    n: function () {
      var d = r.next();
      return (s = d.done), d;
    },
    e: function (d) {
      (a = !0), (o = d);
    },
    f: function () {
      try {
        !s && r.return != null && r.return();
      } finally {
        if (a) throw o;
      }
    },
  };
}
function _unsupportedIterableToArray(e, n) {
  if (e) {
    if (typeof e == 'string') return _arrayLikeToArray(e, n);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (r === 'Object' && e.constructor && (r = e.constructor.name),
      r === 'Map' || r === 'Set')
    )
      return Array.from(e);
    if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return _arrayLikeToArray(e, n);
  }
}
function _arrayLikeToArray(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var r = 0, t = new Array(n); r < n; r++) t[r] = e[r];
  return t;
}
var _iaq = _iaq || [],
  theme = theme;
(theme.utils.EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/),
  (theme.utils.handleize = function (e) {
    return e
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  }),
  (theme.utils.serializeForm = function (e) {
    var n = {},
      r = new FormData(e),
      t = r.keys(),
      i = _createForOfIteratorHelper(t),
      s;
    try {
      for (i.s(); !(s = i.n()).done; ) {
        var a = s.value;
        n[a] = r.get(a);
      }
    } catch (o) {
      i.e(o);
    } finally {
      i.f();
    }
    return JSON.stringify(n);
  }),
  (theme.utils.Timer = function (e) {
    var n = this,
      r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 500,
      t;
    (this.stop = function () {
      return t && (clearInterval(t), (t = null)), n;
    }),
      (this.start = function () {
        return t || (n.stop(), (t = setInterval(e, r))), n;
      });
  }),
  (theme.utils.iterable = function (e, n) {
    var r =
        arguments.length > 2 && arguments[2] !== void 0
          ? arguments[2]
          : 'identify',
      t = n;
    r === 'identify' && (t.accepts_marketing = !0), _iaq.push([r, e, t]);
  }),
  (theme.utils.gif = function (e, n) {
    var r =
      arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e3;
    if (!(!e || !n)) {
      var t = 0,
        i,
        s,
        a;
      e.tagName === 'PICTURE' &&
        ((i = e.querySelector('img')),
        (s = e.querySelector('source[media="(max-width:989px)"]')),
        (a = e.querySelector('source[media="(min-width:990px)"]'))),
        setInterval(function () {
          e.tagName === 'IMG'
            ? (e.src = n[t])
            : ((i.src = n[t].desktop),
              (s.srcset = n[t].mobile),
              (a.srcset = n[t].desktop)),
            t++,
            t === n.length && (t = 0);
        }, r);
    }
  }),
  (theme.utils.swipe = function (e, n) {
    var r = e,
      t = 50,
      i = 100,
      s = 300,
      a = n || function (v) {},
      o,
      l,
      d,
      c,
      u,
      m,
      f,
      p;
    r.addEventListener(
      'touchstart',
      function (v) {
        var h = v.changedTouches[0];
        (o = 'none'),
          (m = 0),
          (l = h.pageX),
          (d = h.pageY),
          (p = new Date().getTime());
      },
      { passive: !0 }
    ),
      r.addEventListener(
        'touchend',
        function (v) {
          var h = v.changedTouches[0];
          (c = h.pageX - l),
            (u = h.pageY - d),
            (f = new Date().getTime() - p),
            f <= s &&
              (Math.abs(c) >= t && Math.abs(u) <= i
                ? (o = c < 0 ? 'left' : 'right')
                : Math.abs(u) >= t &&
                  Math.abs(c) <= i &&
                  (o = u < 0 ? 'up' : 'down')),
            a(o);
        },
        { passive: !0 }
      );
  }),
  (theme.fetchConfig = function () {
    var e =
      arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'json';
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/'.concat(e),
      },
    };
  });
var ZuoSliderComponent = (function (e) {
  _inherits(r, e);
  var n = _createSuper(r);
  function r() {
    var t;
    return (
      _classCallCheck(this, r),
      (t = n.call(this)),
      _defineProperty(_assertThisInitialized(t), 'slidesWrapper', void 0),
      _defineProperty(_assertThisInitialized(t), 'slides', void 0),
      _defineProperty(_assertThisInitialized(t), 'slidesLength', void 0),
      _defineProperty(_assertThisInitialized(t), 'prev', void 0),
      _defineProperty(_assertThisInitialized(t), 'next', void 0),
      _defineProperty(_assertThisInitialized(t), 'dots', void 0),
      _defineProperty(_assertThisInitialized(t), 'checking', void 0),
      _defineProperty(_assertThisInitialized(t), 'threshold', void 0),
      _defineProperty(_assertThisInitialized(t), 'quantity', void 0),
      _defineProperty(_assertThisInitialized(t), 'allowClick', void 0),
      _defineProperty(_assertThisInitialized(t), 'multiple', void 0),
      _defineProperty(_assertThisInitialized(t), 'centered', void 0),
      _defineProperty(_assertThisInitialized(t), 'position', void 0),
      _defineProperty(_assertThisInitialized(t), 'initialPosition', void 0),
      _defineProperty(_assertThisInitialized(t), 'finalPosition', void 0),
      _defineProperty(_assertThisInitialized(t), 'disabled', void 0),
      _defineProperty(_assertThisInitialized(t), 'slide', void 0),
      _defineProperty(_assertThisInitialized(t), 'step', void 0),
      _defineProperty(_assertThisInitialized(t), 'initial', void 0),
      _defineProperty(_assertThisInitialized(t), 'final', void 0),
      _defineProperty(_assertThisInitialized(t), 'x1', void 0),
      _defineProperty(_assertThisInitialized(t), 'y1', void 0),
      _defineProperty(_assertThisInitialized(t), 'x2', void 0),
      _defineProperty(_assertThisInitialized(t), 'y2', void 0),
      (t.slidesWrapper = t.querySelector('.slider-slides')),
      (t.slides = t.querySelectorAll('.slider-slide')),
      (t.slidesLength = t.slides.length),
      (t.prev = t.querySelector('.slider-prev')),
      (t.next = t.querySelector('.slider-next')),
      (t.dots = t.querySelector('.slider-dots')),
      (t.checking = !1),
      (t.threshold = 50),
      (t.quantity = parseInt(t.dataset.quantity)),
      (t.allowClick = !0),
      t.init(),
      t
    );
  }
  return (
    _createClass(r, [
      {
        key: 'init',
        value: function () {
          var i = this;
          this.dataset.status !== 'disabled' &&
            (this.resizeVariables(),
            this.createClones(),
            this.prev &&
              this.prev.addEventListener(
                'click',
                function () {
                  i.changeSlide('prev');
                }.bind(this)
              ),
            this.next &&
              this.next.addEventListener(
                'click',
                function () {
                  i.changeSlide('next');
                }.bind(this)
              ),
            this.dots &&
              this.dots.addEventListener(
                'click',
                function (s) {
                  var a = s.target,
                    o = a.dataset.index;
                  !o || a.hasAttribute('active') || i.changeSlide(parseInt(o));
                }.bind(this)
              ),
            this.slidesWrapper.addEventListener(
              'click',
              this.clickAction.bind(this)
            ),
            this.slidesWrapper.addEventListener(
              'transitionend',
              this.checkSlide.bind(this)
            ),
            this.slidesWrapper.addEventListener(
              'mousedown',
              this.dragStart.bind(this)
            ),
            this.slidesWrapper.addEventListener(
              'touchstart',
              this.dragStart.bind(this),
              { passive: !0 }
            ),
            this.slidesWrapper.addEventListener(
              'touchend',
              this.dragEnd.bind(this),
              { passive: !0 }
            ),
            this.slidesWrapper.addEventListener(
              'touchmove',
              this.dragAction.bind(this),
              { passive: !0 }
            ));
        },
      },
      {
        key: 'createClones',
        value: function () {
          var i = this.slides[0].cloneNode(!0),
            s = this.slides[this.slidesLength - 1].cloneNode(!0);
          if (
            (i.classList.add('slide-clone'),
            s.classList.add('slide-clone'),
            this.slidesWrapper.appendChild(i),
            this.slidesWrapper.insertBefore(s, this.slides[0]),
            this.multiple || this.centered)
          ) {
            var a = this.slides[1].cloneNode(!0),
              o = this.slides[this.slidesLength - 2].cloneNode(!0);
            if (
              (a.classList.add('slide-clone'),
              o.classList.add('slide-clone'),
              this.slidesWrapper.appendChild(a),
              this.slidesWrapper.insertBefore(o, s),
              this.quantity > 2 && !this.centered)
            ) {
              var l = this.slides[2].cloneNode(!0),
                d = this.slides[this.slidesLength - 3].cloneNode(!0);
              l.classList.add('slide-clone'),
                d.classList.add('slide-clone'),
                this.slidesWrapper.appendChild(l),
                this.slidesWrapper.insertBefore(d, o);
            }
          }
          (this.position = this.initialPosition),
            (this.slidesWrapper.style.transform = 'translateX(-'.concat(
              this.position,
              '%)'
            )),
            (this.dataset.status = 'on'),
            (this.slides = this.querySelectorAll('.slider-slide'));
        },
      },
      {
        key: 'changeSlide',
        value: function (i) {
          this.checking ||
            this.disabled ||
            ((this.dataset.status = 'transition'),
            i === 'next'
              ? ((this.position = this.position + this.step),
                (this.slide = this.slide + 1))
              : i === 'prev'
              ? ((this.position = this.position - this.step),
                (this.slide = this.slide - 1))
              : typeof i == 'number' &&
                ((this.position = this.centered
                  ? this.initialPosition + this.step * i
                  : i * this.step),
                (this.slide = i)),
            (this.slidesWrapper.style.transform = 'translateX(-'.concat(
              this.position,
              '%)'
            )),
            (this.checking = !0));
        },
      },
      {
        key: 'checkSlide',
        value: function () {
          (this.dataset.status = 'on'),
            this.position < 1 || (this.centered && this.position < 78)
              ? ((this.slide = this.slidesLength),
                (this.position = this.finalPosition),
                (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                  this.position,
                  '%)'
                )))
              : this.slide > this.slidesLength &&
                ((this.slide = 1),
                (this.position = this.initialPosition),
                (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                  this.position,
                  '%)'
                ))),
            this.updateDots(),
            (this.checking = !1);
        },
      },
      {
        key: 'dragStart',
        value: function (i) {
          if (!(this.disabled || window.innerWidth > 989)) {
            var s = this.slidesWrapper.getBoundingClientRect().width;
            (this.initial = this.centered
              ? s * 0.77 + s * 0.85 * this.slide
              : s * this.slide),
              (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                this.initial,
                'px)'
              )),
              i.type == 'touchstart'
                ? ((this.x1 = i.touches[0].clientX),
                  (this.y1 = i.touches[0].clientY))
                : (i.preventDefault(),
                  (this.x1 = i.clientX),
                  (this.y1 = i.clientY),
                  (document.onmouseup = this.dragEnd.bind(this)),
                  (document.onmousemove = this.dragAction.bind(this)));
          }
        },
      },
      {
        key: 'dragAction',
        value: function (i) {
          var s = this.getPosition(),
            a = i.type == 'touchmove' ? i.touches[0].clientY : i.clientY,
            o = i.type == 'touchmove' ? i.touches[0].clientX : i.clientX;
          (this.allowClick = !1),
            (this.y2 = this.y1 - a),
            (this.x2 = this.x1 - o),
            (this.x1 = o),
            Math.abs(this.x2) > Math.abs(this.y2) &&
              (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                s + this.x2,
                'px)'
              ));
        },
      },
      {
        key: 'dragEnd',
        value: function () {
          var i = this;
          (this.final = this.getPosition()),
            this.final - this.initial < -this.threshold
              ? this.changeSlide('prev')
              : this.final - this.initial > this.threshold
              ? this.changeSlide('next')
              : ((this.dataset.status = 'transition'),
                (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                  this.position,
                  '%)'
                ))),
            (document.onmouseup = null),
            (document.onmousemove = null),
            setTimeout(
              function () {
                i.allowClick = !0;
              }.bind(this),
              0
            );
        },
      },
      {
        key: 'clickAction',
        value: function (i) {
          this.allowClick || i.preventDefault();
        },
      },
      {
        key: 'getPosition',
        value: function () {
          var i = this.slidesWrapper.style.transform
            .replace('translateX(-', '')
            .replace('px)', '');
          return parseInt(i);
        },
      },
      {
        key: 'resizeVariables',
        value: function () {
          (this.centered =
            window.innerWidth < 990 &&
            this.classList.contains('slider-centered')),
            (this.disabled =
              window.innerWidth > 989 &&
              this.classList.contains('slider-no-desktop')),
            (this.multiple = window.innerWidth > 989 && this.quantity > 1),
            (this.dataset.status = 'on'),
            (this.slide = 1),
            (this.initialPosition = this.centered ? 162 : 100),
            (this.step = this.centered ? 85 : this.multiple ? 33.33 : 100),
            (this.finalPosition = this.centered
              ? 77 + this.step * this.slidesLength
              : this.step * this.slidesLength),
            (this.position = this.initialPosition),
            (this.slidesWrapper.style.transform = 'translateX(-'.concat(
              this.position,
              '%)'
            )),
            this.updateDots();
        },
      },
      {
        key: 'updateDots',
        value: function () {
          this.dots &&
            (this.dots.querySelector('[active]').removeAttribute('active'),
            this.dots
              .querySelector('[data-index="' + this.slide + '"]')
              .setAttribute('active', ''));
        },
      },
      {
        key: 'update',
        value: function (i) {
          if (!(!i || i.length === 0)) {
            (this.slidesWrapper.style.minHeight =
              this.slidesWrapper.getBoundingClientRect().height + 'px'),
              (this.slidesWrapper.innerHTML = ''),
              (this.slide = 1),
              (this.position = this.initialPosition),
              (this.slidesWrapper.style.transform = 'translateX(-'.concat(
                this.position,
                '%)'
              ));
            var s = '';
            i.forEach(function (a, o) {
              var l = o + 1;
              s += '\n      <div class="slider-slide media" data-index="'
                .concat(l, '">\n        <img src="')
                .concat(a.src, '" alt="')
                .concat(
                  a.alt,
                  '" width="800" height="1000" class="cover-image">\n      </div>'
                );
            }),
              (this.slidesWrapper.innerHTML = s),
              (this.slides = this.querySelectorAll('.slider-slide')),
              (this.slidesLength = this.slides.length),
              this.createClones(),
              this.updateDots(),
              (this.slidesWrapper.style.minHeight = '');
          }
        },
      },
    ]),
    r
  );
})(_wrapNativeSuper(HTMLElement));
customElements.define('zuo-slider-component', ZuoSliderComponent);

var AccordionComponent = (function (e) {
  _inherits(r, e);
  var n = _createSuper(r);
  function r() {
    var t;
    return (
      _classCallCheck(this, r),
      (t = n.call(this)),
      _defineProperty(_assertThisInitialized(t), 'buttons', void 0),
      (t.buttons = t.querySelectorAll('button')),
      t.addEventListener(
        'click',
        t.handleClick.bind(_assertThisInitialized(t))
      ),
      t
    );
  }
  return (
    _createClass(r, [
      {
        key: 'handleClick',
        value: function (i) {
          var s = i.target;
          if (s.tagName === 'BUTTON') {
            if (s.getAttribute('aria-expanded') === 'true') {
              s.setAttribute('aria-expanded', 'false');
              return;
            } else if (this.buttons.length === 1) {
              s.setAttribute('aria-expanded', 'true');
              return;
            }
            this.buttons.forEach(function (a) {
              a === s
                ? a.setAttribute('aria-expanded', 'true')
                : a.setAttribute('aria-expanded', 'false');
            });
          }
        },
      },
    ]),
    r
  );
})(_wrapNativeSuper(HTMLElement));
customElements.define('accordion-component', AccordionComponent);

var FaqComponent = (function (e) {
  _inherits(r, e);
  var n = _createSuper(r);
  function r() {
    var t;
    return (
      _classCallCheck(this, r),
      (t = n.call(this)),
      _defineProperty(_assertThisInitialized(t), 'questions', void 0),
      (t.questions = t.querySelectorAll('dt')),
      t.addEventListener(
        'click',
        t.handleDropdown.bind(_assertThisInitialized(t))
      ),
      t
    );
  }
  return (
    _createClass(r, [
      {
        key: 'handleDropdown',
        value: function (i) {
          var s;
          if (i.target.tagName === 'H3') s = i.target.closest('dt');
          else if (i.target.tagName === 'DT') s = i.target;
          else return;
          if (s.getAttribute('aria-expanded') === 'true') {
            s.setAttribute('aria-expanded', 'false');
            return;
          } else if (this.questions.length === 1) {
            s.setAttribute('aria-expanded', 'true');
            return;
          }
          this.questions.forEach(function (a) {
            a === s
              ? s.setAttribute('aria-expanded', 'true')
              : a.setAttribute('aria-expanded', 'false');
          });
        },
      },
    ]),
    r
  );
})(_wrapNativeSuper(HTMLElement));
customElements.define('faq-component', FaqComponent);

var NewsletterForm = (function (e) {
  _inherits(r, e);
  var n = _createSuper(r);
  function r() {
    var t;
    return (
      _classCallCheck(this, r),
      (t = n.call(this)),
      _defineProperty(_assertThisInitialized(t), 'form', void 0),
      _defineProperty(_assertThisInitialized(t), 'email', void 0),
      (t.form = t.querySelector('form')),
      (t.email = t.form.querySelector('[type="email"]')),
      t.form.addEventListener(
        'submit',
        t.newsletter.bind(_assertThisInitialized(t))
      ),
      t
    );
  }
  return (
    _createClass(r, [
      {
        key: 'newsletter',
        value: function (i) {
          i.preventDefault();
          var s = this.email.value;
          theme.utils.EMAIL_REGEX.test(s) && this.handleData(s);
        },
      },
      {
        key: 'getProductName',
        value: function (i, s) {
          var a = i.options[0].includes('Weight')
              ? s.options[0] + 'lbs'
              : s.options[0],
            o = i.options[1].includes('Weight')
              ? s.options[1] + 'lbs'
              : s.options[1],
            l = [i.title, a, o].join(' ');
          return l;
        },
      },
      {
        key: 'handleData',
        value: function (i) {
          var s = {};
          if (this.dataset.type === 'product' && 'product' in theme) {
            var a = this.getProductName(
              theme.product,
              theme.product.currentVariant
            );
            s.weightList = a;
          } else if (this.dataset.type === 'collection') {
            var o = this.closest('.collection-shop'),
              l = o.querySelector('[name="id"]'),
              d = parseInt(l.value),
              c = o.dataset.product,
              u = theme.collectionProducts[c].find(function (p) {
                return p.id === d;
              }),
              m = this.getProductName(theme.collectionProducts[c], u);
            s.weightList = m;
          } else {
            var f = this.querySelector('[name="contact[tags]"').value;
            s[f] = !0;
          }
          console.log(222),
            theme.utils.iterable(i, s),
            this.setAttribute('success', '');
        },
      },
    ]),
    r
  );
})(_wrapNativeSuper(HTMLElement));
customElements.define('newsletter-form', NewsletterForm),
  (function () {
    var n = document.querySelectorAll('[data-modal-trigger]');
    n.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = document.getElementById(t.dataset.modalTrigger);
        i.hasAttribute('open')
          ? i.removeAttribute('open')
          : i.setAttribute('open', ''),
          document.body.classList.toggle('body_fade'),
          document.body.classList.toggle('header_fade');
      });
    });
    var r = document.querySelectorAll('[data-drawer-trigger]');
    r.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = document.getElementById(t.dataset.drawerTrigger);
        i.hasAttribute('open')
          ? (i.removeAttribute('open'),
            document.body.classList.remove('body_fade'),
            document.body.classList.remove('header_fade'))
          : (i.setAttribute('open', ''),
            t.dataset.drawerTrigger === 'menu-drawer'
              ? document.body.classList.add('body_fade')
              : (document.body.classList.add('body_fade'),
                document.body.classList.add('header_fade')));
      });
    });
  })(),
  (function () {
    var n = document.querySelector('.scrollup');
    n.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }),
      window.addEventListener('scroll', function () {
        window.scrollY > 50 ? (n.style.opacity = '1') : (n.style.opacity = '0');
      });
  })();
//# sourceMappingURL=/s/files/1/0529/5777/3999/t/22/assets/global.js.map?v=124578749201615234541674829737
