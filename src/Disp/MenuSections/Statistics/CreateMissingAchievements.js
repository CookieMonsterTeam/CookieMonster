import { CMOptions } from '../../../Config/VariablesAndData';

function CrateTooltipLockedAchievements(me) {
  const tags = [];
  if (me.pool === 'shadow') tags.push('Shadow Achievement', '#9700cf');
  else tags.push('Achievement', 0);
  tags.push('Locked', 0);

  let neuromancy = 0;
  if (Game.Has('Neuromancy') || (Game.sesame && me.pool === 'debug')) neuromancy = 1;
  if (neuromancy && me.won === 0) tags.push('Click to win!', '#00c462');
  else if (neuromancy && me.won > 0) tags.push('Click to lose!', '#00c462');

  let { icon } = me;
  if (me.iconFunction) icon = me.iconFunction();

  let { desc } = me;
  if (me.descFunc) desc = me.descFunc('stats');

  let tagsStr = '';
  for (let i = 0; i < tags.length; i += 2) {
    if (i % 2 === 0)
      tagsStr += ` <div class="tag" style="color:${tags[i + 1] === 0 ? '#fff' : tags[i + 1]};">[${
        tags[i]
      }]</div>`;
  }
  tagsStr = tagsStr.substring(1);

  return `<div style="padding:8px 4px;min-width:350px;opacity:0.5">
  <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:${
    -icon[0] * 48
  }px ${-icon[1] * 48}px;"></div>
  <div class="name">${me.name}</div>
  ${tagsStr}<div class="line"></div><div class="description">${desc}</div></div>
  ${
    Game.sesame
      ? `<div style="font-size:9px;">Id : ${me.id} | Order : ${Math.floor(me.order)}${
          me.tier ? ` | Tier : ${me.tier}` : ''
        }</div>`
      : ''
  }`;
}

/**
 * This function overwrites the crates of missing achievements
 */
export default function AddMissingAchievements() {
  let achievs;
  Object.values(document.querySelectorAll('div.title')).forEach((i) => {
    if (i.textContent.includes('Achievements')) {
      achievs = i.parentElement.querySelectorAll('div.listing.crateBox')[0];
    }
  });
  if (CMOptions.MissingAchievements) {
    Object.values(achievs.children).forEach((achievsCrate) => {
      if (!achievsCrate.className.includes('enabled')) {
        const id = achievsCrate.onclick.toString().split(/\[(.*)\]/gi)[1];
        const { icon } = Game.AchievementsById[id];
        // eslint-disable-next-line no-param-reassign
        achievsCrate.style.backgroundPosition = `${-icon[0] * 48}px ${-icon[1] * 48}px`;
        // eslint-disable-next-line no-param-reassign
        achievsCrate.onmouseover = function () {
          if (!Game.mouseDown) {
            Game.setOnCrate(this);
            Game.tooltip.dynamic = 1;
            Game.tooltip.draw(
              this,
              () =>
                (function () {
                  return CrateTooltipLockedAchievements(Game.AchievementsById[id]);
                })(),
              'top',
            );
            Game.tooltip.wobble();
          }
        };
      }
    });
  }
}
