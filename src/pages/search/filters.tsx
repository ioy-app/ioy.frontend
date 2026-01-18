import { Button, Checkbox, Input } from "@/components";
import { useTranslation } from "react-i18next";
import { BiSearch } from "react-icons/bi";

const Filter: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <form className="p-4 border border-gray-200 rounded-xl flex flex-col gap-4">
            <div className="flex gap-4">
                <Input
                    placeholder={t("search.placeholders.search")}
                    type="search"
                />
                <Button type="second">
                    <BiSearch />
                </Button>
            </div>
            <div className="flex gap-4 flex-wrap">
                <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl">
                    <p className="text-lg font-roboto font-thin">{t("search.labels.type")}</p>
                    <Checkbox
                        placeholder={t("search.placeholders.games")}
                    />
                    <Checkbox
                        placeholder={t("search.placeholders.users")}
                    />
                    <Checkbox
                        placeholder={t("search.placeholders.jams")}
                    />
                </div>
                <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl">
                    <p className="text-lg font-roboto font-thin">{t("search.labels.search")}</p>
                    <Checkbox
                        placeholder={t("search.placeholders.tags")}
                    />
                    <Checkbox
                        placeholder={t("search.placeholders.title")}
                    />
                    <Checkbox
                        placeholder={t("search.placeholders.description")}
                    />
                </div>
            </div>
        </form>
    );
}

export default Filter;