export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
}
