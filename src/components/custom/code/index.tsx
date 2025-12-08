import React, { useRef, useState } from "react";
import { Button, Input } from "@/components";
import { FormProvider, useForm } from "react-hook-form";

import "./styles.less";
import fetchAPI from "@/api";
import { useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";

const length: number = 6; // Длина кода подтверждения

/** Форма для ввода проверочного кода */
const Code: React.FC<{
    /** Событие успеха */
    onSubmit: (data: Record<string, any>) => void;
    /** Событие отмены */
    onCancel: () => void;
    /** Классы */
    className?: string;
}> = ({ onSubmit, onCancel, className }) => {
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const inputRefs = useRef([]);
    const methods = useForm();
    const { notify } = useNotify();
    const { t } = useTranslation();

    const handleSubmit = async ({ code }: { code: string[] }) => {
        try {
            setLoading(true);
            const response = await fetchAPI("/api/v1/codes", {
                method: "POST",
                body: JSON.stringify({ code: code.join("") })
            })
            const json = await response.json();
            if (!response.ok)
                throw json?.msg;

            onSubmit && onSubmit(json);
        }
        catch(err) {
            notify(`codes.${err?.message}`, "error");
            handleClear();
        }
        finally { setLoading(false); }
    }

    const handleClear = () => {
        for (let i = 0; i < length; i++)
            methods.setValue(`code.${i}`, '');
        setTimeout(() => {
            inputRefs?.current?.[0]?.focus();
            inputRefs?.current?.[0]?.select();
        }, 0);
    }

     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pastedData = e?.clipboardData?.getData("text")?.trim();
        const digits = pastedData.match(/\d/g)?.slice(0, length) || [];

        if (digits.length === 0) return;

        digits.forEach((digit, idx) => {
            if (idx < length)
                methods.setValue(`code.${idx}`, digit);
        });
        const focusIndex = Math.min(digits.length - 1, length - 1);

        setTimeout(() => {
            inputRefs?.current?.[focusIndex]?.focus();
            inputRefs?.current?.[focusIndex]?.select();
        }, 0);

        if (digits.length === 6)
            methods.handleSubmit(handleSubmit)();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className={`form ${className || ""}`}>
                <div className="form_header">
                    <p className="text title center">{t("codes.title")}</p>
                </div>
                <p className="text center">{t("codes.description")}</p>
                <div className="code_body">
                    {Array.from({ length }, (_: any, i: number) => (
                        <Input
                            {...methods.register(`code.${i}`)}
                            disabled={isLoading}
                            key={i}
                            inputMode="numberic"
                            pattern="[0-9]*"
                            maxLength={1}
                            ref={(elem: HTMLInputElement) => {
                                inputRefs.current[i] = elem;
                                methods.register(`code.${i}`).ref(elem);
                            }}
                            onFocus={(elem: React.FocusEvent<HTMLInputElement>) => elem.target.select()}
                            onPaste={(elem: React.ClipboardEvent<HTMLInputElement>) => {
                                if (i)
                                    return;

                                handlePaste(elem);
                            }}
                            onKeyDown={(elem: React.KeyboardEvent<HTMLInputElement>) => {
                                if (elem.key == "Backspace" && i && !Boolean(elem.currentTarget.value)) {
                                    elem.preventDefault();
                                    inputRefs?.current?.[i - 1]?.focus();
                                }
                            }}
                            onChange={(elem: React.ChangeEvent<HTMLInputElement>) => {
                                const value = String(elem.currentTarget.value || "");
                                if (!/^d$/.test(value))
                                    return;

                                if (!value)
                                    return;

                                if (i < (length - 1))
                                    setTimeout(() => inputRefs?.current?.[i + 1]?.focus(), 0);

                                if (i == (length - 1)) {
                                    const code = methods.getValues("code")?.join("");
                                    if (code?.length == length)
                                        methods.handleSubmit(handleSubmit);
                                }
                            }}
                        />
                    ))}
                </div>
                <div className="form_footer">
                    <Button
                        type="primary"
                        onClick={(elem: React.MouseEvent<HTMLButtonElement>) => {
                            elem.preventDefault();
                            onCancel && onCancel();
                        }}
                        disabled={isLoading}
                    >
                        {t("buttons.back")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default Code;