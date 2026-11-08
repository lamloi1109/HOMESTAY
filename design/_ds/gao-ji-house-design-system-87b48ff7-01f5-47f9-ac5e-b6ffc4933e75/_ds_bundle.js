/* @ds-bundle: {"format":4,"namespace":"GaoJiHouseDesignSystem_87b48f","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"FeatureCard","sourcePath":"components/data/FeatureCard.jsx"},{"name":"PhotoPlate","sourcePath":"components/data/PhotoPlate.jsx"},{"name":"RatingStars","sourcePath":"components/data/RatingStars.jsx"},{"name":"RoomSpecs","sourcePath":"components/data/RoomSpecs.jsx"},{"name":"UnitCard","sourcePath":"components/data/UnitCard.jsx"},{"name":"ContactRail","sourcePath":"components/feedback/ContactRail.jsx"},{"name":"InquiryModal","sourcePath":"components/feedback/InquiryModal.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"StayQueryBar","sourcePath":"components/forms/StayQueryBar.jsx"},{"name":"FilterTabs","sourcePath":"components/nav/FilterTabs.jsx"},{"name":"Footer","sourcePath":"components/nav/Footer.jsx"},{"name":"Logo","sourcePath":"components/nav/Logo.jsx"},{"name":"SectionHeader","sourcePath":"components/nav/SectionHeader.jsx"},{"name":"TopNav","sourcePath":"components/nav/TopNav.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"976c7f41eef9","components/core/Button.jsx":"4ffd0f7a241c","components/core/Eyebrow.jsx":"5e1796f320ef","components/core/Icon.jsx":"fd6f80d011d2","components/core/IconButton.jsx":"f2f55d713d90","components/core/Tag.jsx":"7539c179d01d","components/data/FeatureCard.jsx":"79911dfb88c8","components/data/PhotoPlate.jsx":"146c9438324d","components/data/RatingStars.jsx":"7fd16cf85767","components/data/RoomSpecs.jsx":"142b0ad4bed4","components/data/UnitCard.jsx":"230a165a796e","components/feedback/ContactRail.jsx":"e8d5299055b0","components/feedback/InquiryModal.jsx":"3eee35f375ba","components/forms/Input.jsx":"0a7e98fdc2fb","components/forms/Select.jsx":"a6b78869a5af","components/forms/StayQueryBar.jsx":"c3db4089f7af","components/nav/FilterTabs.jsx":"f16b96728afc","components/nav/Footer.jsx":"3dd0611e4c54","components/nav/Logo.jsx":"adb70d96d386","components/nav/SectionHeader.jsx":"f1fde3e18df5","components/nav/TopNav.jsx":"78ac9c9c734f","ui_kits/landing/Amenities.jsx":"2c791f084be5","ui_kits/landing/Hero.jsx":"c40ea9a671b0","ui_kits/landing/Lifestyle.jsx":"32c2d8de2a39","ui_kits/landing/LocationSection.jsx":"3b179099608f","ui_kits/landing/UnitCollection.jsx":"d22dccbc76da","ui_kits/landing/UnitDetail.jsx":"94a893cac5d4","ui_kits/landing/data.jsx":"e6fffb2d65fb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GaoJiHouseDesignSystem_87b48f = window.GaoJiHouseDesignSystem_87b48f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Eyebrow.jsx
try { (() => {
/* The caps category label that opens every section, card and band. */
function Eyebrow({
  children,
  tone = "gold",
  tick = true,
  style
}) {
  const colors = {
    gold: "var(--gold-900)",
    jade: "var(--jade-700)",
    muted: "var(--text-muted)",
    onDark: "var(--gold-050)"
  };
  const rule = {
    gold: "var(--gold-700)",
    jade: "var(--jade-700)",
    muted: "var(--hairline-strong)",
    onDark: "var(--gold-700)"
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      lineHeight: "var(--lh-label)",
      color: colors[tone] || colors.gold,
      ...style
    }
  }, tick ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 1,
      background: rule[tone] || rule.gold,
      flex: "none"
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Lucide, loaded from CDN as window.lucide (see readme ICONOGRAPHY).
   An unknown name renders nothing rather than the wrong glyph. */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color,
  label,
  style,
  className = ""
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const paint = () => {
      const lucide = typeof window !== "undefined" && window.lucide;
      if (!lucide || !ref.current) return false;
      lucide.createIcons({
        attrs: {
          "stroke-width": strokeWidth,
          width: size,
          height: size
        },
        nameAttr: "data-lucide",
        icons: lucide.icons
      });
      return true;
    };
    if (paint()) return;
    const t = setInterval(() => {
      if (paint()) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [name, size, strokeWidth]);
  if (!name) return null;
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    role: label ? "img" : undefined,
    "aria-label": label || undefined,
    "aria-hidden": label ? undefined : true,
    className: className,
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      lineHeight: 0,
      flex: "none",
      color: color || "inherit",
      ...style
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      display: "block",
      width: size,
      height: size
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  jade: {
    background: "var(--jade-700)",
    color: "var(--accent-on)",
    border: "var(--jade-700)"
  },
  gold: {
    background: "var(--gold-500)",
    color: "var(--ink-900)",
    border: "var(--gold-500)"
  },
  clay: {
    background: "var(--clay-500)",
    color: "#fff",
    border: "var(--clay-500)"
  },
  paper: {
    background: "var(--glass-warm)",
    color: "var(--ink-900)",
    border: "var(--hairline)"
  },
  outline: {
    background: "transparent",
    color: "var(--jade-700)",
    border: "var(--hairline-strong)"
  },
  available: {
    background: "var(--success-soft)",
    color: "var(--success)",
    border: "var(--success)"
  },
  held: {
    background: "var(--warning-soft)",
    color: "var(--warning)",
    border: "var(--warning)"
  }
};

/* Status and category flags. Square, caps, hairline. Sits over photography or in card headers. */
function Badge({
  tone = "paper",
  icon,
  children,
  style
}) {
  const t = TONES[tone] || TONES.paper;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      lineHeight: 1.2,
      borderRadius: "var(--radius-none)",
      background: t.background,
      color: t.color,
      border: "1px solid " + t.border,
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 11
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: "8px 16px",
    fontSize: "var(--fs-label)",
    minHeight: 36
  },
  md: {
    padding: "13px 26px",
    fontSize: "var(--fs-body-sm)",
    minHeight: "var(--tap-min)"
  },
  lg: {
    padding: "18px 38px",
    fontSize: "var(--fs-body-md)",
    minHeight: 56
  }
};
const VARIANTS = {
  jade: {
    background: "var(--jade-700)",
    color: "var(--accent-on)",
    border: "1px solid var(--jade-700)",
    hoverBg: "var(--jade-900)",
    hoverBorder: "var(--jade-900)"
  },
  gold: {
    background: "var(--gold-500)",
    color: "var(--accent-2-on)",
    border: "1px solid var(--gold-500)",
    hoverBg: "var(--gold-600)",
    hoverBorder: "var(--gold-600)"
  },
  clay: {
    background: "var(--clay-500)",
    color: "var(--accent-3-on)",
    border: "1px solid var(--clay-500)",
    hoverBg: "var(--clay-700)",
    hoverBorder: "var(--clay-700)"
  },
  outline: {
    background: "transparent",
    color: "var(--jade-700)",
    border: "1px solid var(--jade-700)",
    hoverBg: "var(--jade-700)",
    hoverColor: "var(--accent-on)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid transparent",
    hoverColor: "var(--gold-900)"
  },
  onDark: {
    background: "transparent",
    color: "var(--gold-050)",
    border: "1px solid var(--gold-700)",
    hoverBg: "var(--gold-500)",
    hoverColor: "var(--ink-900)",
    hoverBorder: "var(--gold-500)"
  }
};

/* Square, letterspaced, caps. The brand darkens on press — it never shrinks. */
function Button({
  variant = "jade",
  size = "md",
  icon,
  iconAfter,
  full,
  disabled,
  as = "button",
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.jade;
  const s = SIZES[size] || SIZES.md;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    disabled: as === "button" ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: full ? "flex" : "inline-flex",
      width: full ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      lineHeight: 1.2,
      borderRadius: "var(--radius-none)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .4 : 1,
      textDecoration: "none",
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
      ...s,
      ...v,
      background: hover && !disabled ? v.hoverBg || v.background : v.background,
      color: hover && !disabled ? v.hoverColor || v.color : v.color,
      borderColor: hover && !disabled && v.hoverBorder ? v.hoverBorder : undefined,
      border: v.border,
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "lg" ? 18 : 15
  }) : null, /*#__PURE__*/React.createElement("span", null, children), iconAfter ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconAfter,
    size: size === "lg" ? 18 : 15
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Square by default (toolbar, close, arrows); circular only for channel and social affordances. */
function IconButton({
  icon,
  label,
  variant = "outline",
  shape = "square",
  size = 44,
  tone,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    outline: {
      bg: "transparent",
      fg: "var(--jade-700)",
      bd: "var(--hairline-strong)",
      hbg: "var(--jade-700)",
      hfg: "var(--accent-on)"
    },
    jade: {
      bg: "var(--jade-700)",
      fg: "var(--accent-on)",
      bd: "var(--jade-700)",
      hbg: "var(--jade-900)",
      hfg: "var(--accent-on)"
    },
    onDark: {
      bg: "rgba(250,243,234,.08)",
      fg: "var(--gold-050)",
      bd: "rgba(212,175,55,.5)",
      hbg: "var(--gold-500)",
      hfg: "var(--ink-900)"
    },
    channel: {
      bg: tone || "var(--channel-zalo)",
      fg: "#fff",
      bd: "transparent",
      hbg: tone || "var(--channel-zalo)",
      hfg: "#fff"
    }
  };
  const t = tones[variant] || tones.outline;
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: hover ? t.hbg : t.bg,
      color: hover ? t.hfg : t.fg,
      border: "1px solid " + t.bd,
      borderRadius: shape === "circle" ? "var(--radius-circle)" : "var(--radius-none)",
      cursor: "pointer",
      padding: 0,
      filter: hover && variant === "channel" ? "brightness(1.08)" : "none",
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), filter var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.42)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/* An amenity or feature chip: Lucide glyph + caps label, hairline box, no fill. */
function Tag({
  icon,
  children,
  selected,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const active = selected || hover;
  const Tag_ = onClick ? "button" : "span";
  return /*#__PURE__*/React.createElement(Tag_, {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: "var(--fw-medium)",
      letterSpacing: ".06em",
      textTransform: "uppercase",
      lineHeight: 1.2,
      background: selected ? "var(--jade-700)" : "transparent",
      color: selected ? "var(--accent-on)" : active ? "var(--gold-900)" : "var(--text-body)",
      border: "1px solid " + (selected ? "var(--jade-700)" : active ? "var(--gold-700)" : "var(--hairline)"),
      borderRadius: "var(--radius-none)",
      cursor: onClick ? "pointer" : "default",
      transition: "all var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }) : null, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/FeatureCard.jsx
try { (() => {
/* Amenity / service card: glyph, caps eyebrow, serif headline, body, optional bullets. */
function FeatureCard({
  icon,
  eyebrow,
  title,
  children,
  bullets = [],
  tone = "paper",
  image,
  imageAlt = "",
  imageRatio = "16 / 10",
  style
}) {
  const [hover, setHover] = React.useState(false);
  const dark = tone === "jade" || tone === "ink";
  const bg = tone === "jade" ? "var(--jade-700)" : tone === "ink" ? "var(--surface-ink)" : tone === "warm" ? "var(--canvas-warm)" : "var(--surface-raised)";
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      background: bg,
      border: "1px solid " + (dark ? "rgba(212,175,55,.28)" : "var(--hairline)"),
      borderRadius: "var(--radius-none)",
      ...style
    }
  }, image ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      aspectRatio: imageRatio,
      overflow: "hidden",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover ? "scale(var(--hover-zoom))" : "scale(1)",
      transition: "transform var(--dur-gallery) var(--ease-out)"
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)",
      padding: "var(--space-lg)"
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26,
    color: dark ? "var(--gold-500)" : "var(--gold-700)"
  }) : null, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: dark ? "var(--gold-050)" : "var(--gold-900)"
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-headline-sm)",
      fontWeight: "var(--fw-medium)",
      lineHeight: "var(--lh-headline-sm)",
      color: dark ? "var(--text-inverse)" : "var(--text-primary)"
    }
  }, title), children ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-md)",
      lineHeight: "var(--lh-body)",
      color: dark ? "rgba(250,243,234,.78)" : "var(--text-body)"
    }
  }, children) : null, bullets.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: "var(--space-xs) 0 0",
      padding: 0,
      display: "grid",
      gap: "var(--space-xs)"
    }
  }, bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-sm)",
      letterSpacing: ".04em",
      color: dark ? "rgba(250,243,234,.86)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      marginTop: 8,
      background: "var(--gold-700)",
      flex: "none"
    }
  }), b))) : null));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/data/PhotoPlate.jsx
try { (() => {
/* The signature offset frame: a hairline rectangle shifted behind a photograph,
   so the composition reads as two planes. Caption is a print-style plate label. */
function PhotoPlate({
  src,
  alt = "",
  caption,
  ratio = "4 / 3",
  offset = "right",
  frame = "var(--gold-700)",
  zoom = true,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const dx = offset === "left" ? "calc(var(--frame-offset) * -1)" : "var(--frame-offset)";
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      position: "relative",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      transform: "translate(" + dx + ", var(--frame-offset))",
      border: "1px solid " + frame,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "block",
      aspectRatio: ratio,
      overflow: "hidden",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover && zoom ? "scale(var(--hover-zoom))" : "scale(1)",
      transition: "transform var(--dur-gallery) var(--ease-out)"
    }
  })), caption ? /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: "var(--space-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, caption) : null);
}
Object.assign(__ds_scope, { PhotoPlate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PhotoPlate.jsx", error: String((e && e.message) || e) }); }

// components/data/RatingStars.jsx
try { (() => {
function RatingStars({
  value = 5,
  count,
  size = 14,
  tone = "light",
  style
}) {
  const full = Math.round(value);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 2
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      color: i <= full ? "var(--gold-500)" : tone === "dark" ? "rgba(250,243,234,.28)" : "var(--hairline)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: size
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      letterSpacing: ".08em",
      color: tone === "dark" ? "var(--text-inverse)" : "var(--text-muted)"
    }
  }, value.toFixed(1), count != null ? " · " + count + " ĐÁNH GIÁ" : ""));
}
Object.assign(__ds_scope, { RatingStars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RatingStars.jsx", error: String((e && e.message) || e) }); }

// components/data/RoomSpecs.jsx
try { (() => {
/* The bed/bath/area strip under a unit headline. Hairline-separated, caps. */
function RoomSpecs({
  beds,
  baths,
  sqm,
  guests,
  tone = "light",
  style
}) {
  const items = [beds != null && {
    icon: "bed-double",
    text: beds + " PN"
  }, baths != null && {
    icon: "bath",
    text: baths + " WC"
  }, sqm != null && {
    icon: "door-open",
    text: sqm + " M²"
  }, guests != null && {
    icon: "users",
    text: guests + " KHÁCH"
  }].filter(Boolean);
  const fg = tone === "dark" ? "var(--text-inverse)" : "var(--text-body)";
  const line = tone === "dark" ? "rgba(212,175,55,.3)" : "var(--hairline)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("span", {
    key: it.text,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "0 14px",
      borderLeft: i === 0 ? "none" : "1px solid " + line,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: "var(--fw-medium)",
      letterSpacing: ".08em",
      color: fg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 15,
    color: tone === "dark" ? "var(--gold-500)" : "var(--gold-700)"
  }), it.text)));
}
Object.assign(__ds_scope, { RoomSpecs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RoomSpecs.jsx", error: String((e && e.message) || e) }); }

// components/data/UnitCard.jsx
try { (() => {
const vnd = n => n >= 1e6 ? (n / 1e6).toLocaleString("vi-VN", {
  maximumFractionDigits: 1
}) + " Triệu VNĐ" : n.toLocaleString("vi-VN") + " VNĐ";

/* Paper on paper: hairline box, no shadow, photo flush to the top edge.
   Only the photograph moves on hover. */
function UnitCard({
  code,
  title,
  image,
  type,
  floor,
  beds,
  baths,
  sqm,
  monthlyRateVnd,
  nightlyRateVnd,
  status = "available",
  statusLabel,
  onView,
  onInquire,
  labels = {},
  style
}) {
  const [hover, setHover] = React.useState(false);
  const t = {
    view: "Xem Sơ Đồ & Hình Ảnh",
    inquire: "Đặt Phòng / Hỏi Giá",
    month: "Giá Thuê Tháng",
    night: "Giá Theo Đêm",
    ...labels
  };
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-none)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      overflow: "hidden",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover ? "scale(var(--hover-zoom))" : "scale(1)",
      transition: "transform var(--dur-gallery) var(--ease-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "paper"
  }, code)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      right: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: status === "available" ? "available" : "held",
    icon: status === "available" ? "badge-check" : "calendar-check"
  }, statusLabel || (status === "available" ? "Còn Phòng" : "Đã Giữ Chỗ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-md) var(--space-md) 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--gold-900)"
    }
  }, type), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-headline-sm)",
      fontWeight: "var(--fw-medium)",
      lineHeight: "var(--lh-headline-sm)",
      color: hover ? "var(--gold-900)" : "var(--text-primary)",
      transition: "color var(--dur-fast) var(--ease-standard)"
    }
  }, title), floor ? /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-italic)",
      fontStyle: "italic",
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-muted)"
    }
  }, floor) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "var(--space-md) 0",
      padding: "var(--space-sm) 0",
      borderTop: "1px solid var(--hairline)",
      borderBottom: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.RoomSpecs, {
    beds: beds,
    baths: baths,
    sqm: sqm
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-md)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-md) var(--space-xl)"
    }
  }, monthlyRateVnd ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, t.month), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.35rem",
      color: "var(--jade-700)"
    }
  }, vnd(monthlyRateVnd))) : null, nightlyRateVnd ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, t.night), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.35rem",
      color: "var(--jade-700)"
    }
  }, vnd(nightlyRateVnd))) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: "var(--space-md)",
      display: "grid",
      gap: "var(--space-xs)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "jade",
    size: "sm",
    full: true,
    onClick: onView,
    iconAfter: "arrow-right"
  }, t.view), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "sm",
    full: true,
    onClick: onInquire
  }, t.inquire)));
}
Object.assign(__ds_scope, { UnitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/UnitCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ContactRail.jsx
try { (() => {
/* The SOP made visible: a fixed right-edge rail of contact channels.
   Present on every viewport — the landing page has no checkout. */
function ContactRail({
  zalo,
  wechat,
  phone,
  email,
  onInquire,
  style
}) {
  const items = [zalo && {
    icon: "message-circle",
    label: "Chat Zalo",
    tone: "var(--channel-zalo)",
    href: zalo
  }, wechat && {
    icon: "message-square",
    label: "WeChat",
    tone: "var(--channel-wechat)",
    href: wechat
  }, phone && {
    icon: "phone",
    label: "Gọi Ngay",
    tone: "var(--jade-700)",
    href: "tel:" + phone
  }, email && {
    icon: "mail",
    label: "Email",
    tone: "var(--ink-900)",
    href: "mailto:" + email
  }].filter(Boolean);
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "fixed",
      right: 16,
      bottom: 16,
      zIndex: 60,
      display: "grid",
      gap: "var(--space-xs)",
      justifyItems: "end",
      ...style
    }
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    href: it.href,
    target: "_blank",
    rel: "noreferrer",
    "aria-label": it.label,
    title: it.label,
    style: {
      display: "inline-flex",
      border: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: it.icon,
    label: it.label,
    variant: "channel",
    tone: it.tone,
    shape: "circle",
    size: 48
  }))), onInquire ? /*#__PURE__*/React.createElement("button", {
    onClick: onInquire,
    style: {
      padding: "12px 16px",
      background: "var(--gold-500)",
      color: "var(--ink-900)",
      border: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      cursor: "pointer"
    }
  }, "\u0110\u1EB7t Ph\xF2ng") : null);
}
Object.assign(__ds_scope, { ContactRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ContactRail.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Square field, hairline border, caps label above. Gold focus ring. */
function Input({
  label,
  icon,
  hint,
  error,
  onDark,
  as = "input",
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const Tag = as;
  const border = error ? "var(--danger)" : focus ? "var(--gold-500)" : onDark ? "rgba(212,175,55,.35)" : "var(--hairline-strong)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: "100%",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: onDark ? "var(--gold-050)" : "var(--text-muted)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      display: "flex",
      color: onDark ? "var(--gold-700)" : "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })) : null, /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    rows: as === "textarea" ? rest.rows || 4 : undefined,
    style: {
      width: "100%",
      padding: icon ? "13px 14px 13px 36px" : "13px 14px",
      minHeight: as === "textarea" ? undefined : "var(--tap-min)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-md)",
      lineHeight: 1.5,
      color: onDark ? "var(--text-inverse)" : "var(--text-primary)",
      background: onDark ? "rgba(250,243,234,.06)" : "var(--surface-raised)",
      border: "1px solid " + border,
      borderRadius: "var(--radius-none)",
      outline: "none",
      resize: as === "textarea" ? "vertical" : undefined,
      transition: "border-color var(--dur-fast) var(--ease-standard)"
    }
  }))), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-sm)",
      color: error ? "var(--danger)" : "var(--text-muted)"
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  onDark,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      width: "100%",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: onDark ? "var(--gold-050)" : "var(--text-muted)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "13px 36px 13px 14px",
      minHeight: "var(--tap-min)",
      appearance: "none",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-md)",
      color: onDark ? "var(--text-inverse)" : "var(--text-primary)",
      background: onDark ? "rgba(250,243,234,.06)" : "var(--surface-raised)",
      border: "1px solid " + (focus ? "var(--gold-500)" : onDark ? "rgba(212,175,55,.35)" : "var(--hairline-strong)"),
      borderRadius: "var(--radius-none)",
      outline: "none",
      cursor: "pointer",
      transition: "border-color var(--dur-fast) var(--ease-standard)"
    }
  }), options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      pointerEvents: "none",
      display: "flex",
      color: onDark ? "var(--gold-700)" : "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/feedback/InquiryModal.jsx
try { (() => {
/* "Đặt Phòng / Hỏi Giá" — the one form in the product. On submit it does not
   book: it returns a reference code and promises a human on Zalo/WeChat. */
function InquiryModal({
  open,
  onClose,
  onSubmit,
  unitTypes = ["1 Phòng Ngủ", "2 Phòng Ngủ", "Chưa Xác Định"],
  style
}) {
  const [sent, setSent] = React.useState(false);
  const ref = React.useMemo(() => "GJH-" + Math.random().toString(36).slice(2, 7).toUpperCase(), [open]);
  React.useEffect(() => {
    if (open) setSent(false);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "var(--scrim)",
      display: "grid",
      placeItems: "center",
      padding: "var(--space-md)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "min(560px, 100%)",
      maxHeight: "90vh",
      overflow: "auto",
      background: "var(--canvas-warm)",
      border: "1px solid var(--gold-700)",
      boxShadow: "var(--shadow-modal)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "var(--space-md)",
      padding: "var(--space-lg) var(--space-lg) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, "Gao Ji House \xB7 Guest Relations"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-headline-md)",
      lineHeight: "var(--lh-headline)"
    }
  }, sent ? "Đã Gửi Yêu Cầu" : "Đặt Phòng / Hỏi Giá")), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "\u0110\xF3ng",
    onClick: onClose,
    size: 40
  })), /*#__PURE__*/React.createElement("hr", {
    style: {
      height: 1,
      border: 0,
      background: "var(--hairline)",
      margin: "var(--space-lg) 0 0"
    }
  }), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-lg)",
      display: "grid",
      gap: "var(--space-md)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "badge-check",
    size: 34,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-body)",
      color: "var(--text-body)"
    }
  }, "C\u1EA3m \u01A1n b\u1EA1n. Qu\u1EA3n l\xFD c\u0103n h\u1ED9 Gao Ji House s\u1EBD li\xEAn h\u1EC7 trong v\xF2ng 2 gi\u1EDD qua Zalo / WeChat ho\u1EB7c email."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-sm) var(--space-md)",
      border: "1px solid var(--gold-700)",
      background: "var(--gold-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--gold-900)"
    }
  }, "M\xE3 Y\xEAu C\u1EA7u"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.5rem",
      color: "var(--jade-700)"
    }
  }, ref)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "jade",
    onClick: onClose
  }, "\u0110\xF3ng C\u1EEDa S\u1ED5")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
      onSubmit && onSubmit();
    },
    style: {
      padding: "var(--space-lg)",
      display: "grid",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-md)",
      color: "var(--text-body)"
    }
  }, "G\u1EEDi y\xEAu c\u1EA7u l\u01B0u tr\xFA c\u1EE7a b\u1EA1n \u2014 b\u1ED9 ph\u1EADn quan h\u1EC7 kh\xE1ch h\xE0ng ph\u1EA3n h\u1ED3i trong v\xF2ng 2 gi\u1EDD."), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "H\u1ECD V\xE0 T\xEAn",
    required: true,
    placeholder: "Nguy\u1EC5n V\u0103n A"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Email",
    type: "email",
    required: true,
    placeholder: "ten@email.com"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "\u0110i\u1EC7n Tho\u1EA1i / Zalo / WeChat",
    icon: "phone",
    required: true,
    placeholder: "09xx xxx xxx"
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    label: "Lo\u1EA1i C\u0103n H\u1ED9 Mong Mu\u1ED1n",
    options: unitTypes
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Ng\xE0y Nh\u1EADn Ph\xF2ng / Th\u1EDDi H\u1EA1n Thu\xEA",
    type: "date"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Y\xEAu C\u1EA7u \u0110\u1EB7c Bi\u1EC7t Ho\u1EB7c C\xE2u H\u1ECFi",
    as: "textarea",
    rows: 3
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "gold",
    type: "submit",
    full: true,
    iconAfter: "arrow-right"
  }, "X\xE1c Nh\u1EADn G\u1EEDi Y\xEAu C\u1EA7u"))));
}
Object.assign(__ds_scope, { InquiryModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/InquiryModal.jsx", error: String((e && e.message) || e) }); }

// components/forms/StayQueryBar.jsx
try { (() => {
/* The availability bar docked under the hero. Jade band, gold hairline top,
   four fields + one gold CTA. Collapses to a single column on mobile. */
function StayQueryBar({
  onSubmit,
  labels = {},
  unitTypes = ["1 Phòng Ngủ", "2 Phòng Ngủ"],
  style
}) {
  const t = {
    intent: "Nhu Cầu Lưu Trú",
    unit: "Loại Căn Hộ",
    checkin: "Ngày Nhận Phòng",
    guests: "Số Khách",
    submit: "Kiểm Tra Phòng Trống",
    ...labels
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "var(--space-md)",
      alignItems: "end",
      padding: "var(--space-lg)",
      background: "var(--jade-700)",
      borderTop: "1px solid var(--gold-700)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Select, {
    onDark: true,
    label: t.intent,
    options: ["Lưu Trú Dài Hạn", "Lưu Trú Ngắn Ngày", "Công Tác / Doanh Nghiệp"]
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    onDark: true,
    label: t.unit,
    options: unitTypes
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    onDark: true,
    label: t.checkin,
    type: "date"
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    onDark: true,
    label: t.guests,
    options: ["1 Khách", "2 Khách", "3 Khách", "4+ Khách"]
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "gold",
    onClick: onSubmit,
    iconAfter: "arrow-right",
    style: {
      minHeight: 46
    }
  }, t.submit));
}
Object.assign(__ds_scope, { StayQueryBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/StayQueryBar.jsx", error: String((e && e.message) || e) }); }

// components/nav/FilterTabs.jsx
try { (() => {
/* Square caps tabs with a jade underline on the active item. */
function FilterTabs({
  tabs = [],
  value,
  onChange,
  tone = "light",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-xs)",
      ...style
    }
  }, tabs.map(tb => {
    const v = typeof tb === "string" ? tb : tb.value;
    const l = typeof tb === "string" ? tb : tb.label;
    const on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(v),
      style: {
        padding: "10px 16px",
        minHeight: 40,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-label)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        background: on ? dark ? "var(--gold-500)" : "var(--jade-700)" : "transparent",
        color: on ? dark ? "var(--ink-900)" : "var(--accent-on)" : dark ? "var(--gold-050)" : "var(--text-body)",
        border: "1px solid " + (on ? dark ? "var(--gold-500)" : "var(--jade-700)" : dark ? "rgba(212,175,55,.35)" : "var(--hairline)"),
        borderRadius: "var(--radius-none)",
        transition: "all var(--dur-base) var(--ease-standard)"
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { FilterTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/FilterTabs.jsx", error: String((e && e.message) || e) }); }

// components/nav/Logo.jsx
try { (() => {
const MARK = {
  light: "url(#gjGold)",
  dark: "url(#gjGold)"
};

/* Direct port of the client's Logo.tsx. The wordmark is LIVE TYPE, never an image:
   gabled mark → "Gao Ji" in Great Vibes → gold rules flanking italic "house" →
   optional caps tagline. Do not set the wordmark in any other face. */
function Logo({
  variant = "light",
  size = "md",
  showTagline = true,
  onClick,
  style
}) {
  const dark = variant === "dark";
  const w = size === "sm" ? 28 : size === "lg" ? 46 : 36;
  const h = size === "sm" ? 15 : size === "lg" ? 24 : 19;
  const script = size === "sm" ? "1.5rem" : size === "lg" ? "2.85rem" : "2.1rem";
  const houseFs = size === "sm" ? ".6875rem" : size === "lg" ? "1rem" : ".8125rem";
  const tagFs = size === "sm" ? ".4375rem" : size === "lg" ? ".625rem" : ".5rem";
  const rule = size === "sm" ? 16 : size === "lg" ? 48 : 32;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      userSelect: "none",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    viewBox: "0 0 50 28",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M25 2L3 24H9L25 8L41 24H47L25 2Z",
    fill: MARK[variant] || MARK.light
  }), /*#__PURE__*/React.createElement("rect", {
    x: "21",
    y: "16",
    width: "3.5",
    height: "3.5",
    fill: MARK[variant] || MARK.light
  }), /*#__PURE__*/React.createElement("rect", {
    x: "25.5",
    y: "16",
    width: "3.5",
    height: "3.5",
    fill: MARK[variant] || MARK.light
  }), /*#__PURE__*/React.createElement("rect", {
    x: "21",
    y: "20.5",
    width: "3.5",
    height: "3.5",
    fill: MARK[variant] || MARK.light
  }), /*#__PURE__*/React.createElement("rect", {
    x: "25.5",
    y: "20.5",
    width: "3.5",
    height: "3.5",
    fill: MARK[variant] || MARK.light
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "gjGold",
    x1: "0",
    y1: "0",
    x2: "50",
    y2: "28",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#D4AF37"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.5",
    stopColor: "#B8860B"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#8B6508"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: -2,
      fontFamily: "var(--font-script)",
      fontSize: script,
      lineHeight: 1.05,
      letterSpacing: ".02em",
      color: dark ? "var(--gold-050)" : "var(--jade-900)",
      textShadow: dark ? "0 0 12px rgba(212,175,55,.4)" : "0.4px 0.4px 0 #C59B27, -0.4px -0.4px 0 #C59B27, 0.4px -0.4px 0 #C59B27, -0.4px 0.4px 0 #C59B27"
    }
  }, "Gao Ji"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "2px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: rule,
      height: 1,
      background: dark ? "rgba(212,175,55,.6)" : "rgba(156,114,29,.6)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontSize: houseFs,
      letterSpacing: "var(--tracking-caps-wide)",
      color: dark ? "var(--gold-050)" : "var(--gold-900)"
    }
  }, "house"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: rule,
      height: 1,
      background: dark ? "rgba(212,175,55,.6)" : "rgba(156,114,29,.6)"
    }
  })), showTagline ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: tagFs,
      fontWeight: "var(--fw-bold)",
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: dark ? "rgba(255,255,255,.7)" : "var(--ink-900)"
    }
  }, "Serviced Apartment \xB7 Comfort \xB7 Home Away From Home") : null);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/Logo.jsx", error: String((e && e.message) || e) }); }

// components/nav/Footer.jsx
try { (() => {
/* The ink band that closes every page. Text columns, hairline rules, no graphics. */
function Footer({
  columns = [],
  address,
  phone,
  email,
  note,
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-ink)",
      color: "var(--text-inverse)",
      padding: "var(--space-4xl) var(--page-gutter) var(--space-xl)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "var(--space-2xl)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-md)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "dark",
    size: "md"
  }), address ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-sm)",
      lineHeight: "var(--lh-body)",
      color: "rgba(250,243,234,.7)",
      maxWidth: "30ch"
    }
  }, address) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, phone ? /*#__PURE__*/React.createElement("span", {
    style: contactLine
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "phone",
    size: 14,
    color: "var(--gold-500)"
  }), phone) : null, email ? /*#__PURE__*/React.createElement("span", {
    style: contactLine
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "mail",
    size: 14,
    color: "var(--gold-500)"
  }), email) : null)), columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      display: "grid",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--gold-050)"
    }
  }, c.title), /*#__PURE__*/React.createElement("hr", {
    style: {
      height: 1,
      border: 0,
      background: "rgba(212,175,55,.28)",
      margin: "2px 0 4px"
    }
  }), c.items.map(it => /*#__PURE__*/React.createElement("span", {
    key: it,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-sm)",
      color: "rgba(250,243,234,.72)"
    }
  }, it))))), /*#__PURE__*/React.createElement("hr", {
    style: {
      height: 1,
      border: 0,
      background: "rgba(250,243,234,.14)",
      margin: "var(--space-2xl) 0 var(--space-md)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "rgba(250,243,234,.5)"
    }
  }, note)));
}
const contactLine = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-body-sm)",
  letterSpacing: ".04em",
  color: "rgba(250,243,234,.86)"
};
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/Footer.jsx", error: String((e && e.message) || e) }); }

// components/nav/SectionHeader.jsx
try { (() => {
/* Every section opens the same way: eyebrow, serif headline, hairline, optional
   right-aligned aside or action. */
function SectionHeader({
  eyebrow,
  title,
  aside,
  action,
  tone = "light",
  align = "left",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)",
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    tone: dark ? "onDark" : "gold"
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--space-lg)",
      textAlign: align
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-display-lg)",
      fontWeight: "var(--fw-regular)",
      lineHeight: "var(--lh-display)",
      letterSpacing: "var(--tracking-display)",
      textTransform: "uppercase",
      color: dark ? "var(--text-inverse)" : "var(--text-primary)",
      maxWidth: "18ch",
      textWrap: "pretty"
    }
  }, title), aside ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-md)",
      lineHeight: "var(--lh-body)",
      maxWidth: "42ch",
      color: dark ? "rgba(250,243,234,.76)" : "var(--text-body)"
    }
  }, aside) : null, action), /*#__PURE__*/React.createElement("hr", {
    style: {
      height: 1,
      border: 0,
      background: dark ? "rgba(212,175,55,.3)" : "var(--hairline)",
      margin: 0
    }
  }));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/nav/TopNav.jsx
try { (() => {
/* Fixed, warm-paper, hairline-bottom. Collapses from 92px to 60px past 30px of
   scroll, gaining a 12px backdrop blur and the only shadow in the system. */
function TopNav({
  links = [],
  onNavigate,
  onInquire,
  lang = "VI",
  onLangChange,
  style
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, {
      passive: true
    });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "var(--glass-warm)",
      backdropFilter: "blur(var(--blur-nav))",
      borderBottom: "1px solid var(--hairline-strong)",
      boxShadow: scrolled ? "var(--shadow-nav)" : "none",
      transition: "padding var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)",
      padding: scrolled ? "6px var(--page-gutter)" : "14px var(--page-gutter)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-lg)",
      alignItems: "center",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-lg)",
      flexWrap: "wrap"
    },
    className: "gj-nav-links"
  }, links.slice(0, Math.ceil(links.length / 2)).map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    href: "#" + l.id,
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(l.id);
    },
    style: navLink
  }, l.label)))), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: scrolled ? "sm" : "md",
    showTagline: !scrolled,
    onClick: () => onNavigate && onNavigate("top")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-lg)",
      alignItems: "center",
      justifyContent: "flex-end",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-lg)",
      flexWrap: "wrap"
    },
    className: "gj-nav-links"
  }, links.slice(Math.ceil(links.length / 2)).map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    href: "#" + l.id,
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(l.id);
    },
    style: navLink
  }, l.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      border: "1px solid var(--hairline-strong)"
    }
  }, ["VI", "EN", "中文"].map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => onLangChange && onLangChange(l),
    style: {
      padding: "6px 9px",
      cursor: "pointer",
      border: "none",
      background: lang === l ? "var(--jade-700)" : "transparent",
      color: lang === l ? "var(--accent-on)" : "var(--text-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: ".12em"
    }
  }, l))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "gold",
    size: "sm",
    onClick: onInquire,
    icon: "calendar-check"
  }, "\u0110\u1EB7t Ph\xF2ng"), /*#__PURE__*/React.createElement("span", {
    className: "gj-nav-burger",
    style: {
      display: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: open ? "x" : "menu",
    label: "Menu",
    size: 40,
    onClick: () => setOpen(!open)
  })))), /*#__PURE__*/React.createElement("style", null, "@media(max-width:1100px){.gj-nav-links{display:none!important}.gj-nav-burger{display:inline-flex!important}}"), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-sm)",
      padding: "var(--space-md) 0 var(--space-xs)",
      borderTop: "1px solid var(--hairline)"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    href: "#" + l.id,
    onClick: e => {
      e.preventDefault();
      setOpen(false);
      onNavigate && onNavigate(l.id);
    },
    style: navLink
  }, l.label))) : null);
}
const navLink = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-label)",
  fontWeight: "var(--fw-semibold)",
  letterSpacing: "var(--tracking-caps)",
  textTransform: "uppercase",
  color: "var(--text-primary)",
  textDecoration: "none",
  borderBottom: "1px solid transparent",
  paddingBottom: 2
};
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Amenities.jsx
try { (() => {
const {
  SectionHeader,
  FeatureCard,
  PhotoPlate,
  Eyebrow,
  Button,
  RatingStars
} = window.GaoJiHouseDesignSystem_87b48f;
function Amenities({
  onInquire
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "svc",
    style: {
      padding: "var(--section-y) var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Comfort & Convenience",
    title: "Ti\u1EC7n \xCDch & D\u1ECBch V\u1EE5 C\u01B0 D\xE2n",
    aside: "C\u01B0 d\xE2n Gao Ji House d\xF9ng chung to\xE0n b\u1ED9 ti\u1EC7n \xEDch trong khu\xF4n vi\xEAn Vinhomes Central Park \u2014 h\u1ED3 b\u01A1i, ph\xF2ng gym v\xE0 v\u01B0\u1EDDn c\u1EA3nh tr\xEAn t\u1EA7ng cao."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)",
      display: "grid",
      gap: "var(--space-lg)",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
    }
  }, AMENITIES.map(a => /*#__PURE__*/React.createElement(FeatureCard, {
    key: a.title,
    icon: a.icon,
    eyebrow: a.eyebrow,
    title: a.title,
    bullets: a.bullets,
    tone: "warm",
    image: a.image,
    imageAlt: a.title
  }, a.body))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-3xl)",
      display: "grid",
      gap: "var(--space-2xl)",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(PhotoPlate, {
    src: IMG.landmark,
    ratio: "4 / 3",
    offset: "left",
    caption: "H\xECnh 04 \u2014 Landmark 81 Nh\xECn T\u1EEB Ban C\xF4ng C\u0103n H\u1ED9"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "\u0110\u01A1n V\u1ECB \u0110\u1ED3ng H\xE0nh & Ph\xE1p L\xFD"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-md)",
      display: "grid",
      gap: 0,
      border: "1px solid var(--hairline)"
    }
  }, PARTNERS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.title,
    style: {
      padding: "var(--space-md)",
      borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
      background: "var(--surface-raised)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--gold-900)"
    }
  }, p.eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.3rem",
      color: "var(--text-primary)"
    }
  }, p.title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-lg)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-md)",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(RatingStars, {
    value: 4.9,
    count: 128
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "clay",
    onClick: onInquire,
    iconAfter: "arrow-right"
  }, "\u0110\u1EB7t Ph\xF2ng Ngay"))))));
}
Object.assign(window, {
  Amenities
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Amenities.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
const {
  Eyebrow,
  Button,
  StayQueryBar,
  Badge
} = window.GaoJiHouseDesignSystem_87b48f;
function Hero({
  onInquire
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: "clamp(520px, 78vh, 760px)",
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.hero,
    alt: "Kh\xF4ng gian m\u1EDF ph\xF2ng kh\xE1ch, b\u1EBFp v\xE0 b\xE0n \u0103n c\u0103n h\u1ED9 Gao Ji House",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--protect-top)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-4xl) var(--page-gutter) var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "onDark"
  }, "Gao Ji House \xB7 C\u0103n H\u1ED9 D\u1ECBch V\u1EE5 Cao C\u1EA5p"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: "var(--space-md)",
      maxWidth: "20ch",
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-display-xl)",
      fontWeight: "var(--fw-regular)",
      lineHeight: "var(--lh-display)",
      letterSpacing: "var(--tracking-display)",
      textTransform: "uppercase",
      color: "var(--text-inverse)",
      textWrap: "pretty"
    }
  }, "V\u1EC1 Nh\xE0 \xB7 T\u1EADn H\u01B0\u1EDFng Kh\xF4ng Gian S\u1ED1ng"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: "var(--space-md)",
      maxWidth: "52ch",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-body)",
      color: "rgba(250,243,234,.86)"
    }
  }, "Chu\u1ED7i c\u0103n h\u1ED9 d\u1ECBch v\u1EE5 l\u01B0u tr\xFA ng\u1EAFn & d\xE0i h\u1EA1n cao c\u1EA5p c\u1EA1nh Landmark 81 v\xE0 S\xF4ng S\xE0i G\xF2n."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      maxWidth: "52ch",
      fontFamily: "var(--font-italic)",
      fontStyle: "italic",
      fontSize: "var(--fs-body-md)",
      color: "rgba(250,243,234,.66)"
    }
  }, "D\u1ECBch v\u1EE5 d\u1ECDn ph\xF2ng chu\u1EA9n 5 sao, tr\u1ECDn g\xF3i chi ph\xED \u0111i\u1EC7n n\u01B0\u1EDBc & Internet, ch\u1EC9 10 ph\xFAt \u0111\u1EBFn Qu\u1EADn 1 CBD."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-sm)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "lg",
    onClick: onInquire,
    iconAfter: "arrow-right"
  }, "Ki\u1EC3m Tra Ph\xF2ng Tr\u1ED1ng"), /*#__PURE__*/React.createElement(Button, {
    variant: "onDark",
    size: "lg",
    as: "a",
    href: "#units"
  }, "Xem Danh S\xE1ch C\u0103n H\u1ED9"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: "var(--space-xs)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "jade",
    icon: "map-pin"
  }, "Vinhomes Central Park"), /*#__PURE__*/React.createElement(Badge, {
    tone: "gold",
    icon: "badge-check"
  }, "Tr\u1ECDn G\xF3i Chi Ph\xED"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement(StayQueryBar, {
    onSubmit: onInquire
  })));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Lifestyle.jsx
try { (() => {
const {
  Eyebrow,
  Button,
  PhotoPlate,
  FeatureCard
} = window.GaoJiHouseDesignSystem_87b48f;
function Lifestyle({
  onInquire
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "style",
    style: {
      background: "var(--canvas-warm)",
      padding: "var(--section-y) var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-editorial)",
      margin: "0 auto",
      display: "grid",
      gap: "var(--space-3xl)",
      gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "C\u0103n H\u1ED9 D\u1ECBch V\u1EE5 Th\u01B0\u01A1ng Gia"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-md)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-display-lg)",
      lineHeight: "var(--lh-display)",
      letterSpacing: "var(--tracking-display)"
    }
  }, "Tr\u1EA3i Nghi\u1EC7m L\u01B0u Tr\xFA \u0110\u1EC9nh Cao"), /*#__PURE__*/React.createElement("hr", {
    style: {
      height: 1,
      border: 0,
      background: "var(--hairline)",
      margin: "var(--space-lg) 0"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-body)",
      color: "var(--text-body)",
      maxWidth: "48ch"
    }
  }, "Gao Ji House cung c\u1EA5p c\xE1c c\u0103n h\u1ED9 d\u1ECBch v\u1EE5 cao c\u1EA5p \u0111\u1EA7y \u0111\u1EE7 n\u1ED9i th\u1EA5t sang tr\u1ECDng, d\u1ECBch v\u1EE5 d\u1ECDn ph\xF2ng \u0111\u1ECBnh k\u1EF3, l\u1EC5 t\xE2n h\u1ED7 tr\u1EE3 24/7 v\xE0 t\u1EA7m nh\xECn h\u01B0\u1EDBng s\xF4ng S\xE0i G\xF2n tuy\u1EC7t \u0111\u1EB9p."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)",
      display: "grid",
      gap: "var(--space-md)"
    }
  }, PILLARS.map(p => /*#__PURE__*/React.createElement(FeatureCard, {
    key: p.title,
    icon: p.icon,
    eyebrow: p.eyebrow,
    title: p.title,
    tone: "paper"
  }, p.body))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "jade",
    onClick: onInquire,
    iconAfter: "arrow-right"
  }, "Kh\xE1m Ph\xE1 D\u1ECBch V\u1EE5 C\u01B0 D\xE2n"))), /*#__PURE__*/React.createElement(PhotoPlate, {
    src: IMG.master,
    ratio: "3 / 4",
    caption: "H\xECnh 01 \u2014 Kh\xF4ng Gian C\u0103n H\u1ED9 Minh H\u1ECDa",
    style: {
      marginTop: "var(--space-lg)"
    }
  })));
}
Object.assign(window, {
  Lifestyle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Lifestyle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/LocationSection.jsx
try { (() => {
const {
  SectionHeader,
  Eyebrow,
  Icon,
  Button
} = window.GaoJiHouseDesignSystem_87b48f;
function LocationSection({
  onInquire
}) {
  const [active, setActive] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "loc",
    style: {
      background: "var(--canvas-warm)",
      padding: "var(--section-y) var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "The Perfect Stay \xB7 On The Heart Of Saigon",
    title: "B\u1EA3n \u0110\u1ED3 V\u1ECB Tr\xED & B\xE1n K\xEDnh K\u1EBFt N\u1ED1i S\xE0i G\xF2n",
    aside: "To\u1EA1 \u0111\u1ED9 \u0111\u1EAFt gi\xE1 b\u1EADc nh\u1EA5t khu \u0110\xF4ng S\xE0i G\xF2n: s\xE1t Landmark 81, ven s\xF4ng S\xE0i G\xF2n, 10 ph\xFAt t\u1EDBi Qu\u1EADn 1."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)",
      display: "grid",
      gap: "var(--space-lg)",
      gridTemplateColumns: "minmax(300px, 420px) 1fr",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-raised)",
      border: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-md)",
      borderBottom: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tick: false
  }, "Danh S\xE1ch 12 \u0110\u1ECBa \u0110i\u1EC3m N\u1ED5i Ti\u1EBFng")), LANDMARKS.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: l.name,
    onClick: () => setActive(i),
    style: {
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      padding: "var(--space-sm) var(--space-md)",
      display: "flex",
      gap: "var(--space-sm)",
      alignItems: "center",
      justifyContent: "space-between",
      background: i === active ? "var(--gold-100)" : "transparent",
      border: "none",
      borderBottom: "1px solid var(--hairline)",
      borderLeft: "2px solid " + (i === active ? "var(--gold-700)" : "transparent"),
      transition: "background var(--dur-fast) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-display)",
      fontSize: "1.05rem",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14,
    color: "var(--gold-700)"
  }), l.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 2,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, l.sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-display)",
      fontSize: "1.15rem",
      color: "var(--jade-700)"
    }
  }, l.min, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: ".14em"
    }
  }, "PH\xDAT")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: ".1em",
      color: "var(--text-muted)"
    }
  }, l.dist))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-ink)",
      border: "1px solid var(--hairline-strong)",
      padding: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--space-md)",
      paddingBottom: "var(--space-sm)",
      borderBottom: "1px solid rgba(212,175,55,.28)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "onDark",
    tick: false
  }, "Gao Ji House \xB7 Central Distance Radar"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "var(--gold-050)"
    }
  }, LANDMARKS[active].dist, " \xB7 ", LANDMARKS[active].min, " ph\xFAt")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: "var(--space-md)",
      aspectRatio: "16 / 9",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.wide,
    alt: "C\xE1c th\xE1p Vinhomes Central Park v\xE0 Landmark 81",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "saturate(.85)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--protect-bottom)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 14,
      height: 14,
      marginLeft: -7,
      marginTop: -7,
      background: "var(--gold-500)",
      border: "2px solid var(--ink-900)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 180,
      height: 180,
      marginLeft: -90,
      marginTop: -90,
      border: "1px solid rgba(212,175,55,.5)",
      borderRadius: "var(--radius-circle)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 320,
      height: 320,
      marginLeft: -160,
      marginTop: -160,
      border: "1px solid rgba(212,175,55,.28)",
      borderRadius: "var(--radius-circle)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "var(--space-md)",
      bottom: "var(--space-md)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--gold-050)"
    }
  }, LANDMARKS[active].name)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-md)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-sm)",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-sm)",
      color: "rgba(250,243,234,.7)",
      maxWidth: "46ch"
    }
  }, "Gao Ji House \xB7 T\xF4n \u0110\u1EE9c Th\u1EAFng, Ph\u01B0\u1EDDng B\u1EBFn Ngh\xE9, Qu\u1EADn 1, TP. H\u1ED3 Ch\xED Minh \u2014 s\u01A1 \u0111\u1ED3 minh h\u1ECDa b\xE1n k\xEDnh di chuy\u1EC3n."), /*#__PURE__*/React.createElement(Button, {
    variant: "onDark",
    size: "sm",
    onClick: onInquire,
    icon: "phone"
  }, "Li\xEAn H\u1EC7 \u0110\u1EB7t Ph\xF2ng"))))));
}
Object.assign(window, {
  LocationSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/LocationSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/UnitCollection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionHeader,
  FilterTabs,
  UnitCard,
  Button,
  FeatureCard,
  Tag
} = window.GaoJiHouseDesignSystem_87b48f;
function UnitCollection({
  onInquire,
  onView
}) {
  const [filter, setFilter] = React.useState("all");
  const units = filter === "all" ? UNITS : UNITS.filter(u => u.filter === filter);
  return /*#__PURE__*/React.createElement("section", {
    id: "units",
    style: {
      padding: "var(--section-y) var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "B\u1EA3ng Gi\xE1 Thu\xEA & M\u1EB7t B\u1EB1ng",
    title: "Danh S\xE1ch C\u0103n H\u1ED9 D\u1ECBch V\u1EE5",
    aside: "S\xE1u c\u0103n h\u1ED9 \u0111ang m\u1EDF \u0111\u1EB7t ph\xF2ng t\u1EA1i Vinhomes Central Park \u2014 gi\xE1 thu\xEA tr\u1ECDn g\xF3i chi ph\xED qu\u1EA3n l\xFD, Internet v\xE0 d\u1ECBch v\u1EE5 d\u1ECDn ph\xF2ng.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      iconAfter: "arrow-right",
      onClick: onInquire
    }, "Xem T\u1EA5t C\u1EA3 S\u01A1 \u0110\u1ED3 C\u0103n H\u1ED9")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "var(--space-lg) 0 var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement(FilterTabs, {
    tabs: UNIT_FILTERS,
    value: filter,
    onChange: setFilter
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-lg)",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
    }
  }, units.map(u => /*#__PURE__*/React.createElement(UnitCard, _extends({
    key: u.id
  }, u, {
    onInquire: onInquire,
    onView: () => onView(u)
  })))), /*#__PURE__*/React.createElement(FeatureCard, {
    tone: "jade",
    eyebrow: "Ti\xEAu Chu\u1EA9n Thu\xEA Tr\u1ECDn G\xF3i Gao Ji House",
    title: "Tr\u1ECDn G\xF3i Chi Ph\xED & D\u1ECBch V\u1EE5",
    style: {
      marginTop: "var(--space-xl)"
    }
  }, "Gi\xE1 thu\xEA c\u0103n h\u1ED9 d\u1ECBch v\u1EE5 Gao Ji House bao g\u1ED3m chi ph\xED qu\u1EA3n l\xFD, Internet, d\u1ECBch v\u1EE5 d\u1ECDn ph\xF2ng, gi\u1EB7t \u1EE7i ga n\u1EC7m \u0111\u1ECBnh k\u1EF3 v\xE0 quy\u1EC1n s\u1EED d\u1EE5ng to\xE0n b\u1ED9 ti\u1EC7n \xEDch c\u01B0 d\xE2n."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-lg)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-xs)"
    }
  }, INCLUDED.map(i => /*#__PURE__*/React.createElement(Tag, {
    key: i.label,
    icon: i.icon
  }, i.label)))));
}
Object.assign(window, {
  UnitCollection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/UnitCollection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/UnitDetail.jsx
try { (() => {
const {
  IconButton,
  Eyebrow,
  Button,
  RoomSpecs,
  Badge,
  Tag,
  FilterTabs
} = window.GaoJiHouseDesignSystem_87b48f;

/* The floorplan / gallery overlay opened from a UnitCard. */
function UnitDetail({
  unit,
  onClose,
  onInquire
}) {
  const [view, setView] = React.useState("gallery");
  if (!unit) return null;
  const gallery = unit.gallery && unit.gallery.length ? unit.gallery : [unit.image, IMG.kitchen, IMG.bath, IMG.dining];
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 90,
      background: "var(--scrim)",
      display: "grid",
      placeItems: "center",
      padding: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "min(1040px, 100%)",
      maxHeight: "92vh",
      overflow: "auto",
      background: "var(--canvas)",
      border: "1px solid var(--gold-700)",
      boxShadow: "var(--shadow-modal)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "var(--space-md)",
      padding: "var(--space-lg)",
      borderBottom: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, unit.code, " \xB7 ", unit.type), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-xs)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-headline-md)",
      lineHeight: "var(--lh-headline)"
    }
  }, unit.title), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-italic)",
      fontStyle: "italic",
      color: "var(--text-muted)"
    }
  }, unit.floor)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "\u0110\xF3ng",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-lg)",
      display: "grid",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-md)",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(FilterTabs, {
    value: view,
    onChange: setView,
    tabs: [{
      value: "gallery",
      label: "Hình Ảnh Căn Hộ"
    }, {
      value: "plan",
      label: "Sơ Đồ Mặt Bằng"
    }]
  }), /*#__PURE__*/React.createElement(RoomSpecs, {
    beds: unit.beds,
    baths: unit.baths,
    sqm: unit.sqm,
    guests: unit.beds * 2
  })), view === "gallery" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-xs)",
      gridTemplateColumns: "2fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: gallery[0],
    alt: unit.title,
    style: {
      width: "100%",
      height: "100%",
      maxHeight: 420,
      objectFit: "cover",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-xs)",
      gridTemplateColumns: gallery.length > 4 ? "1fr 1fr" : "1fr",
      alignContent: "start"
    }
  }, gallery.slice(1, 7).map(g => /*#__PURE__*/React.createElement("img", {
    key: g,
    src: g,
    alt: "",
    style: {
      width: "100%",
      height: gallery.length > 4 ? 101 : 134,
      objectFit: "cover",
      display: "block"
    }
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas-warm)",
      border: "1px solid var(--hairline)",
      padding: "var(--space-lg)",
      display: "grid",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 12,
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--jade-700)",
      borderStyle: "dashed",
      display: "grid",
      alignContent: "start",
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: ".1em",
      color: "var(--jade-700)"
    }
  }, "OPEN LIVING & DINING (48 M\xB2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--jade-700)",
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: ".1em",
      color: "var(--jade-700)"
    }
  }, "MASTER SUITE (32 M\xB2)")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--gold-700)",
      background: "var(--paper-400)",
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: ".1em",
      color: "var(--gold-900)"
    }
  }, "MARBLE BATHROOM (14 M\xB2)")))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "S\u01A1 \u0111\u1ED3 minh h\u1ECDa \u2014 kh\xF4ng ph\u1EA3i b\u1EA3n v\u1EBD k\u1EF9 thu\u1EADt")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-xs)"
    }
  }, INCLUDED.map(i => /*#__PURE__*/React.createElement(Tag, {
    key: i.label,
    icon: i.icon
  }, i.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-lg)",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: "var(--space-md)",
      borderTop: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-xl)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "Gi\xE1 Thu\xEA Th\xE1ng"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "1.6rem",
      color: "var(--jade-700)"
    }
  }, (unit.monthlyRateVnd / 1e6).toLocaleString("vi-VN"), " Tri\u1EC7u VN\u0110")), /*#__PURE__*/React.createElement(Badge, {
    tone: unit.status === "available" ? "available" : "held",
    icon: "badge-check"
  }, unit.status === "available" ? "Còn Phòng" : "Đã Giữ Chỗ")), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    onClick: onInquire,
    iconAfter: "arrow-right"
  }, "\u0110\u1EB7t Ph\xF2ng / H\u1ECFi Gi\xE1")))));
}
Object.assign(window, {
  UnitDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/UnitDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/data.jsx
try { (() => {
const P = "../../assets/photos/";
const L3 = P + "l3-44-09/";
const L81 = P + "l81-07-12/";
const P127 = P + "p1-27-10/";
const PROP = P + "property/";

/* Real Gao Ji House photography.
   L3.44.09 and L81.07.12 each have a complete shot list of their own.
   The five root photos stand in for the remaining units until per-unit sets arrive. */
const IMG = {
  hero: PROP + "landmark-81-from-balcony-web.jpg",
  living: P + "living-dining.jpg",
  kitchen: P + "kitchen-island.jpg",
  master: P + "master-bedroom.jpg",
  dining: L3 + "dining.jpg",
  bath: P + "bedroom-ensuite.jpg",
  bed2: P + "bedroom-landmark-view.jpg",
  wide: PROP + "towers-skyline-web.jpg",
  landmark: PROP + "landmark-81-from-balcony-web.jpg",
  pool: PROP + "pool-aerial-web.jpg",
  gym: PROP + "gym.webp",
  skyTerrace: PROP + "sky-terrace-detail-web.jpg"
};
const UNITS = [{
  id: "l3",
  code: "CĂN HỘ L3.44.09",
  title: "Căn 2PN Tầng Cao View Sông & Landmark 81",
  type: "2 Phòng Ngủ · Tầng Cao",
  floor: "Tầng 44 · Landmark 3 · Vinhomes Central Park",
  beds: 2,
  baths: 2,
  sqm: 92,
  monthlyRateVnd: 33000000,
  nightlyRateVnd: 2400000,
  image: L3 + "living-room.jpg",
  filter: "2br",
  status: "available",
  gallery: [L3 + "living-room.jpg", L3 + "bedroom-river-view.jpg", L3 + "bedroom-landmark-view.jpg", L3 + "dining.jpg", L3 + "kitchen.jpg", L3 + "bedroom-ensuite.jpg"]
}, {
  id: "p1",
  code: "CĂN HỘ P1.27.10",
  title: "Căn 1PN View Sông Sài Gòn",
  type: "1 Phòng Ngủ · Park 1",
  floor: "Tầng 27 · Park 1 · Vinhomes Central Park",
  beds: 1,
  baths: 1,
  sqm: 54,
  monthlyRateVnd: 24000000,
  nightlyRateVnd: 1800000,
  image: P127 + "living-tv-wall.jpg",
  filter: "1br",
  status: "available",
  gallery: [P127 + "living-tv-wall.jpg", P127 + "living-kitchen.jpg", P127 + "living-sofa.jpg", P127 + "bedroom-river-view.jpg", P127 + "bedroom.jpg", P127 + "bedroom-tv-desk.jpg", P127 + "kitchen.jpg", P127 + "bathroom.jpg"]
}, {
  id: "l81",
  code: "CĂN HỘ L81.07.12",
  title: "Căn 1PN Sky Suite Chuẩn Spa",
  type: "1 Phòng Ngủ · Sky Gallery",
  floor: "Tầng 12 · Tầng Sky Gallery · Landmark 81",
  beds: 1,
  baths: 1,
  sqm: 78,
  monthlyRateVnd: 28000000,
  nightlyRateVnd: 2100000,
  image: L81 + "living-room.jpg",
  filter: "1br",
  status: "available",
  gallery: [L81 + "living-room.jpg", L81 + "bedroom-master.jpg", L81 + "bedroom-night-view.jpg", L81 + "living-tv-wall.jpg", L81 + "kitchen.jpg", L81 + "dining-kitchen.jpg"]
}, {
  id: "l1",
  code: "CĂN HỘ L1.29.08",
  title: "Căn 2PN Góc Nhìn Công Viên Bờ Sông",
  type: "2 Phòng Ngủ · Góc",
  floor: "Tầng 29 · Landmark 1 · Vinhomes Central Park",
  beds: 2,
  baths: 2,
  sqm: 118,
  monthlyRateVnd: 42000000,
  nightlyRateVnd: 3000000,
  image: P + "bedroom-ensuite.jpg",
  filter: "2br",
  status: "available"
}, {
  id: "p3",
  code: "CĂN HỘ P3.42.12",
  title: "Căn 2PN Nội Thất Gỗ Mộc",
  type: "2 Phòng Ngủ · Tân Trang",
  floor: "Tầng 42 · Park 3 · Vinhomes Central Park",
  beds: 2,
  baths: 2,
  sqm: 120,
  monthlyRateVnd: 46000000,
  nightlyRateVnd: 3300000,
  image: P + "kitchen-island.jpg",
  filter: "2br",
  status: "available"
}];
const UNIT_FILTERS = [{
  value: "all",
  label: "Tất Cả Căn Hộ"
}, {
  value: "1br",
  label: "1 Phòng Ngủ (Từ 24tr/tháng)"
}, {
  value: "2br",
  label: "2 Phòng Ngủ (Từ 33tr/tháng)"
}];
const PILLARS = [{
  icon: "door-open",
  eyebrow: "Kiến Trúc",
  title: "Thiết Kế Tinh Tế",
  body: "Diện tích rộng rãi với kính Low-E 3 lớp chống ồn tuyệt đối và nội thất gỗ tự nhiên."
}, {
  icon: "sparkles",
  eyebrow: "Vận Hành",
  title: "Dịch Vụ Khách Sạn 5 Sao",
  body: "Trọn gói dọn phòng, thay ga nệm, Internet tốc độ cao & hóa đơn sinh hoạt."
}, {
  icon: "shield-check",
  eyebrow: "Lễ Tân",
  title: "Lễ Tân & Dịch Vụ 24/7",
  body: "Đón tiếp đa ngôn ngữ, hỗ trợ đăng ký tạm trú trọn gói cho người nước ngoài."
}];
const AMENITIES = [{
  icon: "waves",
  eyebrow: "Hồ Bơi Ngoài Trời · Toàn Khuôn Viên",
  title: "Hồ Bơi Resort Giữa Vườn Nhiệt Đới",
  image: PROP + "pool-aerial-web.jpg",
  caption: "Hình 01 — Hồ Bơi Cư Dân Vinhomes Central Park",
  body: "Hồ bơi ngoài trời quy mô lớn giữa vườn dừa, có khu riêng cho trẻ em và nhân viên cứu hộ trực ban.",
  bullets: ["Hồ Bơi Người Lớn & Trẻ Em", "Cứu Hộ Trực Ban Theo Giờ", "Ghế Nằm & Khu Che Nắng"]
}, {
  icon: "dumbbell",
  eyebrow: "Thiết Bị Technogym · Mở Cửa Cả Ngày",
  title: "Phòng Gym Kính Hướng Vườn",
  image: PROP + "gym.webp",
  caption: "Hình 02 — Phòng Gym Cư Dân",
  body: "Khu cardio, tạ tự do và sàn tập gương kính nhìn ra vườn cây trong khuôn viên.",
  bullets: ["Máy Chạy & Xe Đạp Cardio", "Khu Tạ Tự Do", "Sàn Tập Gương Kính"]
}, {
  icon: "sun",
  eyebrow: "Tầm Nhìn Sông Sài Gòn · Vườn Trên Cao",
  title: "Sky Terrace & Vườn Cảnh Trên Tầng Cao",
  image: PROP + "sky-terrace-detail-web.jpg",
  caption: "Hình 03 — Vườn Cảnh Tầng Cao",
  body: "Sân vườn trên cao nhìn thẳng ra sông Sài Gòn — không gian trà chiều và tiếp khách của cư dân.",
  bullets: ["Tầm Nhìn Trực Diện Sông", "Chòi Nghỉ & Cây Xanh", "Không Gian Tiếp Khách Riêng"]
}];
const LANDMARKS = [{
  name: "Landmark 81 & Công Viên Bờ Sông",
  sub: "Trung Tâm Thương Mại · Phố Đi Bộ",
  dist: "0.2 km",
  min: 3
}, {
  name: "Quận 1 CBD (Tôn Đức Thắng)",
  sub: "Khu Tài Chính · Phố Đi Bộ Nguyễn Huệ",
  dist: "3.5 km",
  min: 10
}, {
  name: "Ga Metro Ba Son (Tuyến Số 1)",
  sub: "Trung Chuyển Ngầm Trực Tiếp",
  dist: "2.0 km",
  min: 7
}, {
  name: "Bệnh Viện Quốc Tế Vinmec",
  sub: "Trong Khuôn Viên Vinhomes Central Park",
  dist: "0.4 km",
  min: 5
}, {
  name: "Sân Bay Quốc Tế Tân Sơn Nhất",
  sub: "Ga Quốc Tế & Quốc Nội",
  dist: "8.5 km",
  min: 25
}];
const INCLUDED = [{
  icon: "sparkles",
  label: "Dọn Phòng Định Kỳ"
}, {
  icon: "wifi",
  label: "Internet Tốc Độ Cao"
}, {
  icon: "shield-check",
  label: "An Ninh 24/7"
}, {
  icon: "cooking-pot",
  label: "Bếp Đầy Đủ Thiết Bị"
}, {
  icon: "car",
  label: "Bãi Đỗ Xe Riêng"
}, {
  icon: "badge-check",
  label: "Hỗ Trợ Đăng Ký Tạm Trú"
}];
const PARTNERS = [{
  eyebrow: "Architectural Design",
  title: "SCDA Architects"
}, {
  eyebrow: "Hospitality Standard",
  title: "Rosewood / JW Standards"
}, {
  eyebrow: "Appliance Standard",
  title: "Bathleen · Guggenau · Grosi"
}, {
  eyebrow: "Legal Status",
  title: "Sổ Hồng Lâu Dài"
}];
Object.assign(window, {
  IMG,
  L3,
  L81,
  P127,
  UNITS,
  UNIT_FILTERS,
  PILLARS,
  AMENITIES,
  LANDMARKS,
  INCLUDED,
  PARTNERS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PhotoPlate = __ds_scope.PhotoPlate;

__ds_ns.RatingStars = __ds_scope.RatingStars;

__ds_ns.RoomSpecs = __ds_scope.RoomSpecs;

__ds_ns.UnitCard = __ds_scope.UnitCard;

__ds_ns.ContactRail = __ds_scope.ContactRail;

__ds_ns.InquiryModal = __ds_scope.InquiryModal;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StayQueryBar = __ds_scope.StayQueryBar;

__ds_ns.FilterTabs = __ds_scope.FilterTabs;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.TopNav = __ds_scope.TopNav;

})();
