import { v4 as uuidv4 } from "uuid";

import { UnityHubError } from "@/lib/utils";
import { appwriteConfig, storage } from "@/lib/AppWirte/config";

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

export function getFilePreview(fileId: string, isAvatar = false) {
  let fileUrl;
  if (isAvatar) {
    fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      500,
      500,
      "center"
    );
  } else {
    fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId);
  }
  if (!fileUrl)
    throw new UnityHubError("خطا در دریافت تصویر", "لطفاً دوباره امتحان کنید.");

  return fileUrl;
}

export function getFileView(fileId: string) {
  const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);

  if (!fileUrl)
    throw new UnityHubError("خطا در دریافت ویدیو", "لطفاً دوباره امتحان کنید.");

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
