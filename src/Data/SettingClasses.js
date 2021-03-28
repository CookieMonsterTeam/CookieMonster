/* eslint-disable max-classes-per-file */
/** This describes all forms of settings used by Cookie Monster */

/** The basic setting class */
export class Setting {
  constructor(type, group) {
    this.type = type;
    this.group = group;
  }
}

/** The standard toggle setting class */
export class SettingStandard extends Setting {
  constructor(type, group, label, desc, toggle, func = null) {
    super(type, group);
    this.label = label;
    this.desc = desc;
    this.toggle = toggle;
    if (func) {
      this.func = func;
    }
  }
}
/** The colour picker setting class */
export class SettingColours extends Setting {
  constructor(type, group, desc) {
    super(type, group);
    this.desc = desc;
  }
}

/** The volume level setting class */
export class SettingVolume extends Setting {
  constructor(type, group, label, desc) {
    super(type, group);
    this.label = label;
    this.desc = desc;
    for (let i = 0; i < 101; i++) {
      this.label[i] = `${i}%`;
    }
  }
}

/** The number input setting class */
export class SettingInputNumber extends Setting {
  constructor(type, group, label, desc, min, max) {
    super(type, group);
    this.label = label;
    this.desc = desc;
    this.min = min;
    this.max = max;
  }
}
