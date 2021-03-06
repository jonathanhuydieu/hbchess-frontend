import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io, Socket } from 'socket.io-client';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://${window.location.hostname}/api/socket.io`
    : `http://${window.location.hostname}:8080/api/socket.io`;

let socket: Socket;
const getSocket = (token: string) => {
  if (!socket) {
    socket = io(
      process.env.NODE_ENV === 'production'
        ? `https://${window.location.hostname}`
        : `http://${window.location.hostname}:65080`,
      {
        transports: ['websocket'],
        query: {
          token: token
        },
        withCredentials: true
      }
    );
  }
  return socket;
};

export const socketApi = createApi({
  reducerPath: 'socketApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    joinGame: builder.mutation<
      { message: string },
      { token: string; roomId: string; player_id: string }
    >({
      queryFn: ({
        token,
        roomId,
        player_id
      }: {
        token: string;
        roomId: string;
        player_id: string;
      }) => {
        const socket = getSocket(token);
        return new Promise((resolve) => {
          socket.emit('join_game', { roomId, player_id }, (message: string) =>
            resolve({ data: { message } })
          );
        });
      }
    }),
    playerJoins: builder.query<Array<string>, string>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        token,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket(token);

          socket.on('player_joined', (userIds: Array<string>) => {
            updateCachedData((draft) => {
              draft = userIds;
              return draft;
            });
          });
          await cacheEntryRemoved;

          socket.off('player_joined');
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      }
    }),
    pickPiece: builder.mutation<
      { message: string },
      { token: string; roomId: string; piece: string }
    >({
      queryFn: ({
        token,
        roomId,
        piece
      }: {
        token: string;
        roomId: string;
        piece: string;
      }) => {
        const socket = getSocket(token);
        return new Promise((resolve) => {
          socket.emit('pick_piece', { roomId, piece }, (message: string) =>
            resolve({ data: { message } })
          );
        });
      }
    }),
    pickedPiece: builder.query<Array<string>, string>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        token,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket(token);

          socket.on('piecePicked', (pieceType: string) => {
            updateCachedData((draft) => {
              draft.push(pieceType);
            });
          });

          await cacheEntryRemoved;

          socket.off('piecePicked');
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      }
    }),
    makeMove: builder.mutation<
      { message: string },
      { token: string; roomId: string; move: string }
    >({
      queryFn: ({
        token,
        roomId,
        move
      }: {
        token: string;
        roomId: string;
        move: string;
      }) => {
        const socket = getSocket(token);
        return new Promise((resolve) => {
          socket.emit('send_move', { roomId, move }, (message: string) =>
            resolve({ data: { message } })
          );
        });
      }
    }),
    sentMove: builder.query<Array<string>, string>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        token,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket(token);

          socket.on('sentMove', (pieceMoved: string) => {
            updateCachedData((draft) => {
              draft.push(pieceMoved);
            });
          });

          await cacheEntryRemoved;

          socket.off('sentMove');
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      }
    }),
    sendEmoji: builder.mutation<
      { message: string },
      { token: string; roomId: string; emoji: string }
    >({
      queryFn: ({
        token,
        roomId,
        emoji
      }: {
        token: string;
        roomId: string;
        emoji: string;
      }) => {
        const socket = getSocket(token);
        return new Promise((resolve) => {
          socket.emit('send_emoji', { roomId, emoji }, (message: string) =>
            resolve({ data: { message } })
          );
        });
      }
    }),
    sentEmoji: builder.query<Array<string>, string>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        token,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket(token);

          socket.on('sentEmoji', (emoji: string) => {
            updateCachedData((draft) => {
              draft.push(emoji);
            });
          });

          await cacheEntryRemoved;

          socket.off('sentEmoji');
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      }
    })
  })
});

export const {
  useJoinGameMutation,
  usePlayerJoinsQuery,
  usePickPieceMutation,
  usePickedPieceQuery,
  useMakeMoveMutation,
  useSentMoveQuery,
  useSendEmojiMutation,
  useSentEmojiQuery
} = socketApi;
