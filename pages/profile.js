import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import Spinner from "../components/spinner";
import InputWithStatus from "../components/inputWithStatus";
import styles from "../styles/Profile.module.css";

const checkUsername = async (username) => {
  try {
    await UserService.checkUsername(username);
  } catch (_error) {
    const { detail, username } = _error.response.data;
    return detail || username[0];
  }
  return true;
};

const resendActivation = (email) => {
  AuthService.resendActivation(email)
    .then((response) => {
      toast.success("Activation email has been sent", { theme: "colored" });
    })
    .catch((error) => {
      toast.error("Error while sending activation email", { theme: "colored" });
    });
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
    setLoading(true);
    return UserService.getUserProfile()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Can't fetch profile", { theme: "colored" });
        setLoading(false);
      });
  };

  useEffect(() => {
    const { user } = TokenService.getUser();
    if (user == null) router.push("/login");
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = (data) => {
    const { username } = data;
    setLoading(true);
    UserService.setUsername(username)
      .then(() => {
        toast.success("Username has been set successfully", {
          theme: "colored",
        });
        fetchProfile().then(() => {
          TokenService.refreshToken();
        });
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
        <p>You can&apos;t change it later</p>
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
        <p>Email: {data.email}</p>
        <p>Username: {data.username}</p>
        <p>
          is_active: {data.is_active.toString()}{" "}
          {!data.is_active && (
            <span
              className={styles.resendActivation}
              onClick={() => resendActivation(data.email)}
            >
              resend activation email
            </span>
          )}
        </p>
        <p>can_change_username: {data.can_change_username.toString()}</p>
      </div>
    );
  };

  if (!data || loading) return <Spinner loading={loading} />;
  if (data.can_change_username) return renderChangeUsername();
  else return renderProfile();
}
