import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "@/icons";
import { useForm } from "react-hook-form";

import confPackage from "@/../package.json";

import { Input, Button } from "@/components";
import { Checkbox } from "../../../components";
import { auth_reg } from "@/api/routes/auth";

export default function Reg({
    onClose
}: {
    onClose?: () => void;
}) {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    const submit = async (data) => {
        try {
            clearErrors("valid");
            const response = await auth_reg(data);
            
            const json = await response.json();
            if (!response.ok)
                throw json?.msg || "Неизвестная ошибка";
        }
        catch(err) {
            setError("valid", {
                type: "valid",
                message: err.toString()
            });
            
        }
    }

    return (
        <div className="auth_content" onSubmit={handleSubmit(submit)}>
            
            <form className="auth_form form">
                <div className="form_header">
                    <img src={Icons.Logo} />
                    <p className="text title center">Регистрация</p>
                </div>
                <Input
                    label="Логин"
                    name="login"
                    placeholder="Введите логин..."
                    type="text"
                    {...register("login")}
                />
                <Input
                    label="Эл. почта"
                    name="email"
                    placeholder="Введите эл. почту..."
                    type="email"
                    {...register("email")}
                />
                <Checkbox
                    name="rules"
                    placeholder="Я ознакомился(-ась) и согласен(-а) с правилами сайта!"
                    {...register("rule")}
                />
                <div className="form_footer">
                    {errors.valid && <p className="auth_form__actions_message">{errors.valid.message} </p>}
                    <Button
                        type="second"
                    >
                        Создать
                    </Button>
                </div>
            </form>
        </div>
    )
}