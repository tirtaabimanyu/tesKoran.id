import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/spinner";
import AuthService from "../services/auth.service";

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

export default function Activation({ uid, token }) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    AuthService.activation(uid, token)
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Server error", { theme: "colored" });
      });
  }, [uid, token]);

  return success ? (
    <div>
      <h3>Your account has been activated successfully</h3>
      <p>Redirecting to the login page in 3 seconds...</p>
    </div>
  ) : (
    <Spinner loading={loading} />
  );
}
