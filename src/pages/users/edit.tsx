import { Button, Checkbox, File, Input, Spin, Tabs, User } from "@/components";
import { useModal, useNotify } from "@/hooks";
import { useForm } from "react-hook-form";
import Sessions from "./sessions";

import { useSelector, useDispatch } from "react-redux";
import { changeLogin, clearLogin } from "../../stories/login";
import { profile_logout } from "@/api/routes/profile";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { users_details, users_edit } from "@/api/routes/users";
import Email from "./email";
import Delete from "./delete";

export default function Edit() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<UserProps | null>(null);
    const params = useParams();

    const { notify } = useNotify();
    const { modal } = useModal();

    const { login } = params;

    

    const { watch, handleSubmit, register, setValue } = useForm();

    const submit = async (fd) => {
        try {
            setLoading(true);

            console.log(fd);

            const response = await users_edit(data.login, {
                ...fd,
                avatar: fd?.avatar?.[0]
            });
            const json = await response.json();
            if (!response.ok)
                throw json.msg;

            notify("Изменения сохранены", "success");
            dispatch(changeLogin(json));
            navigator(`/u/${json.login}`);
            
        }
        catch(err) { notify(err?.message?.toString(), "error"); }
        finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        await profile_logout();
        dispatch(clearLogin());
        notify("Вы вышли из аккаунта", "info");
        navigator("/");
    }

    const avatar = watch("avatar");

    const handlePreview = useMemo(() => {
        if (avatar && avatar.length > 0)
            return URL.createObjectURL(avatar[0]);
        
        return null;
    }, [ avatar ]);

    const refPreview = useRef<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (refPreview.current)
            URL.revokeObjectURL(refPreview.current);
        refPreview.current = handlePreview;
    }, [ refPreview ]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await users_details(login);

                
                if (!response.ok) {
                    const json = await response.json();
                    throw json.msg;
                }

                const json: UserProps = await response.json();
                for (const [ key, value ] of Object.entries(json))
                    setValue(key, value);

                
                setData(json);
            }
            catch(err) {
                notify(err?.message?.toString(), "error");
                navigator("/");
            }
            finally { setLoading(false); }
        })();
    }, [ login ]);

    return (
        <Spin loading={isLoading}>
            <form ref={formRef} className="profile edit" onSubmit={handleSubmit(submit)}>
                <div className="profile_header">
                    <User data={data} preview={handlePreview} />
                    <p className="text title">Настройки</p>
                    <File
                        label="Аватар"
                        accept="image/*"
                        {...register("avatar")}
                    />
                    <Input
                        placeholder="Логин"
                        label="Логин"
                        {...register("login")}
                    />
                    <Input
                        placeholder="Описание"
                        label="Осн. описание"
                        {...register("description.0.content")}
                    />
                    <p className="text title">Отображение на странице</p>
                    <div className="profile_header__block edit">
                        <Checkbox
                            placeholder="Собственные игры"
                            {...register("privacy.games")}
                        />
                        <Checkbox
                            placeholder="Подписки на авторов"
                            {...register("privacy.subscribers")}
                        />
                        <Checkbox
                            placeholder="Мне понравилось"
                            {...register("privacy.likes")}
                        />
                        <Checkbox
                            placeholder="Избранное"
                            {...register("privacy.favorites")}
                        />
                    </div>
                    <div className="profile_header__block edit">
                        <Button
                            type="clear"
                            htmlType="button"
                            onClick={(e) => {
                                e.preventDefault();
                                modal(
                                    Email,
                                    (onClose) => (
                                        <>
                                        
                                        </>
                                    )
                                )
                            }}
                        >
                            Изменить почтовый адрес
                        </Button>
                        <Button
                            type="clear"
                            htmlType="button"
                            onClick={(e) => {
                                e.preventDefault();
                                modal(
                                    Sessions,
                                    (onClose) => (
                                        <>
                                        
                                        </>
                                    )
                                )
                            }}
                        >
                            Управление сессиями
                        </Button>
                        <Button
                            type="danger"
                            htmlType="button"
                            onClick={(e) => {
                                e.preventDefault();
                                modal(
                                    Delete,
                                    (onClose) => (
                                        <>
                                        
                                        </>
                                    )
                                )
                            }}
                        >
                            Удалить аккаунт
                        </Button>
                    </div>
                    <div className="profile_header__controls end">
                        <Button
                            type="clear"
                            htmlType="button"
                            onClick={() => navigator(`/u/${data?.login}`)}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="second"
                            htmlType="button"
                            onClick={(e) => {
                                e.preventDefault();
                                modal(
                                    "Вы хотите сохранить изменения?",
                                    (onClose) => (
                                        <>
                                            <Button
                                                type="danger"
                                                onClick={() => onClose()}
                                            >
                                                Отмена
                                            </Button>
                                            <Button
                                                type="second"
                                                onClick={(e) => {
                                                    formRef.current.requestSubmit();
                                                    onClose();
                                                }}>
                                                Сохранить
                                            </Button>
                                            
                                        </>
                                    )
                                )
                            }}
                        >
                            Сохранить
                        </Button>
                    </div>
                    <div
                        className="profile_header__block edit"
                        style={{
                            marginTop: "calc(var(--size-padding) * 3)"
                        }}
                    >
                        <Button
                            htmlType="button"
                            type="danger"
                            onClick={() => modal(
                                "Вы действительно хотите выйти из аккаунта?",
                                "info",
                                (onClose) => (
                                    <>
                                        <Button
                                            type="clear"
                                            onClick={() => onClose()}
                                        >
                                            Отмена
                                        </Button>
                                        <Button
                                            type="danger"
                                            onClick={(e) => {
                                                handleLogout();
                                                onClose();
                                            }}>
                                            Выйти
                                        </Button>
                                        
                                    </>
                                )
                            )}
                        >
                            Выйти из аккаунта
                        </Button>
                    </div>
                </div>
                
            </form>
        </Spin>
    );
}