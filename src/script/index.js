Date.prototype.format = function (format) {
  return format.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP/g, ($1) => {
    const hour = this.getHours();
    const isOver = hour > 12;
    switch ($1) {
      case "YYYY":
        return this.getFullYear().toString().padStart(2, 0);
      case "MM":
        return this.getMonth().toString().padStart(2, 0);
      case "dd":
        return this.getDate().toString().padStart(2, 0);
      case "HH":
        return hour.toString().padStart(2, 0);
      case "mm":
        return this.getMinutes().toString().padStart(2, 0);
      case "ss":
        return this.getSeconds().toString().padStart(2, 0);
      case "SSS":
        return this.getMilliseconds().toString().padStart(3, 0);
      case "AP":
        return isOver ? "PM" : "AM";
      default:
        return $1;
    }
  });
};

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

Item.id = 0;

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
      window.addEventListener("click", this.handleSubmit);
      window.addEventListener("click", this.handleDeleteItem);
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
      crud.changeCurrent(Number(target.dataset.pageId));
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

    this.handleSubmit = (e) => {
      e.preventDefault();

      const target = e.target;
      const submit = target.closest("form#submit.item");
      if (!submit || target.nodeName !== "BUTTON") return;
      const ta = submit.querySelector("textarea");
      const values = ta.value;

      const inout = document.querySelector("#inout");
      const amount = document.querySelector("#amount");
      const category = document.querySelector("#category");
      const tags = document.querySelector("#tags");
      const from = document.querySelector("#from");
      const to = document.querySelector("#to");

      // if (values.trim().length === 0) {
      //   return;
      // } else {
      crud.addItem({
        memo: values.trim(),
        inout: inout.value,
        amount: Number(amount.value),
        category: category.value,
        tags: tags.value.split(/,\s*/g).filter((_) => _),
        from: from.value,
        to: to.value,
      });
      ta.value = "";
      inout.value = "0";
      amount.value = "0";
      category.value = "";
      tags.value = "";
      from.value = "";
      to.value = "";
      // }
    };

    this.handleDeleteItem = (e) => {
      e.preventDefault();

      const target = e.target;
      if (target.nodeName !== "BUTTON" || !target.classList.contains("del"))
        return;

      crud.deleteItem(Number(target.dataset.itemId));
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

    this.selectItem = (itemId) => {
      model.selectItem(itemId);
    };

    this.addPage = (data = {}) => {
      model.addPage(data);
    };

    this.addItem = (data = {}) => {
      model.addItem(data);
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

    this.deleteItem = (itemId) => {
      model.deleteItem(itemId);
    };
  }

  function Model() {
    let accountBook = {
      current: 0,
      purpose: 500_000,
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
        if (page.id === (accountBook.current ?? Number(pageId))) {
          return page;
        }
      }

      return undefined;
    };

    this.selectItem = (itemId) => {
      const page = this.selectPage(accountBook.current);
      for (let item of page.data) {
        if (item.id === Number(itemId)) {
          return item;
        }
      }

      return undefined;
    };

    this.addPage = (data) => {
      accountBook.pages.push(new Page(data));
      this.save();
    };

    this.addItem = (data) => {
      const page = this.selectPage(accountBook.current);
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

    this.deleteItem = (itemId) => {
      const page = this.selectPage(accountBook.current);
      let index = this.findIndex(page.data, itemId);

      if (
        !confirm(
          `[${page.data[index].inout ? "입금" : "출금"}] "${page.data[
            index
          ].amount.toLocaleString()}원" 레코드를 지우시겠습니까?`
        )
      ) {
        //
      } else {
        if (index > -1) {
          page.data.splice(index, 1);
        }
        this.save();
      }
    };

    this.findIndex = (object, id) => {
      for (let data in object) {
        if (object[data].id === id) {
          return data;
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
      const ab = Object.keys(accountBook);
      const tp = Object.keys(temp);
      const excludes = [];
      if (ab.length < tp.length) {
        for (let t of tp) {
          if (!accountBook[t]) {
            excludes.push(t);
          } else {
            continue;
          }
        }
        for (let ex of excludes) {
          delete temp[ex];
        }
      }

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
      this.save();
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
      const { page, item, column } = options;
      view.update({ page, item, column }, accountBook);
    };
  }

  function View() {
    let options = null;
    let app = null;
    let purpose = null;
    let thead = null;
    let tbody = null;
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
      purpose = this.$("#purpose");
      thead = this.$("#thead");
      tbody = this.$("#tbody");
      sheets = this.$("#sheets");
    };

    this.update = (
      { page: pageTemplate, item: itemTemplate, column: columnTemplate },
      accountBook
    ) => {
      let total = 0;
      let inn = 0;
      let out = 0;

      for (let el of [...sheets.children]) {
        if (!el.classList.contains("create")) {
          el.remove();
        }
      }
      for (let el of [...thead.children]) {
        el.remove();
      }
      for (let el of [...tbody.children]) {
        if (!el.classList.contains("total")) {
          el.remove();
        }
      }
      purpose.innerHTML = "";

      for (let page of accountBook.pages) {
        this.$(".create.sheet").insertAdjacentHTML(
          "beforebegin",
          pageTemplate(page)
        );
      }
      this.$("#purpose").insertAdjacentHTML(
        "beforeend",
        accountBook.purpose.toLocaleString()
      );
      this.$("#thead").insertAdjacentHTML("beforeend", columnTemplate());
      for (let item of accountBook.pages[accountBook.current].data) {
        this.$("#tbody").insertAdjacentHTML("beforeend", itemTemplate(item));

        if (Boolean(Number(item.inout))) {
          inn += item.amount;
          total += item.amount;
        } else {
          out -= item.amount;
          total -= item.amount;
        }
      }
      this.$("#total").innerHTML = `
      <hr />
      <div>
        ${total.toLocaleString()} won
      </div>
      <hr />
      <div>
        ${accountBook.purpose.toLocaleString()} ${
        out < 0 ? "-" : "+"
      } ${Math.abs(out).toLocaleString()} = ${(
        accountBook.purpose + out
      ).toLocaleString()} won
      </div>
      `;

      document
        .querySelectorAll(`.sheet[page-id]`)
        .forEach((el) => el.classList.remove("selected"));
      this.$(`.sheet[data-page-id="${accountBook.current}"]`)?.classList.add(
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
      <div id="header">가계부 (<span id="purpose"></span>)</div>
      <div id="wrapper">
        <div id="board-wrap">
          <div id="board">
            <table id="table">
              <thead id="thead"></thead>
              <tbody id="tbody"></tbody>
            </table>
            <div id="total" class="total"></div>
          </div>
          <div id="sheets">
            <button class="create sheet"></button>
          </div>
        </div>
        <div id="insert">
          <div class="item">
            <select id="inout" class="input">
              <option value="1">입금</option>
              <option value="0" selected>출금</option>
            </select>
            <input id="amount" class="input" type="number" min="0" step="10" placeholder="1000" />
            <input id="category" class="input" type="text" placeholder="일상" />
            <input id="tags" class="input" type="text" placeholder="식대, 개인" />
            <input id="from" class="input" type="text" placeholder="From" />
            <input id="to" class="input" type="text" placeholder="To" />
          </div>
          <form id="submit" class="item" onsubmin="return false">
            <textarea class="input" name="memo" id="memo" cols="30" rows="10"></textarea>
            <button id="write" class="btn" type="submit">write</button>
          </form>
        </div>
      </div>
    </div>
    <div id="footer">
      <p>
        Copyright ${new Date().getFullYear()}. kimson. All rights reserved.
      </p>
    </div>
    `,
    item: ({
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
    }) => `
    <tr class="record">
      <td><button class="del" data-item-id="${id}">❌</button></td>
      <!-- <span class="">${id}</span> -->
      <td class="memo">${memo}</td>
      <td class="amount">${amount.toLocaleString()} ₩</td>
      <td class="inout">${Boolean(Number(inout)) ? "입금" : "출금"}</td>
      <td class="category">${category}</td>
      ${
        tags.length > 0
          ? `<td class="tags">${tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}</td>`
          : ""
      }
      <td class="from">${from}</td>
      <td class="to">${to}</td>
      <td class="timestamp">${new Date(
        created_at < updated_at ? updated_at : created_at
      ).format("YYYY-MM-dd HH:mm")}</td>
    </tr>`,
    page: ({ id, name }) =>
      `<button class="sheet" data-page-id="${id}">${name}</button>`,
    column: () => `
    <tr class="record fields">
      <td>del</td>
      <!-- <span>12</span> -->
      <td class="block memo">memo</td>
      <td class="block amount">amount</td>
      <td class="block inout">inout</td>
      <td class="block category">category</td>
      <td class="block tags">tags</td>
      <td class="block from">from</td>
      <td class="block to">to</td>
      <td class="block timestamp">timestamp</td>
    </tr>`,
  },
  model: {},
  crud: {},
  controller: {},
});
