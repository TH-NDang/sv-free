import { faker } from "@faker-js/faker";

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  uploadDate: string;
  downloadCount: number;
  fileSize: string;
  fileType: string;
  thumbnailUrl: string;
  status: "Published" | "Draft" | "Archived";
}

export const DOCUMENT_CATEGORIES = [
  "Programming",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "History",
  "Literature",
] as const;

export function createRandomDocument(): Document {
  const fileTypes = ["PDF", "DOCX", "PPTX", "ZIP"];
  const fileType = faker.helpers.arrayElement(fileTypes);

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 5 }),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(DOCUMENT_CATEGORIES),
    author: faker.person.fullName(),
    uploadDate: faker.date.recent({ days: 60 }).toISOString(),
    downloadCount: faker.number.int({ min: 0, max: 1000 }),
    fileSize:
      faker.number.float({ min: 0.1, max: 10, fractionDigits: 1 }) + " MB",
    fileType,
    thumbnailUrl: faker.image.urlLoremFlickr({
      category: "education",
      width: 640,
      height: 400,
    }),
    status: faker.helpers.arrayElement(["Published", "Draft", "Archived"]),
  };
}

export const generateSampleDocuments = (count: number = 50) => {
  return faker.helpers.multiple(createRandomDocument, { count });
};
