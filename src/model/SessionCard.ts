import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class SessionCard extends Model {
  static table = TableName.SESSIONS_CARDS;
  static associations: Associations = {
    [TableName.SESSIONS]: { type: "belongs_to", key: "session_id" },
    [TableName.CARDS]: { type: "belongs_to", key: "card_id" },
  };

  @field("session_id") session_id;
  @field("card_id") card_id;
  @field("is_correct") is_correct;
}
