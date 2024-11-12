import { SimpleRegexCreator } from '../simple-regex-creator';

export class StartsWithRegexCreator extends SimpleRegexCreator {

  constructor() {
    super();
    this.init('starts with', '^', '.*');
  }

}
