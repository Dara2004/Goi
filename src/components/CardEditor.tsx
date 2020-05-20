import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/lucario.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";

type Props = { onChange };
export default function CardEditor(props: Props) {
  return (
    <>
      <div className="card-editor">
        <CodeMirror
          value={`Create Deck French with Tags language using style mystyle
(1) Hello : Bonjour
(2) Bye : Au revoir

Create Deck Japanese with Tags language
(1) Hello : Konnichiwa
(2) Goodbye : Sayoonara

Create Style mystyle:
Color = Red
Direction = Horizontal
Align = Center

`}
          options={{
            mode: "xml",
            theme: "lucario",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            props.onChange(value); //trigger handleChange in parent component with the value user type in
          }}
          className="card-editor-codemirror"
        />
      </div>
    </>
  );
}
