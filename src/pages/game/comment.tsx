import { useEffect, useReducer, useState } from "react";
import { Button, Input, Post } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

export default function Comment({
    id,
    author,
    comment,
    date_created,
    date_updated,
    answers,
    deleted,
    onSubmit,
    onDelete,
    onEdit
}) {
    const [ isOpen, setOpen ] = useState<boolean>(false);
    const [ isForm, setForm ] = useState<boolean>(false);
    const [ localAnswers, setLocalAnswers ] = useState(answers);
    const [ localDelete, setLocalDelete ] = useState<boolean>(deleted);
    const [ localComment, setLocalComment ] = useState<string>(comment);
    const [ localDateUpdated, setlocalDateUpdated ] = useState<string>(date_updated);
    const [ update, forceUpdate ] = useReducer((x: number) => x + 1, 0);


    const info = useSelector(state => state?.login);
    const { token } = info;
    const { register, handleSubmit, formState: { errors }, setError, clearErrors, setValue, watch } = useForm({
        defaultValues: {
            comment: null,
            isEdit: false
        }
    });
    
    const submit = async (data) => {
        if (!data.isEdit) {
            if (!onSubmit)
                return;

            const response = await onSubmit(data);
            setValue("isEdit", false);
            
            setValue("comment", null);
            if (response) {
                localAnswers.push(response);
                setLocalAnswers(localAnswers);
            }
        } else {
            if (!onEdit)
                return;

            const response = await onEdit(data);
            setValue("isEdit", false);
            
            if (response) {
                if (response.id == id) {
                    setLocalComment(response.comment);
                    setlocalDateUpdated(new Date());
                } else {
                    const find = localAnswers.filter(comment => comment.id == response.id)[0];
                    if (!find) return;

                    find.comment = response.comment;
                    find.date_updated = new Date();
                    setLocalAnswers(localAnswers);
                    forceUpdate();
                }
                setForm(false);
                setValue("comment", null);
            }
        }

    }

    const handleEdit = async (localid: number, comment: string) => {
        setValue("isEdit", localid);
        setValue("comment", comment);
        setForm(true);
        setOpen(true);
    }

    const handleDelete = async (localid: number) => {
        if (!onDelete) return;

        const result = await onDelete(localid);
        if (result) {
            if (localid == id)
                setLocalDelete(true);
            else {
                const find = localAnswers.filter(comment => comment.id == localid)[0];
                if (!find) return;

                find.deleted = true;
                setLocalAnswers(localAnswers);
                forceUpdate();
            }
        }
    }

    useEffect(() => {}, [ isOpen, isForm ]);

    return (
        <>
            {localDelete ? (
                <p className="gamepage_comments__deleted">Комментарий удален</p>
            ) : (
                <Post
                    id={id}
                    body={localComment}
                    author={author}
                    date_created={date_created}
                    date_updated={localDateUpdated}
                />
            )}
            <div className="gamepage_comments__controls">
                {!isForm && token && (
                    <>
                        <p onClick={() => {
                            setForm((prev: boolean) => !prev);
                            setOpen(true);
                            setValue("isEdit", false);
                            setValue("comment", null);
                        }}>Ответить</p>
                        {info && info?.id != author?.id && !localDelete && <p>Пожаловаться</p>}
                        {info && info?.id == author?.id && !localDelete && (
                            <>
                                <p onClick={() => handleEdit(id, localComment)}>Редактировать</p>
                                <p onClick={() => handleDelete(id)}>Удалить</p>
                            </>
                        )}
                    </>
                )}
            </div>
            {localAnswers?.length > 0 && (
                <>
                    <div className="gamepage_comments__sub">
                        {localAnswers?.slice(0, isOpen ? localAnswers?.length : 3).map((subcomment, j) => (
                            <>
                                {subcomment?.deleted ? (
                                    <p className="gamepage_comments__deleted">Комментарий удален</p>
                                ) : (
                                    <>
                                        <Post
                                            id={subcomment?.id}
                                            body={subcomment.comment}
                                            author={subcomment.author}
                                            date_created={subcomment.date_created}
                                            date_updated={subcomment.date_updated}
                                        />
                                        
                                        <div className="gamepage_comments__controls">
                                        {token && !subcomment?.deleted && (
                                            <>
                                                {info && info?.id != subcomment?.author?.id && <p>Пожаловаться</p>}
                                                {info && info?.id == subcomment?.author?.id && (
                                                    <>
                                                        <p onClick={() => handleEdit(subcomment?.id, subcomment.comment)}>Редактировать</p>
                                                        <p onClick={() => handleDelete(subcomment?.id)}>Удалить</p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        </div>
                                    </>
                                )}
                            
                            </>
                        ))}
                        {(localAnswers?.length > 3) && !isForm && (
                            <div
                                className="gamepage_comments__sub_open"
                                onClick={() => setOpen((prev: boolean) => !prev)}
                            >
                                {isOpen && "Свернуть" || `Развернуть (${localAnswers?.length - 3})`}
                            </div>
                        )}
                        
                    </div>
                    {!isForm && token && (
                        <div className="gamepage_comments__controls">
                            <p onClick={() => {
                                setForm((prev: boolean) => !prev);
                                setOpen(true);
                                setValue("isEdit", false);
                                setValue("comment", null);
                            }}>Ответить</p>
                        </div>
                    )}
                </>
            )}
            {isForm && (
                token && (
                    <>
                        <form className="gamepage_comments__form" onSubmit={handleSubmit(submit)}>
                            <Input
                                type="text"
                                placeholder="Ваш комментарий..."
                                {...register("comment")}
                            />
                            <Button>OK</Button>
                        </form>
                        {errors?.comment && <p className="gamepage_comments__form_error">{errors?.comment?.message}</p>}
                        <div className="gamepage_comments__controls">
                            <p onClick={() => {
                                setForm((prev: boolean) => !prev);
                                setValue("isEdit", false);
                            }}>Отменить</p>
                        </div>
                    </>
                )
            )}
            
        </>
    );
}