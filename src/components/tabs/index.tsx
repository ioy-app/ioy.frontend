import { CSSProperties, ReactNode, useState } from "react";
import "./styles.less";

export interface HeaderProps {
    label: React.ReactNode;
    value: string;
}

const emptyParent: React.FC<{ children: ReactNode }> = ({ children }) => children;

const Tabs: React.FC<{
    headers: HeaderProps[];
    content: Record<string, ReactNode>;
    style?: CSSProperties;
    ContentParent?: typeof emptyParent;
}> = ({
    headers,
    content,
    style,
    ContentParent=emptyParent
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
                <ContentParent>
                    {content && content[(selectTab as HeaderProps).value]}
                </ContentParent>
            </div>
        </div> 
    );
}

export default Tabs;