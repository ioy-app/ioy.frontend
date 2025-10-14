import React, { useActionState, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Icons from "@/icons";

import confPackage from "@/../package.json";
import { Input, Button, Code } from "@/components";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/login";

export default function Login() {
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const { token } = useSelector(state => state.login);
    const [ isCodeForm, setFormCode ] = useState<boolean>(false);

    
    const submit = async (prevState, data: FormData) => {
        const result = await fetch("/api/oauth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.get("email")
            })
        });

        if (!result?.ok) {
            const json = await result.json();
            return {
                success: false,
                message: json?.msg
            };
        }
        setFormCode(true);
        return { success: true }
    }
    const [ Form, handleSubmit, isPending ] = useActionState(submit, { success: null, message: '' });

    
    
    useEffect(() => {
        if (token)
            navigator("/");
    }, []);

    return (
        <div className="oauth_content">
            {!isCodeForm ? (
                <form className="oauth_form" action={handleSubmit}>
                    <h1>Вход в систему</h1>
                    <Input
                        label="Эл. почта"
                        name="email"
                        placeholder="Введите эл.почту..."
                        type="email"
                        disabled={isPending}
                    />
                    <div className="oauth_form__actions">
                        {!Form.success && !isPending && <p className="oauth_form__actions_message">{Form.message}</p>}
                        <Button disabled={isPending}>
                            {isPending ? "Проверка..." : "Войти"}
                        </Button>
                    </div>
                </form>
            ) : (
                <Code
                    onSubmit={async (data) => {
                        dispatch(setLogin(data));
                        navigator("/");
                    }}
                    onCancel={() => setFormCode(false)}
                    className="oauth_form"
                />
            )}
            <div className="oauth_banner">
                <div className="oauth_dialog">
                    <p>
                        Или <NavLink to="/oauth/reg">зарегистрироваться?</NavLink>
                    </p>
                </div>
                <img src={Icons.LoginScreen} />
                <h1><NavLink to="/">{confPackage.name}</NavLink></h1>
            </div>
        </div>
    )
}