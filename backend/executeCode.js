const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeCode = async (filePath, inputPath, language) => {
  return new Promise((resolve, reject) => {
    const outputPath = filePath.replace(/\.(cpp|c|py)$/, "");
    let command;

    if (language === "cpp") {
      command = `g++ "${filePath}" -o "${outputPath}" && "${outputPath}" < "${inputPath}"`;
    } else if (language === "c") {
      command = `gcc "${filePath}" -o "${outputPath}" && "${outputPath}" < "${inputPath}"`;
    } else if (language === "python") {
      command = `python "${filePath}" < "${inputPath}"`;
    } else {
      return reject(new Error("Unsupported language: " + language));
    }

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      // Clean up temp files
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (language !== "python" && fs.existsSync(outputPath))
          fs.unlinkSync(outputPath);
        if (language !== "python" && fs.existsSync(outputPath + ".exe"))
          fs.unlinkSync(outputPath + ".exe");
      } catch (_) {}

      if (stderr && !stdout) return reject(new Error(stderr));
      if (error && !stdout) return reject(new Error(stderr || error.message));
      resolve(stdout);
    });
  });
};

module.exports = { executeCode };
