import { InputProps } from "@/_interfaces/input-props";
import style from "./Input.module.css";
import { Icon } from "@/_assets/icons/Icon";
export const Input = ({
  type,
  placeholder,
  onChange,
  onKeyDown,
  icon,
  ...props
}: InputProps) => {
  return (
    <span className={style.input_container}>
      {icon && <Icon type={icon} height={18} width={18} color="#ccc" />}
      <input
        className={style.input}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...props}
      />
    </span>
  );
};
