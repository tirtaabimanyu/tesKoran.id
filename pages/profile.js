import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import Spinner from "../components/spinner";
import InputWithStatus from "../components/inputWithStatus";
import styles from "../styles/Profile.module.css";

const checkUsername = async (username) => {
  try {
    await UserService.checkUsername(username);
  } catch (_error) {
    return _error.response.data.username[0];
  }
  return true;
};

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    trigger,
  } = useForm();

  const fetchProfile = () => {
    UserService.getUserProfile()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Server error", { theme: "colored" });
        setLoading(false);
      });
  };

  useEffect(async () => {
    const { user } = await TokenService.refreshToken();
    if (user == null) router.push("/login");
  }, [data]);

  useEffect(() => fetchProfile(), []);

  const onSubmit = (data) => {
    const { username } = data;
    setLoading(true);
    UserService.setUsername(username)
      .then(() => {
        setLoading(false);
        toast.success("Username has been set successfully", {
          theme: "colored",
        });
        fetchProfile();
      })
      .catch((error) => {
        toast.error(error.response.data[0], { theme: "colored" });
        setLoading(false);
      });
  };

  const renderChangeUsername = () => {
    return (
      <div>
        <h3>Please choose a username</h3>
        <p>You can't change it later</p>
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputWithStatus
            fieldName="username"
            debounceWait={500}
            trigger={trigger}
            register={register}
            errors={errors["username"]}
            isDirty={dirtyFields["username"]}
            options={{
              required: true,
              validate: checkUsername,
              value: data?.username,
            }}
          />
          <button type="input" disabled={!isValid}>
            Submit
          </button>
        </form>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div>
        <ToastContainer />
        <p>Email: {data.email}</p>
        <p>Username: {data.username}</p>
        <p>is_active: {data.is_active.toString()}</p>
        <p>can_change_username: {data.can_change_username.toString()}</p>
      </div>
    );
  };

  if (loading) return <Spinner loading={loading} />;
  if (data.can_change_username) return renderChangeUsername();
  else return renderProfile();
}
