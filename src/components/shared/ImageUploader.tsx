import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../ui/button";

type ImageUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const ImageUploader = ({ fieldChange, mediaUrl }: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">
            برای تغییر، یک عکس جدید را درگ کنید یا روی همین عکس کلیک کنید
          </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/icons/file-upload.svg"
            alt="file upload"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            عکس خود را اینجا رها کنید
          </h3>
          <p className="text-light-4 small-regular mb-6">PNG, JPG, JPEG</p>
          <Button type="button" className="shad-button_dark_4">
            یا اینجا از دستگاه خود انتخاب کنید
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
