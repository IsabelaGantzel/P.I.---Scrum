const htext = (text) => document.createTextNode(text);
const htag = (tag, { className = {}, children = null, ...props } = {}) => {
  const el = document.createElement(tag);

  for (const key in props) {
    el.setAttribute(key, props[key].toString());
  }

  if (Array.isArray(children)) {
    children.forEach((c) => {
      el.appendChild(c);
    });
  } else if (children && typeof children === "object") {
    el.appendChild(children);
  }

  let classes = [];

  if (Array.isArray(className)) {
    classes = className;
  } else {
    switch (typeof className) {
      case "string":
        classes = className.split(/\s+/);
        break;
      case "object":
        classes = Object.keys(className).filter((cls) => className[cls]);
        break;
    }
  }

  if (classes.length > 0) {
    el.classList.add(...classes);
  }

  return el;
};

const hdiv = (props) => htag("div", props);

const hspan = (text, props) =>
  htag("span", {
    ...props,
    children: [htext(text)],
  });
