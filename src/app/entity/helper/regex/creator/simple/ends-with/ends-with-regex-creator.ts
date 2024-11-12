import { SimpleRegexCreator } from "../simple-regex-creator";

export class EndsWithRegexCreator extends SimpleRegexCreator {

  constructor() {
    super();
    this.init("ends with", ".*", "$");
  }

}
