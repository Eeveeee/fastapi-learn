import { Button, TextInput, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";

import { useCreateUser } from "../../hooks/api/useCreateUser";
import { createUserSchema, type CreateUser } from "../../api/users.schema";

export function SignUp() {
  const form = useForm<CreateUser>({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      gender: "male",
    },
    validate: zod4Resolver(createUserSchema),
  });
  const { mutateAsync, error, isPending } = useCreateUser();

  const onSubmit = (values: CreateUser) => {
    console.log(values);
    mutateAsync(values);
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput label="First name" {...form.getInputProps("first_name")} />
        <TextInput label="Last name" {...form.getInputProps("last_name")} />
        <TextInput label="Username" {...form.getInputProps("username")} />
        <TextInput label="Email" {...form.getInputProps("email")} />

        <Select
          label="Gender"
          data={[
            { value: "male", label: "male" },
            { value: "female", label: "female" },
          ]}
          {...form.getInputProps("gender")}
        />

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
