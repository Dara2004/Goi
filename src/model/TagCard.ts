import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class TagCard extends Model {
  static table = TableName.TAGS_CARDS;
  static associations: Associations = {
    [TableName.TAGS]: { type: "belongs_to", key: "tag_id" },
    [TableName.CARDS]: { type: "belongs_to", key: "card_id" },
  };

  @field("tag_id") tag_id;
  @field("card_id") card_id;
}
