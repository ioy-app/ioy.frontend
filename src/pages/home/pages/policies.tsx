import pdfCookie from "@/../assets/policies/ru/cookie.pdf";
import pdfTerms from "@/../assets/policies/ru/terms.pdf";
import pdfPrivacy from "@/../assets/policies/ru/privacy.pdf";
import { useTranslation } from "react-i18next";

/**
 * Policies template
 * @example
 * return <Policies />
*/
export default function Policies({
    type
}: {
    type: "privacy" | "cookie" | "terms";
}) {
    const { t } = useTranslation();


    let pdf;
    switch(type) {
        case "privacy": pdf = pdfPrivacy; break;
        case "terms": pdf = pdfTerms; break;
        case "cookie": pdf = pdfCookie; break;
    }

    document.title = t(`footer.${type}`);

    return (
        <embed
            className="w-full h-200"
            src={pdf}
        />
    );
}