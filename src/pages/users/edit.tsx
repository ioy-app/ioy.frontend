import { Button, Checkbox, File, Input, Spin, Tabs, Textarea, User } from "@/components";
import { useModal, useNotify } from "@/hooks";
import { useForm } from "react-hook-form";
import Sessions from "./modals/sessions";

import { useSelector, useDispatch } from "react-redux";
import { changeLogin, clearLogin } from "../../stories/login";
import { profile_logout } from "@/api/routes/profile";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { users_details, users_edit } from "@/api/routes/users";
import Email from "./modals/email";
import Delete from "./modals/delete";
import { BiArrowBack, BiCheck, BiChevronsLeft, BiExit, BiSave, BiSolidChevronLeft } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { UserProps } from "@/types";
import { StoreProps } from "@/stories";

export default function Edit() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<UserProps | null>(null);
    const params = useParams();
    const { token, login: selfLogin } = useSelector((state: StoreProps) => state.login);

    const { notify } = useNotify();
    const { modal } = useModal();

    const { login } = params;
    const { watch, handleSubmit, register, setValue } = useForm();

    document.title = t("profile.titles.edit");

    if (login != selfLogin || !token)
        return <Navigate to="/" />

    const submit = async (fd) => {
        try {
            setLoading(true);
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
        <div className="flex flex-1 w-full items-center px-4 py-4 flex-col gap-4">
            <form
                ref={formRef}
                className="flex flex-col gap-4 w-full lg:w-2xl items-center"
                onSubmit={handleSubmit(submit)}
            >
                <div className="w-full flex flex-col gap-2 items-start mb-8">
                    <Button
                        variant="text"
                        onClick={() => navigator(-1)}
                    >
                        <BiChevronsLeft />
                        {t("buttons.back")}
                    </Button>
                    <p className="text-title">{t("profile.titles.edit")}</p>
                </div>
                <label
                    className="flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer"
                >
                    <div className="w-32 h-32">
                        <User
                            login={login}
                            size="full"
                            preview={handlePreview}
                            nolink
                        />
                    </div>
                    <p className="text-placeholder">{t("profile.placeholders.avatar")}</p>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("avatar")}
                        className="hidden"
                        
                    />
                </label>
                <Input
                    placeholder={t("profile.placeholders.login")}
                    label={t("profile.labels.login")}
                    {...register("login")}
                />
                <Textarea
                    placeholder={t("profile.placeholders.description")}
                    label={t("profile.labels.description")}
                    {...register("description")}
                />
                <div className="flex flex-col gap-4 w-full mt-8">
                    <p className="text-default">{t("profile.labels.privacy.title")}</p>
                    <Checkbox
                        placeholder={t("profile.labels.privacy.games")}
                        {...register("privacy.games")}
                    />
                    <Checkbox
                        placeholder={t("profile.labels.privacy.subscribers")}
                        {...register("privacy.subscribers")}
                    />
                    <Checkbox
                        placeholder={t("profile.labels.privacy.likes")}
                        {...register("privacy.likes")}
                    />
                    <Checkbox
                        placeholder={t("profile.labels.privacy.favorites")}
                        {...register("privacy.favorites")}
                    />
                </div>
                <div className="flex flex-col gap-4 w-full mt-8">
                    <Button
                        variant="clear"
                        htmlType="button"
                        onClick={(e) => {
                            e.preventDefault();
                            modal("", (onClose) => <Email onClose={onClose} />);
                        }}
                    >
                        Изменить почтовый адрес
                    </Button>
                    <Button
                        variant="clear"
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
                        variant="danger"
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
                <div className="flex flex-row gap-4 justify-end items-center w-full py-8">
                    <Button
                        variant="danger"
                        htmlType="button"
                        onClick={() => navigator(`/u/${data?.login}`)}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
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
                        <BiCheck />
                    </Button>
                </div>
                <div className="flex flex-col w-full mt-8">
                    <Button
                        htmlType="button"
                        variant="danger"
                        onClick={() => modal(
                            "Вы действительно хотите выйти из аккаунта?",
                            (onClose: () => void) => (
                                <>
                                    <Button
                                        variant="clear"
                                        onClick={() => onClose()}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="danger"
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
                        <BiExit />
                    </Button>
                </div>
            </form>
        </div>
    )

    // return (
    //     <Spin loading={isLoading}>
    //         <form ref={formRef} className="flex flex-col gap-4 justify-center" onSubmit={handleSubmit(submit)}>
    //             <div className="profile_header">
    //                 <User login={login} data={data} preview={handlePreview} />
    //                 <p className="text title">Настройки</p>
    //                 <File
    //                     label="Аватар"
    //                     accept="image/*"
    //                     {...register("avatar")}
    //                 />
    //                 <Input
    //                     placeholder="Логин"
    //                     label="Логин"
    //                     {...register("login")}
    //                 />
    //                 <Input
    //                     placeholder="Описание"
    //                     label="Осн. описание"
    //                     {...register("description.0.content")}
    //                 />
    //                 <p className="text title">Отображение на странице</p>
    //                 <div className="profile_header__block edit">
    //                     <Checkbox
    //                         placeholder="Собственные игры"
    //                         {...register("privacy.games")}
    //                     />
    //                     <Checkbox
    //                         placeholder="Подписки на авторов"
    //                         {...register("privacy.subscribers")}
    //                     />
    //                     <Checkbox
    //                         placeholder="Мне понравилось"
    //                         {...register("privacy.likes")}
    //                     />
    //                     <Checkbox
    //                         placeholder="Избранное"
    //                         {...register("privacy.favorites")}
    //                     />
    //                 </div>
    //                 <div className="profile_header__block edit">
    //                     <Button
    //                         type="clear"
    //                         htmlType="button"
    //                         onClick={(e) => {
    //                             e.preventDefault();
    //                             modal(
    //                                 Email,
    //                                 (onClose) => (
    //                                     <>
                                        
    //                                     </>
    //                                 )
    //                             )
    //                         }}
    //                     >
    //                         Изменить почтовый адрес
    //                     </Button>
    //                     <Button
    //                         type="clear"
    //                         htmlType="button"
    //                         onClick={(e) => {
    //                             e.preventDefault();
    //                             modal(
    //                                 Sessions,
    //                                 (onClose) => (
    //                                     <>
                                        
    //                                     </>
    //                                 )
    //                             )
    //                         }}
    //                     >
    //                         Управление сессиями
    //                     </Button>
    //                     <Button
    //                         type="danger"
    //                         htmlType="button"
    //                         onClick={(e) => {
    //                             e.preventDefault();
    //                             modal(
    //                                 Delete,
    //                                 (onClose) => (
    //                                     <>
                                        
    //                                     </>
    //                                 )
    //                             )
    //                         }}
    //                     >
    //                         Удалить аккаунт
    //                     </Button>
    //                 </div>
    //                 <div className="profile_header__controls end">
    //                     <Button
    //                         type="clear"
    //                         htmlType="button"
    //                         onClick={() => navigator(`/u/${data?.login}`)}
    //                     >
    //                         Отмена
    //                     </Button>
    //                     <Button
    //                         type="second"
    //                         htmlType="button"
    //                         onClick={(e) => {
    //                             e.preventDefault();
    //                             modal(
    //                                 "Вы хотите сохранить изменения?",
    //                                 (onClose) => (
    //                                     <>
    //                                         <Button
    //                                             type="danger"
    //                                             onClick={() => onClose()}
    //                                         >
    //                                             Отмена
    //                                         </Button>
    //                                         <Button
    //                                             type="second"
    //                                             onClick={(e) => {
    //                                                 formRef.current.requestSubmit();
    //                                                 onClose();
    //                                             }}>
    //                                             Сохранить
    //                                         </Button>
                                            
    //                                     </>
    //                                 )
    //                             )
    //                         }}
    //                     >
    //                         Сохранить
    //                     </Button>
    //                 </div>
    //                 <div
    //                     className="profile_header__block edit"
    //                     style={{
    //                         marginTop: "calc(var(--size-padding) * 3)"
    //                     }}
    //                 >
    //                     <Button
    //                         htmlType="button"
    //                         type="danger"
    //                         onClick={() => modal(
    //                             "Вы действительно хотите выйти из аккаунта?",
    //                             (onClose: () => void) => (
    //                                 <>
    //                                     <Button
    //                                         type="clear"
    //                                         onClick={() => onClose()}
    //                                     >
    //                                         Отмена
    //                                     </Button>
    //                                     <Button
    //                                         type="danger"
    //                                         onClick={(e) => {
    //                                             handleLogout();
    //                                             onClose();
    //                                         }}>
    //                                         Выйти
    //                                     </Button>
                                        
    //                                 </>
    //                             )
    //                         )}
    //                     >
    //                         Выйти из аккаунта
    //                     </Button>
    //                 </div>
    //             </div>
                
    //         </form>
    //     </Spin>
    // );
}