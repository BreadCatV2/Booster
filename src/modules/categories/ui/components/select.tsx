import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    description?: string;
    count?: number;
}

interface CategorySelectorProps {
    selectedCategory?: Category;
    onCategorySelect: (category: Category) => void;
    existingCategories?: Category[];
    allowCreate?: boolean;
    placeholder?: string;
}

export function CategorySelector({
    selectedCategory,
    onCategorySelect,
    existingCategories = [],
    allowCreate = true,
    placeholder = "Search or create a category..."
}: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');

    // Filter categories based on search
    const filteredCategories = existingCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if search term matches existing category
    const exactMatch = existingCategories.find(
        category => category.name.toLowerCase() === searchTerm.toLowerCase()
    );

    // Reset creation state when closing
    useEffect(() => {
        if (!isOpen) {
            setIsCreating(false);
            setNewCategoryName('');
            setNewCategoryDescription('');
        }
    }, [isOpen]);

    // Handle category selection
    const handleSelectCategory = (category: Category) => {
        onCategorySelect(category);
        setIsOpen(false);
        setSearchTerm('');
    };

    // Start creating new category
    const startCreateCategory = () => {
        setIsCreating(true);
        setNewCategoryName(searchTerm);
    };

    // Create new category
    const createCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCategory: Category = {
            id: `cat_${Date.now()}`,
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim() || undefined,
            count: 0
        };

        // In a real app, you would save to your backend here
        console.log('Creating new category:', newCategory);

        handleSelectCategory(newCategory);
        setIsCreating(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
    };

    return (
        <div className="relative w-full">
            {/* Selected Category Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 border border-amber-600 rounded-lg bg-gray-800 text-white text-left hover:border-amber-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            >
                {selectedCategory ? (
                    <div className="flex items-center justify-between">
                        <span className="text-amber-200">{selectedCategory.name}</span>
                        <span className="text-amber-400 text-sm">▼</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between text-amber-400">
                        <span>{placeholder}</span>
                        <span className="text-sm">▼</span>
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-amber-600 rounded-lg shadow-2xl max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-amber-700">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full p-2 bg-gray-700 border border-amber-600 rounded text-white placeholder-amber-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {/* Existing Categories */}
                        {filteredCategories.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide px-2 py-1">
                                    Existing Categories
                                </div>
                                {filteredCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleSelectCategory(category)}
                                        className="w-full text-left p-3 rounded-lg hover:bg-amber-900/30 transition-colors group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-amber-200 group-hover:text-amber-100">
                                                {category.name}
                                            </span>
                                            {category.count !== undefined && (
                                                <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded-full">
                                                    {category.count}
                                                </span>
                                            )}
                                        </div>
                                        {category.description && (
                                            <p className="text-sm text-amber-400 mt-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Create New Category Option */}
                        {allowCreate && searchTerm.trim() && !exactMatch && (
                            <div className="border-t border-amber-700 p-2">
                                {!isCreating ? (
                                    <button
                                        onClick={startCreateCategory}
                                        className="w-full text-left p-3 rounded-lg bg-amber-900/20 hover:bg-amber-900/40 border border-amber-600 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-sm">
                                                +
                                            </div>
                                            <div>
                                                <div className="text-amber-300 font-semibold">
                                                    Create {searchTerm}
                                                </div>
                                                <div className="text-sm text-amber-400">
                                                    Add as new category
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="p-3 bg-amber-900/10 border border-amber-600 rounded-lg">
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-amber-200 mb-1">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="w-full p-2 bg-gray-700 border border-amber-600 rounded text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-amber-200 mb-1">
                                                Description (Optional)
                                            </label>
                                            <textarea
                                                value={newCategoryDescription}
                                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                                placeholder="Describe this category..."
                                                rows={2}
                                                className="w-full p-2 bg-gray-700 border border-amber-600 rounded text-white placeholder-amber-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={createCategory}
                                                disabled={!newCategoryName.trim()}
                                                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded transition-colors"
                                            >
                                                Create Category
                                            </button>
                                            <button
                                                onClick={() => setIsCreating(false)}
                                                className="px-4 py-2 border border-amber-600 text-amber-300 hover:bg-amber-900/30 rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Results */}
                        {filteredCategories.length === 0 && searchTerm.trim() && exactMatch && (
                            <div className="p-4 text-center text-amber-400">
                                No categories found matching {searchTerm}
                            </div>
                        )}

                        {/* Empty State */}
                        {existingCategories.length === 0 && !searchTerm && (
                            <div className="p-4 text-center text-amber-400">
                                No categories yet. Start typing to create one!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
