const dev = function dev() {};
Object.entries(console).forEach(([k, v]) => {
  if (k === "memory") {
    dev[k] = v;
  } else {
    dev[k] = v.bind(dev, `[DEV] ::`);
  }
});

const Item = function Item({
  id,
  memo,
  amount,
  inout,
  category,
  tags,
  from,
  to,
  created_at,
  updated_at,
}) {
  this.id = id ?? Item.id;
  this.memo = memo ?? "memo" + Item.id;
  this.amount = amount ?? 0;
  this.inout = inout ?? false;
  this.category = category ?? "";
  this.tags = tags ?? [];
  this.from = from ?? "";
  this.to = to ?? "";
  this.created_at = created_at ?? new Date().getTime();
  this.updated_at = updated_at ?? new Date().getTime();
  id ?? Item.id++;
  id === undefined || id === null ? Item.id++ : (Item.id = id + 1);
};

const Page = function Page({ id, name, data, created_at, updated_at }) {
  this.id = id ?? Page.id;
  this.name = name ?? "page" + Page.id;
  this.data = data ?? [];
  this.created_at = created_at ?? new Date().getTime();
  this.updated_at = updated_at ?? new Date().getTime();
  id === undefined || id === null ? Page.id++ : (Page.id = id + 1);
};

Page.id = 0;

/**
 * MVC 모델 사용
 * 1. 이벤트 관리
 * 2. CRUD 처리
 * 3. 로직 처리
 * 4. 템플릿 처리
 * 5. 렌더 처리
 */
const account = (function () {
  function Controller() {
    let options = null;
    let crud = null;

    this.init = (_options, _crud) => {
      options = _options;
      crud = _crud;

      window.addEventListener("click", this.handleAddPage);
      window.addEventListener("click", this.handleSelectPage);
    };

    this.handleSelectPage = (e) => {
      e.preventDefault();

      const target = e.target;

      if (
        target.nodeName !== "BUTTON" ||
        target.classList.contains("create") ||
        !target.classList.contains("sheet")
      )
        return;
      crud.changeCurrent(target.dataset.pageId);
    };

    this.handleAddPage = (e) => {
      e.preventDefault();

      const target = e.target;

      if (
        target.nodeName !== "BUTTON" ||
        !target.classList.contains("create") ||
        !target.classList.contains("sheet")
      )
        return;

      crud.addPage();
    };
  }

  function Crud() {
    let options = null;
    /**
     * 페이지는 배열
     * {
     *  id: num
     *  name: string
     *  deleted: boolean
     *  data: Item[]
     *  created_at: time
     *  updated_at: time
     * }
     */
    let model = null;

    this.init = (_options, _model) => {
      options = _options;
      model = _model;
    };

    this.changeCurrent = (id) => {
      model.changeCurrent(id);
    };

    this.selectPage = (pageId) => {
      model.selectPage(pageId);
    };

    this.selectItem = (pageId, itemId) => {
      model.selectItem(pageId, itemId);
    };

    this.addPage = (data = {}) => {
      model.addPage(data);
    };

    this.addItem = (pageId, data = {}) => {
      model.addItem(pageId, data);
    };

    this.updatePage = (data) => {
      model.updatePage(data);
    };

    this.updateItem = (pageId, data) => {
      model.updateItem(pageId, data);
    };

    this.deletePage = (pageId) => {
      model.deletePage(pageId);
    };

    this.deleteItem = (pageId, itemId) => {
      model.deleteItem(pageId, itemId);
    };
  }

  function Model() {
    let accountBook = {
      current: 0,
      pages: [],
    };
    let options = null;
    let template = null;

    this.init = (_options, _template) => {
      options = _options;
      template = _template;

      this.load();
    };

    this.changeCurrent = (id) => {
      accountBook.current = id;
      this.save();
    };

    this.selectPage = (pageId) => {
      for (let page of accountBook.pages) {
        if (page.id === pageId) {
          return page;
        }
      }

      return undefined;
    };

    this.selectItem = (pageId, itemId) => {
      const page = this.selectPage(pageId);
      for (let item of page.data) {
        if (item.id === itemId) {
          return item;
        }
      }

      return undefined;
    };

    this.addPage = (data) => {
      accountBook.pages.push(new Page(data));
      this.save();
    };

    this.addItem = (pageId, data) => {
      const page = this.selectPage(pageId);
      if (page) {
        page.data.push(new Item(data));
      }
      this.save();
    };

    this.updatePage = (data) => {
      for (let page of accountBook) {
        if (page.id === data.id) {
          Object.assign(page, this.filterFalsyValues(data));
          break;
        }
      }
      this.save();
    };

    this.updateItem = (pageId, data) => {
      const item = this.selectItem(pageId, item.id);
      if (item) {
        Object.assign(item, this.filterFalsyValues(data));
      }
      this.save();
    };

    this.deletePage = (pageId) => {
      let index = this.findIndex(accountBook, pageId);

      if (index > -1) {
        accountBook.splice(i, 1);
      }
      this.save();
    };

    this.deleteItem = (pageId, itemId) => {
      const page = this.selectPage(pageId);
      let index = this.findIndex(page.data, itemId);

      if (index > -1) {
        page.data.splice(i, 1);
      }
      this.save();
    };

    this.findIndex = (object, id) => {
      for (let data in object) {
        if (object[data].id === id) {
          return i;
        }
      }
      return -1;
    };

    this.filterFalsyValues = (object) => {
      return Object.fromEntries(
        Object.entries(object).filter(([k, v]) => v === undefined || v === null)
      );
    };

    this.load = () => {
      if (!localStorage.getItem("accountbook")) {
        localStorage.setItem("accountbook", JSON.stringify(accountBook));
      }
      const temp = JSON.parse(localStorage.getItem("accountbook"));
      Object.assign(accountBook, {
        ...temp,
        pages: temp.pages.map(
          (page) =>
            new Page(
              Object.assign(page, {
                data: page.data.map((item) => new Item(item)),
              })
            )
        ),
      });
      this.update();
    };

    this.save = () => {
      localStorage.setItem("accountbook", JSON.stringify(accountBook));
      this.update();
    };

    this.update = () => {
      template.update(accountBook);
    };
  }

  function Template() {
    let options = null;
    let view = null;

    this.init = (_options, _view) => {
      options = _options;
      view = _view;

      this.render();
    };

    this.render = () => {
      view.render(options.ui);
    };

    this.update = (accountBook) => {
      const { page, item } = options;
      view.update(page, item, accountBook);
    };
  }

  function View() {
    let options = null;
    let app = null;
    let board = null;
    let sheets = null;

    this.init = (_options) => {
      options = _options;
    };

    this.$ = (el) => {
      return document.querySelector(el);
    };

    this.render = (ui) => {
      app = this.$("#app");
      app.innerHTML = ui || "";
      board = this.$("#board");
      sheets = this.$("#sheets");
    };

    this.update = (pageTemplate, itemTemplate, accountBook) => {
      console.log(pageTemplate, itemTemplate, accountBook);
      for (let el of [...sheets.children]) {
        if (!el.classList.contains("create")) {
          el.remove();
        }
      }
      for (let page of accountBook.pages) {
        this.$(".create.sheet").insertAdjacentHTML(
          "beforebegin",
          pageTemplate(page)
        );
      }

      document
        .querySelectorAll(`.sheet[page-id]`)
        .forEach((el) => el.classList.remove("selected"));
      this.$(`.sheet[data-page-id="${accountBook.current}"]`).classList.add(
        "selected"
      );
    };

    this.filter = () => {};
  }

  return {
    init(options) {
      const view = new View();
      const template = new Template();
      const model = new Model();
      const crud = new Crud();
      const controller = new Controller();

      view.init(options.view);
      template.init(options.template, view);
      model.init(options.model, template);
      crud.init(options.curd, model);
      controller.init(options.controller, crud);
    },
  };
})();

account.init({
  view: {},
  template: {
    ui: `
    <div id="wrap">
      <div id="header">header</div>
        <div id="insert">
        <select name="" id="">
          <option value="">입금</option>
          <option value="">출금</option>
        </select>
        <input type="text" placeholder="일상" />
        <input type="text" placeholder="식대, 개인" />
        <input type="number" min="0" step="10" value="0" />
        <input type="text" placeholder="From" />
        <input type="text" placeholder="To" />
        <textarea name="memo" id="memo" cols="30" rows="10"></textarea>
      <button>write</button>
      </div>
      <div id="board">
        
      </div>
      <div id="sheets">
        <button class="create sheet"></button>
      </div>
    </div>
    <div id="footer">
      <p>
      Copyright ${new Date().getFullYear()}. kimson. All rights reserved.
      </p>
    </div>
    `,
    item: () => `
    <div class="record">
      <span>id</span>
      <span>memo</span>
      <span>amount</span>
      <span>inout</span>
      <span>category</span>
      <span>tags</span>
      <span>from</span>
      <span>to</span>
      <span>created_at</span>
      <span>updated_at</span>
    </div>`,
    page: ({ id, name }) =>
      `<button class="sheet" data-page-id="${id}">${name}</button>`,
  },
  model: {},
  crud: {},
  controller: {},
});
