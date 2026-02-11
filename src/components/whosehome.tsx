import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarGroup } from "./ui/avatar";

type User = {
  name: string;
  status: "ONLINE" | "OFFLINE";
  color: string;
};

export function WhoseHome() {
  const [whoseHome, setWhoseHome] = useState<User[]>([]);

  const fetchWhoseHome = async () => {
    let results: User[];
    try {
      const resultsResp = await fetch("/whoshome/all");
      results = await resultsResp.json();
    } catch (err) {
      results = [
        {
          name: "error",
          status: "ONLINE",
          color: "(199, 0, 54)",
        },
      ];
    }

    if (results.length === 0) {
      results = [
        {
          name: "unavailable",
          status: "ONLINE",
          color: "(54, 65, 83)",
        },
      ];
    }
    setWhoseHome(results);
  };

  useEffect(() => {
    fetchWhoseHome();
    let interval = setInterval(async () => {
      fetchWhoseHome();
    }, 5000);

    return () => {
      interval;
    };
  }, []);

  return (
    <AvatarGroup className="justify-center m-5">
      {whoseHome.map((user, idx) => (
        <Avatar key={idx} size="sm">
          <AvatarFallback
            style={{ backgroundColor: `rgb${user.color}` }}
          ></AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
