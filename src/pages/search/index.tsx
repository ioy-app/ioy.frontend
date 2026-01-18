import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom"
import Filter from "./filters";

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { t } = useTranslation();

    document.title = t("search.title");

    return (
        <div className="p-4 flex flex-col gap-4 w-full">
            <Filter />
            <p className="text-xl font-roboto font-light">{t("search.labels.result")} «{searchParams.get("search")}≫</p>
            <div className="flex-1 w-full h-full flex justify-center items-center">
                <p className="text-2xl font-roboto font-extralight">{t("search.labels.noresult")}</p>
            </div>
        </div>
    );
}