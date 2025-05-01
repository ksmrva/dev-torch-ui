export class StringSandwich {

  prefix: string;

  postfix: string;

  constructor() {
    this.prefix = "";
    this.postfix = "";
  }

  createSandwich(middleValue: string): string {
    return this.prefix + middleValue + this.postfix;
  }

  static build(prefix: string, postfix: string): StringSandwich {
    let createdStringSandwich = new StringSandwich();
    createdStringSandwich.prefix = prefix;
    createdStringSandwich.postfix = postfix;

    return createdStringSandwich;
  }
}
