import { ComparableEntity } from "../../../../comparable-entity";
import { DeserializableEntity } from "../../../../deserializable-entity";

export class ExplorerPanelListEntry implements DeserializableEntity<ExplorerPanelListEntry>, ComparableEntity<ExplorerPanelListEntry> {

  id: number;

  type: string;

  name: string;

  hasSubEntries: boolean;

  constructor() {
    this.id = -1;
    this.type = "";
    this.name = "";
    this.hasSubEntries = false;
  }

  deserialize(json: any): ExplorerPanelListEntry {
    if (json) {
      this.id = json.id;
      this.type = json.type;
      this.name = json.name;
      this.hasSubEntries = json.hasSubEntries;
    }
    return this;
  }

  isEqualTo(otherEntity: ExplorerPanelListEntry): boolean {
    let isEqualTo = false;
    if (
      this.id === otherEntity.id &&
      this.type === otherEntity.type &&
      this.name === otherEntity.name &&
      this.hasSubEntries === otherEntity.hasSubEntries
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

}
