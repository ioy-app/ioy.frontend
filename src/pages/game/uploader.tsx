import JSZip from "jszip";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Empty } from "@/icons";
import { BiFile, BiFileBlank } from "react-icons/bi";

/**
 * Example description for the Component
 * @example
 * return <Uploader />
*/
const Uploader: React.FC<{
  disabled?: boolean;
  onChange: (files: File[], total_size: number) => void;
}> = ({
  disabled,
  onChange
}) => {
  const { t } = useTranslation();
  const [ files, setFiles ] = useState<File[]>([]);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    const filteredFiles = files?.filter(file => {
      return !file.webkitRelativePath.split('/').some(part => part.startsWith('.'));
    });

    setFiles(filteredFiles);
    onChange && onChange(
      filteredFiles,
      filteredFiles?.reduce((a, b) => a + b.size, 0) / 1024 / 1024
    );
  }

  const totalSize = useMemo(() => {
    return files?.reduce((a, b) => a + b.size, 0) / 1024 / 1024;
  }, [ files ]);

  return (
    <div className="flex w-full justify-center flex-col gap-4">
      <label className="w-full flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer">
        <div className="flex flex-col text-center">
          <p className="text-placeholder">
            {t("games.labels.game")}
          </p>
          <p className="text-placeholder text-text/50">
            {t("games.labels.game_limit")}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleUpload}
          disabled={disabled}
        />
      </label>
      <div className="border border-br rounded-2xl flex flex-col gap-4 w-full p-4">
        {!files?.length && (
          <img src={Empty} className="h-42" />
        )}
        {files?.map(file => (
          <div className="flex w-full justify-between gap-4 items-center text-xl text-default">
            <div className="flex items-center gap-1">
              <BiFileBlank />
              <p>{file?.webkitRelativePath?.split("/").slice(1)?.join("/")}</p>
            </div>
            <p>{(file?.size / 1024 / 1024).toFixed(2)}MB</p>
          </div>
        ))}
      </div>
      {files?.length > 0 && (
        <div className="flex justify-end items-center">
          <p className={`text-default ${totalSize > 32 && "text-danger" || "text-text"}`}>{t("games.labels.total_size")} {(totalSize).toFixed(2)}MB / 32MB</p>
        </div>
      )}
    </div>
  );
}

export default Uploader;