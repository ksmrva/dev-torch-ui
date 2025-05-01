import { SimpleRegexCreator } from "../../../../../shared/regex/creator/simple/simple-regex-creator";

export class EndsWithRegexCreator extends SimpleRegexCreator {

  constructor() {
    super();
    this.init("ends with", ".*", "$");
  }

}
