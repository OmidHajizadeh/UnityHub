import { v4 as uuidv4 } from "uuid";

import { appwriteConfig, storage } from "@/lib/AppWirte/config";
import { UnityHubError } from "@/lib/utils";

export async function uploadFile(file: File) {
  const uniqueId = uuidv4();
  const uploadedFile = await storage.createFile(
    appwriteConfig.storageId,
    uniqueId,
    file
  );

  if (!uploadedFile)
    throw new UnityHubError("خطا در آپلود تصویر", "لطفاً دوباره امتحان کنید.");

  return uploadedFile;
}

export function getFilePreview(fileId: string) {
  const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId);

  if (!fileUrl)
    throw new UnityHubError("خطا در دریافت تصویر", "لطفاً دوباره امتحان کنید.");

  return fileUrl;
}

export async function deleteFile(fileId: string) {
  const deletedFile = await storage.deleteFile(
    appwriteConfig.storageId,
    fileId
  );

  if (!deletedFile)
    throw new UnityHubError("خطای سرور", "لطفاً دوباره امتحان کنید.");

  return { status: "ok" };
}
