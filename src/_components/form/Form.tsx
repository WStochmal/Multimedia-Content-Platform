import { Input } from "@/_ui/input/Input";
import style from "./Form.module.css";
import { Textarea } from "@/_ui/textarea/Textarea";
import { Icon } from "@/_assets/icons/Icon";
export const Form = ({
  formData,
  index,
  onFormChange,
  onRemoveTag,
  onAddTag,
  onRemoveInstance,
}) => {
  return (
    <div className={style.formInstance}>
      <div className={style.formInstanceHeader}>
        <h2>Image {index + 1}</h2>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemoveInstance(index);
            }}
          >
            Remove
          </button>
        </div>
      </div>
      <div className={style.formData}>
        <div className={style.formRow}>
          <label htmlFor="Title">Image title</label>

          <Input
            type="text"
            placeholder="Title"
            onChange={(e) => onFormChange(index, "title", e.target.value)}
            icon="title"
          />
        </div>
        <div className={style.formRow}>
          <label htmlFor="Description">Image description</label>
          <Textarea
            type="text"
            placeholder="Description"
            onChange={(e) => onFormChange(index, "description", e.target.value)}
            icon="description"
          />
        </div>
        <div className={style.formRow}>
          <label htmlFor="Tags">Image tags</label>

          <Input
            type="text"
            placeholder="Tags"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddTag(index, e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            icon="tag"
          />
          {formData.tags?.length !== 0 && (
            <div className={style.formTagContainer}>
              {formData.tags?.map((tag) => (
                <span key={tag} className={style.formTag}>
                  #{tag}
                  {/* <button onClick={() => onRemoveTag(tag)}>x</button> */}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={style.imagePreview}>
        <input
          type="file"
          className={style.fileInput}
          onChange={(e) => onFormChange(index, "file", e.target.files?.[0])}
        />
        {formData.file && (
          <img src={URL.createObjectURL(formData.file)} alt="preview" />
        )}
        {!formData.file && (
          <div className={style.imagePreviewText}>
            <Icon type={"add-image"} height={18} width={18} color="#ccc" />
            <p>Add image</p>
          </div>
        )}
      </div>
    </div>
  );
};
