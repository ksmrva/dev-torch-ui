import { StringSandwich } from "../../../string/sandwich/string-sandwich";

export class SimpleRegexCreator {

  name: string;

  regexSandwich: StringSandwich;

  constructor() {
    this.name = "";
    this.regexSandwich = StringSandwich.build("", "");
  }

  init(name: string, prefix: string, postfix: string): SimpleRegexCreator {
    this.name = name;
    this.regexSandwich = StringSandwich.build(prefix, postfix);

    return this;
  }

  getPrefix(): string {
    return this.regexSandwich.prefix;
  }

  getPostfix(): string {
    return this.regexSandwich.postfix;
  }

  createRegex(wordToMatch: string): string {
    return this.regexSandwich.createSandwich(wordToMatch);
  }
}
