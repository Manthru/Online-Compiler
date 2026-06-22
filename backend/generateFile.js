const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "outputs");
if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });

const generateFile = async (language, code) => {
  const extensions = {
    cpp: "cpp",
    python: "py",
    c: "c",
  };
  const ext = extensions[language] || "cpp";
  const jobId = uuid();
  const filename = `${jobId}.${ext}`;
  const filePath = path.join(dirCodes, filename);
  await fs.promises.writeFile(filePath, code);
  return filePath;
};

module.exports = { generateFile };
