import { useEffect, useState, useRef } from "react";
import { FaUserPlus, FaSignInAlt, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../styles/Login.module.css";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import Spinner from "../components/spinner";
import InputWithStatus from "../components/inputWithStatus";

const validateEmailPattern = (email) => {
  const pattern =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email) || "Invalid email";
};

const handleForgotPassword = (e) => {
  e.preventDefault();
  const email = prompt("Enter email address");
  if (!email) return;
  AuthService.resetPassword(email)
    .then((response) => {
      toast.success("Password reset email has been sent", { theme: "colored" });
    })
    .catch((error) => {
      toast.error(
        "Can't send the reset password email. Please try again later",
        { theme: "colored" }
      );
    });
};

export async function getServerSideProps(context) {
  const { code, state } = context.query;
  if (code && state) {
    return {
      props: {
        code,
        state,
        initLoading: true,
      },
    };
  }

  return {
    props: {},
  };
}

const useConstructor = (callBack = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
  callBack();
  hasBeenCalled.current = true;
};

export default function Login({ code, state, initLoading }) {
  const router = useRouter();
  const [loading, setLoading] = useState(initLoading);

  useConstructor(() => {
    const { user } = TokenService.getUser();
    if (user) router.push("/profile");
  }, []);

  useEffect(() => {
    if (code && state) {
      AuthService.socialLogin(code, state)
        .then((response) => {
          setLoading(false);
          TokenService.setUser(response);
          router.push("/profile");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data["non_field_errors"][0], {
            theme: "colored",
          });
        });
    }
  }, [code, state]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid, dirtyFields },
    getValues,
  } = useForm();

  const [checkedUsername, setCheckedUsername] = useState({
    username: "",
    value: null,
  });

  const checkUsername = async (username) => {
    if (username == checkedUsername.username) return checkedUsername.value;
    const returnValue = true;

    try {
      await UserService.checkUsername(username);
    } catch (_error) {
      returnValue = _error.response.data?.username[0];
    }

    setCheckedUsername({ username: username, value: returnValue });
    return returnValue;
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    trigger: triggerLogin,
    formState: {
      errors: errorsLogin,
      isValid: isValidLogin,
      dirtyFields: dirtyFieldsLogin,
    },
  } = useForm();

  const onSubmitSignup = (data) => {
    const { username, email, password, re_password } = data;
    AuthService.signup(username, email, password, re_password)
      .then((response) => {
        return AuthService.login(email, password);
      })
      .then((response) => {
        TokenService.setUser(response);
        router.push("profile/");
      })
      .catch((error) => {
        Object.entries(error.response.data).forEach((items) => {
          toast.error(`${items[0]}: ${items[1]}`, { theme: "colored" });
        });
      });
  };

  const onSubmitLogin = (data) => {
    const { email, password } = data;
    AuthService.login(email, password)
      .then((response) => {
        TokenService.setUser(response);
        router.push("profile/");
      })
      .catch((error) => {
        const msg = error.response.data
          ? "Invalid credentials"
          : "Service unavailable";
        toast.error(msg, { theme: "colored" });
      });
  };

  const socialLogin = (e) => {
    e.preventDefault();
    AuthService.getSocialAuthUrl()
      .then((response) => {
        const { authorization_url } = response.data;
        router.push(authorization_url);
      })
      .catch((error) => {
        toast.error("Service unavailable", { theme: "colored" });
      });
  };

  return (
    <div className={styles.container}>
      <Spinner loading={loading} />
      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(onSubmitSignup)}
      >
        <div className={styles.headerText}>Sign Up</div>
        <InputWithStatus
          placeholder="username"
          fieldName="username"
          debounceWait={500}
          trigger={trigger}
          register={register}
          errors={errors["username"]}
          isDirty={dirtyFields["username"]}
          options={{
            required: "Username is required",
            validate: checkUsername,
          }}
        />
        <InputWithStatus
          placeholder="email"
          fieldName="email"
          debounceWait={250}
          trigger={trigger}
          register={register}
          errors={errors["email"]}
          isDirty={dirtyFields["email"]}
          options={{
            required: "Email is required",
            onChange: () => trigger("re_email"),
            validate: validateEmailPattern,
          }}
        />
        <InputWithStatus
          placeholder="verify email"
          fieldName="re_email"
          debounceWait={250}
          trigger={trigger}
          register={register}
          errors={errors["re_email"]}
          isDirty={dirtyFields["re_email"]}
          options={{
            required: "Please retype your email",
            validate: (value) =>
              value == getValues("email") || "Email does not match",
          }}
        />
        <InputWithStatus
          type="password"
          placeholder="password"
          fieldName="password"
          debounceWait={250}
          trigger={trigger}
          register={register}
          errors={errors["password"]}
          isDirty={dirtyFields["password"]}
          options={{
            required: "Password is required",
            onChange: () => trigger("re_password"),
            validate: (value) =>
              value.length >= 8 || "Password must be at least 8 character",
          }}
        />
        <InputWithStatus
          type="password"
          placeholder="verify password"
          fieldName="re_password"
          debounceWait={250}
          trigger={trigger}
          register={register}
          errors={errors["re_password"]}
          isDirty={dirtyFields["re_password"]}
          options={{
            required: "Please retype your password",
            validate: (value) =>
              value == getValues("password") || "Password does not match",
          }}
        />
        <button type="submit" disabled={!isValid}>
          <FaUserPlus size={20} />
          Sign Up
        </button>
      </form>
      <div className={styles.separator} />
      <form
        className={styles.formContainer}
        onSubmit={handleSubmitLogin(onSubmitLogin)}
      >
        <div className={styles.loginHeader}>
          <div className={styles.headerText}>Log In</div>
          <div className={styles.subHeaderText} onClick={handleForgotPassword}>
            Forgot password?
          </div>
        </div>
        <InputWithStatus
          placeholder="email"
          fieldName="email"
          debounceWait={250}
          trigger={triggerLogin}
          register={registerLogin}
          errors={errorsLogin["email"]}
          isDirty={dirtyFieldsLogin["email"]}
          options={{
            required: "Email is required",
            validate: validateEmailPattern,
          }}
        />
        <InputWithStatus
          type="password"
          placeholder="password"
          fieldName="password"
          debounceWait={250}
          trigger={triggerLogin}
          register={registerLogin}
          errors={errorsLogin["password"]}
          isDirty={dirtyFieldsLogin["password"]}
          options={{
            required: "Password is required",
            validate: (value) =>
              value.length >= 8 || "Password must be at least 8 character",
          }}
        />
        <button type="submit">
          <FaSignInAlt size={20} />
          Sign In
        </button>
        <div className={styles.centered}>or</div>
        <button onClick={socialLogin}>
          <FaGoogle size={20} />
          Google Sign In
        </button>
      </form>
    </div>
  );
}
