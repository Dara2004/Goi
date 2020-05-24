import { Model } from "@nozbe/watermelondb";
import { children, date, field, action } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { TableName } from "./constants";
import Card from "./Card";

export default class Deck extends Model {
  static table = TableName.DECKS;
  static associations: Associations = {
    [TableName.CARDS]: { type: "has_many", foreignKey: "deck_id" },
  };

  @field("name") name;
  @date("created_at") created_at;
  @children(TableName.CARDS) cards;

  @action async addCard(front: string, back: string) {
    return await this.collections.get(TableName.CARDS).create((card: Card) => {
      card.deck_id = this.id;
      card.front = front;
      card.back = back;
    });
  }
}
