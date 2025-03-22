import {
  IconDatabaseImport,
  IconDownload,
  IconFileDescription,
  IconFolder,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

import { ChartAreaInteractive } from "@/app/admin/components/chart-area-interactive";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/lib/db/queries/categories";
import { getDocumentCount } from "@/lib/db/queries/documents";
import { getTags } from "@/lib/db/queries/tags";

export default async function AdminDashboard() {
  const totalDocuments = await getDocumentCount();
  const totalCategories = (await getCategories()).length;
  const totalTags = (await getTags()).length;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid gap-4 px-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <IconFileDescription className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-muted-foreground text-xs">
                Educational resources in the library
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <IconFolder className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-muted-foreground text-xs">
                Document classification categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
              <IconTag className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTags}</div>
              <p className="text-muted-foreground text-xs">
                Tags for document organization
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <IconDownload className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-muted-foreground text-xs">
                Total document downloads
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="px-4 lg:px-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Document Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <ChartAreaInteractive />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 px-4 md:grid-cols-2 md:gap-6 lg:grid-cols-7 lg:px-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Recently added educational materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                        <IconFileDescription className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Sample Document {i}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Added by admin
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto font-medium">
                      {i} day{i !== 1 ? "s" : ""} ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-1">
                      <IconUser className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New user registered
                      </p>
                      <p className="text-muted-foreground text-xs">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-1">
                      <IconFileDescription className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New document uploaded
                      </p>
                      <p className="text-muted-foreground text-xs">
                        15 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-1">
                      <IconFolder className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Category created
                      </p>
                      <p className="text-muted-foreground text-xs">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-1">
                      <IconDatabaseImport className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        System backup completed
                      </p>
                      <p className="text-muted-foreground text-xs">
                        3 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center px-4 lg:px-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/admin/documents">Manage Documents</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
