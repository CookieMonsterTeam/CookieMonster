/**
 * This function creates a white square over the full screen and appends it to l('wrapper')
 */
export default function CreateFlashScreen() {
  const WhiteScreen = document.createElement('div');
  WhiteScreen.id = 'CMFlashScreen';
  WhiteScreen.style.width = '100%';
  WhiteScreen.style.height = '100%';
  WhiteScreen.style.backgroundColor = 'white';
  WhiteScreen.style.display = 'none';
  WhiteScreen.style.zIndex = '9999999999';
  WhiteScreen.style.position = 'absolute';
  l('wrapper').appendChild(WhiteScreen);
}
