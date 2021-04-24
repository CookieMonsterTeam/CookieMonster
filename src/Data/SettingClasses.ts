/* eslint-disable max-classes-per-file */
/** The basic setting class */
class Setting {
  constructor(public type: string, public group: string, public desc: string) {}
}

/** The colour picker setting class */
class SettingColours extends Setting {
  constructor(type: string, group: string, desc: string) {
    super(type, group, desc);
  }
}

/** The number input setting class */
class SettingInputNumber extends Setting {
  constructor(
    type: string,
    group: string,
    public label: string[],
    desc: string,
    public min: number,
    public max: number,
  ) {
    super(type, group, desc);
  }
}

/** The standard toggle setting class */
class SettingStandard extends Setting {
  constructor(
    type: string,
    group: string,
    public label: string[],
    desc: string,
    public toggle: boolean,
    // This one might throw up an error
    public func?: () => void,
  ) {
    super(type, group, desc);
  }
}

/** The volume level setting class */
class SettingVolume extends Setting {
  constructor(type: string, group: string, public label: string[], desc: string) {
    super(type, group, desc);

    for (let i = 0; i < 101; i++) {
      this.label[i] = `${i}%`;
    }
  }
}

export { SettingColours, SettingInputNumber, SettingStandard, SettingVolume };
