const dev = function dev() {};
Object.entries(console).forEach(([k, v]) => {
  if (k === "memory") {
    dev[k] = v;
  } else {
    dev[k] = v.bind(dev, `[DEV] ::`);
  }
});

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
    };
  }
  function Crud() {
    let options = null;
    let accountBook = [];
    let pageIndex = 0;
    let model = null;

    this.init = (_options, _model) => {
      options = _options;
      model = _model;
    };

    this.page = () => {
      const page = {
        id: pageIndex,
        data: [],
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      };

      pageIndex++;

      return page;
    };

    this.read = () => {
      accountBook = localStorage.getItem("accountbook");
    };
  }
  function Model() {
    let options = null;
    let template = null;

    this.init = (_options, _template) => {
      options = _options;
      template = _template;
    };
  }
  function Template() {
    let options = null;
    let view = null;

    this.init = (_options, _view) => {
      options = _options;
      view = _view;
    };
  }
  function View() {
    let options = null;

    this.init = (_options) => {
      options = _options;
    };
  }

  return {
    init(options) {
      const view = new View();
      const template = new Template();
      const model = new Model();
      const crud = new Crud();
      const controller = new Controller();

      view.init(options.view);
      template.init(options.template);
      model.init(options.model);
      crud.init(options.curd);
      controller.init(options.controller);
    },
  };
})();

account.init({
  view: {},
  template: {},
  model: {},
  crud: {},
  controller: {},
});
