import React, { useActionState, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Icons from "@/icons";

import confPackage from "@/../package.json";
import { Input, Button, Code } from "@/components";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/login";
import { auth_login } from "@/api/routes/auth";
import { useNotify } from "@/hooks";

export default function Login({
    onClose
}) {
    //const navigator = useNavigate();
    const dispatch = useDispatch();
    const { notify } = useNotify();

    const { token } = useSelector(state => state.login);
    const [ isCodeForm, setFormCode ] = useState<boolean>(false);

    
    const submit = async (prevState, data: FormData) => {
        const result = await auth_login({
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
             onClose();
    }, []);

    return (
        <div className="oauth_content">
            {!isCodeForm ? (
                <form className="oauth_form form" action={handleSubmit}>
                    <div className="form_header">
                        <img src={Icons.Logo} />
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
                        onClose();
                    }}
                    onCancel={() => setFormCode(false)}
                    className="oauth_form"
                />
            )}
        </div>
    )
}