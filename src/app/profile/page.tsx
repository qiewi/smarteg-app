"use client";

import DashboardLayout from "@/components/dashboard/PWALayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Edit2, Check, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface UserProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUserProfile() as UserProfileResponse;
        
        if (response.status === 'success') {
          setUserProfile(response.data);
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
        
        // Fallback to default data
        setUserProfile({
          name: "User Name",
          email: "user@smarteg.com",
          picture: "/icon-only.png"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setEditedName(userProfile?.name || "");
    setIsEditing(true);
    setUpdateSuccess(false);
    setError(null);
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === userProfile?.name) {
      setIsEditing(false);
      return;
    }

    try {
      setUpdateLoading(true);
      
      // Call the API to update the user profile
      await userAPI.updateUserProfile({ name: editedName.trim() });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, name: editedName.trim() } : null);
      setIsEditing(false);
      setError(null);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update name');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName("");
    setIsEditing(false);
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse"></div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <Image
                    src={userProfile?.picture || "/icon-only.png"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to local icon if external image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/icon-only.png";
                    }}
                  />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !updateLoading && editedName.trim()) {
                            handleSaveName();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        className="text-center text-xl font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        placeholder="Enter your name"
                        disabled={updateLoading}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center">  
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold">
                          {userProfile?.name || "User Name"}
                        </h2>
                      </div>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditClick}
                          className="h-auto text-white/80 hover:text-white hover:bg-white/10"
                        >
                          <Edit2 className="w-4]3 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="flex space-x-2 mt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={updateLoading || !editedName.trim()}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                      >
                        {updateLoading ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={updateLoading}
                        className="text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  <p>{userProfile?.email || "user@smarteg.com"}</p>
                  {updateSuccess && (
                    <p className="text-xs text-green-200 mt-1 flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Name updated successfully!
                    </p>
                  )}
                  {error && !updateSuccess && (
                    <p className="text-xs text-white/70 mt-1">
                      {error === 'Failed to update name' ? 'Failed to update name' : 'Using fallback data'}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Card className="py-2 bg-white/20 backdrop-blur-md">
              <CardContent className="px-4">
                <Button variant="ghost" className="w-full justify-start text-white">
                  <LogOut className="mr-3 h-5 w-5" />
                  Keluar
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 