import { Model, Q } from "@nozbe/watermelondb";
import { date, lazy } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";

export default class Session extends Model {
  static table = TableName.SESSIONS;
  static associations: Associations = {
    [TableName.SESSIONS_CARDS]: { type: "has_many", foreignKey: "session_id" },
  };

  @date("started_at") started_at;
  @date("ended_at") ended_at;

  @lazy cards = this.collections
    .get(TableName.CARDS)
    .query(Q.on(TableName.SESSIONS_CARDS, "session_id", this.id))
    .fetch();

  @lazy sessionCards = this.collections
    .get(TableName.SESSIONS_CARDS)
    .query(Q.where("session_id", this.id))
    .fetch();
}
