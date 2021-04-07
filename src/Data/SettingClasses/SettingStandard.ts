import Setting from './BaseSetting';

/** The standard toggle setting class */
export default class SettingStandard extends Setting {
  label: string[];

  desc: string;

  toggle: boolean;

  func: () => void;

  constructor(
    type: string,
    group: string,
    label: string[],
    desc: string,
    toggle: boolean,
    func?: () => void,
  ) {
    super(type, group);
    this.label = label;
    this.desc = desc;
    this.toggle = toggle;
    if (func !== undefined) {
      this.func = func;
    }
  }
}
