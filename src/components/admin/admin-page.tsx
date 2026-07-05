import { useNavigate } from "react-router";
import { Button } from "../ui/button";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="p-5 h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl text-bold pb-5 ">Debug Tools</h1>
      <Button
        className="w-48 h-18  text-3xl"
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        Refresh
      </Button>
      <Button
        variant="secondary"
        className="w-48 h-18 text-3xl"
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </Button>
    </div>
  );
}

export default AdminPage;
