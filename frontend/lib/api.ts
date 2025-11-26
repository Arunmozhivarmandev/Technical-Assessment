// lib/api.ts
import { apiRequest } from "./apiclient";


export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json" },
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json" },
    }),
};


// Employee API
export const employeeAPI = {
  getList: (params?: {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {

    const query: Record<string, string | number> = {};

    // Attach only non-empty params
    if (params?.search) query.search = params.search;
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;

    // Sort conversion
    if (params?.sort) {
      let sortValue = params.sort;

      if (sortValue.startsWith("-")) {
        // -name -> name:desc
        sortValue = sortValue.slice(1) + ":desc";
      } else {
        // name -> name:asc
        sortValue = sortValue + ":asc";
      }

      query.sort = sortValue;
    }

    return apiRequest("/employees", { params: query });
  },


  getById: (id: string) => apiRequest(`/employees/${id}`),

  // Create employee using FormData
  create: (data: FormData) =>
    apiRequest("/employees", {
      method: "POST",
      body: data,
      headers: {},
    }),

  // Update employee using FormData
  update: (id: string, data: FormData) =>
    apiRequest(`/employees/${id}`, {
      method: "PUT",
      body: data,
      headers: {},
    }),

  delete: (id: string) =>
    apiRequest(`/employees/${id}`, {
      method: "DELETE",
    }),
};
