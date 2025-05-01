import { ComparableEntity } from "./comparable-entity";
import { DeserializableEntity } from "./deserializable-entity";

export abstract class ApiEntity implements DeserializableEntity<ApiEntity>, ComparableEntity<ApiEntity> {

  id: number;

  createdUid: string;

  createdDate: Date;

  modifiedUid: string;

  modifiedDate: Date;

  constructor() {
    this.id = -1;
    this.createdUid = "";
    this.createdDate = new Date();
    this.modifiedUid = "";
    this.modifiedDate = new Date();
  }

  deserialize(json: any): ApiEntity {
    if (json) {
      this.id = json.id;
      this.createdUid = json.createdUid;
      this.createdDate = json.createdDate;
      this.createdUid = json.createdUid;
      this.createdDate = json.createdDate;
    }
    return this;
  }

  isEqualTo(otherEntity: ApiEntity): boolean {
    let isEqualTo = false;
    if (
      this.id === otherEntity.id &&
      this.createdUid === otherEntity.createdUid &&
      this.createdDate === otherEntity.createdDate &&
      this.modifiedUid === otherEntity.modifiedUid &&
      this.modifiedDate === otherEntity.modifiedDate
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  isNewEntity(): boolean {
    let isNewEntity = false;
    if(this.id < 0) {
      isNewEntity = true;
    }
    return isNewEntity;
  }

  static isEntityNew(entity: ApiEntity | undefined): boolean {
    let isEntityNew = false;
    if (entity) {
      isEntityNew = entity.isNewEntity();
    }
    return isEntityNew;
  }

}
