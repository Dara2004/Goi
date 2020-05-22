import {
  appSchema,
  tableSchema,
  ColumnType,
  ColumnSchema,
} from "@nozbe/watermelondb";

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
      name: "decks",
      columns: [
        // Just use automatic id string column for deck name?
        // columnSchema("name", "string", true),
        columnSchema("created_at", "number"), // automatic https://nozbe.github.io/WatermelonDB/Advanced/CreateUpdateTracking.html
      ],
    }),
    tableSchema({
      name: "cards",
      columns: [
        columnSchema("created_at", "number"), // automatic
        columnSchema("updated_at", "number"), // automatic
        columnSchema("last_tested_at", "number"),
        columnSchema("deck_name", "string", true), // hook up to decks->id in Model
        columnSchema("front", "string", true),
        columnSchema("back", "string", true),
        columnSchema("wrong", "number"),
        columnSchema("right", "number"),
      ],
    }),
    tableSchema({
      name: "sessions",
      columns: [
        columnSchema("created_at", "number"), // automatic
        columnSchema("ended_at", "number"), // must manually update (with Unix timestamp integer Date::valueOf)
      ],
    }),
    tableSchema({
      name: "sessions_cards",
      columns: [
        columnSchema("session_id", "string", true),
        columnSchema("card_id", "string", true),
        columnSchema("is_correct", "boolean"),
      ],
    }),

    // To have card tags we need to change EBNF, however it would be a huge improvement over deck tags
    tableSchema({
      name: "tags",
      columns: [columnSchema("name", "string", true)],
    }),
    tableSchema({
      name: "tags_cards",
      columns: [
        columnSchema("tag_id", "string", true),
        columnSchema("card_id", "string", true),
      ],
    }),
  ],
});
