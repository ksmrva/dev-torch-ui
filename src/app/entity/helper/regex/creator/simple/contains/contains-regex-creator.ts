import { SimpleRegexCreator } from "../simple-regex-creator";

export class ContainsRegexCreator extends SimpleRegexCreator {

  constructor() {
    super();
    this.init("contains", ".*", ".*");
  }

}
