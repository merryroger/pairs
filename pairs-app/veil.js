/*** The Pairs game by Ehwaz Raido (Merry Roger) 2022 ***/
/*** 2022 Jul, 4-7  v.0.1.0 ***/

function getVeilSample(dock) {
  this.body = document.body;
  this.veilDock = dock;
  this.msgList = null;
  this.raised = false;

  this.fireMessages = (msgs = []) => {
    let shift = 0;

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
      msgItem.setAttribute('data-shift', `${shift}`);
      this.msgList.append(msgItem);
      shift += (msgItem.offsetHeight + 10);
    });

    setTimeout(this.showMessage, 10);
  }

  this.showMessage = () => {
    const msgs = document.querySelectorAll('.popup-message');
    msgs.forEach((m) => {
      let shift = +m.getAttribute('data-shift');
      m.style.transform = `translateY(-${shift}px)`;
      m.style.opacity = 0;
      m.style.visibility = 'visible';
    });
  }

  this.clearList = () => {
    if (this.msgList !== null) {
      delete this.msgList;
      this.msgList = null;
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
