import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/mode/xml/xml';
import { UnControlled as CodeMirror } from 'react-codemirror2'

export default function CardEditor() {

    return (
        <>
            <div className="card-editor">
                <CodeMirror
                    value='Create Deck French With tags'
                    options={{
                        mode: 'xml',
                        theme: 'lucario',
                        lineNumbers: true,
                    }}
                    onChange={(editor, data, value) => {
                    }}
                    className="card-editor-codemirror"
                />
            </div>
        </>
    )
}