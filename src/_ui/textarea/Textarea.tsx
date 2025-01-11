import { InputProps } from "@/_interfaces/input-props";
import style from "./Textarea.module.css";
import { Icon } from "@/_assets/icons/Icon";
export const Textarea = ({
  type,
  placeholder,
  onChange,
  icon,
  ...props
}: InputProps) => {
  return (
    <span className={style.textarea_container}>
      {icon && <Icon type={icon} height={18} width={18} color="#ccc" />}
      <textarea
        className={style.textarea}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
        rows={2}
      />
    </span>
  );
};
