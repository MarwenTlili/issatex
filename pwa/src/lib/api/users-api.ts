import { ApiService } from "./base";
import type { User } from "@/types/resources/User";
import { API_ENDPOINTS } from "@/config/api";

class UsersApiService extends ApiService<User> {
  constructor() {
    super(API_ENDPOINTS.USERS);
  }
}

export const usersApiService = new UsersApiService();
