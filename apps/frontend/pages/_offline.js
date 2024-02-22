import { FaHeartBroken } from "react-icons/fa";

export default function OfflineFallback() {
  return (
    <div style={{ textAlign: "center" }}>
      <p>{`You're offline`}</p>
      <p>{`Please check your connection 🥲`}</p>
      <FaHeartBroken size={64} />
    </div>
  );
}
