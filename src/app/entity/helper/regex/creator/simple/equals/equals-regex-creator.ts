import { SimpleRegexCreator } from "../simple-regex-creator";

export class EqualsRegexCreator extends SimpleRegexCreator {

  constructor() {
    super();
    this.init("equals", "", "");
  }

}
