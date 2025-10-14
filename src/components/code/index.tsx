import React, { useActionState, useRef } from "react";
import { Button, Input } from "..";
import { useForm } from "react-hook-form";

import "./styles.less";
import { fetchoAuthLogin } from "@/store/oAuthLogin";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Code({
    onSubmit,
    onCancel,
    className
}) {
    const inputRefs = useRef([]);
    const { register, handleSubmit, setValue, getValues, formState: { errors }, setError, clearErrors } = useForm();
    const submit = async (data) => {
        clearErrors();
        try {
            const response = await fetch("/api/codes", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: data?.code?.join("")
                })
            });
            
            const json = await response.json();
            console.log(json);
            if (!response?.ok)
                throw json?.msg;

            onSubmit && onSubmit(json);
            
        }
        catch(err) {
            setError("fetch", { message: err });
            for (let i = 0; i < 6; i++)
                setValue(`code.${i}`, '');
            setTimeout(() => {
                inputRefs.current[0]?.focus();
                inputRefs.current[0]?.select();
            }, 0);
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        clearErrors();
        const pastedData = e?.clipboardData?.getData("text")?.trim();
        const digits = pastedData.match(/\d/g)?.slice(0, 6) || [];

        if (digits.length === 0) return;

        digits.forEach((digit, idx) => {
            if (idx < 6) {
                setValue(`code.${idx}`, digit);
            }
        });
        const focusIndex = Math.min(digits.length - 1, 5);
        setTimeout(() => {
            inputRefs.current[focusIndex]?.focus();
            inputRefs.current[focusIndex]?.select();
        }, 0);
        if (digits.length === 6) {
            handleSubmit(submit)();
        }
    };

    console.log(errors);

    return (
        <form onSubmit={handleSubmit(submit)} className={className}>
            <div className="code_header">
                <p className="code_header__title">Подтвердите действие</p>
                <p className="code_header__description">Введите код, который пришел на вашу почту для подтверждения дейтсвия</p>
            </div>
            <div className="code_body">
                {Array(6).fill(1).map((_: any, i: number) => (
                    <Input
                        key={i}
                        {...register(`code.${i}`)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        onChange={e => {
                            const value = e?.target?.value || '';
                            if (!/^\d?$/.test(value)) return;
                            clearErrors();
                            register(`code.${i}`)?.onChange(e);

                            if (value && i < 5)
                                setTimeout(() => inputRefs.current[i + 1]?.focus(), 0);

                            if (i === 5 && value && getValues("code").join("").length == 6)
                                handleSubmit(submit)();
                        }}
                        onKeyDown={e => {
                            if (e.key == "Backspace" && i > 0 && !e?.target?.value) {
                                e.preventDefault();
                                inputRefs.current[i - 1]?.focus();
                            }
                        }}
                        {...(i == 0 ? { onPaste: handlePaste } : {})}
                        onFocus={e => e?.target?.select()}
                        
                        ref={(el) => {
                            inputRefs.current[i] = el;
                            register(`code.${i}`).ref(el);
                        }}
                    />
                ))}
            </div>
            <div className="code_controls">
                {errors?.fetch && <p className="code_controls__error">{errors?.fetch?.message}</p>}
                <Button onClick={(e) => {
                    e.preventDefault();
                    onCancel && onCancel();
                }}>
                    Назад
                </Button>
            </div>
        </form>
    )
}