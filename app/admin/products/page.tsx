import { IconEdit, IconPlus } from "@tabler/icons-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with actual data fetching
const products = [
  {
    id: "prod_1",
    name: "Premium Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    price: 299.99,
    stock: 45,
    category: "Electronics",
    status: "In Stock",
  },
  {
    id: "prod_2",
    name: "Ergonomic Office Chair",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    price: 249.5,
    stock: 12,
    category: "Furniture",
    status: "Low Stock",
  },
  {
    id: "prod_3",
    name: "Smart Watch",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    price: 199.99,
    stock: 28,
    category: "Electronics",
    status: "In Stock",
  },
  {
    id: "prod_4",
    name: "Leather Backpack",
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    price: 89.99,
    stock: 0,
    category: "Accessories",
    status: "Out of Stock",
  },
  {
    id: "prod_5",
    name: "Ceramic Coffee Mug",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    price: 24.99,
    stock: 67,
    category: "Home & Kitchen",
    status: "In Stock",
  },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input placeholder="Search products..." className="w-64" />
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-background group relative overflow-hidden rounded-lg border"
                  >
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {product.category}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <IconEdit className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            ${product.price.toFixed(2)}
                          </p>
                          <Badge
                            variant={
                              product.status === "In Stock"
                                ? "success"
                                : product.status === "Low Stock"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`inventory-${product.id}`}
                            className="flex-1"
                          >
                            In stock: {product.stock}
                          </Label>
                          <Switch
                            id={`inventory-${product.id}`}
                            checked={product.stock > 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-muted-foreground text-xs">
                Showing <strong>{products.length}</strong> of{" "}
                <strong>{products.length}</strong> products
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="in-stock">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products
                  .filter((product) => product.status === "In Stock")
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-background group relative overflow-hidden rounded-lg border"
                    >
                      {/* Same product card as above */}
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {product.category}
                        </p>
                        <div className="mt-2">
                          <p className="font-medium">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            In stock: {product.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Other TabsContent similar to "in-stock" */}
      </Tabs>
    </div>
  );
}
