import { useNavigate } from "react-router";
import { Button } from "../ui/button";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="m-5">
      <h1 className="text-xl text-bold pb-5">AdminPage</h1>
      <Button
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        Refresh
      </Button>
    </div>
  );
}

export default AdminPage;
