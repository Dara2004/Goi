import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Tag extends Model {
  static table = TableName.TAGS;
  static associations: Associations = {
    [TableName.TAGS_CARDS]: { type: "has_many", foreignKey: "tag_id" },
  };

  @field("name") name;
}
