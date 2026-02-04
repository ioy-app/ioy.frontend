import React, { useActionState, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Icons from "@/icons";

import { Input, Button, Code } from "@/components";
import { useDispatch } from "react-redux";
import { setLogin } from "@/stories/login";
import { auth_login } from "@/api/routes/auth";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { useNotify } from "@/hooks";

const Login: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { notify } = useNotify();
    const methods = useForm();
    const [ isCodeForm, setFormCode ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(false);

    const handleSubmit = async ({ email }: { email: string }) => {
        try {
            setLoading(true);

            const response = await auth_login({ email });
            if (!response.ok) {
                const json = await response.json();
                throw json?.msg;
            }
            
            setFormCode(true);
        }
        catch(err) { notify(`auth.${err?.message}`); }
        finally { setLoading(false); }
    }

    const handleVerify = async ({ login, ...props }: { login: string }) => {
        notify(t("auth.welcome", { login }), "success");
        dispatch(setLogin({
            ...props,
            login
        }));
        onClose();
    }
    
    if (isCodeForm)
        return (
            <Code
                onSubmit={handleVerify}
                onCancel={() => setFormCode(false)}
                className="auth_form"
            />
        );

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col gap-4 items-end w-full"
                onSubmit={methods.handleSubmit(handleSubmit)}
            >
                <div className="flex flex-col gap-2 items-center w-full">
                    <img src={Icons.Logo} className="w-25" />
                    <p className="text-default">{t("auth.title.login")}</p>
                </div>
                <Input
                    {...methods.register("email")}
                    label={t("auth.labels.email")}
                    placeholder={t("auth.placeholders.email")}
                    type="email"
                    disabled={isLoading}
                />
                <Button
                    disabled={isLoading}
                    variant="primary"
                    htmlType="submit"
                >
                    {t(isLoading ? "buttons.loading" : "buttons.ok")}
                </Button>
            </form>
        </FormProvider>
    );
}

export default Login;