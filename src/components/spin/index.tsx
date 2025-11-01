import "./styles.less";
import { Logo } from "@/icons";

const Spin: React.FC = ({
    children,
    loading,
    fullscreen
} : {
    /** Контент */
    children: React.ReactElement;
    /** Состояние загрузки */
    loading?: boolean;
    /** Отображение загрузки на полном экране */
    fullscreen?: boolean;
}) => (
    <>
        {loading && (
            <div className={`wp_spin ${fullscreen && "wp_fullscreen" || ""}`}>
                <img src={Logo} />
            </div>
        )}
        {!loading && <div className="wp_content">{children}</div>}
    </>
);

export default Spin;