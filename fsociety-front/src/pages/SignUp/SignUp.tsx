import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpUserSchema, type SignUpSchema } from "../../api/signup.schema";
import { useSignUp } from "../../hooks/api/useSignUp";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@radix-ui/react-select";
import { Select } from "../../components/ui/select";

//TODO: Validation errors straight on inputs
//TODO: HOC for titles

export function SignUp() {
  const { register, handleSubmit } = useForm<SignUpSchema>({
    defaultValues: {
      password: "",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      gender: "male",
    },
    resolver: zodResolver(signUpUserSchema),
  });
  const { mutateAsync } = useSignUp();

  const onSubmit = (values: SignUpSchema) => {
    console.log(values);
    mutateAsync(values);
  };
  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-20">
        SignUp
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <Input {...register("first_name")} />
          <Input {...register("last_name")} />
          <Input {...register("username")} />
          <Input {...register("email")} />
          <Select {...register("gender")}>
            <SelectTrigger>
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

          <span>Password</span>
          <Input {...register("password")} />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
