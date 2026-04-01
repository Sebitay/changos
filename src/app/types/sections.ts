export type SectionImage = {
  id: string;
  sectionId: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  name: string;
  title: string;
  content: string;
  order: number;
  show: boolean;
  createdAt: string;
  updatedAt: string;
  images: SectionImage[];
};

export type CreateSectionInput = {
  name: string;
  title: string;
  content: string;
  order: number;
  show: boolean;
  images?: string[];
};

export type UpdateSectionInput = {
  id: string;
  name: string;
  title: string;
  content: string;
  order: number;
  show: boolean;
  images: string[];
};
