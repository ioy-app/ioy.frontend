import { CSSProperties, ReactNode, useState } from "react";

import "./styles.less";

interface HeaderProps {
    label: string;
    value: string;
}

const Tabs: React.FC = ({
    headers,
    content,
    style
}: {
    headers: HeaderProps[];
    content: Record<string, ReactNode>;
    style?: CSSProperties;
}) => {
    const [ selectTab, setSelectTab ] = useState<HeaderProps | null>(headers[0]);

    return (
        <div className="tabs" style={style}>
            <div className="tabs_header">
                {headers.map((header: HeaderProps, i: number) => (
                    <div
                        className={`tabs_header__elem${(header.value == selectTab.value) && "_select" || ""}`}
                        onClick={() => setSelectTab(header)}
                        key={i}
                    >
                        {header.label}
                    </div>
                ))}
            </div>
            <div className="tabs_body" key={selectTab?.value}>
                {content && content[(selectTab as HeaderProps).value]}
            </div>
        </div> 
    );
}

export default Tabs;