/*** The Pairs game by Ehwaz Raido (Merry Roger) 2022 ***/
/*** 2022 Jul, 4-7  v.0.1.0 ***/

function getPairsSample(params = {}) {
  this.field = null;
  this.stock = null;
  this.veil = null;
  this.timer = null;
  this.ctrls = null;
  this.stockRect = null;
  this.cardPlaces = [];
  this.numbers = [];
  this.waitTarget = null;
  this.testedCard = null;
  this.cols = 4;
  this.lines = 4;
  this.stage = -1;
  this.matches = 0;
  this.isFlipping = false;

  this.setVariables = () => {
    for (let [pmName, pmValue] of Object.entries(params)) {
      this[pmName] = pmValue;
    }
  }

  this.setListeners = () => {
    document.body.addEventListener('transitionend', (e) => {
      this.transitionsHandler(e);
    });
    document.body.addEventListener('pointerdown', (e) => {
      this.downEventHandler(e);
    }, true);
    document.body.addEventListener("gameover", (e) => {
      this.checkGameOver(e.detail.src);
    });
    document.body.addEventListener("reload", (e) => {
      if (this.stage % 5 == 0) {
        this.reload();
      }
    });
  }

  this.reload = () => {
    this.reset();
    this.rebuild();
    this.pullStock();
  }

  this.reset = () => {
    this.waitTarget = null;
    this.stage = 1;
    this.field.innerHTML = '';
    this.veil.reset();
    this.timer.reset(this.cols * this.lines / 2);
  }

  this.rebuild = () => {
    this.cardPlaces = [];
    this.numbers = [];

    for (let l = 0; l < this.lines; l++) {
      for (let c = 0; c < this.cols; c++) {
        this.cardPlaces[cardPlaces.length] = document.createElement('div');
        this.cardPlaces[cardPlaces.length - 1].className = 'card cardplace';
        this.cardPlaces[cardPlaces.length - 1].setAttribute('data-index', `${l * this.cols + c}`);
        this.numbers[this.numbers.length] = Math.floor((l * this.cols + c) / 2) + 1;
      }
    }

    this.field.style.setProperty('--col-count', `${this.cols}`);
    this.field.style.setProperty('--line-count', `${this.lines}`);
    this.field.style.setProperty('--max-count', `${Math.max(this.lines, this.cols)}`);

    this.field.append(...this.cardPlaces);
    this.shuffle(this.numbers);
  }

  this.pullStock = () => {
    let treck = 0;
    this.stock.style.width = this.stock.style.height = getComputedStyle(this.cardPlaces[0]).width;
    this.stock.style.borderRadius = getComputedStyle(this.cardPlaces[0]).borderRadius;
    treck = this.stock.offsetWidth + 10;
    this.stock.style.left = -treck + 'px';
    this.stock.style.top = -treck + 'px';
    this.stock.style.transform = `translate(${treck + 10}px, ${treck + 10}px)`;
    this.waitTarget = this.stock;
  }

  this.putCardsToStock = () => {
    this.stockRect = this.stock.getBoundingClientRect();
    this.cardPlaces.forEach((card) => {
      card.style.setProperty('--trf-cp', `translate(var(--mv-x), var(--mv-y)) rotate(var(--cp-rot))`);
      card.style.setProperty('--mv-x', `${this.stockRect.x - card.getBoundingClientRect().x}px`);
      card.style.setProperty('--mv-y', `${this.stockRect.y - card.getBoundingClientRect().y}px`);
    });

    this.field.style.setProperty('--stock-cp-visibility', 'visible');
    this.stage++;
    setTimeout(this.distribute, 10);
  }

  this.putCardsByPlaces = () => {
    this.field.style.setProperty('--trn-cp', 'transform .5s ease-in-out');
    let cards = Object.assign([], this.cardPlaces);
    this.shuffle(cards);
    this.moveCardFromStock(cards);
  }

  this.moveCardFromStock = (cards) => {
    const card = cards.splice(0, 1)[0];
    card.style.setProperty('--mv-x', '0');
    card.style.setProperty('--mv-y', '0');
    card.style.setProperty('--cp-rot', '1turn');
    card.style.setProperty('--cp-z', '5');
    let nextCard = this.moveCardFromStock.bind(this, cards);
    if (cards.length > 0) {
      setTimeout(nextCard, 100);
    } else {
      this.stock.style.visibility = 'hidden';
      this.waitTarget = card;
      this.stage++;
      this.stock.style.transform = `translate(0, 0)`;
    }
  }

  this.distribute = () => {
    switch (this.stage) {
      case 1: this.putCardsToStock(); break;
      case 2: this.putCardsByPlaces(); break;
    }
  }

  this.setCardPlayActions = () => {
    this.waitTarget = null;
    this.testedCard = null;
    this.matches = this.lines * this.cols / 2;
    this.timer.go();
  }

  this.flipBack = () => {
    if (this.testedCard !== null && this.waitTarget !== null) {
      this.testedCard.style.setProperty('--trf-fcp', 'scaleX(.1%)');
      this.waitTarget.style.setProperty('--trf-fcp', 'scaleX(.1%)');
    }
  }

  this.completeFlip = () => {
    const requestedValue = this.numbers[+this.waitTarget.getAttribute('data-index')];

    if (this.waitTarget.getAttribute('data-flipped') === 'true') {
      if (this.testedCard === null) {
        this.testedCard = this.waitTarget;
      } else {
        if (!this.compareCards(requestedValue)) {
          return;
        }
        this.testedCard = null;
      }
      this.waitTarget = null;
      this.isFlipping = false;
    } else {
      this.waitTarget.setAttribute('data-value', `${requestedValue}`)
      this.waitTarget.style.setProperty('--stock-cp-visibility', 'hidden');
      this.waitTarget.style.setProperty('--card-face-visibility', 'visible');
      this.waitTarget.style.setProperty('--trf-fcp', 'scaleX(100%)');
      this.waitTarget.setAttribute('data-flipped', 'true');
    }
  }

  this.completeFlipBack = (card) => {
    if (card !== null) {
      card.setAttribute('data-flipped', 'false');
      card.style.setProperty('--card-face-visibility', 'hidden');
      card.style.setProperty('--stock-cp-visibility', 'visible');
      card.setAttribute('data-value', '0');
      card.classList.remove('flipped');
    }
  }

  this.compareCards = (cardValue2) => {
    const cardValue1 = this.numbers[+this.testedCard.getAttribute('data-index')];
    if (cardValue1 == cardValue2) {
      this.matches--;
      this.checkGameOver();
      return true;
    } else {
      setTimeout(this.flipBack, 300);
      return false;
    }
  }

  this.checkGameOver = (...extra) => {
    if (!this.matches && extra.length == 0) {
      this.stage = 5;
      this.timer.pause();
      this.veil.raise(['Отлично! Вы справились.']);
    } else if (this.matches > 0 && extra.length > 0) {
      this.stage = 5;
      this.veil.raise(['К сожалению, на&nbsp;этот раз вы&nbsp;проиграли.']);
      this.waitTarget = extra[0];
    }
  }

  this.downEventHandler = (e) => {
    if (this.stage == 4 && e.target.classList.contains('card') && this.waitTarget === null && !this.isFlipping) {
      if (!e.target.classList.contains('flipped')) {
        this.isFlipping = true;
        e.target.classList.add('flipped');
        this.waitTarget = e.target;
      }
    } else if (this.stage % 5 == 0 && (e.target.closest('.controls') !== null || e.target.closest('.veil') !== null)) {
      this.ctrls.handleControlRequests(e);
    }
  }

  this.transitionsHandler = (e) => {
    if (e.target == this.waitTarget) {
      this.handleStockEvents();
    } else if (this.stage == 4) {
      if (this.testedCard !== null && this.waitTarget !== null) {
        this.completeFlipBack(this.testedCard);
        this.testedCard = null;
        this.completeFlipBack(this.waitTarget);
        this.waitTarget = null;
      } else {
        this.isFlipping = false;
      }
    } else if (this.stage % 5 == 0) {
      if (e.target.classList.contains('popup-message') && (e.propertyName == 'opacity')) {
        const ul = e.target.closest('ul');
        ul.remove(e.target);
      }
    } else {
      //console.log(e);
    }
  }

  this.handleStockEvents = () => {
    switch (this.stage) {
      case 1:
      case 2: this.distribute(); break;
      case 3:
        this.setCardPlayActions();
        this.stage++
        break;
      case 4: this.completeFlip(); break;
      case 5: this.timer.setReloadState(); break;
    }
  }

  this.shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  return {
    init: () => {
      this.setVariables();
      this.timer.init();
      this.ctrls.init();
      this.setListeners();
      this.stage = 0;
      this.veil.raise(["Привет! Это игра «Пары»", "Можно начать игру сразу, но&nbsp;можно изменить настройки в&nbsp;панели управления."]);
    },
    restart: () => {
      this.reset();
      this.rebuild();
      this.pullStock();
    },
    raise: (msgs) => {
      this.veil.raise(msgs);
    }
  }
};
