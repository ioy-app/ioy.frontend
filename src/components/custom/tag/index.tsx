import { BiHash } from "react-icons/bi";
import "./styles.less";

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function stringToHSLColor(str: string, saturation = 70, lightness = 65): string {
  const hash = hashString(str);
  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getContrastTextColor(hslColor: string): string {
  const match = hslColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  if (!match) return '#000';
  const lightness = parseInt(match[1], 10);
  return lightness > 60 ? '#000' : '#fff';
}

const Tag: React.FC<{
    title: string;
}> = ({ title }) => {
    const bg = stringToHSLColor(title);
    return (
        <div
            className="wp_tag"
            style={{
                background: bg,
                color: getContrastTextColor(bg)
            }}
        >
            <BiHash />
            <p>{title}</p>
        </div>
    );
}

export default Tag;