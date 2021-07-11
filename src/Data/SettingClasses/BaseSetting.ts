/** The basic setting class */
export default class Setting {
  defaultValue: string | number;

  type: string;

  group: string;

  constructor(defaultValue: string | number, type: string, group: string) {
    this.defaultValue = defaultValue;
    this.type = type;
    this.group = group;
  }
}
