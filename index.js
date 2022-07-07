/*** The Pairs game by Ehwaz Raido (Merry Roger) 2022 ***/
/*** 2022 Jul, 4-7  v.0.1.0 ***/

const params = {}

document.addEventListener('DOMContentLoaded', () => {
  const veilDock = document.getElementById('veil');
  const timerDock = document.getElementById('timer');
  const ctrlsDock = document.getElementById('controls');

  params.field = document.getElementById('root');
  params.stock = document.getElementById('stock');
  params.veil = getVeilSample(veilDock);
  params.timer = getTimerSample(timerDock);
  params.ctrls = getControlPanelSample(ctrlsDock);

  const pairs = getPairsSample(params);
  pairs.init();
});
