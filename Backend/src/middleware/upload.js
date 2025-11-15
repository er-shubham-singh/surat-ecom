import multer from 'multer'

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { files: 4, fileSize: 5 * 1024 * 1024 } // 5 MB per file
});

export default upload