import { Button, Checkbox, Input, User } from "@/components";
import { useAPI } from "@/hooks";
import * as Icons from "@/icons";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { UAParser } from "ua-parser-js";
import Sessions from "./sessions";

export default function Edit({
    data,
    onClose
}) {
    const social = {};
    for (const item of data.description)
        social[item.type] = item.content;

    const { watch, handleSubmit, register } = useForm({
        defaultValues: {
            login: data.login,
            social
        }
    });

    const submit = (fd) => {
        console.log(fd);
    }

    return (
        <form className="profile edit" onSubmit={handleSubmit(submit)}>
            <div className="profile_header">
                <User dataSource={data}/>
                <p className="text title">Редактирование профиля</p>

                <Input
                    placeholder="Логин"
                    label="Логин"
                    {...register("login")}
                />
                <p className="text title">Информация и ссылки</p>
                
                <table>
                    <tbody>
                        <tr>
                            <td colSpan={2}>
                                <Input
                                    placeholder="Описание"
                                    label="Осн. описание"
                                    {...register("social.main")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialTelegram} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.telegram")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialYoutube} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.youtube")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialSteam} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.steam")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialGooglePlay} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.google-play")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialAppStore} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.appstore")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialItch} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.itch")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><img src={Icons.SocialGameJolt} /></td>
                            <td>
                                <Input
                                    placeholder="Ссылка"
                                    {...register("social.gamejolt")}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="profile_header__controls">
                    <Button type="second">
                        Сохранить
                    </Button>
                    <Button
                        type="clear"
                        onClick={() => onClose && onClose()}
                    >
                        Отмена
                    </Button>
                </div>
                <Sessions />
                <p className="text title">Изменить почту</p>
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
                <div className="profile_header__controls">
                    <Button>
                        Изменить
                    </Button>
                </div>
                <p className="text title">Приватность</p>
                <div className="profile_header__block edit">
                    <Checkbox
                        placeholder="Отображение сохраненных"
                        {...register("privacy.favorites")}
                    />
                    <Checkbox
                        placeholder="Отображение Подписок"
                        {...register("privacy.subscribes")}
                    />
                    <Checkbox
                        placeholder="Отображение своих игр"
                        {...register("privacy.games")}
                    />
                    <Checkbox
                        placeholder="Отображение Понравившихся"
                        {...register("privacy.likes")}
                    />
                </div>
                <div className="profile_header__controls">
                    <Button>
                        Сохранить
                    </Button>
                </div>
                <p className="profile_header__block_info">
                    Внимание! После удаления аккаунта есть возможность восстановить его в течении 3 дней с момента удаления. По истечению времени аккаунт будет удален безвозратно!
                </p>
                <Button type="danger">
                    Удалить аккаунт
                </Button>
            </div>
        </form>
    );
}