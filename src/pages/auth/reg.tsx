import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "@/icons";
import { FormProvider, useForm } from "react-hook-form";

import confPackage from "@/../package.json";

import { Input, Button, Checkbox } from "@/components";
import { auth_reg } from "@/api/routes/auth";
import { useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";

export default function Reg({
    onClose
}: {
    onClose?: () => void;
}) {
    const methods = useForm();
    const { notify } = useNotify();
    const { t } = useTranslation();

    const submit = async (data) => {
        try {
            methods.clearErrors("valid");
            await auth_reg(data);
            notify(t("auth.reg"), "success");
            onClose && onClose();
        }
        catch(err) {
            methods.setError("valid", {
                type: "valid",
                message: err.toString()
            });
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col gap-4 items-end w-full"
                onSubmit={methods.handleSubmit(submit)}
            >
                <div className="flex flex-col gap-2 items-center w-full">
                    <img src={Icons.Logo} className="w-25" />
                    <p className="text-default">{t("auth.title.reg")}</p>
                </div>
                <Input
                    label={t("auth.labels.login")}
                    name="login"
                    placeholder={t("auth.placeholders.login")}
                    type="text"
                    {...methods.register("login")}
                />
                <Input
                    label={t("auth.labels.email")}
                    name="email"
                    placeholder={t("auth.placeholders.email")}
                    type="email"
                    {...methods.register("email")}
                />
                <div className="w-full">
                    <Checkbox
                        name="rules"
                        placeholder="Я ознакомился(-ась) и согласен(-а) с правилами сайта!"
                        {...methods.register("rule")}
                    />
                </div>
                {methods.formState.errors.valid && <p className="auth_form__actions_message">{methods.formState.errors.valid.message} </p>}
                <Button
                    variant="primary"
                    htmlType="submit"
                >
                    {t("buttons.ok")}
                </Button>
            </form>
        </FormProvider>
    )
}