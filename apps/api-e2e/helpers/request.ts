import supertest from "supertest";

const BASE_URL = "http://localhost:3001";
export const request = supertest(BASE_URL);
