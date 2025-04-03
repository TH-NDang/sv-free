import { LifeBuoy } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NavSecondary(
  props: React.ComponentPropsWithoutRef<typeof SidebarGroup>
) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <button
                onClick={() => setHelpOpen(true)}
                className="flex items-center"
              >
                <LifeBuoy />
                <span>Help & Support</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>
              Welcome to our help center. If you need assistance, please read
              our FAQ or contact support via email at support@svfree.com.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
            <div className="space-y-2">
              <p className="font-medium">How do I download documents?</p>
              <p className="text-muted-foreground">
                Click on any document and use the download button on the
                document detail page.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">
                Can I upload my own educational materials?
              </p>
              <p className="text-muted-foreground">
                Yes, navigate to the upload section after logging in to your
                account.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
