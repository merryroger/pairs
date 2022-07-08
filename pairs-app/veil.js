/*** The Pairs game by Ehwaz Raido (Merry Roger) 2022 ***/
/*** 2022 Jul, 8  v.0.1.1 ***/

function getVeilSample(dock) {
  this.body = document.body;
  this.veilDock = dock;
  this.msgList = null;
  this.raised = false;
  this.shift = 0;

  this.fireMessages = (msgs = []) => {
    this.shift = 0;

    if (!msgs.length) {
      return;
    }

    if (this.msgList === null) {
      this.msgList = document.createElement('ul');
      this.msgList.className = 'popup-message-list';
      document.body.append(this.msgList);
    }

    msgs.reverse();
    msgs.forEach((msg) => {
      const msgItem = document.createElement('li');
      msgItem.className = 'popup-message';
      msgItem.innerHTML = msg;
      msgItem.setAttribute('data-shift', `${this.shift}`);
      this.msgList.append(msgItem);
      this.shift += (msgItem.offsetHeight + 10);
    });

    setTimeout(this.showMessage, 10);
  }

  this.showMessage = () => {
    const msgs = document.querySelectorAll('.popup-message');

    msgs.forEach((m) => {
      let shift = (m.style.visibility == 'visible')
        ? (+m.getAttribute('data-shift') + this.shift)
        : +m.getAttribute('data-shift');
      m.style.transform = `translateY(-${shift}px)`;
      m.style.opacity = 0;
      m.style.visibility = 'visible';
      m.setAttribute('data-shift', `${shift}`);
    });
  }

  this.clearList = () => {
    if (this.msgList !== null && this.msgList.length == 0) {
      delete this.msgList;
      this.msgList = null;
      this.shift = 0;
    }
  }

  return {
    raise: (msgs) => {
      this.raised = true;
      this.body.classList.add('veil-raised');
      this.fireMessages(msgs);
    },
    reset: () => {
      this.body.classList.remove('veil-raised');
      this.clearList();
      this.raised = false;
    }
  }
}
