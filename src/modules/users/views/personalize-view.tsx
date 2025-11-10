"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    User, 
    Rocket, 
    Gamepad, 
    Palette, 
    Code, 
    Music, 
    Camera, 
    Star, 
    Heart, 
    Globe, 
    Gem, 
    Crown,
    Sun,
    Moon,
    Check,
    X,
    Upload,
    Search
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICONS = [
    { icon: User, name: "user" },
    { icon: Rocket, name: "rocket" },
    { icon: Gamepad, name: "gamepad" },
    { icon: Palette, name: "palette" },
    { icon: Code, name: "code" },
    { icon: Music, name: "music" },
    { icon: Camera, name: "camera" },
    { icon: Star, name: "star" },
    { icon: Heart, name: "heart" },
    { icon: Globe, name: "globe" },
    { icon: Gem, name: "gem" },
    { icon: Crown, name: "crown" },
];

const ROLES = [
    { id: 1, name: 'UX Designer', icon: Palette, color: 'bg-purple-500' },
    { id: 2, name: 'Frontend Developer', icon: Code, color: 'bg-blue-500' },
    { id: 3, name: 'Backend Developer', icon: Code, color: 'bg-green-500' },
    { id: 4, name: 'Product Manager', icon: Star, color: 'bg-yellow-500' },
    { id: 5, name: 'Content Creator', icon: Camera, color: 'bg-pink-500' },
    { id: 6, name: 'Community Manager', icon: User, color: 'bg-indigo-500' },
    { id: 7, name: 'Graphic Designer', icon: Palette, color: 'bg-red-500' },
    { id: 8, name: 'Video Editor', icon: Camera, color: 'bg-teal-500' },
    { id: 9, name: 'Game Developer', icon: Gamepad, color: 'bg-orange-500' },
    { id: 10, name: 'Data Scientist', icon: Star, color: 'bg-cyan-500' }
];

export const PersonalizeView = () => {
    const [activeTab, setActiveTab] = useState<'basic' | 'appearance'>('basic');
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [username, setUsername] = useState('johndoe');
    const [selectedIcon, setSelectedIcon] = useState(0);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([1, 2]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [roleSearch, setRoleSearch] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedAccent, setSelectedAccent] = useState(0);

    const SelectedIconComponent = ICONS[selectedIcon].icon;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            setFirstName('John');
            setLastName('Doe');
            setUsername('johndoe');
            setSelectedIcon(0);
            setSelectedRoles([1, 2]);
            toast.info('Changes discarded');
        }
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoles(prev => 
            prev.includes(roleId) 
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const filteredRoles = ROLES.filter(role => 
        role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );

    const primaryRole = ROLES.find(role => role.id === selectedRoles[0]);
    const xpProgress = 65;

    return (
        <div className="min-h-screen bg-background py-10 px-4 md:px-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2">Customize Your Profile</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Personalize your profile information, appearance, and preferences to make it truly yours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Preview */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl border shadow-lg p-6 sticky top-6 hover:shadow-xl transition-shadow">
                            <div className="text-center mb-6">
                                <div className="relative inline-block mx-auto mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white text-4xl">
                                        <SelectedIconComponent className="w-16 h-16" />
                                    </div>
                                    <button
                                        onClick={() => setShowAvatarModal(true)}
                                        className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
                                <p className="text-muted-foreground">{primaryRole?.name || 'No role selected'}</p>
                            </div>

                            {/* XP Progress */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-3">
                                    <span className="text-muted-foreground text-sm">Channel Booster</span>
                                    <span className="font-medium text-sm">250 XP to next level</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                                        style={{ width: `${xpProgress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>Level 4</span>
                                    <span>Level 5</span>
                                </div>
                            </div>

                            {/* Selected Roles */}
                            <div className="mt-6">
                                <h3 className="font-medium mb-3">Selected Roles</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRoles.map(roleId => {
                                        const role = ROLES.find(r => r.id === roleId);
                                        if (!role) return null;
                                        const RoleIcon = role.icon;
                                        return (
                                            <div 
                                                key={roleId}
                                                className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm text-white", role.color)}
                                            >
                                                <RoleIcon className="w-3 h-3 mr-1" />
                                                <span>{role.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customization Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-xl border shadow-lg p-6">
                            {/* Tabs */}
                            <div className="flex space-x-2 mb-8 bg-muted p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('basic')}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all",
                                        activeTab === 'basic' 
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <User className="w-4 h-4 inline mr-2" />
                                    Basic Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('appearance')}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all",
                                        activeTab === 'appearance' 
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Palette className="w-4 h-4 inline mr-2" />
                                    Appearance
                                </button>
                            </div>

                            {/* Basic Info Tab */}
                            {activeTab === 'basic' && (
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">First Name</label>
                                            <Input
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="John"
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Last Name</label>
                                            <Input
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Username</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 bg-muted text-muted-foreground">
                                                @
                                            </span>
                                            <Input
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="johndoe"
                                                className="rounded-l-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Display Role</label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowRoleModal(true)}
                                            className="w-full justify-start"
                                        >
                                            {selectedRoles.length > 0 
                                                ? selectedRoles.map(id => ROLES.find(r => r.id === id)?.name).join(', ')
                                                : 'Select roles to display...'
                                            }
                                        </Button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-4">Displayed Icon</label>
                                        <div className="grid grid-cols-6 gap-3">
                                            {ICONS.map((icon, idx) => {
                                                const IconComponent = icon.icon;
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSelectedIcon(idx)}
                                                        className={cn(
                                                            "w-12 h-12 rounded-lg flex items-center justify-center transition-all border-2",
                                                            selectedIcon === idx 
                                                                ? "border-amber-500 bg-amber-50 dark:bg-amber-950" 
                                                                : "border-transparent hover:border-gray-300"
                                                        )}
                                                    >
                                                        <IconComponent className="w-5 h-5" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <Button type="button" variant="destructive" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4">Theme</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={cn(
                                                    "border rounded-lg p-4 flex items-center transition-all",
                                                    theme === 'light' ? "border-amber-500 bg-amber-50 dark:bg-amber-950" : "border-border"
                                                )}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-300 mr-4 flex items-center justify-center">
                                                    <Sun className="w-6 h-6 text-yellow-500" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">Light Mode</div>
                                                    <div className="text-sm text-muted-foreground">Clean and bright interface</div>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={cn(
                                                    "border rounded-lg p-4 flex items-center transition-all",
                                                    theme === 'dark' ? "border-amber-500 bg-amber-50 dark:bg-amber-950" : "border-border"
                                                )}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-600 mr-4 flex items-center justify-center">
                                                    <Moon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">Dark Mode</div>
                                                    <div className="text-sm text-muted-foreground">Easy on the eyes</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-4">Accent Color</h3>
                                        <div className="flex space-x-4">
                                            {[
                                                { gradient: 'from-amber-500 to-orange-500', name: 'Amber Orange' },
                                                { gradient: 'from-blue-500 to-teal-400', name: 'Blue Teal' },
                                                { gradient: 'from-green-400 to-blue-500', name: 'Green Blue' },
                                                { gradient: 'from-yellow-400 to-red-500', name: 'Yellow Red' },
                                                { gradient: 'from-purple-500 to-pink-500', name: 'Purple Pink' },
                                            ].map((accent, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedAccent(idx)}
                                                    className={cn(
                                                        "w-16 h-16 rounded-xl bg-gradient-to-br transition-all border-4",
                                                        accent.gradient,
                                                        selectedAccent === idx ? "border-foreground scale-110" : "border-transparent"
                                                    )}
                                                    title={accent.name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <Button variant="outline">Reset to Default</Button>
                                        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                                            Apply Changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 flex justify-center">
                    <Link href="/users">
                        <Button variant="outline" size="lg">
                            Back to Channel
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Role Selector Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Select Display Roles</h3>
                            <button onClick={() => setShowRoleModal(false)} className="hover:bg-muted rounded-lg p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={roleSearch}
                                onChange={(e) => setRoleSearch(e.target.value)}
                                placeholder="Search roles..."
                                className="pl-10"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 mb-6">
                            {filteredRoles.map(role => {
                                const RoleIcon = role.icon;
                                const isSelected = selectedRoles.includes(role.id);
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => toggleRole(role.id)}
                                        className={cn(
                                            "w-full flex items-center p-3 rounded-lg border-2 transition-all",
                                            isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-950" : "border-transparent hover:bg-muted"
                                        )}
                                    >
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3", role.color)}>
                                            <RoleIcon className="w-5 h-5" />
                                        </div>
                                        <span className="flex-1 text-left font-medium">{role.name}</span>
                                        {isSelected && <Check className="w-5 h-5 text-amber-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button variant="destructive" onClick={() => setShowRoleModal(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => {
                                    setShowRoleModal(false);
                                    toast.success('Roles updated!');
                                }}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                            >
                                Save Roles
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Upload Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Change Profile Picture</h3>
                            <button onClick={() => setShowAvatarModal(false)} className="hover:bg-muted rounded-lg p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 transition-all">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="font-medium">Drag & drop your image here</p>
                            <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                            <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 5MB</p>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Button variant="destructive" onClick={() => setShowAvatarModal(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90">
                                Save Avatar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
