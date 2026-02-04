import * as Icons from "@/icons";
import { Button } from "@/components";
import { NavLink, useRouteError } from "react-router-dom";

export default function ErrorPage(props) {
    const localError = useRouteError();

    return (
        <div className="flex-1 w-full h-screen flex justify-center items-center flex-col gap-4 bg-back text-text">
            <img
                src={Icons.Logo}
                className="h-25"
            />
            <p className="text-title">Произошла ошибка</p>
            <p className="text-default">{localError?.message || "Неизвестная ошибка"}</p>
            <NavLink to="/">
                <Button variant="primary">
                    Главная страница
                </Button>
            </NavLink>
        </div>
    )
}