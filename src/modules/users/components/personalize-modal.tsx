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

const ACCENT_COLORS = [
    { 
        name: 'Dark Gray',
        bg: 'bg-[#212121]',
        gradient: 'from-[#212121] to-[#424242]',
        border: 'border-[#212121]',
        text: 'text-[#212121]',
        hover: 'hover:bg-[#212121]/90',
        bgSolid: '#212121',
        light: 'bg-gray-100',
        dark: 'bg-gray-900'
    },
    { 
        name: 'Blue Teal',
        bg: 'bg-blue-500',
        gradient: 'from-blue-500 to-teal-400',
        border: 'border-blue-500',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-600',
        bgSolid: '#3B82F6',
        light: 'bg-blue-50',
        dark: 'bg-blue-950'
    },
    { 
        name: 'Green Blue',
        bg: 'bg-green-500',
        gradient: 'from-green-400 to-blue-500',
        border: 'border-green-500',
        text: 'text-green-500',
        hover: 'hover:bg-green-600',
        bgSolid: '#22C55E',
        light: 'bg-green-50',
        dark: 'bg-green-950'
    },
    { 
        name: 'Orange Red',
        bg: 'bg-orange-500',
        gradient: 'from-yellow-400 to-red-500',
        border: 'border-orange-500',
        text: 'text-orange-500',
        hover: 'hover:bg-orange-600',
        bgSolid: '#F97316',
        light: 'bg-orange-50',
        dark: 'bg-orange-950'
    },
    { 
        name: 'Purple Pink',
        bg: 'bg-purple-500',
        gradient: 'from-purple-500 to-pink-500',
        border: 'border-purple-500',
        text: 'text-purple-500',
        hover: 'hover:bg-purple-600',
        bgSolid: '#A855F7',
        light: 'bg-purple-50',
        dark: 'bg-purple-950'
    }
];

interface PersonalizeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PersonalizeModal = ({ isOpen, onClose }: PersonalizeModalProps) => {
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
    const currentAccent = ACCENT_COLORS[selectedAccent];

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
        onClose();
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            setFirstName('John');
            setLastName('Doe');
            setUsername('johndoe');
            setSelectedIcon(0);
            setSelectedRoles([1, 2]);
            toast.info('Changes discarded');
            onClose();
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

    if (!isOpen) return null;

    return (
        <>
            {/* Main Modal Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-background rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden my-8">
                    {/* Header */}
                    <div 
                        className="px-6 py-4 flex justify-between items-center"
                        style={{ background: currentAccent.bgSolid }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-white">Customize Your Profile</h2>
                            <p className="text-white/90 text-sm">Personalize your profile information and appearance</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Profile Preview */}
                            <div className="lg:col-span-1">
                                <div className="bg-card rounded-xl border shadow-lg p-6 sticky top-0">
                                    <div className="text-center mb-6">
                                        <div className="relative inline-block mx-auto mb-4">
                                            <div 
                                                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl"
                                                style={{ background: currentAccent.bgSolid }}
                                            >
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
                                            <span className="text-white font-bold text-sm">Channel Booster</span>
                                        </div>
                                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${xpProgress}%`, background: currentAccent.bgSolid }}
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

                            {/* Right Column - Forms */}
                            <div className="lg:col-span-2">
                                <div className="bg-card rounded-xl border shadow-lg p-6">
                                    {/* Tabs */}
                                    <div className="flex space-x-2 mb-6 bg-muted p-1 rounded-xl">
                                        <button
                                            onClick={() => setActiveTab('basic')}
                                            className={cn(
                                                "flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm",
                                                activeTab === 'basic' 
                                                    ? "text-white" 
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                            style={activeTab === 'basic' ? { background: currentAccent.bgSolid } : {}}
                                        >
                                            <User className="w-4 h-4 inline mr-2" />
                                            Basic Info
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('appearance')}
                                            className={cn(
                                                "flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm",
                                                activeTab === 'appearance' 
                                                    ? "text-white" 
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                            style={activeTab === 'appearance' ? { background: currentAccent.bgSolid } : {}}
                                        >
                                            <Palette className="w-4 h-4 inline mr-2" />
                                            Appearance
                                        </button>
                                    </div>

                                    {/* Basic Info Tab */}
                                    {activeTab === 'basic' && (
                                        <form onSubmit={handleSave} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm mb-2 font-bold">First Name</label>
                                                    <Input 
                                                        value={firstName} 
                                                        onChange={(e) => setFirstName(e.target.value)} 
                                                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-[#212121] dark:focus:border-[#212121]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm  mb-2 font-bold">Last Name</label>
                                                    <Input 
                                                        value={lastName} 
                                                        onChange={(e) => setLastName(e.target.value)} 
                                                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-[#212121] dark:focus:border-[#212121]"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold mb-2">Username</label>
                                                <div className="flex">
                                                    <span className="inline-flex items-center px-4 rounded-l-lg border-2 border-r-0 border-gray-300 dark:border-gray-600 bg-muted text-muted-foreground">@</span>
                                                    <Input 
                                                        value={username} 
                                                        onChange={(e) => setUsername(e.target.value)} 
                                                        className="rounded-l-none border-2 border-gray-300 dark:border-gray-600 focus:border-[#212121] dark:focus:border-[#212121]"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold mb-2">Display Role</label>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setShowRoleModal(true)} 
                                                    className="w-full justify-start border-2 border-gray-300 dark:border-gray-600 hover:border-[#212121] dark:hover:border-[#212121]"
                                                >
                                                    {selectedRoles.length > 0 
                                                        ? selectedRoles.map(id => ROLES.find(r => r.id === id)?.name).join(', ')
                                                        : 'Select roles...'
                                                    }
                                                </Button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold mb-3">Displayed Icon</label>
                                                <div className="grid grid-cols-6 gap-2">
                                                    {ICONS.map((icon, idx) => {
                                                        const IconComponent = icon.icon;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => setSelectedIcon(idx)}
                                                                className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2",
                                                                    selectedIcon === idx ? "" : "border-transparent hover:border-gray-300"
                                                                )}
                                                                style={selectedIcon === idx ? { 
                                                                    borderColor: currentAccent.bgSolid,
                                                                    backgroundColor: `${currentAccent.bgSolid}15`
                                                                } : {}}
                                                            >
                                                                <IconComponent className="w-4 h-4" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                                                <Button 
                                                    type="submit" 
                                                    className="text-white"
                                                    style={{ background: currentAccent.bgSolid }}
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Appearance Tab */}
                                    {activeTab === 'appearance' && (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-bold mb-3">Theme</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Light Theme */}
                                                    <button 
                                                        onClick={() => setTheme('light')} 
                                                        className={cn(
                                                            "relative border-2 rounded-xl p-4 transition-all group hover:scale-105",
                                                            theme === 'light' 
                                                                ? "bg-gradient-to-br from-white to-gray-100 shadow-lg" 
                                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50"
                                                        )}
                                                        style={theme === 'light' ? { borderColor: currentAccent.bgSolid } : {}}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                                <Sun className="w-6 h-6 text-yellow-600" />
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <div className="font-bold text-gray-900">Light Mode</div>
                                                                <div className="text-xs text-gray-600 mt-0.5">Bright & clean interface</div>
                                                            </div>
                                                        </div>
                                                        {/* Selection indicator */}
                                                        {theme === 'light' && (
                                                            <div 
                                                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                                                style={{ background: currentAccent.bgSolid }}
                                                            >
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        {/* Preview bars */}
                                                        <div className="mt-3 flex gap-1">
                                                            <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                                                            <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
                                                            <div className="h-1 flex-1 bg-gray-400 rounded-full"></div>
                                                        </div>
                                                    </button>

                                                    {/* Dark Theme */}
                                                    <button 
                                                        onClick={() => setTheme('dark')} 
                                                        className={cn(
                                                            "relative border-2 rounded-xl p-4 transition-all group hover:scale-105",
                                                            theme === 'dark' 
                                                                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg" 
                                                                : "border-gray-300 dark:border-gray-600 bg-gray-900 dark:bg-gray-800/50"
                                                        )}
                                                        style={theme === 'dark' ? { borderColor: currentAccent.bgSolid } : {}}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 bg-indigo-900/50 rounded-lg">
                                                                <Moon className="w-6 h-6 text-indigo-300" />
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <div className="font-bold text-white">Dark Mode</div>
                                                                <div className="text-xs text-gray-400 mt-0.5">Easy on the eyes</div>
                                                            </div>
                                                        </div>
                                                        {/* Selection indicator */}
                                                        {theme === 'dark' && (
                                                            <div 
                                                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                                                style={{ background: currentAccent.bgSolid }}
                                                            >
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        {/* Preview bars */}
                                                        <div className="mt-3 flex gap-1">
                                                            <div className="h-1 flex-1 bg-gray-700 rounded-full"></div>
                                                            <div className="h-1 flex-1 bg-gray-600 rounded-full"></div>
                                                            <div className="h-1 flex-1 bg-gray-500 rounded-full"></div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold mb-3">Accent Color</h3>
                                                <div className="flex space-x-3">
                                                    {ACCENT_COLORS.map((accent, idx) => (
                                                        <button 
                                                            key={idx} 
                                                            onClick={() => setSelectedAccent(idx)} 
                                                            className={cn(
                                                                "w-12 h-12 rounded-lg transition-all border-4", 
                                                                `bg-gradient-to-br ${accent.gradient}`,
                                                                selectedAccent === idx ? "scale-110 shadow-lg" : "border-transparent"
                                                            )}
                                                            style={selectedAccent === idx ? { borderColor: accent.bgSolid } : {}}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <Button variant="outline">Reset</Button>
                                                <Button 
                                                    className="text-white"
                                                    style={{ background: currentAccent.bgSolid }}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Selector Sub-Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
                    <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Select Roles</h3>
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
                                className="pl-10 border-2 border-gray-300 dark:border-gray-600 focus:border-[#212121] dark:focus:border-[#212121]"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                            {filteredRoles.map(role => {
                                const RoleIcon = role.icon;
                                const isSelected = selectedRoles.includes(role.id);
                                return (
                                    <button 
                                        key={role.id} 
                                        onClick={() => toggleRole(role.id)} 
                                        className={cn(
                                            "w-full flex items-center p-3 rounded-lg border-2 transition-all", 
                                            isSelected ? "" : "border-transparent hover:bg-muted"
                                        )}
                                        style={isSelected ? { 
                                            borderColor: currentAccent.bgSolid,
                                            backgroundColor: `${currentAccent.bgSolid}15`
                                        } : {}}
                                    >
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3", role.color)}>
                                            <RoleIcon className="w-5 h-5" />
                                        </div>
                                        <span className="flex-1 text-left font-medium">{role.name}</span>
                                        {isSelected && (
                                            <Check 
                                                className="w-5 h-5" 
                                                style={{ color: currentAccent.bgSolid }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setShowRoleModal(false)}>Cancel</Button>
                            <Button 
                                onClick={() => { setShowRoleModal(false); toast.success('Roles updated!'); }} 
                                className="text-white"
                                style={{ background: currentAccent.bgSolid }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Upload Sub-Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
                    <div className="bg-card rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Change Avatar</h3>
                            <button onClick={() => setShowAvatarModal(false)} className="hover:bg-muted rounded-lg p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-[#212121] hover:bg-gray-100 dark:hover:bg-gray-900 transition-all mb-4">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="font-medium">Drag & drop image here</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setShowAvatarModal(false)}>Cancel</Button>
                            <Button 
                                className="text-white"
                                style={{ background: currentAccent.bgSolid }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
