import React, { useActionState, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Icons from "@/icons";

import confPackage from "@/../package.json";
import { Input, Button, Code } from "@/components";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/login";
import { oauth_login } from "@/api/routes/oauth";
import { useNotify } from "@/hooks";

export default function Login() {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const { notify } = useNotify();

    const { token } = useSelector(state => state.login);
    const [ isCodeForm, setFormCode ] = useState<boolean>(false);

    
    const submit = async (prevState, data: FormData) => {
        const result = await oauth_login({
            email: data.get("email")
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
    const [ Form, handleSubmit, isPending ] = useActionState(submit, {
        success: null,
        message: ""
    });

    useEffect(() => {
        if (token)
            navigator("/");
    }, []);

    return (
        <div className="oauth_content">
            {!isCodeForm ? (
                <form className="oauth_form form" action={handleSubmit}>
                    <div className="form_header">
                        <p className="text title center">Вход в систему</p>
                    </div>
                    <Input
                        label="Эл. почта"
                        name="email"
                        placeholder="Введите эл.почту..."
                        type="email"
                        disabled={isPending}
                    />
                    <div className="form_footer">
                        {!Form.success && !isPending && <p className="oauth_form__actions_message">{Form.message}</p>}
                        <Button
                            disabled={isPending}
                            type="second"
                        >
                            {isPending ? "Проверка..." : "Войти"}
                        </Button>
                    </div>
                </form>
            ) : (
                <Code
                    onSubmit={async (data) => {
                        notify(`Добро пожаловать, ${data?.login}`, "success");
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