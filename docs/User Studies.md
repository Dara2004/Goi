# User Study

## Version 1 - May 19, 2020

#### Notes

- Remember to write down everything the user says (ideally record the session and then note down the important points)
- Try not to give any hints about the DSL language
- Tell the user to think aloud!

#### Procedure

##### 1. Tell users the general gist of the language: That it’s to create decks of flash cards and that to do so, a user can specify their Decks, Session, Card, Card styling, etc. As we are testing non-programmers, let them know that they will be expected to type out what they want the to do, and that a program will take in their input and spit out a bunch of cards that looks kind of like (https://www.figma.com/file/rwtCawM0rIYo4kFMUei8P5/Flashcard-Maker?node-id=0%3A1)

##### 2. Give the user the examples below and explain that there are two different windows for input: one window for inputting ‘creation’ code, and other window for ‘command’ code (explain what this means using the examples below)

##### 3. Ask them to complete the following tasks (one after another)

- Create a deck of 5 flashcards called “practice final” with a green font, and tag it as “hard” and “not fun”
- Start a session with the newly created deck
- Imagine there is another deck called “practice midterm”. Start a session with 10 random cards from both the “practice midterm” and “practice finals” deck
- Imagine they have completed a bunch of sessions with the “practice finals” deck. Show the statistics for the 5 worst cards from the deck

##### 4. Ask them the following debrief questions

- What was the most confusing part of the exercise? Why? What would make it better?
- What was the most tedious part of the language? Did you find any part of the language too slow or repetitive?
- If the user only tried typing the language in one way, how else might they have typed it? For example, if they saw the example and typed `Create Deck French with Tags language, hard, midterm using Style mystyle`, would they have thought to type `Create Deck French using Style mystyle with Tags language, hard, midterm`?
- On a scale of 1-10, how intuitive was the language syntax?

##### Examples

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

Note:

- Style (optional): The Style will define how the card looks. Can define any property of Direction, Font, Align, Color/Colour
- Front: What is written on the front of the flash card
- Back: What is written on the back of the flash card

---

(Interactive Prompt)

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

---

## User Test 1 Conducted May 19, 2020 by May Kikuchi

Participant: friend of May's

### Notes from Tester

#### What they typed/answered:

Create a deck of 5 flashcards called “practice final” with a green font, and tag it as “hard” and “not fun”

```
Create Style mystyle:
Color = Green
Direction = Horizontal
Align = Center

Create Deck practice final with Tags hard, not fun using Style mystyle:
Front:Back
Front:Back
Front:Back
Front:Back
Front:Back
```

b) Start a session with the newly created deck

```
Start Session from Decks: practice final
```

c) Imagine there is another deck called “practice midterm”. Start a session with 10
random cards from both the “practice midterm” and “practice finals” deck

```
Start Session from random cards: practice final, practice midterm (Limit: 10)
```

d) Imagine you have completed a bunch of sessions with the “practice finals” deck. Show the statistics for the 5 worst cards from the deck

```
Show worst scores from Decks: practice final (Limit: 5)
```

Feedback + What they answered to the question prompts:

- User was not sure what `Show Sessions`… commands were for
  when creating the `Style`, user felt like they needed to include `Direction` and `Align` because 1) it was in the example and 2) they were not sure that the defaults would be, or if there were any default values

b) What was the most confusing part of the exercise? Why? What would make it better?

- worst scores and limit were not super straightforward
- suggestion from user: maybe add a note explaining what the ‘`Limit`’ is
- more interactive prompt examples might have been helpful, for example, using worst scores
- observation from May: maybe a list of possible inputs for the ‘variables’ would make the language intuitive for beginners

c) What was the most tedious part of the language? Did you find any part of the language too slow or repetitive?

- no, the language was pretty straightforward
  If the user only tried typing the language in one way, how else might they have typed it? For example, if they saw the example and typed `Create Deck French with Tags language, hard, midterm using Style mystyle`, would they have thought to type `Create Deck French using Style mystyle with Tags language, hard, midterm`?
- felt like `Style` should probably be created above deck creation - the user was not sure that the program would be able to understand if the `Style` name was called before it was created
- user was not sure about `Tag` vs `Style` order and whether swapping them would make a difference

d) On a scale of 1-10, how intuitive was the language syntax?

- 9 (yay :D )

---

## User Test 2 Conducted May 19, 2020 by Zhi Han Lim

Participant: friend of Zhi's

### Notes from Tester:

#### What they typed/answered:

a) Create a deck of 5 flashcards called “practice final” with a green font, and tag it as “hard” and “not fun”

```
Create Style mystyle:
Color = Green

Create Deck Practice Final with Tags "hard and not fun"
(1) Front:Back
(2) Front:Back
(3) Front:Back
(4) Front:Back
(5) Front:Back
```

b) Start a session with the newly created deck

```
Start Session from Decks: deck1
```

c) Imagine there is another deck called “practice midterm”. Start a session with 10
random cards from both the “practice midterm” and “practice finals” deck

```
Start session from 10 random cards from Decks: deckpracticefinal, deckpracticemidterm
```

d) Imagine you have completed a bunch of sessions with the “practice finals” deck. Show the statistics for the 5 worst cards from the deck

```
Show 5 worst cards from deckpracticefinal
```

Feedback + What they answered to the question prompts:

- Main confusion was due to how the examples were laid out and differentiating user inputted fields vs keywords. Suggested adding quotes or something to differentiate them.

Suggestion from Zhi:

```
Create Deck: Practice Final
add Tags: example
add Color: red
add Alignment: center
(1) Front : Back
```

- Thought that the examples for the interactive prompt were all the possible input options
- User suggests a more step by step explanation (like a tutorial/welcome message) to the syntax
- Confusion about defining the `style` separate from the `deck` - this concept is not familiar to non programmers
- Confusion about what `limit` is
- Better documentation will solve the majority of the issues

e) What was the most confusing part of the exercise? Why? What would make it better?

- The task (d). A better example/help section

f) What was the most tedious part of the language? Did you find any part of the language too slow or repetitive?

- Found the deck creation language should have better differentiation between user terms and keywords

g) On a scale of 1-10, how intuitive was the language syntax?

- 3 :(
