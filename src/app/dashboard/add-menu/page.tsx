"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, ChefHat, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { menuAPI } from "@/lib/api";

const menuItemSchema = z.object({
  emoji: z.string().min(1, "Pilih emoji untuk menu"),
  namaMenu: z.string()
    .min(1, "Nama menu tidak boleh kosong")
    .min(3, "Nama menu minimal 3 karakter")
    .max(50, "Nama menu maksimal 50 karakter"),
  modal: z.string()
    .min(1, "Modal tidak boleh kosong")
    .refine((val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return !isNaN(num) && num > 0;
    }, "Modal harus berupa angka yang valid dan lebih dari 0"),
  hargaJual: z.string()
    .min(1, "Harga jual tidak boleh kosong")
    .refine((val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return !isNaN(num) && num > 0;
    }, "Harga jual harus berupa angka yang valid dan lebih dari 0")
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🍛");
  const [formData, setFormData] = useState<NewMenuItem>({
    emoji: "🍛",
    namaMenu: "",
    modal: "",
    hargaJual: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to convert string to number (removing currency formatting)
  const parseToNumber = (value: string): number => {
    const cleanValue = value.replace(/[^\d.-]/g, '');
    return parseFloat(cleanValue) || 0;
  };

  const validateField = (field: keyof NewMenuItem, value: string) => {
    try {
      const fieldSchema = menuItemSchema.shape[field];
      fieldSchema.parse(value);
      // Clear the error for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
    
    // Always validate the field, whether empty or not
    validateField(field, value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setFormData(prev => ({
      ...prev,
      emoji: emoji
    }));
    // Clear emoji error since selecting an emoji makes it valid
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.emoji;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate all fields with Zod
      const validatedData = menuItemSchema.parse(formData);
      
      // Validate parsed numbers
      const capital = parseToNumber(validatedData.modal);
      const price = parseToNumber(validatedData.hargaJual);
      
      if (capital <= 0 || price <= 0) {
        throw new Error("Modal dan harga jual harus berupa angka positif yang valid");
      }
      
      // Show confirmation modal instead of directly saving
      setShowConfirmModal(true);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof NewMenuItem] = issue.message;
          }
        });
        setErrors(newErrors);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan validasi';
        setErrors({ namaMenu: errorMessage });
      }
    }
  };

  const handleConfirmSave = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      // Validate all fields with Zod
      const validatedData = menuItemSchema.parse(formData);
      
      // Prepare API payload with correct format and number conversion
      const capital = parseToNumber(validatedData.modal);
      const price = parseToNumber(validatedData.hargaJual);
      
      const menuItem = {
        icon: validatedData.emoji,
        name: validatedData.namaMenu,
        capital: capital,
        price: price
      };
      
      const apiPayload = [menuItem]; // Wrap in array as per your specification
      
      // Call the API
      await menuAPI.addMenuItem(apiPayload);
      
      // Success - show success modal
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
    } catch (error) {
      setIsSubmitting(false);
      
      // Handle API errors
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan menu';
      setErrors({ namaMenu: errorMessage });
    }
  };

  // Check if there are any actual errors (filter out undefined values)
  const hasErrors = Object.values(errors).some(error => error !== undefined);
  
  const isFormValid = !hasErrors && 
    formData.emoji.trim() &&
    formData.namaMenu.trim() && 
    formData.modal.trim() && 
    formData.hargaJual.trim();



  // Handle success modal close and navigation
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/dashboard');
  };

  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleSuccessModalClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
        <section>
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
                    placeholder="Contoh: 8000 atau Rp 8.000"
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
                    placeholder="Contoh: 12000 atau Rp 12.000"
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
                    >
                      Batal
                    </Button>
                  </Link>
                  
                  <Button 
                    type="submit" 
                    className="flex-1 flex items-center justify-center space-x-2"
                    disabled={!isFormValid}
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-white">Review Menu</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={() => setShowConfirmModal(false)}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <ChefHat className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Konfirmasi Menu Baru
                  </h3>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-center text-gray-600 text-sm">
                Pastikan detail menu sudah benar sebelum menyimpan
              </p>
              
              {/* Menu Details Review */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Emoji:</span>
                  <span className="text-2xl">{formData.emoji}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Nama Menu:</span>
                  <span className="text-sm text-gray-900 font-medium">{formData.namaMenu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Modal:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    Rp {parseToNumber(formData.modal).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Harga Jual:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    Rp {parseToNumber(formData.hargaJual).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                
                <Button 
                  onClick={handleConfirmSave}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2 text-white" />
                  )}
                  <p className="text-white">{isSubmitting ? "Menyimpan..." : "Simpan Menu"}</p>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Menu Berhasil Ditambahkan!
                  </h3>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Menu "{formData.namaMenu}" telah berhasil ditambahkan ke sistem.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleSuccessModalClose}
                  className="w-full text-white"
                >
                  Kembali ke Dashboard
                </Button>
                <p className="text-xs text-gray-400">
                  Otomatis kembali dalam 3 detik
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
