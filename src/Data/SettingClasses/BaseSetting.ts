/** The basic setting class */
export default class Setting {
  type: string;

  group: string;

  constructor(type: string, group: string) {
    this.type = type;
    this.group = group;
  }
}
