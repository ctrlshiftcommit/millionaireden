import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Trash2, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  XCircle
} from "lucide-react";
import { useProfilePictures } from "@/hooks/useProfilePictures";
import { ProfilePicture } from "@/types/profile";

interface ProfilePictureGalleryProps {
  onClose?: () => void;
}

export const ProfilePictureGallery = ({ onClose }: ProfilePictureGalleryProps) => {
  const { 
    profilePictures, 
    primaryPicture, 
    loading, 
    uploading, 
    uploadProfilePicture, 
    setPrimaryPictureById, 
    deleteProfilePicture 
  } = useProfilePictures();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    await uploadProfilePicture(selectedFile);
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSetPrimary = async (pictureId: string) => {
    await setPrimaryPictureById(pictureId);
  };

  const handleDelete = async (pictureId: string) => {
    setDeletingId(pictureId);
    try {
      await deleteProfilePicture(pictureId);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusIcon = (status: ProfilePicture['upload_status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: ProfilePicture['upload_status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'uploading':
        return 'Uploading...';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Profile Pictures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Pictures</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById('profile-picture-input')?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Add New Picture'}
            </Button>
            {selectedFile && (
              <Button onClick={handleUpload} disabled={uploading}>
                Upload {selectedFile.name}
              </Button>
            )}
          </div>
          
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Selected: {selectedFile.name}</span>
              <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {/* Pictures Grid */}
        {profilePictures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No profile pictures uploaded yet</p>
            <p className="text-sm">Upload your first profile picture to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profilePictures.map((picture) => (
              <div key={picture.id} className="relative group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Avatar className="w-full h-32 mx-auto mb-3">
                        <AvatarImage src={picture.public_url} />
                        <AvatarFallback className="text-lg">
                          {picture.file_name[0]?.toUpperCase() || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant={picture.upload_status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {getStatusIcon(picture.upload_status)}
                          <span className="ml-1">{getStatusText(picture.upload_status)}</span>
                        </Badge>
                      </div>

                      {/* Primary Badge */}
                      {picture.is_primary && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="default" className="text-xs bg-yellow-600">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium truncate">{picture.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(picture.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {!picture.is_primary && picture.upload_status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetPrimary(picture.id)}
                            className="flex-1"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Set Primary
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(picture.id)}
                          disabled={deletingId === picture.id}
                          className="flex-1"
                        >
                          {deletingId === picture.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Error Messages */}
        {profilePictures.some(p => p.upload_status === 'failed') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Some uploads failed</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              You can try uploading again or contact support if the problem persists.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};