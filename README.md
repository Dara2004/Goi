# Goi

## Deck Creation DSL

### Example

```
Create Deck: Practice Final
add Tags: example, tag2, tag3
add Color: red
add Alignment: center
(1) Front : Back
(2) Front : Back
(3) Front : Back
(4) Front : Back
(5) Front : Back

```

### EBNF

```
PROGRAM ::= CREATE_DECK+
CREATE_DECK ::= “Create Deck” NAME”:” MODIFIERS? DECK
MODIFIERS ::= (“add” MODIFIER)*
MODIFIER ::= TAGS | COLOR | ALIGNMENT | DIRECTION
ALIGNMENT ::= “center” | “right” | “left”
COLOR ::= ‘red’ | ‘blue’ | ‘green’ | ‘purple’
DIRECTION ::= ‘horizontal’ | ‘vertical’

DECK ::= CARD+
CARD ::= “(”INT”) ” STRING “:” STRING
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+
NAME ::= STRING
```

## Interactive Prompt DSL

### Examples

```
Show stats for 5 best scores for Decks: deck1, deck2
Show stats for 10 best Sessions
Show stats for 10 oldest Sessions
Show stats for best scores for Decks: deck1
Show stats for average time spent on Decks: deck2
Start Session from Decks: deck1, deck2
Start Session from Tags: hard, language
Start Session from random cards from Decks: deck1, deck2
```

### EBNF

```
COMMANDS ::= ((SHOW | START_SESSION) SUBJECT) | HELP | LIST

SHOW ::= "Show stats for" (“the” INT)? (STAT_TO_SHOW | SELECTED_CARDS)
STAT_TO_SHOW ::= STAT STAT_ITEM
STAT ::= "minimum" | "maximum" | "average"
STAT_ITEM ::= "time spent on" | "scores for"
SELECTED_CARDS::= CARD_FILTER "cards from"
CARD_FILTER ::= "best" |  "worst" | "random" | "oldest" | "newest"

START_SESSION ::= "Start Session from" (“the” INT)? SELECTED_CARDS?

SUBJECT ::= (“Decks: ” DECKS) | (“Tags: ” TAGS) | “Sessions”
DECKS ::= DECK (“, ” DECK)*
DECK ::= [^,]+
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+

HELP ::= “Help”

LIST ::= “List: “ (“Tags” | “Decks”)
```

## Misc

#### What the user sees upon initial load:

```
To create the deck:

Create Deck [enter a deck name]:
add Tags: [enter one or more tags]
add Color: [enter one of ‘red’ or ‘blue’ or ‘green’ or ‘purple’]
add Alignment: [enter one of ‘center’ or ‘right’, or ‘left’]
add Direction: [enter one of ‘horizontal’ or ‘vertical’]
(1) [enter front of card] : [enter back of card]
(1) [enter front of card] : [enter back of card]

Where add Tags, add Color, add Alignment, and add Direction are optional.

# enter “help” command to view available commands
```

#### Help message

```
To start a session from decks:
Start Session from [choose ‘random card’, ect ] from Decks: [choose 1 or more deck names]

To start a session from tags:
Start Session from [choose ‘random card’, ect ] from Tags: [choose 1 or more tag names]

To show stats:
Show stats for [choose one or more ‘best scores for’, ‘average time spent on’, ‘worst scores for’] Decks: [choose 1 or more deck names]
```
