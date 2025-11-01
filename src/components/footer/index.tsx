import { NavLink } from "react-router-dom";
import "./styles.less";

import confPackage from "@/../package.json";

const Footer: React.FC = () => (
    <footer>
        <abbr>
            {confPackage.date}, {confPackage.name}
        </abbr>
        <nav>
            <NavLink to="/developers">
                Разработчикам
            </NavLink>
            <NavLink to="/about">
                О проекте
            </NavLink>
        </nav>
    </footer>
)

export default Footer;