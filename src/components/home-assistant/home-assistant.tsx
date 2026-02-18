import React, { useEffect, useState } from "react";

import { LightbulbIcon, LightbulbOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  getAuth,
  createConnection,
  Connection,
  Auth,
} from "home-assistant-js-websocket";
import { usePersistentState } from "@/lib/usePersistentState";

export default function HomeAssistant() {
  const [authTest, setAuth] = usePersistentState<Auth>("auth", null);
  const [ws, setWs] = useState<Connection>();
  const [entities, setEntities] = useState<{}>();
  const [config, setConfig] = useState();

  useEffect(() => {
    getAuth({
      hassUrl: import.meta.env.VITE_HASS_URL,
      saveTokens: setAuth,
      loadTokens: () => authTest,
    })
      .then((auth) => {
        // This is prob a dumb way to remove the `auth_callback` from the url, but installing react-router seems overkill for this.
        // Can revisit if we have other reasons to use react-router
        if (window.location.href.split("?").length > 1) {
          window.location.href = window.location.href.split("?")[0];
        }
        createConnection({ auth }).then((con) => {
          setWs(con);
        });
      })
      .catch((err) => {
        console.error("Failed to authenticate:", err);
      });
  }, []);

  useEffect(() => {
    if (!ws) {
      return;
    }
    fetch("http://localhost:8080/api/hass-config")
      .then((resp) => resp.json())
      .then((respConfig) => {
        setConfig(respConfig);
      })
      .catch((err) => {
        console.log("Failed/parse to fetch hass config:", err);
      });
  }, [ws]);

  useEffect(() => {
    if (!config) {
      return;
    }

    let unsubscribe = ws?.subscribeMessage(
      (msg) => {
        // Presumably 'a' for 'all'
        if (msg["a"]) {
          let updatedEntities = {};
          Object.entries(msg["a"]).forEach(([key, val]) => {
            updatedEntities[key] = val["s"];
          });
          setEntities(updatedEntities);
        }
        // Presumably 'c' for 'change'
        else if (msg["c"]) {
          let updatedEntities = {};
          Object.entries(msg["c"]).forEach(([key, val]) => {
            updatedEntities[key] = val["+"]["s"];
          });
          setEntities((previousState) => ({
            ...previousState,
            ...updatedEntities,
          }));
        }
      },
      {
        id: 3,
        type: "subscribe_entities",
        entity_ids: config.light_entities,
      },
    );

    return async () => {
      unsubscribe?.then((unsubscribeFunc) => unsubscribeFunc());
    };
  }, [config]);

  return (
    <div className="absolute top-0 right-0 p-3">
      {entities &&
        config?.light_entities.map((lightEntitiyId, idx) => {
          return (
            <Button
              key={idx}
              variant="secondary"
              className="ml-2 w-20 h-20"
              onClick={() => {
                ws?.sendMessage({
                  id: 20,
                  type: "call_service",
                  domain: lightEntitiyId.split(".")[0],
                  service: "toggle",
                  target: {
                    entity_id: lightEntitiyId,
                  },
                });
              }}
              disabled={!ws}
            >
              {entities[lightEntitiyId] === "on" ? (
                <LightbulbIcon />
              ) : (
                <LightbulbOffIcon />
              )}
            </Button>
          );
        })}
    </div>
  );
}
