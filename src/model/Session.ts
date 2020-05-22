import { Model } from "@nozbe/watermelondb";
import { date } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Session extends Model {
  static table = TableName.SESSIONS;
  static associations: Associations = {
    [TableName.SESSIONS_CARDS]: { type: "has_many", foreignKey: "session_id" },
  };

  @date("created_at") created_at;
  @date("ended_at") ended_at;
}
