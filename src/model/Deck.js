import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Deck extends Model {
  static table = "decks";

  @field("title") title;
}
