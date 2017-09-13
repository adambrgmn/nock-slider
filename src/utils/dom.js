export const createElement = (type, classNames = []) => {
  const newEl = document.createElement(type);
  newEl.classList.add(...classNames);

  return newEl;
};

export const removeElement = el => {
  if ('remove' in el) {
    el.remove();
  } else {
    el.parentNode.removeChild(el);
  }
};

export const appendChild = (parent, child) => {
  parent.appendChild(child);
};

export const setAttribute = (el, attr, value) => {
  el.setAttribute(attr, value);
  return el;
};

export const addClass = (el, ...classNames) => {
  if ('classList' in el) {
    el.classList.add(...classNames);
  } else {
    el.className += ' ' + classNames.join(' ');
  }

  return el;
};

export const removeClass = (el, ...classNames) => {
  if ('classList' in el) {
    el.classList.remove(...classNames);
  } else {
    el.className = el.className.replace(
      new RegExp('(^|\\b)' + classNames.join('|') + '(\\b|$)', 'gi'),
      ' ',
    );
  }
  return el;
};
