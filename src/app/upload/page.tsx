"use client";
import { useUpload } from "@/_hooks/useUpload";
import { UploadProps } from "@/_interfaces/upload-media-props";
// import useUpload from "@/_hooks/useUpload";
import { useState } from "react";

// !TODO: move props into a separate file

const uploadPage = () => {
  const { isLoading, error, upload } = useUpload();
  const [formData, setFormData] = useState<UploadProps>({
    title: "",
    description: "",
    tags: [],
    file: null,
  });

  const [tagInputvalue, setTagInputValue] = useState<string>("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Addign tag:", tagInputvalue);
    if (tagInputvalue.length > 0 && !formData.tags.includes(tagInputvalue)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInputvalue] });
      setTagInputValue("");
    }
  };

  const handleRemoveTag = (tag: string) => {};

  // const { upload, isLoading, error } = useUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending data", formData);
    upload(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div>
          {formData.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <input
            type="text"
            placeholder="Tags"
            onChange={(e) => setTagInputValue(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && handleAddTag(e);
            }}
          />
        </div>

        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files?.[0] })
          }
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
export default uploadPage;
