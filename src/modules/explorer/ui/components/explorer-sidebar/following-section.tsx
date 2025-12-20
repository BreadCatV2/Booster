"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroupLabel } from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

export const FollowingSection = () => {
    const pathname = usePathname();
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const { data: users } = trpc.follows.getFollowingWithRecentUploads.useQuery(undefined, {
        enabled: !!isSignedIn,
    });
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    if (!isSignedIn) {
        return (
            <SidebarGroup className="relative bg-background">
                <SidebarGroupLabel>Recent Uploads</SidebarGroupLabel>
                <SidebarGroupContent className="relative z-10 bg-background">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                onClick={() => clerk.openSignIn()}
                                className="text-sm text-muted-foreground hover:text-foreground h-auto py-2 whitespace-normal"
                            >
                                Sign in to see recent uploads!  
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    if (!users || users.length === 0) return null;

    return (
        <SidebarGroup className="relative bg-background">
            <SidebarGroupLabel>Recent Uploads</SidebarGroupLabel>
            <SidebarGroupContent className="relative z-10 bg-background">
                <SidebarMenu>
                    {users.map((user) => {
                        const isActive = pathname === `/users/${user.id}`;
                        const isHovered = hoveredItem === user.id;
                        const hasNewVideo = new Date(user.lastUploadDate).getTime() > Date.now() - 12 * 60 * 60 * 1000;
                        
                        return (
                            <SidebarMenuItem key={user.id} className="relative">
                                {/* Active state background */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-accent rounded-full border border-border shadow-sm" />
                                )}
                                
                                {/* Hover state background */}
                                {isHovered && !isActive && (
                                    <div className="absolute inset-0 bg-accent/50 rounded-full transition-all duration-200" />
                                )}

                                <SidebarMenuButton
                                    tooltip={user.name}
                                    asChild
                                    isActive={isActive}
                                    onMouseEnter={() => setHoveredItem(user.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`
                                        relative
                                        transition-all duration-200
                                        rounded-full
                                        ${isActive 
                                            ? 'bg-accent/50 rounded-full' 
                                            : 'hover:bg-accent/30'
                                        }
                                        group
                                        h-12 
                                        mx-0.5 
                                    `}
                                >
                                    <Link href={`/users/${user.id}`} className="flex items-center gap-3 w-full h-full relative z-10">
                                        <div className="relative">
                                            <UserAvatar 
                                                imageUrl={user.imageUrl}
                                                name={user.name}
                                                size="sm"
                                                className="w-8 h-8 min-w-[2rem] flex-shrink-0" userId={undefined}                                            />
                                            {hasNewVideo && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 border-2 border-background rounded-full" />
                                            )}
                                        </div>
                                        
                                        <span className={`
                                            text-base font-medium transition-all duration-200
                                            ${isActive 
                                                ? 'text-foreground font-semibold' 
                                                : 'text-muted-foreground group-hover:text-foreground'
                                            }
                                            whitespace-nowrap
                                            overflow-hidden
                                            truncate
                                        `}>
                                            {user.name}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
