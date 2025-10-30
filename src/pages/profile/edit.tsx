import { Button, Checkbox, File, Input, Tabs, User } from "@/components";
import { useAPI } from "@/hooks";
import * as Icons from "@/icons";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { UAParser } from "ua-parser-js";
import Sessions from "./sessions";

import { useSelector, useDispatch } from "react-redux";
import { clearLogin } from "../../store/login";
import { profile_logout } from "@/api/routes/profile";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { users_details, users_edit } from "@/api/routes/users";

export default function Edit() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<UserProps | null>(null);
    const params = useParams();

    const { login } = params;

    

    const { watch, handleSubmit, register, setValue } = useForm();

    const submit = async (fd) => {
        try {
            setLoading(true);

            const response = await users_edit(data.login, {
                ...fd,
                avatar: fd?.avatar?.[0]
            });
            console.log(response);
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
        console.log(fd);
    }

    const handleLogout = async () => {
        await profile_logout();
        dispatch(clearLogin());
        navigator("/");
    }

    const avatar = watch("avatar");

    const handlePreview = useMemo(() => {
        if (avatar && avatar.length > 0)
            return URL.createObjectURL(avatar[0]);
        
        return null;
    }, [ avatar ]);

    const refPreview = useRef<string | null>(null);
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
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [ login ]);

    if (isLoading)
        return (
            <p>Загрузка...</p>
        );

    if (!data)
        return (
            <p>Пользователя не существует</p>
        );

    return (
        <form className="profile edit" onSubmit={handleSubmit(submit)}>
            <div className="profile_header">
                <User dataSource={data} preview={handlePreview} />
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
                <Tabs
                    style={{ marginTop: "calc(var(--size-padding) * 2)" }}
                    headers={[
                        {
                            label: "Приватность",
                            value: "privacy"
                        },
                        {
                            label: "Безопасность",
                            value: "security"
                        }
                    ]}
                    content={{
                        privacy: (
                            <>
                                <p className="text title">Отображение на странице</p>
                                <div className="profile_header__block edit">
                                    <Checkbox
                                        placeholder="Сохраненные игры"
                                        {...register("privacy.favorites")}
                                    />
                                    <Checkbox
                                        placeholder="Подписки на авторов"
                                        {...register("privacy.subscribes")}
                                    />
                                    <Checkbox
                                        placeholder="Собственные игры"
                                        {...register("privacy.games")}
                                    />
                                    <Checkbox
                                        placeholder="Мне понравилось"
                                        {...register("privacy.likes")}
                                    />
                                </div>
                            </>
                        ),
                        security: (
                            <>
                                <p className="text title">Почтовый адрес</p>
                                <Input
                                    placeholder="Введите почту..."
                                    label="Текущая почта"
                                    {...register("email.current")}
                                />
                                <Input
                                    placeholder="Введите почту..."
                                    label="Новая почта"
                                    {...register("email.new")}
                                />
                                <Sessions />
                            </>
                        )
                    }}
                />
                <div className="profile_header__controls end">
                    <Button
                        type="clear"
                        onClick={() => navigator(`/u/${data?.login}`)}
                    >
                        Отмена
                    </Button>
                    <Button type="second">
                        Сохранить
                    </Button>
                </div>
            </div>
            <div
                style={{
                    marginTop: "calc(var(--size-padding) * 3)"
                }}
            >
                <Button
                    type="danger"
                    onClick={handleLogout}
                >
                    Выйти из аккаунта
                </Button>
            </div>
        </form>
    );
}