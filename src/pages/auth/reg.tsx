import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "@/icons";
import { FormProvider, useForm } from "react-hook-form";

import confPackage from "@/../package.json";

import { Input, Button, Checkbox } from "@/components";
import { auth_reg } from "@/api/routes/auth";
import { useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";
import { paths } from "@/routes";

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
            methods.clearErrors();
            await auth_reg(data);
            notify(t("auth.reg"), "success");
            onClose && onClose();
        }
        catch(err) {
            methods.setError("valid", {
                type: "valid",
                message: err?.message?.toString()
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
                    onLocalChange={() => {
                        methods.clearErrors();
                    }}
                />
                <Input
                    label={t("auth.labels.email")}
                    name="email"
                    placeholder={t("auth.placeholders.email")}
                    type="email"
                    {...methods.register("email")}
                    onLocalChange={() => {
                        methods.clearErrors();
                    }}
                />
                <div className="w-full flex justify-center">
                    <Checkbox
                        name="rules"
                        placeholder={(
                            <div className="flex flex-row gap-1 items-center">
                                {t("auth.placeholders.rules")}
                                <a href={paths.terms} target="_blank">
                                    <Button variant="text" className="text-primary">
                                        {t("footer.terms")}
                                    </Button>
                                </a>
                            </div>
                        )}
                        {...methods.register("rule")}
                    />
                </div>
                {methods.formState.errors.valid && (
                    <p className="text-placeholder text-danger">
                        {t(`auth.${methods.formState.errors.valid.message}`)}
                    </p>
                )}
                <Button
                    variant="primary"
                    htmlType="submit"
                    disabled={methods.formState.errors.valid}
                >
                    {t("buttons.create")}
                </Button>
            </form>
        </FormProvider>
    )
}