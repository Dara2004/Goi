import React from "react";
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
          value=">"
          options={{
            mode: "xml",
            theme: "yonce",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            props.onChange(value); //trigger handleChange in parent component with the value user type in
          }}
        />
      </div>
    </>
  );
}
