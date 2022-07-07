function getTimerSample(dock) {
  this.tmrDock = dock;
  this.seconds = 0;
  this.toh = 0;

  this.init = () => {
    this.tmrDock.addEventListener('click', () => {
      document.body.dispatchEvent(new CustomEvent('reload', {
        detail: { src: this.tmrDock }
      }));
    });
  }

  this.resetTimerStyle = () => {
    this.tmrDock.className = 'timer';
  }

  this.recalcTime = (pairsTotal) => {
    this.seconds = Math.round(pairsTotal * 7.5);
    //this.seconds = 2;
  }

  this.display = () => {
    let minutes = Math.floor(this.seconds / 60);
    let seconds = this.seconds % 60;

    this.tmrDock.textContent = ((minutes < 10) ? `0${minutes}` : minutes) + ':' + ((seconds < 10) ? `0${seconds}` : seconds);
  }

  this.start = () => {
    this.tmrDock.classList.add('go');
    this.tick();
    this.toh = setInterval(this.tick, 1000);
  }

  this.tick = () => {
    this.seconds--;
    if (this.seconds < 0) {
      this.stop();
      return;
    }

    this.display();
  }

  this.pause = () => {
    clearInterval(toh);
    this.tmrDock.classList.add('reload');
  }

  this.stop = () => {
    this.tmrDock.classList.remove('go');
    this.tmrDock.textContent = '';
    this.tmrDock.classList.add('squeezed');
    clearInterval(toh);

    document.body.dispatchEvent(new CustomEvent('gameover', {
      detail: { src: this.tmrDock }
    }));
  }

  return {
    init: () => {
      this.init();
    },
    reset: (pairsTotal) => {
      this.resetTimerStyle();
      this.recalcTime(pairsTotal);
      this.display();
    },
    pause: () => {
      this.pause();
    },
    go: () => {
      this.start();
    },
    setReloadState: () => {
      this.tmrDock.classList.add('reload');
    }
  }
}
