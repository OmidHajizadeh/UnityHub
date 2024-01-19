import { useCallback, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../ui/button";
import UnityHubVideoPlayer from "./UnityHubVideoPlayer";
import { useToast } from "../ui/use-toast";

const MAXED_ALLOWED_FILE_SIZE = 10000000; // 10MB

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
  mediaType: "video" | "image" | undefined;
  videoErrorHandling: any;
  updateMode: boolean;
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
  mediaType: media,
  videoErrorHandling,
  updateMode,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [mediaType, setMediaType] = useState(media);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const error = fileRejections[0].errors.at(-1);
        return toast({
          title: error?.code,
          description: error?.message,
          variant: "destructive",
        });
      }

      setFiles(acceptedFiles);
      setMediaType(
        acceptedFiles[0].type.startsWith("video") ? "video" : "image"
      );
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [files]
  );

  const validateInput = useCallback((file: File) => {
    if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
      return {
        code: "خطا در بارگزاری مدیا",
        message: "فقط از یکی از فرمت های تعیین شده میتوانید فایل آپلود کنید.",
      };
    }
    if (file.size > MAXED_ALLOWED_FILE_SIZE) {
      return {
        code: "خطا در بارگزاری مدیا",
        message: `حجم فایل نمیتواند بیشت از ${
          20000000 / 1000000
        } مگابایت باشد.`,
      };
    }
    return null;
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: MAXED_ALLOWED_FILE_SIZE,
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".flv", ".mov", ".avi", ".mpeg"],
    },
    validator: validateInput,
    disabled: updateMode,
  });

  return (
    <div className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5">
            {mediaType === "video" ? (
              <UnityHubVideoPlayer
                isFromForm
                videoErrorHandling={videoErrorHandling}
                videoUrl={fileUrl}
              />
            ) : (
              <div {...getRootProps()}>
                <img
                  src={fileUrl}
                  alt="پست جدید"
                  className="file_uploader-img"
                />
              </div>
            )}
          </div>
          <p className="file_uploader-label" {...getRootProps()}>
            {updateMode
              ? "نمیتوانید مدیا را ویرایش کنید"
              : mediaType === "video"
              ? "برای تغییر، یک مدیا جدید را روی این متن درگ کنید یا روی همین متن کلیک کنید"
              : "برای تغییر، یک مدیا جدید را روی این جعبه درگ کنید یا روی همین مدیا کلیک کنید"}
          </p>
        </>
      ) : (
        <div className="file_uploader-box gap-4" {...getRootProps()}>
          <img
            src="/icons/file-upload.svg"
            alt="file upload"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2">
            مدیا خود را اینجا رها کنید
          </h3>
          <div className="flex flex-col items-center">
            <p className="text-light-4 small-regular">PNG | JPG | JPEG</p>
            <p className="text-light-4 small-regular">
              MP4 | MPEG | FLV | MOV | AVI
            </p>
          </div>
          <Button type="button" className="shad-button_dark_4">
            یا اینجا از دستگاه خود انتخاب کنید
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
