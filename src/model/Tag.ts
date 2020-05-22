import { Model, Q } from "@nozbe/watermelondb";
import { field, lazy } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Tag extends Model {
  static table = TableName.TAGS;
  static associations: Associations = {
    [TableName.TAGS_CARDS]: { type: "has_many", foreignKey: "tag_id" },
  };

  @field("name") name;

  @lazy cards = this.collections
    .get(TableName.CARDS)
    .query(Q.on(TableName.TAGS_CARDS, "tag_id", this.id))
    .fetch();
}
