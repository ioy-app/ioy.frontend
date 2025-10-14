import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "@/icons";
import { useForm } from "react-hook-form";

import confPackage from "@/../package.json";

import { Input, Button } from "@/components";
import { Checkbox } from "../../../components";

export default function Reg() {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();

    const submit = async (data) => {
        try {
            clearErrors("valid");
            const response = await fetch("/api/oauth/reg", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
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
        <div className="oauth_content" onSubmit={handleSubmit(submit)}>
            
            <form className="oauth_form">
                <h1>Регистрация</h1>
                <Input
                    label="Эл. почта"
                    name="email"
                    placeholder="Введите эл.почту..."
                    type="email"
                    {...register("email")}
                />
                <Input
                    label="Логин"
                    name="login"
                    placeholder="Введите логин..."
                    type="text"
                    {...register("login")}
                />
                <Checkbox
                    name="rules"
                    placeholder="Я ознакомился(-ась) и согласен(-а) с правилами сайта!"
                    {...register("rule")}
                />
                <div className="oauth_form__actions">
                    {errors.valid && <p className="oauth_form__actions_message">{errors.valid.message} </p>}
                    <Button>
                        Создать
                    </Button>
                </div>
            </form>
            <div className="oauth_banner">
                <div className="oauth_dialog">
                    <p>
                        Или <NavLink to="/oauth">войти?</NavLink>
                    </p>
                </div>
                <img src={Icons.Logo} />
                <h1><NavLink to="/">{confPackage.name}</NavLink></h1>
            </div>
        </div>
    )
}