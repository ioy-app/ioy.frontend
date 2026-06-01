import {
  Meta,
  TitleColorfull,
  User,
  ViewModel
} from "@/components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Logo from "@/icons/logo.svg";
import { BiRightArrowAlt } from "react-icons/bi";

/**
 * Donut-page
 * @example
 * return <Donut />
*/
export default function Donut({}) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("donut.title");
  }, [ t ]);

  return (
    <div className="flex-1 gap-4 flex justify-center flex-col items-center w-full min-h-full">
			<Meta
				title={t("donut.title")}
				description={t("donut.description")}
				url="https://ioy.app/donut"
			/>
      <img
        src={Logo}
        className="w-50 max-w-full"
      />
      <p className="text-title text-center">
        <TitleColorfull text={t("donut.title")} />
      </p>
      <p className="text-default text-center w-md max-w-full">{t("donut.description")}</p>
      <div className="flex gap-4 justify-around w-full flex-wrap">
        <div className="flex gap-4 flex-col">
          <p className="text-title text-center">
            <TitleColorfull text={t("donut.feature")} />
          </p>
          <div className="animate-donate bg-linear-to-b from-primary to-second p-1 bg-size-[100%_150%] [animation-duration:7s] rounded-2xl">
            <div className="flex gap-4 items-center p-4 bg-back rounded-2xl">
              <User
                login="ufo"
                vertical
                dataSource={{
                  is_avatar: true
                }}
                nolink
              />
              <BiRightArrowAlt className="text-4xl" />
              <User
                login="ufo"
                vertical
                dataSource={{
                  is_avatar: true,
                  is_donut: true
                }}
                nolink
              />
            </div>
          </div>
          <p className="text-placeholder text-center">*{t("donut.feature_description")}</p>
        </div>
        <div className="flex gap-4 flex-col">
          <p className="text-title text-center">
            <TitleColorfull text={t("donut.steps.title")} />
          </p>
          <ol className="list-decimal text-placeholder text-xl">
            <li>{t("donut.steps.first")}</li>
            <li>{t("donut.steps.second")}</li>
            <li>{t("donut.steps.third")}</li>
          </ol>
        </div>
      </div>
      <ViewModel
        name="computer-donut"
        href="/resources/gltf/computer.gltf"
        spdY={.5}
        scale={1.25}
      />
    </div>
  );
}