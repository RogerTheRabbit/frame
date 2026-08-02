import { AssetTypeEnum, init, searchRandom } from "@immich/sdk";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_IMMICH_API_KEY;
const BASE_URL = `${import.meta.env.PROD ? import.meta.env.BASE_URL : ""}/api`;
const REPEAT_COUNT = 10;
const IMAGE_DURATION_SECONDS = 60;

init({
  baseUrl: BASE_URL,
  apiKey: API_KEY,
});

function Photos() {
  const [queue, setQueue] = useState<string[]>([]);

  const searchAssets = () => {
    searchRandom({
      randomSearchDto: {
        personIds: JSON.parse(import.meta.env.VITE_IMMICH_USERS),
        size: 20,
        withPeople: true,
        type: AssetTypeEnum.Image,
      },
    })
      .then((resp) => {
        const filteredResp = resp.filter(
          (asset) => asset.people && asset.people.length > 1,
        );
        let toAppend: string[] = Array(REPEAT_COUNT)
          .fill(filteredResp)
          .flat()
          .map((asset) => asset.id);
        setQueue([...queue, ...toAppend]);
      })
      .catch((err) => {
        console.error("Failed to smart search", err);
      });
  };

  useEffect(() => {
    searchAssets();
  }, []);

  useEffect(() => {
    if (queue.length < 5) {
      searchAssets();
    }

    const timeout = setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, IMAGE_DURATION_SECONDS * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [queue]);

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden -z-100">
      <img
        key={queue[0]}
        className={
          "w-full brightness-50 inset-0 h-[150vh] w-full object-cover animate-[scroll-y_60s_ease-in-out] [animation-fill-mode:forwards] transition-opacity duration-500 opacity-100"
        }
        src={`${import.meta.env.VITE_IMMICH_SERVER_URL}/api/assets/${queue[0]}/thumbnail?size=fullsize&apiKey=${import.meta.env.VITE_IMMICH_API_KEY}`}
      />
      <img
        key={queue[1]}
        className={
          "w-full brightness-50 inset-0 h-[150vh] w-full object-cover transition-opacity duration-500 opacity-0"
        }
        src={`${import.meta.env.VITE_IMMICH_SERVER_URL}/api/assets/${queue[1]}/thumbnail?size=fullsize&apiKey=${import.meta.env.VITE_IMMICH_API_KEY}`}
      />
    </div>
  );
}

export default Photos;
