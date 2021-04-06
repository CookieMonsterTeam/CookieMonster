import Setting from './BaseSetting';

/** The volume level setting class */
export default class SettingVolume extends Setting {
  label: string[];

  desc: string;

  constructor(type: string, group: string, label: string[], desc: string) {
    super(type, group);
    this.label = label;
    this.desc = desc;
    for (let i = 0; i < 101; i++) {
      this.label[i] = `${i}%`;
    }
  }
}
