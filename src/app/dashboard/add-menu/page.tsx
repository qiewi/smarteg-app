"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, ChefHat, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const menuItemSchema = z.object({
  emoji: z.string().min(1, "Pilih emoji untuk menu"),
  namaMenu: z.string()
    .min(1, "Nama menu tidak boleh kosong")
    .min(3, "Nama menu minimal 3 karakter")
    .max(50, "Nama menu maksimal 50 karakter"),
  modal: z.string()
    .min(1, "Modal tidak boleh kosong")
    .regex(/^Rp\s?[\d.,]+$/, "Format modal harus 'Rp 10.000'"),
  hargaJual: z.string()
    .min(1, "Harga jual tidak boleh kosong")
    .regex(/^Rp\s?[\d.,]+$/, "Format harga jual harus 'Rp 15.000'")
});

type NewMenuItem = z.infer<typeof menuItemSchema>;

interface FormErrors {
  emoji?: string;
  namaMenu?: string;
  modal?: string;
  hargaJual?: string;
}

const EMOJI_OPTIONS = [
  "🍛", "🍳", "🐟", "🥬", "🍗", "🍖", "🥩", "🍤", "🦐", "🐠",
  "🍚", "🍜", "🍲", "🥘", "🍱", "🍙", "🍘", "🥙", "🌮", "🌯",
  "🥗", "🥒", "🥕", "🌽", "🍅", "🥔", "🍠", "🧄", "🧅",
  "🍄", "🥜", "🌶️", "🫒", "🥞", "🧇", "🥖", "🍞", "🥨", "🥯"
];

export default function AddMenuPage() {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🍛");
  const [formData, setFormData] = useState<NewMenuItem>({
    emoji: "🍛",
    namaMenu: "",
    modal: "",
    hargaJual: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof NewMenuItem, value: string) => {
    try {
      const fieldSchema = menuItemSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof NewMenuItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate field on change (debounced)
    if (value.trim()) {
      validateField(field, value);
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setFormData(prev => ({
      ...prev,
      emoji: emoji
    }));
    setErrors(prev => ({ ...prev, emoji: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate all fields with Zod
      const validatedData = menuItemSchema.parse(formData);
      
      // Simulate API call
      setTimeout(() => {
        console.log("New menu item:", validatedData);
        setIsSubmitting(false);
        // TODO: Navigate back to dashboard with success message
        alert("Menu berhasil ditambahkan! (Backend belum diimplementasi)");
      }, 1000);
      
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof NewMenuItem] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.namaMenu.trim() && 
    formData.modal.trim() && 
    formData.hargaJual.trim();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <section>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Menu Baru</h1>
              <p className="text-gray-600">Isi informasi menu yang akan ditambahkan</p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-32">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <span>Informasi Menu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Emoji Picker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Pilih Emoji Menu
                  </Label>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-primary">
                      <span className="text-3xl">{selectedEmoji}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Emoji yang dipilih akan muncul di menu</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`w-9 h-9 text-lg hover:bg-white rounded-md transition-all ${
                          selectedEmoji === emoji 
                            ? "bg-primary/10 ring-1 ring-primary scale-90" 
                            : "hover:bg-white hover:scale-105"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {errors.emoji && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.emoji}</span>
                    </div>
                  )}
                </div>

                                 {/* Nama Menu */}
                <div className="space-y-2">
                  <Label htmlFor="namaMenu" className="text-sm font-medium text-gray-700">
                    Nama Menu
                  </Label>
                  <Input
                    id="namaMenu"
                    type="text"
                    placeholder="Contoh: Nasi Gudeg"
                    value={formData.namaMenu}
                    onChange={(e) => handleInputChange("namaMenu", e.target.value)}
                    className={`w-full ${errors.namaMenu ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {errors.namaMenu && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.namaMenu}</span>
                    </div>
                  )}
                </div>

                                 {/* Modal */}
                <div className="space-y-2">
                  <Label htmlFor="modal" className="text-sm font-medium text-gray-700">
                    Modal
                  </Label>
                  <Input
                    id="modal"
                    type="text"
                    placeholder="Contoh: Rp 8.000"
                    value={formData.modal}
                    onChange={(e) => handleInputChange("modal", e.target.value)}
                    className={`w-full ${errors.modal ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {errors.modal && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.modal}</span>
                    </div>
                  )}
                </div>

                {/* Harga Jual */}
                <div className="space-y-2">
                  <Label htmlFor="hargaJual" className="text-sm font-medium text-gray-700">
                    Harga Jual
                  </Label>
                  <Input
                    id="hargaJual"
                    type="text"
                    placeholder="Contoh: Rp 12.000"
                    value={formData.hargaJual}
                    onChange={(e) => handleInputChange("hargaJual", e.target.value)}
                    className={`w-full ${errors.hargaJual ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {errors.hargaJual && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.hargaJual}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Link href="/dashboard" className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                  </Link>
                  
                  <Button 
                    type="submit" 
                    className="flex-1 flex items-center justify-center space-x-2"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? "Menyimpan..." : "Simpan Menu"}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
