import { Model } from "@nozbe/watermelondb";
import { date, field } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Deck extends Model {
  static table = TableName.DECKS;
  static associations: Associations = {
    [TableName.CARDS]: { type: "has_many", foreignKey: "deck_id" },
  };

  @field("name") name;
  @date("created_at") created_at;
}
