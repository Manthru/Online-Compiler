import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import './App.css'; 

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = async () => {
    setIsLoading(true);

    try {
      let response;
      if (language === 'javascript') {
        const worker = new Worker(`${process.env.PUBLIC_URL}/worker-javascript.js`);

        worker.postMessage(code);

        worker.onmessage = (event) => {
          if (event.data.error) {
            setOutput(`Error: ${event.data.error}`);
          } else {
            setOutput(event.data);
          }
          setIsLoading(false);
        };

        worker.onerror = (error) => {
          setOutput(`Worker error: ${error.message}`);
          setIsLoading(false);
        };
      } else {
        response = await fetch('http://localhost:5000/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setOutput(`Error: ${errorText}`);
        } else {
          const result = await response.text();
          setOutput(result);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setOutput(`Network error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(''); // Reset code when language changes
    setOutput(''); // Clear output when language changes
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <select className="language-select" onChange={handleLanguageChange} value={language}>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button className="run-button" onClick={executeCode} disabled={isLoading}>
          {isLoading ? 'Running...' : 'Run'}
        </button>
      </div>
      <AceEditor
        className="ace-editor"
        mode={language === 'java' ? 'java' : 'python'}
        theme="github"
        onChange={(newCode) => setCode(newCode)}
        value={code}
        name="code_editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="500px"
      />
      <div className="output-container">
        <h3>Output:</h3>
        <pre className="output">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
