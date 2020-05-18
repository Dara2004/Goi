# Goi

## Deck Creation DSL
### Example
```
Create Deck French with Tags language, hard, midterm using Style mystyle:  
(1) Front:Back
(2) Front:Back
(3) Front:Back

Create Style mystyle:
Color = Red
Direction = Horizontal
Align = Center
```

### EBNF
```
CREATE_DECK ::= “Create Deck” NAME (“with Tags“ TAGS | “using Style” STYLE)*”:” DECK
DECK ::= CARD+
CARD ::= “(”NUMBER”) ” STRING “:” STRING
TAGS ::= STRING”,”? TAGS

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
COMMANDS ::= (ACTION SELECTOR? SUBJECT LIMIT? | HELP | (LIST LIMIT?)
ACTION ::= “Show” | “Start Session from”

SELECTOR ::= (STAT “time spent on”) | 
             (BEST_WORST “scores for”) | 
             (BEST_WORST | “random” “cards from ”) | 
             OLDEST_NEWEST
STAT ::= “minimum” | “maximum” | “average” 
OLDEST_NEWEST::= “oldest” | “newest”
BEST_WORST ::= “best” | “worst”

SUBJECT ::= (“Decks: ” DECKS) | (“Tags: ” TAGS) | “Sessions”
LIMIT ::=  “(limit: “ + INT +”)”
HELP ::= “Help”
LIST ::= “List: “ (“Tags” | “Decks”)

DECKS ::= DECK (“, ” DECK)*
DECK ::= [^,]+
TAGS ::= TAG (“, ” TAG)*
TAG ::= [^,]+


```
