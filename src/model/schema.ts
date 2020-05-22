import {
  appSchema,
  tableSchema,
  ColumnType,
  ColumnSchema,
} from "@nozbe/watermelondb";
import { TableName } from "./constants";

function columnSchema(
  name: string,
  type: ColumnType,
  isIndexed?: boolean
): ColumnSchema {
  return {
    name,
    type,
    isIndexed,
  };
}

// ERD: https://drive.google.com/file/d/1lpoQcutNxBkVubtkJHgOVcD3UjohvQpm/view

// Following suggested naming convention: plural snake case
// https://nozbe.github.io/WatermelonDB/Schema.html

// All tables automatically have a string column id to uniquely identify records
export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.DECKS,
      columns: [
        columnSchema("name", "string"),
        columnSchema("created_at", "number"), // automatic https://nozbe.github.io/WatermelonDB/Advanced/CreateUpdateTracking.html
      ],
    }),
    tableSchema({
      name: TableName.CARDS,
      columns: [
        columnSchema("created_at", "number"), // automatic
        columnSchema("updated_at", "number"), // automatic
        columnSchema("last_tested_at", "number"),
        columnSchema("deck_id", "string", true),
        columnSchema("front", "string", true),
        columnSchema("back", "string", true),
        columnSchema("wrong", "number"),
        columnSchema("right", "number"),
      ],
    }),
    tableSchema({
      name: TableName.SESSIONS,
      columns: [
        columnSchema("created_at", "number"), // automatic
        columnSchema("ended_at", "number"), // must manually update (with Unix timestamp integer Date::valueOf)
      ],
    }),
    tableSchema({
      name: TableName.SESSIONS_CARDS,
      columns: [
        columnSchema("session_id", "string", true),
        columnSchema("card_id", "string", true),
        columnSchema("is_correct", "boolean"),
      ],
    }),

    // To have card tags we need to change EBNF, however it would be a huge improvement over deck tags
    tableSchema({
      name: TableName.TAGS,
      columns: [columnSchema("name", "string", true)],
    }),
    tableSchema({
      name: TableName.TAGS_CARDS,
      columns: [
        columnSchema("tag_id", "string", true),
        columnSchema("card_id", "string", true),
      ],
    }),
  ],
});
