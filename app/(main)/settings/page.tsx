import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountCard,
  ProvidersCard,
  RedirectToSignIn,
  SessionsCard,
  SignedIn,
  UpdateAvatarCard,
  UpdateUsernameCard,
} from "@daveyplate/better-auth-ui";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account preferences and security settings",
};

interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  type: "switch" | "checkbox";
  defaultChecked?: boolean;
  disabled?: boolean;
}

function NotificationItem({
  id,
  title,
  description,
  type,
  defaultChecked,
  disabled,
}: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {title}
        </Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {type === "switch" ? (
        <Switch id={id} defaultChecked={defaultChecked} disabled={disabled} />
      ) : (
        <Checkbox id={id} defaultChecked={defaultChecked} disabled={disabled} />
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-base font-medium">{children}</h2>;
}

function SettingsCard({
  title,
  description,
  children,
  isDestructive = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isDestructive?: boolean;
}) {
  return (
    <div
      className={`bg-card rounded-lg p-6 ${isDestructive ? "border-destructive bg-destructive/5 border" : "bg-muted/30"}`}
    >
      <div className="mb-4">
        <h3
          className={`text-base font-medium ${isDestructive ? "text-destructive" : ""}`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <RedirectToSignIn />

      <SignedIn>
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mb-6 flex flex-col space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your account preferences and security
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-muted/60 mb-8 grid h-12 w-full grid-cols-3 rounded-lg p-1">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-background rounded-md py-2.5 text-sm data-[state=active]:shadow-sm"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-background rounded-md py-2.5 text-sm data-[state=active]:shadow-sm"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-background rounded-md py-2.5 text-sm data-[state=active]:shadow-sm"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[500px] transition-all duration-300 ease-in-out">
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <div className="mx-auto max-w-xl">
                  <div className="space-y-8">
                    <SettingsCard
                      title="Avatar"
                      description="Click on the avatar to upload a custom one from your files."
                    >
                      <UpdateAvatarCard />
                    </SettingsCard>

                    <SettingsCard
                      title="Username"
                      description="Enter the username you want to use to log in."
                    >
                      <UpdateUsernameCard />
                    </SettingsCard>

                    <SettingsCard
                      title="Email"
                      description="Enter the email address you want to use to log in."
                    >
                      <ChangeEmailCard />
                    </SettingsCard>

                    <SettingsCard
                      title="Delete Account"
                      description="Permanently delete your account"
                      isDestructive
                    >
                      <DeleteAccountCard />
                    </SettingsCard>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0">
                <div className="mx-auto max-w-xl">
                  <div className="space-y-8">
                    <SettingsCard
                      title="Password"
                      description="Change your password"
                    >
                      <ChangePasswordCard />
                    </SettingsCard>

                    <SettingsCard
                      title="Login Providers"
                      description="Manage sign-in services"
                    >
                      <ProvidersCard />
                    </SettingsCard>

                    <SettingsCard
                      title="Active Sessions"
                      description="Manage active login sessions"
                    >
                      <SessionsCard />
                    </SettingsCard>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0">
                <div className="mx-auto max-w-xl">
                  <div className="space-y-8">
                    <SettingsCard
                      title="Notification Settings"
                      description="Customize notification preferences"
                    >
                      <div className="space-y-8">
                        <div>
                          <SectionTitle>Delivery Methods</SectionTitle>
                          <div className="space-y-4">
                            <NotificationItem
                              id="notification-email"
                              title="Email Notifications"
                              description="Updates via email"
                              type="switch"
                            />
                            <NotificationItem
                              id="notification-push"
                              title="Push Notifications"
                              description="Alerts on your devices"
                              type="switch"
                            />
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <SectionTitle>Notification Types</SectionTitle>
                          <div className="space-y-4">
                            <NotificationItem
                              id="notification-account"
                              title="Account Activity"
                              description="Sign-ins and account changes"
                              type="checkbox"
                            />
                            <NotificationItem
                              id="notification-security"
                              title="Security Alerts"
                              description="Security-related notifications"
                              type="checkbox"
                              defaultChecked
                              disabled
                            />
                            <NotificationItem
                              id="notification-marketing"
                              title="Marketing & Updates"
                              description="News about features"
                              type="checkbox"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <Button type="button">Save Settings</Button>
                      </div>
                    </SettingsCard>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SignedIn>
    </>
  );
}
