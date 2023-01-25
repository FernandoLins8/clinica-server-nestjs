import { randomUUID } from "crypto"
import { extname } from "path"

export function editFileName(req, file, callback) {
  const fileExtensionName = extname(file.originalname)
  const newFileName = `${randomUUID()}${fileExtensionName}`
  callback(null, newFileName);
}
