# SVFree - Nền tảng chia sẻ tài liệu học tập miễn phí

SVFree là một nền tảng web được xây dựng bằng [Next.js](https://nextjs.org), nhằm mục đích tạo ra một không gian chia sẻ tài liệu học tập miễn phí cho sinh viên.

## Tính năng

- Chia sẻ và tải tài liệu học tập miễn phí
- Tìm kiếm tài liệu nhanh chóng

## Bắt đầu phát triển

1. Clone dự án và cài đặt dependencies:

```bash
git clone <repository-url>
cd sv-free
pnpm install
```

2. Thiết lập biến môi trường:

```bash
cp .env.example .env
```

3. Khởi chạy development server:

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## Công nghệ sử dụng

- [Next.js](https://nextjs.org/) - React framework
- [DrizzleORM](https://orm.drizzle.team/) - TypeScript ORM
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Shadcn](https://ui.shadcn.com/docs) - UI Components
- [Tanstack Query](https://tanstack.com/query/latest) - Data fetching
