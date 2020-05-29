# Goi

## Deck Creation DSL

## Note: the Tokenizer used in this project has been adapted from the in-class example

### Example

```
Create Deck Practice Final:
add tags: example, tag2, tag3
add color: red
add alignment: center
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
MODIFIER ::= "tags: " TAGS | "color: " COLOR | "alignment: " ALIGNMENT | "direction: " DIRECTION
ALIGNMENT ::= “center” | “right” | “left”
COLOR ::= ‘red’ | ‘blue’ | ‘green’ | ‘purple’ | ‘yellow’ | ‘grey’ | ‘brown’
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
Show stats for 5 best cards from Decks: deck1, deck2
Show stats for 2 best Decks: deck1, deck2, deck3 (Although weird syntax, would just show stats for the 2 best decks out of the 3)
Show stats for random Decks: deck1, deck2, deck3, deck4, deck5, deck6 (We can have a default number of 5)
Show stats for cards from Decks: deck1
Show stats for Past Sessions (Default number of 5)
Show stats for 5 oldest Past Sessions
Start Session from Decks: deck1, deck2
Start Session from 5 worst Decks: deck1, deck2, deck3, deck4, deck5, deck6 (Start session from all cards from 5 of the listed decks)
Start Session from 10 worst cards from Decks: deck1, deck2 (Start session with 10 worst cards from the listed decks)
```

### EBNF

```
COMMAND ::=  COMPLEX_COMMAND | HELP | LIST | EXPORT_DECKS | LOAD_DECKS

COMPLEX_COMMAND ::= SUBJECT_MODIFIER SUBJECT
SUBJECT_MODIFIER ::= (SHOW | START_SESSION) INT? FILTER? SELECTED_CARDS?
SUBJECT ::= (“Decks: ” DECKS) | (“Tags: ” TAGS) | “Past Sessions”

SHOW ::= "Show stats for"
START_SESSION ::= "Start Session from"

SELECTED_CARDS::= "cards from"
FILTER ::= "best" |  "worst" | "random" | "oldest" | "newest"


DECKS ::= DECK (“, ” DECK)*
DECK ::= [^,]+
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+

HELP ::= “Help”
LIST ::= “List“ (“tags” | “decks”)
EXPORT_DECKS ::= "Export decks"
LOAD_DECKS ::= "Load decks"
QUIT_TO_HOME ::= ("Quit" | "Back to home")
```

## Misc

#### What the user sees upon initial load:

```
To create the deck:

Create Deck [enter a deck name]:
add tags: [enter one or more tags]
add color: [enter one of ‘red’ or ‘blue’ or ‘green’ or ‘purple’]
add alignment: [enter one of ‘center’ or ‘right’, or ‘left’]
add direction: [enter one of ‘horizontal’ or ‘vertical’]
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

To download your decks:
Enter 'export decks'

To load decks from your computer:
Enter 'load decks'

To go back to Home:
Enter 'quit' or 'back to home'

```
