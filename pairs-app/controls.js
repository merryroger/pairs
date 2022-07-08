/*** The Pairs game by Ehwaz Raido (Merry Roger) 2022 ***/
/*** 2022 Jul, 8  v.0.1.1 ***/

function getControlPanelSample(dock) {
  this.ctrlsDock = dock;
  this.unfolded = null;
  this.unfoldCaller = null;

  this.setSubmitListeners = () => {
    document.querySelector('form.control-panels.settings').addEventListener('submit', (e) => {
      e.preventDefault();
      this.cols = +e.target.cols.value;
      this.lines = +e.target.lines.value;
      this.togglePanel();
      return false;
    });
  }

  this.buildPanel = () => {
    const ctrlItems = [];
    ctrlItems.push(this.buildCtrlItem(
      this.buildConfButton(),
      this.buildSetupPanel()
    ));
    ctrlItems.push(this.buildCtrlItem(
      this.buildSourceLink()
    ));
    this.ctrlsDock.append(this.buildCtrlSocket(ctrlItems));
  }

  this.buildCtrlItem = (...parts) => {
    const item = document.createElement('li');
    item.className = 'control-set-item';
    item.append(...parts);
    return item;
  }

  this.buildCtrlSocket = (items = []) => {
    const sock = document.createElement('ul');
    sock.className = 'control-set';
    sock.append(...items);
    return sock;
  }

  this.buildConfButton = () => {
    const btn = document.createElement('button');
    btn.className = 'control-buttons config';
    btn.textContent = 'Настройки';
    return btn;
  }

  this.buildSetupPanel = () => {
    const panel = document.createElement('form');
    panel.className = 'control-panels settings';

    const elems = [];
    elems.push(this.biuldNumberElement('cols', 'Карт в&nbsp;строке:', 2));
    elems.push(this.biuldNumberElement('lines', 'Количество строк:', 2));
    elems.push(this.buildFormButton('except', 'Принять', 'submit'));
    elems.push(this.buildHR());
    elems.push(this.buildActionButton('О программе', this.fireMessages, 'The Pairs game by Ehwaz Raido (Merry Roger)', 'version 0.1.1'));

    panel.append(...elems);

    return panel;
  }

  this.buildSourceLink = () => {
    const anchor = document.createElement('a');
    anchor.className = 'control-buttons github';
    anchor.setAttribute('href', 'https://github.com/merryroger/pairs');
    anchor.textContent = 'Исходники';
    return anchor;
  }

  this.biuldNumberElement = (elemId, labelText = '', step = 1) => {
    const label = document.createElement('label');
    label.className = 'control__label';
    label['for'] = elemId;
    label.innerHTML = labelText;

    let input = document.createElement('input');
    input.type = 'number';
    input.className = 'control__input';
    input.id = elemId;
    input.min = 4;
    input.max = 10;
    input.placeholder = '4,6,8 или 10';
    input.step = step;
    input.required = true;
    input.value = this[elemId];

    label.append(input);

    return label;
  }

  this.buildFormButton = (elemId, labelText = '', type = 'button') => {
    const btn = document.createElement('button');
    btn.id = elemId;
    btn.className = 'control__button';
    btn.type = type;
    btn.innerHTML = labelText;

    return btn;
  }

  this.buildActionButton = (labelText = '', execFunc, ...params) => {
    const btn = document.createElement('button');
    btn.className = 'action__button';
    btn.type = 'button';
    btn.innerHTML = labelText;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      params.sort();
      execFunc(params);
    });

    return btn;
  }

  this.handleRequest = (e) => {
    if (this.unfolded !== null && e.target.closest('.unfolded') === null) {
      this.togglePanel();
    }

    if (e.target.classList.contains('config')) {
      this.unfolded = document.querySelector('.control-panels.settings');
      this.unfoldCaller = e.target;
      this.togglePanel(true);
    }
  }

  this.buildHR = () => {
    let hr = document.createElement('hr');
    hr.className = 'control__hr';
    return hr;
  }

  this.togglePanel = (setOn = false) => {
    if (setOn) {
      this.unfolded.classList.add('unfolded');
      this.unfoldCaller.disabled = true;
    } else {
      this.unfolded.classList.remove('unfolded');
      this.unfoldCaller.disabled = false;
      this.unfoldCaller = null;
      this.unfolded = null;
    }
  }

  return {
    init: () => {
      this.buildPanel();
      this.setSubmitListeners();
    },
    handleControlRequests: (e) => {
      this.handleRequest(e);
    }
  }
}
