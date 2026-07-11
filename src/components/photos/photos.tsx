import { init, searchRandom, type AssetResponseDto } from "@immich/sdk";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_IMMICH_API_KEY;
const BASE_URL = `${import.meta.env.BASE_URL}/api`;

init({
  baseUrl: BASE_URL,
  apiKey: API_KEY,
});

function Photos() {
  const [assets, setAssets] = useState<AssetResponseDto[]>([]);
  const [idx, setIdx] = useState(0);

  const searchAssets = () => {
    searchRandom({
      randomSearchDto: {
        personIds: JSON.parse(import.meta.env.VITE_IMMICH_USERS),
        size: 20,
        withPeople: true,
      },
    })
      .then((resp) => {
        setAssets(
          resp.filter((asset) => asset.people && asset.people.length > 1),
        );
      })
      .catch((err) => {
        console.error("Failed to smart search", err);
      });
  };

  useEffect(() => {
    searchAssets();
    const interval = setInterval(() => {
      searchAssets();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIdx((idx + 1) % assets.length);
    }, 60000);

    return () => {
      clearTimeout(timeout);
    };
  }, [assets, idx]);

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden -z-100">
      <img
        key={assets[idx]?.id}
        className="w-full brightness-50 inset-0 h-[150vh] w-full object-cover animate-[scroll-y_60s_ease-in-out] [animation-fill-mode:forwards]"
        src={`${import.meta.env.VITE_IMMICH_SERVER_URL}/api/assets/${assets[idx]?.id}/thumbnail?size=fullsize&apiKey=${import.meta.env.VITE_IMMICH_API_KEY}`}
      />
    </div>
  );
}

export default Photos;
