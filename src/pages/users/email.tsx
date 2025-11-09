import { Input } from "@/components";
import { useForm } from "react-hook-form";

const Email: React.FC = () => {
    const { register, handleSubmit } = useForm();

    const submit = (fd: FormData) => {
        
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <Input
                placeholder="Введите почту..."
                label="Текущая почта"
                {...register("email.current")}
            />
            <Input
                placeholder="Введите почту..."
                label="Новая почта"
                {...register("email.new")}
            />
        </form>
    )
}

export default Email;