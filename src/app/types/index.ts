import {
  Section,
  CreateSectionInput,
  UpdateSectionInput,
  SectionImage,
} from "./sections";
import { User, CreateUserInput, UpdateUserInput } from "./users";

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export type {
  Section,
  CreateSectionInput,
  UpdateSectionInput,
  SectionImage,
  User,
  CreateUserInput,
  UpdateUserInput,
  ApiErrorPayload,
};
