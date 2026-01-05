import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../../api/login.schema";
import { useLogin } from "../../hooks/api/useLogin";
import { initCurrentUser } from "../../store/authThunks";
import { useAppDispatch } from "../../store/hooks";
//TODO: Validation errors straight on inputs
//TODO: HOC for titles

export function Login() {
  const { register, handleSubmit } = useForm<LoginSchema>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const { mutateAsync } = useLogin();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: LoginSchema) => {
    console.log(values);
    await mutateAsync(values);
    await dispatch(initCurrentUser());
  };
  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-20">
        login
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <span>Username</span>
          <Input {...register("username")} />
          <span>Password</span>
          <Input {...register("password")} />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
