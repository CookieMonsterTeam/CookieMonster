import Setting from './BaseSetting';

/** The number input setting class */
export default class SettingInputNumber extends Setting {
  label: string[];

  desc: string;

  min: number;

  max: number;

  constructor(
    defaultValue: string | number,
    type: string,
    group: string,
    label: string[],
    desc: string,
    min: number,
    max: number,
  ) {
    super(defaultValue, type, group);
    this.label = label;
    this.desc = desc;
    this.min = min;
    this.max = max;
  }
}
