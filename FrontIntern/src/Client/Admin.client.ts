import { Client } from "./Client";

export const AdminClient = {
  dashboard: async () => {
    const { data } = await Client.get<{ message: string }>("/Admin/dashboard");
    return data;
  },
};
