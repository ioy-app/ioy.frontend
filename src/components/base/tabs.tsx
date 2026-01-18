import { CSSProperties, ReactNode, useState } from "react";

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
        <div className="text-placeholder flex flex-col gap-4">
            <div className="flex flex-row items-center border-b border-b-br overflow-hidden overflow-x-auto no-scrollbar">
                {headers.map((header: HeaderProps, i: number) => (
                    <div
                        className={`px-4 py-2 select-none cursor-default rounded-t-xl ${(header.value == selectTab.value) && "text-primary bg-br font-light" || "cursor-pointer"} transition-colors`}
                        onClick={() => setSelectTab(header)}
                        key={i}
                    >
                        {header.label}
                    </div>
                ))}
            </div>
            <div
                key={selectTab?.value}
            >
                <ContentParent>
                    {content && content[(selectTab as HeaderProps).value]}
                </ContentParent>
            </div>
        </div> 
    );
}

export default Tabs;