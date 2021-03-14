import { DispCSS } from '../VariablesAndData';

/**
 * This function creates a CSS style that stores certain standard CSS classes used by CookieMonster

 */
export default function CreateCssArea() {
  DispCSS = document.createElement('style');
  DispCSS.type = 'text/css';
  DispCSS.id = 'CMCSS';

  document.head.appendChild(DispCSS);
}
