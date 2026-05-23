import { useMemo } from "react";

/**
 * Colorfull title text
 * @example
 * return <TitleColorfull text="hello world" />
*/
const TitleColorfull: React.FC<{
  text: string;
}> = ({ text }) => {
  const arr = useMemo(() => Array.from(text), [ text ]);

  return arr?.map?.((char: string, i: number) => (
    <span className={i % 2 != 0 ? "text-primary" : "text-second"}>
      {char}
    </span>
  ));
}

export default TitleColorfull;