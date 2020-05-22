import { Model } from "@nozbe/watermelondb";
import { date, field } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Card extends Model {
  static table = TableName.CARDS;
  static associations: Associations = {
    [TableName.DECKS]: { type: "belongs_to", key: "deck_id" },
    [TableName.TAGS_CARDS]: { type: "has_many", foreignKey: "card_id" },
    [TableName.SESSIONS_CARDS]: { type: "has_many", foreignKey: "card_id" },
  };

  @date("created_at") created_at;
  @date("updated_at") updated_at;
  @date("last_tested_at") last_tested_at;
  @field("deck_id") deck_id;
  @field("front") front;
  @field("back") back;
  @field("wrong") wrong;
  @field("right") right;
}
