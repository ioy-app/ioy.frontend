import { Button, Input } from "@/components";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Email: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();

    const submit = (fd: FormData) => {
        
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col gap-4 flex-1 h-full justify-between"
        >
            <div className="flex flex-col gap-4">
                <p>{t("profile.titles.email")}</p>
                <Input
                    placeholder="Введите почту..."
                    label="Текущая почта"
                    {...register("email.current")}
                />
                <Input
                    placeholder="Введите почту..."
                    label="Новая почта"
                    {...register("email.new")}
                />
            </div>
            <div className="flex w-full items-center justify-end">
                <Button
                    type="second"
                >
                    {t("buttons.edit")}
                </Button>
            </div>
        </form>
    );
}

export default Email;