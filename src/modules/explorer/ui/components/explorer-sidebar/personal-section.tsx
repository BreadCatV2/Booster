"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { History, Library, Star, LayoutGrid, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const items = [
    {
        title: "History",
        url: "/history",
        icon: History,
        auth: true,
    },
    {
        title: "My Library",
        url: "/library",
        icon: Library,
        auth: true,
    },
    {
        title: "Rated",
        url: "/rated",
        icon: Star,
        auth: true,
    },
    {
        title: "Categories",
        url: "/categories",
        icon: LayoutGrid,
        auth: false,
    },
    {
        title: "My Videos",
        url: "/my-videos",
        icon: Video,
        auth: true,
    },
];

export const PersonalSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleClick = (e: React.MouseEvent, item: typeof items[0]) => {
        e.preventDefault();
        if (item.auth && !isSignedIn) {
            return clerk.openSignIn();
        }
        toast.info("This site is under construction (for now)");
    };

    return (
        <SidebarGroup className="relative bg-background">
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent className="relative z-10 bg-background">
                <SidebarMenu>
                    {items.map((item) => {
                        const isHovered = hoveredItem === item.title;
                        const Icon = item.icon;

                        return (
                            <SidebarMenuItem key={item.title} className="relative">
                                {/* Hover state background */}
                                {isHovered && (
                                    <div className="absolute inset-0 bg-accent/50 rounded-full transition-all duration-200" />
                                )}

                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    onMouseEnter={() => setHoveredItem(item.title)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={(e) => handleClick(e, item)}
                                    className={`
                                        relative
                                        transition-all duration-200
                                        rounded-full
                                        hover:bg-accent/30
                                        group
                                        h-12 
                                        mx-0.5 
                                    `}
                                >
                                    <Link href={item.url} className="flex items-center gap-3 w-full h-full relative z-10">
                                        <div className={`
                                            flex items-center justify-center
                                            transition-all duration-200
                                            bg-muted text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-foreground
                                            rounded-lg
                                            w-8 h-8
                                            min-w-[2rem]
                                            flex-shrink-0
                                        `}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        
                                        <span className={`
                                            text-base font-medium transition-all duration-200
                                            text-muted-foreground group-hover:text-foreground
                                            whitespace-nowrap
                                            overflow-hidden
                                        `}>
                                            {item.title}
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
