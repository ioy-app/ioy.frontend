import { auth_verify } from "@/api/routes/auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import ErrorPage from "./error";
import { Spin, Button } from "@/components";
import * as Icons from "@/icons";
import {
	NavLink,
	useAsyncError,
	useRouteError,
} from "react-router-dom";

/**
 * Verify account
 * @example
 * return <Verify />
*/
export default function Verify({}) {
  const { t } = useTranslation();
  const [ searchParam, setSearchParams ] = useSearchParams();
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)")
      .matches;
  const [darkMode, setDarkMode] = useState<
    "dark" | "light"
  >(
    (localStorage.getItem("theme") ||
      (prefersDarkMode && "dark")) as "dark" | "light",
  );

  document.title = t(`footer.terms`);
  if (darkMode == "dark")
    document.documentElement.classList.add("dark");

  const code = searchParam?.get("code");

  const query = useQuery({
    queryKey: [ "verify", code ],
    enabled: Boolean(code),
    retry: 0,
    queryFn: async () => {
      const response = await auth_verify(code);
      return response;
    }
  });

  if (query?.status == "error")
    return <ErrorPage msg={query?.error?.message} />

  return (
    <div className="flex flex-col gap-4 w-screen h-screen justify-center items-center text-default text-text p-4">
      <Spin loading={query?.status == "pending"}>
        <img src={Icons.Logo} className="h-25" />
        <p className="text-title">{t("auth.title.verify")}</p>
        <p className="text-default">
          {t("auth.verify_description")}
        </p>
        <NavLink to="/">
          <Button variant="primary">
            {t("buttons.main")}
          </Button>
        </NavLink>
      </Spin>
    </div>
  );
}