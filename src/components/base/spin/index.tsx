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
        <div className={`wp_spin p-4 ${fullscreen && "wp_fullscreen" || ""}`}>
            <img src={Logo} />
        </div>
    ) : <div className="wp_spin__content">{children}</div>
);

export default Spin;