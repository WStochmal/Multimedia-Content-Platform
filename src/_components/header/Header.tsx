"use client";
import { useAuthContext } from "@/_hooks/useAuthContext";
import { useRouter } from "next/navigation";
import style from "./Header.module.css";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@/_assets/icons/Icon";
import { userAgent } from "next/server";

export const Header = () => {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const { dispatch } = useAuthContext();
  const { state } = useAuthContext();
  const router = useRouter();

  // Refs to track the context menu DOM element
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (state?.user) router.push("/upload");
    else router.push("/auth/sign-in");
  };

  const handleSignIn = () => {
    setIsContextMenuVisible(false);
    router.push("/auth/sign-in");
  };

  const handleContextMenuButtons = (type: string) => {
    setIsContextMenuVisible(false);

    switch (type) {
      case "favourites":
        router.push("/favourite");
        break;
      case "user-upload":
        router.push("/user-media");
        break;
      default:
        break;
    }
  };

  const handleContextMenuView = () => {
    setIsContextMenuVisible(!isContextMenuVisible);
  };

  // Close the context menu if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setIsContextMenuVisible(false);
      }
    };

    // Attach event listener when context menu is visible
    if (isContextMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isContextMenuVisible]);

  return (
    <header className={style.header}>
      <div className={style.header_logo} onClick={() => router.push("/")}>
        <img src="http://localhost:3000/logo/logo.png" alt="logo" />
      </div>

      <div className={style.header_aside}>
        {state?.user && (
          <button className="commonBtn" onClick={handleClick}>
            <Icon type={"upload"} height={18} width={18} color="#fff" />
            Upload Image
          </button>
        )}

        <div className={style.header_user}>
          {state?.user ? (
            <div
              className={style.header_user_avatar}
              onClick={handleContextMenuView}
            >
              <img
                src={`http://localhost:3000/avatar/${state.user.avatar}`}
                alt={state.user.email}
              />
            </div>
          ) : (
            <button className="inactive" onClick={handleSignIn}>
              Sign in
            </button>
          )}

          {isContextMenuVisible && (
            <div
              className={style.headerContextMenu}
              ref={contextMenuRef} // Ref to track the context menu element
            >
              <ul>
                <li>
                  <button
                    className="inactive"
                    onClick={() => handleContextMenuButtons("favourites")}
                  >
                    {/* <Icon type={"star"} height={18} width={18} color="#ccc" /> */}
                    Favourites
                  </button>
                </li>
                <li>
                  <button
                    className="inactive"
                    onClick={() => handleContextMenuButtons("user-upload")}
                  >
                    My upload
                  </button>
                </li>
                <li>
                  <button
                    className="inactive"
                    onClick={() => {
                      setIsContextMenuVisible(false);
                      router.push("/");
                      dispatch({ type: "LOGOUT" });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
