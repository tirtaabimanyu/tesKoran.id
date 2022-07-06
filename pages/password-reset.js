import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import InputWithStatus from "../components/inputWithStatus";
import Spinner from "../components/spinner";
import styles from "../styles/PasswordReset.module.css";
import { toast } from "react-toastify";

export async function getServerSideProps(context) {
  const { uid, token } = context.query;
  if (!uid || !token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { uid, token },
  };
}

export default function PasswordReset({ uid, token }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    trigger,
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    const { new_password, re_new_password } = data;
    setLoading(true);
    AuthService.resetPasswordConfirm(uid, token, new_password, re_new_password)
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Server error", { theme: "colored" });
      });
  };

  const showInputScreen = () => (
    <div>
      <Spinner loading={loading} />
      <h3>Input a new password</h3>
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <InputWithStatus
          type={"password"}
          placeholder="new password"
          fieldName="new_password"
          debounceWait={500}
          trigger={trigger}
          register={register}
          errors={errors["new_password"]}
          isDirty={dirtyFields["new_password"]}
          options={{
            required: "Password is required",
            onChange: () => trigger("re_new_password"),
            validate: (value) =>
              value.length >= 8 || "Password must be at least 8 character",
          }}
        />
        <InputWithStatus
          type={"password"}
          placeholder="verify password"
          fieldName="re_new_password"
          debounceWait={500}
          trigger={trigger}
          register={register}
          errors={errors["re_new_password"]}
          isDirty={dirtyFields["re_new_password"]}
          options={{
            required: "Please retype your password",
            validate: (value) =>
              value == getValues("new_password") || "Password does not match",
          }}
        />
        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>
    </div>
  );

  const showSuccessScreen = () => (
    <div style={{ "text-align": "center" }}>
      <h3>Your password has been reset successfully</h3>
      <p>Redirecting to the login page in 3 seconds...</p>
    </div>
  );

  return success ? showSuccessScreen() : showInputScreen();
}
