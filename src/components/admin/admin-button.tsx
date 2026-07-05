import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function AdminButton() {
  const [clickCount, setClickCount] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (clickCount === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setClickCount(0);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [clickCount]);

  if (clickCount === 3) {
    toast.info("Opening admin menu in 5 clicks");
  }

  if (clickCount > 7) {
    navigate("admin");
  }

  return (
    <button
      className="absolute top-0 left-0 w-50 h-50"
      onClick={() => {
        setClickCount(clickCount + 1);
      }}
    />
  );
}

export default AdminButton;
