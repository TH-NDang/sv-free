"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Save } from "lucide-react";

export default function SettingsPage() {
  const [generalSaved, setGeneralSaved] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleSaveGeneral = () => {
    // Mock save functionality
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2000);
  };

  const handleCopyApiKey = () => {
    // Mock copy functionality
    navigator.clipboard.writeText("sk_live_xyz123abc456def789ghi");
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your site configurations and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic site settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="My Awesome Site" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue="A powerful site with amazing features"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  defaultValue="admin@example.com"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>
                {generalSaved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Configure search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input id="meta-title" defaultValue="My Awesome Site | Home" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  defaultValue="Discover amazing products and services on My Awesome Site"
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input
                  id="meta-keywords"
                  defaultValue="awesome, products, services"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save SEO Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Options</CardTitle>
              <CardDescription>
                Customize the look and feel of your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="primary-color" defaultValue="#007BFF" />
                  <div className="h-8 w-8 rounded-md bg-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="theme-mode">Theme Mode</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="rtl-mode" />
                <Label htmlFor="rtl-mode">RTL Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Theme Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-notifications">
                      Order Notifications
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Receive notifications for new orders
                    </p>
                  </div>
                  <Switch id="order-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-notifications">
                      User Registrations
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Receive notifications for new user registrations
                    </p>
                  </div>
                  <Switch id="user-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-notifications">System Alerts</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive important system status alerts
                    </p>
                  </div>
                  <Switch id="system-notifications" defaultChecked />
                </div>
              </div>
              <div className="space-y-1 pt-4">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@example.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="live-api-key">Live API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="live-api-key"
                    value="sk_live_xyz123abc456def789ghi"
                    readOnly
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyApiKey}
                  >
                    {apiKeyCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="test-api-key">Test API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="test-api-key"
                    value="sk_test_123xyz456abc789def"
                    readOnly
                    type="password"
                  />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline">Generate New API Keys</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks for real-time event notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div className="space-y-1">
                <Label>Events</Label>
                <div className="grid gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <Switch id="order-created" />
                    <Label htmlFor="order-created">Order Created</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="order-updated" />
                    <Label htmlFor="order-updated">Order Updated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="user-created" />
                    <Label htmlFor="user-created">User Created</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Webhook</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
