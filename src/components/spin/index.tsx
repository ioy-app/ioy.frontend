import "./styles.less";
import { Logo } from "@/icons";

interface SpinProps {
    /** Контент */
    children: React.ReactNode;
    /** Состояние загрузки */
    loading?: boolean;
    /** Отображение загрузки на полном экране */
    fullscreen?: boolean;
}

const Spin: React.FC<SpinProps> = ({
    children,
    loading,
    fullscreen
}) => (
    loading ? (
        <div className={`wp_spin ${fullscreen && "wp_fullscreen" || ""}`}>
            <img src={Logo} />
        </div>
    ) : <div className="wp_content">{children}</div>
);

export default Spin;