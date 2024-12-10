import { mvc } from "@joint/core";

export const INITIAL_VALUE_TAG: string = "_initial";
export const CURRENT_VALUE_TAG: string = "_current";

export class JointValueAccessor {

  static initializeValue(key: string, value: any, jointModel: mvc.Model): void {
    JointValueAccessor.setInitialValue(key, value, jointModel);
    JointValueAccessor.setCurrentValue(key, value, jointModel);
  }

  static setInitialValue(key: string, value: any, jointModel: mvc.Model): void {
    let intialValueKey = JointValueAccessor.createInitialValueKey(key);

    jointModel.set(intialValueKey, value);
  }

  static setCurrentValue(key: string, value: any, jointModel: mvc.Model): void {
    let currentValueKey = JointValueAccessor.createCurrentValueKey(key);

    jointModel.set(currentValueKey, value);
  }

  static getInitialValue(key: string, jointModel: mvc.Model): any {
    let intialValueKey = JointValueAccessor.createInitialValueKey(key);

    return jointModel.get(intialValueKey);
  }

  static getCurrentValue(key: string, jointModel: mvc.Model): any {
    let currentValueKey = JointValueAccessor.createCurrentValueKey(key);

    return jointModel.get(currentValueKey);
  }

  private static createInitialValueKey(baseKey: string) {
    return baseKey + INITIAL_VALUE_TAG;
  }

  private static createCurrentValueKey(baseKey: string) {
    return baseKey + CURRENT_VALUE_TAG;
  }

}
