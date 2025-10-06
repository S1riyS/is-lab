import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Store } from "@reduxjs/toolkit";
import { baseApi } from "@common/api/baseApi";

type Operation = "CREATE" | "UPDATE" | "DELETE";

type ChangeEvent = {
    entity: string;
    operation: Operation;
    id: number;
};

const entityToTags: Record<string, { list: string; single: (id: number) => { type: string; id: number }[] }> = {
    tickets: { list: "Tickets", single: (id) => [{ type: "Tickets", id }] },
    persons: { list: "Persons", single: (id) => [{ type: "Persons", id }] },
    locations: { list: "Locations", single: (id) => [{ type: "Locations", id }] },
    coordinates: { list: "Coordinates", single: (id) => [{ type: "Coordinates", id }] },
    events: { list: "Events", single: (id) => [{ type: "Events", id }] },
    venues: { list: "Venues", single: (id) => [{ type: "Venues", id }] },
};

export function initSync(store: Store) {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "/";
        // If base points to REST prefix like /api, strip it for websocket endpoint at /ws
        const withoutApi = baseUrl.endsWith("/api") ? baseUrl.slice(0, -4) : baseUrl;
        const normalized = withoutApi.endsWith("/") ? withoutApi.slice(0, -1) : withoutApi;
        const wsUrl = normalized + "/ws";

        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl) as any,
            reconnectDelay: 3000,
            debug: () => { },
            onConnect: () => {
                client.subscribe("/topic/changes", (message) => {
                    try {
                        const event: ChangeEvent = JSON.parse(message.body);
                        const mapping = entityToTags[event.entity];
                        if (!mapping) return;

                        store.dispatch(baseApi.util.invalidateTags([{ type: mapping.list, id: "LIST" }] as any));
                        if (event.operation === "CREATE" || event.operation === "UPDATE") {
                            store.dispatch(baseApi.util.invalidateTags(mapping.single(event.id) as any));
                        }
                        if (event.operation === "DELETE") {
                            store.dispatch(baseApi.util.invalidateTags(mapping.single(event.id) as any));
                        }
                    } catch {
                        // ignore
                    }
                });
            },
        });

        client.activate();

        return () => {
            try {
                client.deactivate();
            } catch {
                // ignore
            }
        };
    } catch {
        return () => { };
    }
}



