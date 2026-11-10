'use client';

import { getAccessToken } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export interface RealtimeEvent {
  event: 'quest.taken' | 'quest.completed' | 'quest.validated' | 'quest.awarded';
  date: string;
  data: Record<string, unknown>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const RECONNECT_DELAY_MS = 4000;

export function useRealtime(onEvent: (e: RealtimeEvent) => void) {
  const queryClient = useQueryClient();
  const handler = useRef(onEvent);

  useEffect(() => {
    handler.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnect: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    function connect() {
      const token = getAccessToken();
      if (!token || closed) {
        return;
      }

      const url = `${API_URL.replace(/^http/, 'ws')}/v1/realtime?token=${token}`;
      socket = new WebSocket(url);

      socket.onopen = () => {
        // A la connexion au socket, on invalide le cache des quêtes
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      };

      socket.onmessage = (message) => {
        const event = JSON.parse(message.data) as RealtimeEvent;
        if (event.event.startsWith('quest.')) {
          queryClient.invalidateQueries({ queryKey: ['quests'] });
        }
        handler.current(event);
      };

      socket.onclose = () => {
        if (!closed) {
          reconnect = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    }

    connect();

    return () => {
      closed = true;
      if (reconnect) {
        clearTimeout(reconnect);
      }
      socket?.close();
    };
  }, [queryClient]);
}
