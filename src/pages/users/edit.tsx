import { Button, Checkbox, File, Input, Spin, Tabs, Textarea, User } from "@/components";
import { useModal, useNotify } from "@/hooks";
import { useForm } from "react-hook-form";
import Sessions from "./modals/sessions";

import { useSelector, useDispatch } from "react-redux";
import { changeLogin, clearLogin } from "../../stories/login";
import { profile_logout } from "@/api/routes/profile";
import { Navigate, NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { users_details, users_edit } from "@/api/routes/users";
import Email from "./modals/email";
import Delete from "./modals/delete";
import { BiArrowBack, BiCheck, BiChevronsLeft, BiExit, BiSave, BiSolidChevronLeft } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { UserProps } from "@/types";
import { StoreProps } from "@/stories";

const Edit: React.FC<{
    onClose: () => void;
    login?: string;
    navigator?: NavigateFunction;
}> = ({
    onClose,
    login,
    navigator
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ data, setData ] = useState<UserProps | null>(null);

    const { notify } = useNotify();
    const { modal } = useModal();
    const { watch, handleSubmit, register, setValue } = useForm();

    const submit = async (fd) => {
        try {
            setLoading(true);
            const response = await users_edit(data.login, {
                ...fd,
                avatar: fd?.avatar?.[0]
            });

            notify(t("notify.save"), "success");
            dispatch(changeLogin(response));
            onClose && onClose();
            
        }
        catch(err) { notify(err?.message?.toString(), "error"); }
        finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        await profile_logout();
        dispatch(clearLogin());
        onClose && onClose();
        notify(t("auth.bye"), "success");
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
                for (const [ key, value ] of Object.entries(response))
                    setValue(key, value);

                setData(response);
            }
            catch(err) {
                notify(err?.message?.toString(), "error");
                onClose && onClose();
            }
            finally { setLoading(false); }
        })();
    }, [ login ]);

    return (
        <div className="flex w-full items-center px-4 py-4 flex-col gap-4 p-4">
            <form
                ref={formRef}
                className="flex flex-col gap-4 w-full items-center"
                onSubmit={handleSubmit(submit)}
            >
                <label
                    className="flex flex-col justify-center gap-4 items-center p-4 border-4 border-dotted border-br rounded-2xl cursor-pointer"
                >
                    <div className="w-32 h-32" key={data?.is_avatar}>
                        <User
                            login={login}
                            dataSource={{
                                is_avatar: data?.is_avatar || handlePreview
                            }}
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
                        variant="default"
                        htmlType="button"
                        onClick={(e) => {
                            e.preventDefault();
                            modal("", (onClose) => <Email onClose={onClose} />);
                        }}
                    >
                        {t("buttons.change_email")}
                    </Button>
                    <Button
                        variant="default"
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
                        {t("buttons.sessions")}
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
                        {t("buttons.delete_account")}
                    </Button>
                </div>
                <div className="flex flex-row gap-4 justify-end items-center w-full py-8">
                    <Button
                        variant="primary"
                        htmlType="button"
                        onClick={(e) => {
                            e.preventDefault();
                            modal(
                                t("profile.modals.save"),
                                (onClose) => (
                                    <>
                                        <Button
                                            variant="default"
                                            onClick={() => onClose()}
                                        >
                                            {t("buttons.cancel")}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={(e) => {
                                                formRef.current.requestSubmit();
                                                onClose();
                                            }}>
                                            {t("buttons.save")}
                                        </Button>
                                        
                                    </>
                                )
                            )
                        }}
                    >
                        {t("buttons.save")}
                        <BiCheck />
                    </Button>
                </div>
                <div className="flex flex-col w-full mt-8">
                    <Button
                        htmlType="button"
                        variant="danger"
                        onClick={() => modal(
                            t("profile.modals.logout"),
                            (onClose: () => void) => (
                                <>
                                    <Button
                                        variant="clear"
                                        onClick={() => onClose()}
                                    >
                                        {t("buttons.cancel")}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={(e) => {
                                            handleLogout();
                                            onClose();
                                        }}>
                                        {t("buttons.logout")}
                                    </Button>
                                    
                                </>
                            )
                        )}
                    >
                        {t("buttons.logout")}
                        <BiExit />
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Edit;