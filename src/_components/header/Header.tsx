"use client";
import { useAuthContext } from "@/_hooks/useAuthContext";
import style from "./Header.module.css";
export const Header = () => {
  const { state } = useAuthContext();
  return (
    <header className={style.header}>
      <div className={style.header_logo}></div>

      {state?.user && (
        <div className={style.header_user}>
          <div className={style.header_user_name}>
            {state.user?.name || state.user.email}
          </div>
          <div className={style.header_user_avatar}>
            <img
              src={`http://localhost:3000/avatar/${state.user.avatar}`}
              alt={state.user.email}
            />
          </div>
        </div>
      )}
    </header>
  );
};
