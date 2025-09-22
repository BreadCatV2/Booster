'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, ShoppingCart, Search, Filter, Crown, Palette, Sparkles, BadgeCheck, Zap, Star, Heart, Rocket, Lock, Check, Boxes, Plus, PlusCircle, Box, Wallet, Landmark } from "lucide-react"
import { XpIndicator } from "@/modules/xp/ui/components/xp-indicator"

export const MarketSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [userCoins, setUserCoins] = useState(2450)
  const [ownedItems, setOwnedItems] = useState([1, 6]) // IDs of owned items

  // Marketplace items data
  const marketplaceItems = [
    { id: 1, name: "Golden Crown", price: 500, category: "icons", image: "👑", rarity: "epic" },
    { id: 2, name: "Rainbow Background", price: 300, category: "backgrounds", image: "🌈", rarity: "rare" },
    { id: 3, name: "Neon Border", price: 250, category: "borders", image: "🔆", rarity: "rare" },
    { id: 4, name: "Verified Badge", price: 1000, category: "badges", image: "✅", rarity: "legendary" },
    { id: 5, name: "Fire Effect", price: 750, category: "effects", image: "🔥", rarity: "epic" },
    { id: 6, name: "Silver Star", price: 150, category: "icons", image: "⭐", rarity: "common" },
    { id: 7, name: "Gradient Text", price: 400, category: "text", image: "🎨", rarity: "rare" },
    { id: 8, name: "Animated Avatar", price: 1200, category: "effects", image: "✨", rarity: "legendary" },
    { id: 9, name: "Diamond Frame", price: 600, category: "frames", image: "💎", rarity: "epic" },
    { id: 10, name: "Special Color Pack", price: 350, category: "colors", image: "🎯", rarity: "rare" },
    { id: 11, name: "Exclusive Badge", price: 900, category: "badges", image: "🛡️", rarity: "epic" },
    { id: 12, name: "Premium Theme", price: 800, category: "themes", image: "🌠", rarity: "legendary" },
  ]

  // Filter items based on category and search
  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle purchasing an item
  const handlePurchase = (itemId: number, price: number) => {
    if (userCoins >= price) {
      setUserCoins(prev => prev - price)
      setOwnedItems(prev => [...prev, itemId])
      // In a real app, you'd make an API call to update the user's inventory
    } else {
      alert("Not enough coins!")
    }
  }

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Items", icon: <Sparkles className="h-4 w-4" /> },
    { id: "icons", name: "Icons", icon: <Star className="h-4 w-4" /> },
    { id: "badges", name: "Badges", icon: <BadgeCheck className="h-4 w-4" /> },
    { id: "backgrounds", name: "Backgrounds", icon: <Palette className="h-4 w-4" /> },
    { id: "effects", name: "Effects", icon: <Zap className="h-4 w-4" /> },
    { id: "colors", name: "Colors", icon: <Palette className="h-4 w-4" /> },
    { id: "frames", name: "Frames", icon: <Heart className="h-4 w-4" /> },
    { id: "themes", name: "Themes", icon: <Sparkles className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ffca55] to-[#FFA100] bg-clip-text text-transparent">
              Customization Marketplace
            </h1>
            <p className="text-gray-400 mt-2">Personalize your profile with exclusive items</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* XP INDICATOR */}
              <XpIndicator xp={userCoins} />
            <Button className="flex rounded-full bg-gradient-to-r from-[#ffca55] to-[#FFA100] text-gray-900 font-semibold hover:opacity-90">
              <Landmark className="h-4 w-4 " />
              Get More XP
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-[#252525] border border-gray-700 focus:border-[#ffca55] focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter:</span>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-full bg-[#252525] border border-gray-700 text-white px-3 py-2 text-sm focus:border-[#ffca55] focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[#ffca55] to-[#FFA100] text-gray-900"
                    : "bg-[#252525] text-gray-300 hover:bg-[#2d2d2d]"
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isOwned = ownedItems.includes(item.id)
            
            return (
              <Card 
                key={item.id} 
                className="bg-[#1e1e1e] border border-gray-800 overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#ffca55]/10"
              >
                <CardContent className="p-0">
                  {/* Item Image */}
                  <div className="h-40 flex items-center justify-center bg-gradient-to-b from-[#2a2a2a] to-[#1e1e1e] relative">
                    <span className="text-5xl">{item.image}</span>
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-3 right-3">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full capitalize ${
                          item.rarity === "common" ? "bg-gray-600" :
                          item.rarity === "rare" ? "bg-blue-600" :
                          item.rarity === "epic" ? "bg-purple-600" : "bg-yellow-600"
                        }`}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    
                    {/* Owned Badge */}
                    {isOwned && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Owned
                      </div>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.price < 500 ? (
                            <Box className="h-4 w-4 text-purple-400 mr-1" />
                        ) : (
                         <Boxes className="h-5 w-5 text-purple-600 mr-1" />
                        )}
                        <span className="font-semibold">{item.price}</span>
                      </div>
                      
                      {isOwned ? (
                        <Button 
                          className="rounded-full bg-green-600 text-white text-sm hover:bg-green-700"
                          disabled
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Owned
                        </Button>
                      ) : (
                        <Button 
                          className="rounded-full bg-gradient-to-r from-[#ffca55] to-[#FFA100] text-gray-900 text-sm hover:opacity-90"
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={userCoins < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-300">No items found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Crown className="h-6 w-6 text-[#ffca55]" />
            Featured Items
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-800 p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">🌟</div>
              <div>
                <h3 className="text-xl font-bold">Premium Creator Pack</h3>
                <p className="text-gray-300 mt-2">Get access to exclusive items and special features</p>
                <div className="flex items-center mt-4">
                  <Coins className="h-5 w-5 text-[#ffca55] mr-2" />
                  <span className="font-semibold">2,500</span>
                  <Button className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                    <Rocket className="h-4 w-4 mr-2" />
                    Unlock Now
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-800 p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">⚡</div>
              <div>
                <h3 className="text-xl font-bold">Weekly Special Offer</h3>
                <p className="text-gray-300 mt-2">Limited time offer - 50% off on all effects</p>
                <div className="flex items-center mt-4">
                  <Boxes className="h-5 w-5 text-[#ffca55] mr-2" />
                  <span className="font-semibold line-through text-gray-400">1,500</span>
                  <span className="font-semibold ml-2">750</span>
                  <Button className="ml-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90">
                    <Zap className="h-4 w-4 mr-2" />
                    Claim Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}