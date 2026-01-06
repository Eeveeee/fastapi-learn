import type { UserPrivate } from "../../api/currentUser.schema";
import { useAppSelector } from "../../store/hooks";
type FieldValueProps = {
  label: keyof UserPrivate;
  value: string;
};
function FieldValue(props: FieldValueProps) {
  const { label, value } = props;
  return (
    <div className="text-2xl flex align-middle ">
      <div className="mr-2">{label}: </div>
      <div>{value}</div>
    </div>
  );
}
const fields: (keyof UserPrivate)[] = ["first_name", "last_name", "email", "role", "gender"];
export function SelfProfile() {
  const selfInfo = useAppSelector((state) => state.auth.currentUser);
  console.log("SELF INFO: ", selfInfo);

  if (!selfInfo) return null;

  return (
    <div>
      <div className="text-4xl">Your Profile</div>
      <div className="text-3xl">{selfInfo?.username}</div>
      {fields.map((field) => (
        <FieldValue key={field} label={field} value={String(selfInfo[field])} />
      ))}
    </div>
  );
}
