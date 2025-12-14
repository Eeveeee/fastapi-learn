import { useCreateUser } from "../../hooks/api/useCreateUser";
import { createUserSchema, type CreateUser } from "../../api/users.schema";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function SignUp() {
  const { register, handleSubmit, formState } = useForm<CreateUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      gender: "male",
    },
    resolver: zodResolver(createUserSchema),
  });
  const { mutateAsync, error, isPending } = useCreateUser();

  const onSubmit = (values: CreateUser) => {
    console.log(values);
    mutateAsync(values);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Input {...register("first_name")} />
        <Input {...register("last_name")} />
        <Input {...register("username")} />
        <Input {...register("email")} />
        <Select {...register("gender")}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>gender</SelectLabel>
              <SelectItem value="male">male</SelectItem>
              <SelectItem value="female">female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {formState.errors.email && <p>{formState.errors.email.message}</p>}
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
