import Setting from './BaseSetting';

/** The colour picker setting class */
export default class SettingColours extends Setting {
  desc: string;

  constructor(defaultValue: string | number,type: string, group: string, desc: string) {
    super(defaultValue, type, group);
    this.desc = desc;
  }
}
