import Setting from './BaseSetting';

/** The colour picker setting class */
export default class SettingColours extends Setting {
  desc: string;

  constructor(type: string, group: string, desc: string) {
    super(type, group);
    this.desc = desc;
  }
}
