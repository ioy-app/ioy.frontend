import { Input } from "@/components";
import { useForm } from "react-hook-form";

const Delete: React.FC = () => {
    const { register, handleSubmit } = useForm();

    const submit = (fd: FormData) => {
        
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <p className="text title">Удаление аккаунта</p>
        </form>
    )
}

export default Delete;