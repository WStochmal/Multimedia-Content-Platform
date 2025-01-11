"use client";
import { Form } from "@/_components/form/Form";
import { useUpload } from "@/_hooks/useUpload";
import { UploadProps } from "@/_interfaces/upload-media-props";
// import useUpload from "@/_hooks/useUpload";
import { useState } from "react";
import style from "../../_styles/modules/FormPage.module.css";
import { Icon } from "@/_assets/icons/Icon";

// !TODO: move props into a separate file

const uploadPage = () => {
  const { isLoading, error, upload } = useUpload();
  const [formsData, setFormsData] = useState<UploadProps[]>([
    {
      title: "",
      description: "",
      tags: [],
      file: null,
    },
  ]);

  const [tagInputvalue, setTagInputValue] = useState<string>("");

  // Handing adding new image instance
  const handleAddNewInstance = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormsData([
      ...formsData,
      {
        title: "",
        description: "",
        tags: [],
        file: null,
      },
    ]);
  };

  const handleRemoveTag = (tag: string) => {};

  // Handle form change
  const handleFormChange = (
    index: number,
    field: keyof UploadProps,
    value: string
  ) => {
    const updatedForms = [...formsData];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setFormsData(updatedForms);
  };

  // Handle adding new tag
  const handleAddingTags = (index: number, tag: string) => {
    const updatedForms = [...formsData];
    if (tag.length > 0 && !updatedForms[index].tags.includes(tag)) {
      updatedForms[index].tags = [
        ...updatedForms[index].tags,
        tag.toLocaleLowerCase(),
      ];
      setFormsData(updatedForms);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sending data", formsData);
    upload(formsData);
    alert("Media has been uploaded");
  };

  const handleRemoveInstance = (index: number) => {
    console.log("Removing instance", index);
    const updatedForms = [...formsData];
    updatedForms.splice(index, 1);
    setFormsData(updatedForms);
  };

  return (
    <div className="content">
      <form onSubmit={handleSubmit}>
        <div className={style.formHeader}>
          <div className={style.formHeaderPart}>
            <h2>Form</h2>
          </div>
          <div className={style.formHeaderPart}>
            {" "}
            <button onClick={handleAddNewInstance} className="commonBtn">
              <Icon type={"add-image"} height={18} width={18} color="#fff" />
              <a>New Image</a>
            </button>
            <button type="submit" className="commonBtn">
              <Icon type={"upload"} height={18} width={18} color="#fff" />
              <a>Upload Content</a>
            </button>
          </div>
        </div>
        <div className={style.formsContainer}>
          {formsData.map((data, index) => (
            <Form
              key={index}
              formData={data}
              index={index}
              onFormChange={handleFormChange}
              onRemoveTag={handleRemoveTag}
              onAddTag={handleAddingTags}
              onRemoveInstance={handleRemoveInstance}
            />
          ))}
        </div>

        {/* <div>
          {formData.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          
        </div>

        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files?.[0] })
          }
        /> */}
      </form>
    </div>
  );
};
export default uploadPage;
