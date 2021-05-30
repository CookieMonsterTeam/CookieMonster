/** Functions related to the Timer Bar */

import { UpdateBotTimerBarPosition } from '../../Config/SpecificToggles';
import { CMOptions } from '../../Config/VariablesAndData';
import {
  BuffColours,
  ColourBackPre,
  ColourGray,
  ColourOrange,
  ColourPurple,
  LastNumberOfTimers,
} from '../VariablesAndData';
import { CreateTimer } from './CreateDOMElements';

/**
 * This function creates the TimerBar and appends it to l('wrapper')
 */
export function CreateTimerBar() {
  const TimerBar = document.createElement('div');
  TimerBar.id = 'CMTimerBar';
  TimerBar.style.position = 'absolute';
  TimerBar.style.display = 'none';
  TimerBar.style.height = '0px';
  TimerBar.style.fontSize = '10px';
  TimerBar.style.fontWeight = 'bold';
  TimerBar.style.backgroundColor = 'black';

  // Create standard Autosave bar
  const CMTimerBarAutosave = CreateTimer('CMTimerBarAutosave', 'Autosave', [
    { id: 'CMTimerBarAutosaveBar', color: ColourPurple },
  ]);
  TimerBar.appendChild(CMTimerBarAutosave);

  // Create standard Golden Cookie bar
  const CMTimerBarGC = CreateTimer('CMTimerBarGC', 'Next Cookie', [
    { id: 'CMTimerBarGCMinBar', color: ColourGray },
    { id: 'CMTimerBarGCBar', color: ColourPurple },
  ]);
  TimerBar.appendChild(CMTimerBarGC);

  // Create standard Reindeer bar
  const CMTimerBarRen = CreateTimer('CMTimerBarRen', 'Next Reindeer', [
    { id: 'CMTimerBarRenMinBar', color: ColourGray },
    { id: 'CMTimerBarRenBar', color: ColourOrange },
  ]);
  TimerBar.appendChild(CMTimerBarRen);
  const TimerBarBuffTimers = document.createElement('div');
  TimerBarBuffTimers.id = 'CMTimerBarBuffTimers';
  TimerBar.appendChild(TimerBarBuffTimers);

  l('wrapper').appendChild(TimerBar);
}

/**
 * This function updates indivudual timers in the timer bar
 */
export function UpdateTimerBar() {
  if (CMOptions.TimerBar === 1) {
    // label width: 113, timer width: 30, div margin: 20
    const maxWidthTwoBar = l('CMTimerBar').offsetWidth - 163;
    // label width: 113, div margin: 20, calculate timer width at runtime
    const maxWidthOneBar = l('CMTimerBar').offsetWidth - 133;
    let numberOfTimers = 0;

    if (CMOptions.AutosaveTimerBar && Game.prefs.autosave) {
      const timeTillNextAutosave =
        (Game.fps * 60 - (Game.OnAscend ? 0 : Game.T % (Game.fps * 60))) / Game.fps;
      l('CMTimerBarAutosave').style.display = '';
      l('CMTimerBarAutosaveBar').style.width = `${Math.round(
        (timeTillNextAutosave *
          (maxWidthOneBar - Math.ceil(timeTillNextAutosave).toString().length * 8)) /
          60,
      )}px`;
      if (CMOptions.TimerBarOverlay >= 1) {
        l('CMTimerBarAutosaveBar').textContent = Math.ceil(timeTillNextAutosave);
      } else l('CMTimerBarAutosaveBar').textContent = '';
      l('CMTimerBarAutosaveTime').textContent = Math.ceil(timeTillNextAutosave);
      numberOfTimers += 1;
    } else l('CMTimerBarAutosave').style.display = 'none';

    // Regulates visibility of Golden Cookie timer
    if (Game.shimmerTypes.golden.spawned === 0 && !Game.Has('Golden switch [off]')) {
      l('CMTimerBarGC').style.display = '';
      l('CMTimerBarGCMinBar').style.width = `${Math.round(
        (Math.max(0, Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time) *
          maxWidthTwoBar) /
          Game.shimmerTypes.golden.maxTime,
      )}px`;
      if (CMOptions.TimerBarOverlay >= 1)
        l('CMTimerBarGCMinBar').textContent = Math.ceil(
          (Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time) / Game.fps,
        );
      else l('CMTimerBarGCMinBar').textContent = '';
      if (Game.shimmerTypes.golden.minTime === Game.shimmerTypes.golden.maxTime) {
        l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
        l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
      } else {
        l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
        l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
      }
      l('CMTimerBarGCBar').style.width = `${Math.round(
        (Math.min(
          Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime,
          Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time,
        ) *
          maxWidthTwoBar) /
          Game.shimmerTypes.golden.maxTime,
      )}px`;
      if (CMOptions.TimerBarOverlay >= 1)
        l('CMTimerBarGCBar').textContent = Math.ceil(
          Math.min(
            Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime,
            Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time,
          ) / Game.fps,
        );
      else l('CMTimerBarGCBar').textContent = '';
      l('CMTimerBarGCTime').textContent = Math.ceil(
        (Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps,
      );
      numberOfTimers += 1;
    } else l('CMTimerBarGC').style.display = 'none';

    // Regulates visibility of Reindeer timer
    if (Game.season === 'christmas' && Game.shimmerTypes.reindeer.spawned === 0) {
      l('CMTimerBarRen').style.display = '';
      l('CMTimerBarRenMinBar').style.width = `${Math.round(
        (Math.max(0, Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time) *
          maxWidthTwoBar) /
          Game.shimmerTypes.reindeer.maxTime,
      )}px`;
      if (CMOptions.TimerBarOverlay >= 1)
        l('CMTimerBarRenMinBar').textContent = Math.ceil(
          (Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time) / Game.fps,
        );
      else l('CMTimerBarRenMinBar').textContent = '';
      l('CMTimerBarRenBar').style.width = `${Math.round(
        (Math.min(
          Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime,
          Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time,
        ) *
          maxWidthTwoBar) /
          Game.shimmerTypes.reindeer.maxTime,
      )}px`;
      if (CMOptions.TimerBarOverlay >= 1)
        l('CMTimerBarRenBar').textContent = Math.ceil(
          Math.min(
            Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime,
            Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time,
          ) / Game.fps,
        );
      else l('CMTimerBarRenBar').textContent = '';
      l('CMTimerBarRenTime').textContent = Math.ceil(
        (Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps,
      );
      numberOfTimers += 1;
    } else {
      l('CMTimerBarRen').style.display = 'none';
    }

    // On every frame all buff-timers are deleted and re-created
    const BuffTimerBars = {};
    l('CMTimerBarBuffTimers').innerHTML = '';
    Object.keys(Game.buffs).forEach((i) => {
      if (Game.buffs[i]) {
        const timer = CreateTimer(Game.buffs[i].name, Game.buffs[i].name, [
          { id: `${Game.buffs[i].name}Bar` },
        ]);
        timer.style.display = '';
        let classColour = '';
        // Gives specific timers specific colors
        if (typeof BuffColours[Game.buffs[i].name] !== 'undefined') {
          classColour = BuffColours[Game.buffs[i].name];
        } else classColour = ColourPurple;
        timer.lastChild.children[1].className = ColourBackPre + classColour;
        timer.lastChild.children[1].style.color = 'black';
        if (CMOptions.TimerBarOverlay === 2)
          timer.lastChild.children[1].textContent = `${Math.round(
            100 * (Game.buffs[i].time / Game.buffs[i].maxTime),
          )}%`;
        else timer.lastChild.children[1].textContent = '';
        timer.lastChild.children[1].style.width = `${Math.round(
          (Game.buffs[i].time *
            (maxWidthOneBar - Math.ceil(Game.buffs[i].time / Game.fps).toString().length * 8)) /
            Game.buffs[i].maxTime,
        )}px`;
        timer.lastChild.children[2].textContent = Math.ceil(Game.buffs[i].time / Game.fps);
        numberOfTimers += 1;
        BuffTimerBars[Game.buffs[i].name] = timer;
      }
    });
    Object.keys(BuffTimerBars).forEach((i) => {
      l('CMTimerBarBuffTimers').appendChild(BuffTimerBars[i]);
    });

    if (numberOfTimers !== 0) {
      l('CMTimerBar').style.height = `${numberOfTimers * 12 + 2}px`;
    }
    if (LastNumberOfTimers !== numberOfTimers) {
      LastNumberOfTimers = numberOfTimers;
      UpdateBotTimerBarPosition();
    }
  }
}
