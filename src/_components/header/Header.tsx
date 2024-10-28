"use client";
import { useAuthContext } from "@/_hooks/useAuthContext";
import style from "./Header.module.css";
export const Header = () => {
  const { state } = useAuthContext();
  return (
    <header className={style.header}>
      <div className={style.header_logo}></div>

      <div className={style.header_aside}>
        {/* // !TODO create a ui button component */}
        <button>Upload Image</button>
        <div className={style.header_user}>
          {(state?.user && (
            <div className={style.header_user_avatar}>
              <img
                src={`http://localhost:3000/avatar/${state.user.avatar}`}
                alt={state.user.email}
              />
            </div>
          )) || <div>Sign in</div>}
        </div>
      </div>
    </header>
  );
};
