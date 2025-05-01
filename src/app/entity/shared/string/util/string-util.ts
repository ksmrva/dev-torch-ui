export class StringUtil {

  static isEmpty(valueToCheck: string | undefined | null): boolean {
    let isEmpty = true;
    if(valueToCheck !== null
        && valueToCheck !== undefined
        && valueToCheck !== ""
    ) {
        isEmpty = false;
    }
    return isEmpty;
  }

  static isNotEmpty(valueToCheck: string | undefined | null): boolean {
    return !StringUtil.isEmpty(valueToCheck);
  }

}
