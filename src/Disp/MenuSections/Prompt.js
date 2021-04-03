/** Creates a Prompt similar to the base game without some of the stuff breaking them */
export default function CookieMonsterPrompt(content, options) {
  Game.promptWrapL.className = 'framed';
  const str = content;
  Game.promptL.innerHTML = `${str}<div class="optionBox"></div>`;
  Object.keys(options).forEach((i) => {
    const option = document.createElement('a');
    option.id = `promptOption${i}`;
    option.className = 'option';
    option.onclick = function () {
      PlaySound('snd/tick.mp3');
      options[i][1]();
    };
    option.textContent = options[i][0];
    Game.promptL.children[1].appendChild(option);
  });
  Game.promptAnchorL.style.display = 'block';
  Game.darkenL.style.display = 'block';
  Game.promptL.focus();
  Game.promptOn = 1;
  Game.UpdatePrompt();
}
