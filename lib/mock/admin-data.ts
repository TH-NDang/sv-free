// Mock data for admin dashboard

// Mock documents data
export const mockDocuments = [
  {
    id: "doc-1",
    title: "Toán học lớp 12",
    description: "Tài liệu ôn tập toán học lớp 12",
    fileUrl: "https://example.com/documents/toan-12.pdf",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Toán học" },
    tags: [
      { id: "tag-1", name: "Lớp 12" },
      { id: "tag-2", name: "Ôn thi" },
    ],
    createdAt: "2023-09-15T08:30:00Z",
    updatedAt: "2023-09-15T08:30:00Z",
    downloads: 127,
    status: "published",
  },
  {
    id: "doc-2",
    title: "Ngữ văn lớp 11",
    description: "Bài giảng ngữ văn lớp 11",
    fileUrl: "https://example.com/documents/van-11.pdf",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Ngữ văn" },
    tags: [
      { id: "tag-3", name: "Lớp 11" },
      { id: "tag-4", name: "Bài giảng" },
    ],
    createdAt: "2023-10-05T10:15:00Z",
    updatedAt: "2023-10-06T14:20:00Z",
    downloads: 83,
    status: "published",
  },
  {
    id: "doc-3",
    title: "Vật lý lớp 10",
    description: "Bài tập vật lý lớp 10 có đáp án",
    fileUrl: "https://example.com/documents/vatly-10.pdf",
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Vật lý" },
    tags: [
      { id: "tag-5", name: "Lớp 10" },
      { id: "tag-6", name: "Bài tập" },
    ],
    createdAt: "2023-11-12T09:45:00Z",
    updatedAt: "2023-11-12T09:45:00Z",
    downloads: 56,
    status: "published",
  },
  {
    id: "doc-4",
    title: "Hóa học lớp 12",
    description: "Tài liệu ôn thi đại học môn hóa",
    fileUrl: "https://example.com/documents/hoa-12.pdf",
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Hóa học" },
    tags: [
      { id: "tag-1", name: "Lớp 12" },
      { id: "tag-2", name: "Ôn thi" },
    ],
    createdAt: "2023-12-03T11:30:00Z",
    updatedAt: "2023-12-04T08:15:00Z",
    downloads: 92,
    status: "published",
  },
  {
    id: "doc-5",
    title: "Tiếng Anh lớp 11",
    description: "Tài liệu ngữ pháp tiếng Anh lớp 11",
    fileUrl: "https://example.com/documents/english-11.pdf",
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Tiếng Anh" },
    tags: [
      { id: "tag-3", name: "Lớp 11" },
      { id: "tag-7", name: "Ngữ pháp" },
    ],
    createdAt: "2024-01-15T13:20:00Z",
    updatedAt: "2024-01-15T13:20:00Z",
    downloads: 64,
    status: "pending",
  },
];

// Mock categories data
export const mockCategories = [
  {
    id: "cat-1",
    name: "Toán học",
    description: "Tài liệu học tập môn toán các cấp",
    documentCount: 15,
    createdAt: "2023-08-01T08:00:00Z",
  },
  {
    id: "cat-2",
    name: "Ngữ văn",
    description: "Các bài giảng và tài liệu môn ngữ văn",
    documentCount: 12,
    createdAt: "2023-08-02T09:30:00Z",
  },
  {
    id: "cat-3",
    name: "Vật lý",
    description: "Tài liệu học tập và bài tập môn vật lý",
    documentCount: 8,
    createdAt: "2023-08-03T10:15:00Z",
  },
  {
    id: "cat-4",
    name: "Hóa học",
    description: "Sách giáo khoa và bài tập môn hóa học",
    documentCount: 7,
    createdAt: "2023-08-04T11:45:00Z",
  },
  {
    id: "cat-5",
    name: "Tiếng Anh",
    description: "Tài liệu học tập môn tiếng Anh",
    documentCount: 14,
    createdAt: "2023-08-05T13:20:00Z",
  },
];

// Mock tags data
export const mockTags = [
  {
    id: "tag-1",
    name: "Lớp 12",
    documentCount: 22,
    createdAt: "2023-08-01T08:30:00Z",
  },
  {
    id: "tag-2",
    name: "Ôn thi",
    documentCount: 18,
    createdAt: "2023-08-01T09:15:00Z",
  },
  {
    id: "tag-3",
    name: "Lớp 11",
    documentCount: 16,
    createdAt: "2023-08-02T10:00:00Z",
  },
  {
    id: "tag-4",
    name: "Bài giảng",
    documentCount: 25,
    createdAt: "2023-08-02T11:30:00Z",
  },
  {
    id: "tag-5",
    name: "Lớp 10",
    documentCount: 14,
    createdAt: "2023-08-03T13:45:00Z",
  },
  {
    id: "tag-6",
    name: "Bài tập",
    documentCount: 30,
    createdAt: "2023-08-04T08:20:00Z",
  },
  {
    id: "tag-7",
    name: "Ngữ pháp",
    documentCount: 11,
    createdAt: "2023-08-05T09:40:00Z",
  },
];

// Function to simulate fetching documents with filtering
export function getDocuments(options?: {
  categoryId?: string;
  tagId?: string;
  searchTerm?: string;
  status?: string;
}) {
  let filteredDocs = [...mockDocuments];

  if (options?.categoryId) {
    filteredDocs = filteredDocs.filter(
      (doc) => doc.categoryId === options.categoryId
    );
  }

  if (options?.tagId) {
    filteredDocs = filteredDocs.filter((doc) =>
      doc.tags.some((tag) => tag.id === options.tagId)
    );
  }

  if (options?.searchTerm) {
    const search = options.searchTerm.toLowerCase();
    filteredDocs = filteredDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(search) ||
        (doc.description && doc.description.toLowerCase().includes(search))
    );
  }

  if (options?.status) {
    filteredDocs = filteredDocs.filter((doc) => doc.status === options.status);
  }

  return filteredDocs;
}

// Function to simulate fetching categories with filtering
export function getCategories(searchTerm?: string) {
  if (!searchTerm) return mockCategories;

  const search = searchTerm.toLowerCase();
  return mockCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(search) ||
      (category.description &&
        category.description.toLowerCase().includes(search))
  );
}

// Function to simulate fetching tags with filtering
export function getTags(searchTerm?: string) {
  if (!searchTerm) return mockTags;

  const search = searchTerm.toLowerCase();
  return mockTags.filter((tag) => tag.name.toLowerCase().includes(search));
}
