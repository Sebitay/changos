export type {
  Section,
  CreateSectionInput,
  UpdateSectionInput,
  SectionImage,
} from "./sections";
export type { User, CreateUserInput, UpdateUserInput } from "./users";

export type ApiErrorPayload = {
  error?: string;
  message?: string;
};
