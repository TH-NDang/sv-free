# Quy tắc cho dự án Next.js (App Router, TS, Tailwind, Shadcn/ui, Sonner, Zustand, TanStack Query, Drizzle)

## 1. Tổng quan & Công nghệ chính

- **Framework:** **Next.js 15** (hoặc phiên bản mới nhất hỗ trợ ổn định App Router).
- **Routing:** Sử dụng **App Router**. **KHÔNG** sử dụng thư mục `src`.
- **Ngôn ngữ:** TypeScript (strict mode).
- **Styling:** **Tailwind CSS**.
- **UI Library:** **Shadcn/ui**.
  - Thêm components bằng lệnh `npx shadcn@latest add [component-name]`.
  - Sử dụng **Sonner** (thêm qua Shadcn) làm thư viện hiển thị thông báo (Toast).
- **Database ORM:** **Drizzle ORM** + **Drizzle Kit**.
- **State Management:**
  - **Server State:** **TanStack Query (React Query)**.
  - **Client State:** **Zustand** (global/complex), React Hooks (local).
- **Data Fetching/Mutations (Server-side):** **Drizzle ORM** trong **API Routes** / **Server Actions**.

## 2. Cấu trúc thư mục

- `app/`: Routes, layouts, pages...
- `components/`: UI components.
  - `components/ui/`: Chứa các component của Shadcn/ui (bao gồm cả `sonner` sau khi add). **Chỉ tùy chỉnh** tại đây.
- `lib/`: Utilities, helpers.
  - `lib/db/`: Drizzle (schema, client).
  - `lib/utils.ts`: Helpers chung (bao gồm `cn`).
  - `lib/queryClient.ts`: TanStack Query client config.
    - `lib/store/`: Zustand stores.
    - `lib/types/`: Shared types.
- `providers/` hoặc `components/providers/`: Context providers (QueryClientProvider, Toaster...).
- `styles/`: Global CSS.
- `public/`: Static assets.
- `drizzle.config.ts`: Drizzle Kit config.

## 3. Component Development

- Sử dụng `.tsx`. Định nghĩa kiểu cho props.
- **Ưu tiên Server Components** cho hiển thị tĩnh/fetch lần đầu.
- Sử dụng **`'use client'`** cho component cần tương tác, TanStack Query, Zustand.
- **Sử dụng Shadcn/ui:**
  - **Thêm components vào dự án bằng lệnh CLI:** `npx shadcn@latest add [component-name]` (ví dụ: `npx shadcn-ui@latest add button sonner`).
  - Kiểm tra xem Shadcn/ui có cung cấp component phù hợp trước khi tự xây dựng.
  - Import trực tiếp từ alias đã cấu hình: `import { Button } from '@/components/ui/button';`
  - Sử dụng component `<Toaster />` từ Sonner (đặt trong layout hoặc provider) và gọi hàm `toast()` từ `'sonner'` để hiển thị thông báo.
- Giữ component nhỏ gọn, tái sử dụng.

## 4. Styling (Tailwind CSS)

- Sử dụng utility classes trực tiếp.
- Dùng `clsx`/`tailwind-merge` (qua `cn` từ `lib/utils`).
- Cấu hình theme trong `tailwind.config.js`.
- Hạn chế `@apply` và inline styles.

## 5. TypeScript

- Kiểu dữ liệu chặt chẽ, tránh `any`.
- Định nghĩa `interface`/`type` rõ ràng.
- Tận dụng type safety của Drizzle.

## 6. Data Fetching, Mutations & Database Interaction

- **Database Schema & Migrations:**
  - Định nghĩa schema trong `lib/db/schema.ts`.
  - Sử dụng **Drizzle Kit** để tạo và áp dụng migrations.
- **Server-Side Logic (API Routes / Server Actions):**
  - Sử dụng **Drizzle ORM** để tương tác DB.
  - Server Actions là cách được khuyến khích cho mutations.
- **Server Components:**
  - Fetch dữ liệu ban đầu (gọi Server Actions hoặc truy vấn DB).
- **Client Components (`'use client'`):**
  - **KHÔNG** dùng Drizzle trực tiếp.
  - Gọi API Routes/Server Actions qua **TanStack Query**:
    - `useQuery`: Để đọc dữ liệu.
    - `useMutation`: Để ghi/cập nhật/xóa. Sử dụng các callback như `onSuccess`, `onError` để **hiển thị thông báo bằng Sonner** (ví dụ: `toast.success('Cập nhật thành công!')`, `toast.error('Đã có lỗi xảy ra.')`).
    - Cấu hình `QueryClient` và sử dụng `<QueryClientProvider>`.
  - Đặt `<Toaster />` (từ `sonner`, thường import từ `@/components/ui/sonner`) ở cấp cao trong cây component (ví dụ trong Root Layout hoặc Provider Component).
- **Client State:** **Zustand** hoặc React Hooks.

## 7. Conventions & Best Practices

- ESLint, Prettier.
- Code rõ ràng, comment khi cần.
- Ưu tiên `named exports`.
- Quản lý Migrations Drizzle cẩn thận.
- Giữ dependencies cập nhật.
- Components: PascalCase (e.g., MyComponent)
- Functions and variables: camelCase (e.g., myFunction)
- Files: kebab-case (e.g., my-component.tsx)

## 8. Quy chuẩn Git & Commit Message

- Conventional Commits + Gitmoji.
- Cấu trúc: `<emoji> <type>(<scope>): <subject>`.
- Scope ví dụ: `auth`, `ui`, `api`, `db`, `schema`, `store`, `query`, `toast`.
- Ví dụ:
  - `✨ feat(ui): add Sonner toast component via shadcn-ui`
  - `🔧 chore(toast): integrate Sonner for mutation feedback`
  - `🐛 fix(db): correct type definition for posts table`

## 9. Tài liệu & Tham khảo

- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **TypeScript Handbook:** [https://www.typescriptlang.org/docs/handbook/intro.html](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Shadcn/ui Documentation:** [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
  - **CLI (Lệnh add):** [https://ui.shadcn.com/docs/cli](https://ui.shadcn.com/docs/cli)
  - **Sonner (Toast):** [https://ui.shadcn.com/docs/components/sonner](https://ui.shadcn.com/docs/components/sonner) (hoặc link tới repo Sonner nếu cần: [https://github.com/emilkowalski/sonner](https://github.com/emilkowalski/sonner))
- **Zustand Documentation:** [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **TanStack Query Documentation:** [https://tanstack.com/query/latest/docs/react/overview](https://tanstack.com/query/latest/docs/react/overview)
- **Drizzle ORM Documentation:** [https://orm.drizzle.team/docs/overview](https://orm.drizzle.team/docs/overview)
- **Drizzle Kit Documentation:** [https://orm.drizzle.team/kit-docs/overview](https://orm.drizzle.team/kit-docs/overview)
- **Conventional Commits:** [https://www.conventionalcommits.org/](https://www.conventionalcommits.org/)
- **Gitmoji:** [https://gitmoji.dev/](https://gitmoji.dev/)
- **ESLint:** [https://eslint.org/](https://eslint.org/)
- **Prettier:** [https://prettier.io/](https://prettier.io/)
