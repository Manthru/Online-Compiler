const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/execute', (req, res) => {
  const { code, language } = req.body;
  const tempFilePath = path.join(__dirname, 'tempCode');

  let command;
  switch (language) {
    case 'python':
      command = `python -c "${code.replace(/"/g, '\\"').replace(/\n/g, ';')}"`;
      break;
    case 'javascript':
      command = `node -e "${code.replace(/"/g, '\\"').replace(/\n/g, ';')}"`;
      break;
    case 'java':
      fs.writeFileSync(`${tempFilePath}.java`, code);
      command = `javac ${tempFilePath}.java && java -cp ${__dirname} tempCode`;
      break;
    case 'cpp':
      fs.writeFileSync(`${tempFilePath}.cpp`, code);
      command = `g++ ${tempFilePath}.cpp -o ${tempFilePath} && ${tempFilePath}`;
      break;
    default:
      return res.status(400).send('Language not supported');
  }

  exec(command, (error, stdout, stderr) => {
    // Clean up temporary files
    if (language === 'java') {
      fs.unlinkSync(`${tempFilePath}.java`);
      if (fs.existsSync(`${tempFilePath}.class`)) {
        fs.unlinkSync(`${tempFilePath}.class`);
      }
    } else if (language === 'cpp') {
      fs.unlinkSync(`${tempFilePath}.cpp`);
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  
    if (error) {
      return res.status(400).send(stderr || 'Execution error');
    }
    res.send(stdout || stderr);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
