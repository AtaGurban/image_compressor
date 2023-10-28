const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const sizeOf = require("image-size")
async function imgCompressor(imagePath, fileName, width = null, height = null, quality = 10,){
  if (!width || !height){
    await sharp(imagePath)
    .composite([
      {
        input: path.resolve(__dirname, "assets", "small.png"),
        gravity: "center",
      },
    ])
    .webp({ quality })
    .toFile(path.resolve(__dirname, "comressedImgs", `${fileName.split(".")[0]}.webp`) , function (err) {
      if (!err) {
        console.log(`${fileName} compressed`);
      } else console.log(err, fileName);
    });
  } else {
    await sharp(imagePath)
    .resize(width, height)
    .composite([
      {
        input: path.resolve(__dirname, "assets", "med.png"),
        gravity: "center",
      },
    ])
    .webp({ quality })
    .toFile(path.resolve(__dirname, "comressedImgs", `${fileName.split(".")[0]}.webp`) , function (err) {
      if (!err) {
        console.log(`${fileName} compressed`);
      } else console.log(err);
    });
  }
}

function processFilesInFolder(folderPath) {
  // Чтение содержимого папки
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', err);
      return;
    }

    // Обработка каждого файла
    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      // Проверка, является ли элемент файлом
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Ошибка при получении информации о файле:', err);
          return;
        }

        if (stats.isFile()) {
          // Если это файл, передаем его в imgCompressor
          const {width, height} = sizeOf(filePath);
          const newWidth = 1200
          imgCompressor(filePath, file, newWidth, Math.round((newWidth / width) * height));
        } else if (stats.isDirectory()) {
          // Если это папка, рекурсивно вызываем эту же функцию для обработки файлов внутри папки
          processFilesInFolder(filePath);
        }
      });
    });
  });
}

const folderPath = path.resolve(__dirname, "university");
processFilesInFolder(folderPath);