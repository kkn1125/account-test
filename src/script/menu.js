export class Item {}

class BaseMenuList {
  #list = [];
  #wrap = (children) => `<div id="menu-pop">${children}</div>`;
  #item = ({ action, content }) =>
    `<div class="menu-item" id="${action}">${content}</div>`;
  constructor(data) {
    this.#list = this.#list.concat(data);
  }

  get list() {
    return this.#list;
  }

  get template() {
    const children = this.#list.map((item) => this.#item(item)).join("");
    return this.#wrap(children);
  }
}

export class MenuList extends BaseMenuList {
  constructor(data) {
    super(data);
  }

  get list() {
    return super.list;
  }

  get template() {
    return super.template;
  }
}
