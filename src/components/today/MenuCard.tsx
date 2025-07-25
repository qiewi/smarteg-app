"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Check, X } from "lucide-react";
import { useState } from "react";

interface MenuCardProps {
  id: number;
  emoji: string;
  name: string;
  stock: number;
  sold: number;
  price: number;
  revenue: number;
  onDataChange?: (id: number, data: { stock: number; sold: number; price: number; revenue: number }) => void;
}

export default function MenuCard({
  id,
  emoji,
  name,
  stock: initialStock,
  sold: initialSold,
  price: initialPrice,
  revenue: initialRevenue,
  onDataChange,
}: MenuCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Current data state
  const [currentStock, setCurrentStock] = useState(initialStock);
  const [currentSold, setCurrentSold] = useState(initialSold);
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [currentRevenue, setCurrentRevenue] = useState(initialRevenue);
  
  // Editing state
  const [editStock, setEditStock] = useState(initialStock);
  const [editSold, setEditSold] = useState(initialSold);
  const [editPrice, setEditPrice] = useState(initialPrice);

  const handleEdit = () => {
    // Set edit values to current values when starting edit
    setEditStock(currentStock);
    setEditSold(currentSold);
    setEditPrice(currentPrice);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Calculate new revenue
    const newRevenue = editSold * editPrice;
    
    // Update current state
    setCurrentStock(editStock);
    setCurrentSold(editSold);
    setCurrentPrice(editPrice);
    setCurrentRevenue(newRevenue);
    
    // Notify parent of changes if callback provided
    if (onDataChange) {
      onDataChange(id, {
        stock: editStock,
        sold: editSold,
        price: editPrice,
        revenue: newRevenue,
      });
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset edit values to current values
    setEditStock(currentStock);
    setEditSold(currentSold);
    setEditPrice(currentPrice);
    setIsEditing(false);
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        {/* Mobile Layout: Vertical stacking for better mobile UX */}
        <div className="space-y-4">
          {/* Header Row: Emoji, Name, and Edit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{name}</h3>
                <p className="text-sm text-gray-500">Menu Item</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    onClick={handleSave} 
                    className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="h-9 w-9 p-0 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleEdit} 
                  className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid: 2x2 layout for mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Stok Tersisa</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="font-semibold text-lg text-gray-900">{currentStock}</p>
              )}
            </div>

            <div className="rounded-lg p-3">
              <p className="text-xs mb-1">Terjual</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={editSold}
                  onChange={(e) => setEditSold(parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="font-semibold text-lg">{currentSold}</p>
              )}
            </div>

            <div className="rounded-lg p-3">
              <p className="text-xs mb-1">Harga</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="font-semibold text-sm">
                  Rp {currentPrice.toLocaleString('id-ID')}
                </p>
              )}
            </div>

            <div className="rounded-lg p-3">
              <p className="text-xs mb-1">Pendapatan</p>
              <p className="font-bold text-sm">
                Rp {currentRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 