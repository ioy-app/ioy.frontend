import { useEffect, useState } from "react";
import Input from "../base/input";
import User from "../content/user";
import { BiX } from "react-icons/bi";
import { users_details } from "@/api/routes/users";
import { useNotify } from "@/hooks";
import { useTranslation } from "react-i18next";
import { UserProps } from "@/types";

/**
 * Multiple select users
 * @example
 * return <SelectUser />
 */
const SelectUser: React.FC<{
	name: string;
	label?: string;
	placeholder?: string;
	setValue: (key: string, value: any) => void;
	watch: (key: string) => any;
	disabled?: boolean;
	initial?: UserProps[];
}> = ({ name, label, placeholder, setValue, disabled, watch, initial }) => {
	const [local_value, setLocalValue] = useState<any[]>(null);
	const [isLoading, setLoading] = useState<boolean>(disabled);
	const { notify } = useNotify();
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const value = watch(name);
				const arr = [];
				if (!value) throw false;
				for (const id of value) {
					try {
						const find = initial?.find((user) => user.id == id);
						if (!find) throw false;

						arr.push({
							login: find?.login,
							id: find?.id,
							is_avatar: find?.is_avatar,
						});
					} catch (err) {}
				}

				setLocalValue((prev) => {
					const newarr = Array.from(
						new Set((prev && [...prev, ...arr]) || arr),
					);
					setValue?.(name, newarr);
					return newarr;
				});
			} catch (err) {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="flex w-full flex-col gap-4">
			<Input
				name={name}
				placeholder={placeholder}
				label={label}
				disabled={isLoading}
				onKeyPress={async (e) => {
					if (!["Enter", ","].includes(e.key)) return;

					e.preventDefault();
					const value = e.target?.value?.trim?.();
					if (!value) return;

					try {
						if (local_value && local_value.find((user) => user.login == value))
							throw t("profile.errors.equal", { login: value });

						const response = await users_details(value);

						setLocalValue((prev) => {
							const obj = {
								login: value,
								id: response?.id,
								is_avatar: response?.is_avatar,
							};

							const newarr = Array.from(
								new Set((prev && [...prev, obj]) || [obj]),
							);
							setValue?.(name, newarr);

							return newarr;
						});
						e.target.value = "";
					} catch (err) {
						notify(t("profile." + err?.message, { login: value }), "error");
					} finally {
						setLoading(false);
					}
				}}
			/>
			<div className="flex flex-row gap-4 flex-wrap">
				{local_value?.map((user, i: number) => {
					return (
						<div
							key={i}
							className="pr-2 border border-br rounded-full cursor-pointer flex gap-2 items-center"
							onClick={() => {
								setLocalValue((prev) => {
									const newarr = prev?.filter((t) => t?.login != user?.login);
									console.log(newarr);
									setValue?.(name, (newarr?.length && newarr) || null);
									return newarr;
								});
							}}
						>
							<User
								login={user.login}
								dataSource={{ is_avatar: user.is_avatar }}
								size={12}
								nolink
							/>
							{user.login}
							<BiX className="text-2xl" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SelectUser;

{
	/* <div className="flex w-full flex-col gap-4">
    <Input
        name="tags"
        placeholder={t("games.placeholders.tags")}
        label={t("games.labels.tags")}
        onChange={({ target: { value }}) => {
            console.log(value);
        }}
        onKeyPress={(e) => {
            if (e.key == "Enter" || e.key == ",") {
                if (e.target.value.trim()) {
                    tags.push(e.target.value);
                    e.target.value = "";
                    methods.setValue("tags", tags);
                }
                e.preventDefault();
            }
        }}
    />
    <div className="flex flex-row gap-4 flex-wrap">
        {tags?.map((tag: string, i: number) => (
            <span
                className="pr-2 border border-br rounded-xl cursor-pointer flex gap-2 items-center"
                onClick={() => {
                    methods.setValue("tags", tags.filter((t: string) => t != tag));
                }}
            >
                <Tag
                    title={tag}
                    key={i}
                />
                <BiX className="text-2xl"/>
            </span>
        ))}
    </div>
</div> */
}
