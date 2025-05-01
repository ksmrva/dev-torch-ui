import { ComparableEntity } from "../../comparable-entity";
import { DeserializableEntity } from "../../deserializable-entity";

export class RegexMatcher<T extends ComparableEntity<T>> implements DeserializableEntity<RegexMatcher<T>>, ComparableEntity<RegexMatcher<T>> {

  objectForMatch: T | undefined;

  matchingRegexes: string[];

  constructor() {
    this.objectForMatch = undefined;
    this.matchingRegexes = [];
  }

  addNameRegex(matchingRegexToAdd: string): void {
    this.matchingRegexes.push(matchingRegexToAdd);
  }

  deserialize(json: any): RegexMatcher<T> {
    if (json) {
      this.objectForMatch = json.objectForMatch;
      this.matchingRegexes = json.matchingRegexes;
    }
    return this;
  }

  isEqualTo(otherEntity: RegexMatcher<T>): boolean {
    let isEqualTo = false;

    if (!this.objectForMatch && !otherEntity.objectForMatch) {
      isEqualTo = true;
    } else if (this.objectForMatch && otherEntity.objectForMatch) {
      isEqualTo = this.objectForMatch.isEqualTo(otherEntity.objectForMatch);
    } else {
      isEqualTo = false;
    }

    if (isEqualTo) {
      if(this.matchingRegexes.length === otherEntity.matchingRegexes.length) {
        let allRegexesHaveMatch = true;
        for (let i = 0; i < this.matchingRegexes.length; i++) {
          let regex = this.matchingRegexes[i];
          let indexOfRegex = otherEntity.matchingRegexes.findIndex((otherRegex: string) => {
            return otherRegex === regex;
          });
          if (indexOfRegex < 0) {
            allRegexesHaveMatch = false;
            break;
          }
        }
        isEqualTo = allRegexesHaveMatch;

      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
