export interface ServerToClientEvents {
  "chat message": (msg: string) => void;
}

export interface ClientToServerEvents {
  "chat message": (msg: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
