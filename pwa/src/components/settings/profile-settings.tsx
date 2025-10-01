"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser, useUpdateUser } from "@/hooks/use-current-user";
import { uploadAvatar } from "@/lib/api/avatars-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Camera,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api";

export function ProfileSettings() {
  const { update: updateSession } = useSession();
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();

  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const avatarData = await uploadAvatar(selectedFile);

      await updateUser.mutateAsync({
        avatar: avatarData["@id"],
      });

      // Update session to reflect new avatar
      await updateSession();

      toast.success("Photo de profil mise à jour avec succès");
      setAvatarPreview(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Échec du téléchargement de l'avatar"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await updateUser.mutateAsync({
        avatar: null,
      });

      // Update session to reflect removed avatar
      await updateSession();

      toast.success("Photo de profil supprimée avec succès");
      setAvatarPreview(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Échec de la suppression de l'avatar");
    }
  };

  const handleCancelAvatarChange = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser.mutateAsync({
        username: formData.username,
        email: formData.email,
      });

      await updateSession();

      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Échec de la mise à jour du profil");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Chargement du profil..." />
      </div>
    );
  }

  const avatarUrl =
    user?.avatar &&
    typeof user.avatar === "object" &&
    "contentUrl" in user.avatar &&
    user.avatar.contentUrl
      ? `${API_CONFIG.BASE_URL}${user.avatar.contentUrl}`
      : null;

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo de profil
          </CardTitle>
          <CardDescription>
            Téléchargez ou modifiez votre photo de profil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-32 w-32 border-4 border-muted">
              <AvatarImage
                src={avatarPreview || avatarUrl || undefined}
                alt={user?.username || "User"}
              />
              <AvatarFallback className="text-3xl">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar-upload">
                  Choisir une nouvelle photo
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  JPG, PNG ou GIF. Taille maximale de 2 Mo.
                </p>
              </div>

              {selectedFile && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nouvelle photo sélectionnée. Cliquez sur "Télécharger" pour
                    enregistrer.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedFile && (
                  <>
                    <Button
                      onClick={handleUploadAvatar}
                      disabled={isUploading}
                      size="sm"
                    >
                      {isUploading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Téléchargement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Télécharger
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelAvatarChange}
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                    >
                      Annuler
                    </Button>
                  </>
                )}

                {avatarUrl && !selectedFile && (
                  <Button
                    onClick={handleDeleteAvatar}
                    variant="destructive"
                    size="sm"
                    disabled={updateUser.isLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer la photo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du profil
          </CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ref">Référence utilisateur</Label>
              <Input
                id="ref"
                value={user?.ref || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Votre identifiant unique ne peut pas être modifié
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="votre@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateUser.isLoading}>
                {updateUser.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
          <CardDescription>Détails de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Rôles</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {user?.roles?.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {role.replace("ROLE_", "")}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Statut du compte</Label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    user?.enabled
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.enabled ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>

            {user?.createdAt && (
              <div>
                <Label className="text-muted-foreground">Créé le</Label>
                <p className="mt-1 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {user?.lastLoginAt && (
              <div>
                <Label className="text-muted-foreground">
                  Dernière connexion
                </Label>
                <p className="mt-1 text-sm">
                  {new Date(user.lastLoginAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
