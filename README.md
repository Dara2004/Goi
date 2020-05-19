# Goi

## Deck Creation DSL
### Example
```
Create Style mystyle:
Color = Red
Direction = Horizontal
Align = Center

Create Deck French with Tags language, hard, midterm using Style mystyle:  
(1) Front:Back
(2) Front:Back
(3) Front:Back
```

### EBNF
```
PROGRAM ::= CREATE_STYLE* CREATE_DECK+

CREATE_DECK ::= “Create Deck” NAME MODIFIERS”:” DECK
MODIFIERS ::= (“with Tags” TAGS (“using Style” STYLE)?) | (“using Style” STYLE (“with Tags” TAGS)?)
DECK ::= CARD+
CARD ::= “(”NUMBER”) ” STRING “:” STRING
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+

CREATE_STYLE ::= “Create Style” NAME “:” STYLE
STYLE ::= ATTRIBUTE “=” STRING
ATTRIBUTE ::= “Direction” | “Font” | “Align” | “Color” | “Colour”

NAME ::= STRING
```

## Interactive Prompt DSL
### Examples
```
Show best scores for Decks: deck1, deck2 (Limit: 5)
Show Sessions (Limit: 10)
Show oldest Sessions (Limit: 10)
Show best scores for Decks: deck1
Show average time spent on Decks: deck2
Start Session from Decks: deck1, deck2
Start Session from Tags: hard, language
Start Session from random cards from Decks: deck1, deck2

```

### EBNF
```
COMMANDS ::= ((SHOW | START_SESSION) SUBJECT LIMIT?) | HELP | LIST
SHOW ::= "Show" (STAT_TO_SHOW | SELECTED_CARDS)
STAT_TO_SHOW ::= STAT STAT_ITEM
STAT ::= "minimum" | "maximum" | "average"
STAT_ITEM ::= "time spent on" | "scores for"
SELECTED_CARDS::= CARD_FILTER "cards from"
CARD_FILTER ::= "best" |  "worst" | "random" | "oldest" | "newest"
START_SESSION ::= "Start Session from"  SELECTED_CARDS?

SUBJECT ::= (“Decks: ” DECKS) | (“Tags: ” TAGS) | “Sessions”
LIMIT ::=  “(limit: “ + INT +”)”
HELP ::= “Help”
LIST ::= “List: “ (“Tags” | “Decks”)

DECKS ::= DECK (“, ” DECK)*
DECK ::= [^,]+
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+


```
