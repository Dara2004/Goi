import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";

type Props = { onChange };

export default function CommandEditor(props: Props) {
  return (
    <>
      <div className="command-editor">
        <CodeMirror
          value={"> "}
          options={{
            mode: "xml",
            theme: "yonce",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            // console.log("onChange");
            if (!value.startsWith("> ")) {
              editor.getDoc().setValue("> ");
              editor.getDoc().setCursor(2);
            }
            if (value.includes("\n")) {
              props.onChange(value.trim());
              editor.getDoc().setValue("> ");
              editor.getDoc().setCursor(2);
            }
          }}
        />
      </div>
    </>
  );
}
