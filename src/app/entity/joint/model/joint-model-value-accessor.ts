import { mvc } from "@joint/core";

export const INITIAL_VALUE_TAG: string = "_initial";
export const CURRENT_VALUE_TAG: string = "_current";

export class JointModelValueAccessor {
  static initializeValue(key: string, value: any, jointModel: mvc.Model): void {
    JointModelValueAccessor.setInitialValue(key, value, jointModel);
    JointModelValueAccessor.setCurrentValue(key, value, jointModel);
  }

  static setInitialValue(key: string, value: any, jointModel: mvc.Model): void {
    let intialValueKey = JointModelValueAccessor.createInitialValueKey(key);

    jointModel.set(intialValueKey, value);
  }

  static setCurrentValue(key: string, value: any, jointModel: mvc.Model): void {
    let currentValueKey = JointModelValueAccessor.createCurrentValueKey(key);

    jointModel.set(currentValueKey, value);
  }

  static getInitialValue(key: string, jointModel: mvc.Model): any {
    let intialValueKey = JointModelValueAccessor.createInitialValueKey(key);

    return jointModel.get(intialValueKey);
  }

  static getCurrentValue(key: string, jointModel: mvc.Model): any {
    let currentValueKey = JointModelValueAccessor.createCurrentValueKey(key);

    return jointModel.get(currentValueKey);
  }

  private static createInitialValueKey(baseKey: string) {
    return baseKey + INITIAL_VALUE_TAG;
  }

  private static createCurrentValueKey(baseKey: string) {
    return baseKey + CURRENT_VALUE_TAG;
  }
}
