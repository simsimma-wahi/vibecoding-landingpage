export interface ApiKey {
  id: string;
  name: string;
  type: "dev" | "prod";
  key: string;
  usage: number;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface ApiKeyFormData {
  name: string;
  type: "dev" | "prod";
}

export type ApiKeyType = "dev" | "prod";
export type ToastType = "success" | "error" | "info";
