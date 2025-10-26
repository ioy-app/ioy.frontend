import * as Icons from "@/icons";
import "./styles.less";
import { Button } from "@/components";
import { NavLink, useRouteError } from "react-router-dom";

export default function ErrorPage(props) {
    const localError = useRouteError();

    return (
        <div className="error">
            <img src={Icons.Logo} />
            <h1>Произошла ошибка</h1>
            <p>{localError?.message || "Неизвестная ошибка"}</p>
            <NavLink to="/">
                <Button type="primary">
                    Главная страница
                </Button>
            </NavLink>
        </div>
    )
}