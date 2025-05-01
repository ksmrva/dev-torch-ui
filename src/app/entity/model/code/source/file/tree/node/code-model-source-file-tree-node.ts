import { ApiEntity } from "../../../../../../shared/api-entity";
import { ExplorerPanelListEntry } from "../../../../../../shared/explorer/panel/list/entry/explorer-panel-list-entry";

export class CodeModelSourceFileTreeNode extends ApiEntity {

  name: string;

  fileId: number;

  hasChildren: boolean;

  explorerPanelListEntry: ExplorerPanelListEntry;

  constructor() {
    super();

    this.name = "";
    this.fileId = -1;
    this.hasChildren = false;
    this.explorerPanelListEntry = new ExplorerPanelListEntry();
  }

  hasSubEntries(): boolean {
    return this.hasChildren;
  }

  override deserialize(json: any): CodeModelSourceFileTreeNode {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.fileId = json.fileId;
      this.hasChildren = json.hasChildren;
      this.explorerPanelListEntry = json.explorerPanelListEntry;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelSourceFileTreeNode): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(
        this.name === otherEntity.name
        && this.fileId === otherEntity.fileId
        && this.hasChildren === otherEntity.hasChildren) {
          isEqualTo = true;
        } else {
          isEqualTo = false;
        }
    }
    return isEqualTo;
  }

}
