"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Mail,
  Camera,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  EyeOff,
  Eye,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser, useUpdateUser } from "@/hooks/use-current-user";
import { uploadAvatar } from "@/lib/api/avatars-api";

import { API_CONFIG } from "@/config/api";
import {
  PasswordChangeFormData,
  passwordChangeSchema,
  UserFormData,
  userSchema,
} from "@/lib/validation/schemas";
import {
  type FormErrors,
  handleFormSubmitError,
} from "@/lib/api/handle-api-error";

export function ProfileSettings() {
  const { update: updateSession } = useSession();
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiErrors, setApiErrors] = useState<FormErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordApiErrors, setPasswordApiErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    setError: setPasswordError,
    clearErrors: clearPasswordErrors,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const handlePasswordInputChange = (
    fieldName: keyof PasswordChangeFormData,
  ) => {
    if (passwordApiErrors[fieldName]) {
      setPasswordApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      clearPasswordErrors(fieldName);
    }
  };

  const handleInputChange = (fieldName: keyof UserFormData) => {
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      clearErrors(fieldName);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    // Validate file size (max 2MB)
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
        avatar: avatarData["@id"], // Use IRI instead of full object
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
          : "Échec du téléchargement de l'avatar",
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

  const onSubmit = async (data: UserFormData) => {
    try {
      setApiErrors({});

      // save old username to compare
      const oldUsername = user?.username;

      await updateUser.mutateAsync({
        username: data.username,
        email: data.email,
      });

      await updateSession();

      toast.success("Profil mis à jour avec succès");
      reset(data); // ✅ reset form so isDirty = false again

      // if username was changed → disconnect
      if (oldUsername && oldUsername !== data.username) {
        signOut({ redirect: false }).then(() => {
          router.push("/login");
        });
      }
    } catch (error) {
      handleFormSubmitError<UserFormData>(
        error,
        setError,
        "Impossible de mettre à jour le profil. Vérifiez vos données.",
      );
    }
  };

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      setPasswordApiErrors({});

      // Note: The API should verify the current password before updating
      await updateUser.mutateAsync({
        plainPassword: data.newPassword,
      });

      toast.success("Mot de passe modifié avec succès");
      resetPassword();
      signOut({ redirect: false }).then(() => {
        router.push("/login");
      });
    } catch (error) {
      handleFormSubmitError<PasswordChangeFormData>(
        error,
        setPasswordError,
        "Impossible de modifier le mot de passe. Vérifiez vos données.",
      );
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
                    {
                      'Nouvelle photo sélectionnée. Cliquez sur "Télécharger" pour enregistrer.'
                    }
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
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

            <FormField
              label="Nom d'utilisateur"
              htmlFor="username"
              error={errors.username?.message || apiErrors.username}
              required
            >
              <Input
                id="username"
                {...register("username", {
                  onChange: () => handleInputChange("username"),
                })}
                placeholder="Entrez votre nom d'utilisateur"
                className={
                  errors.username || apiErrors.username ? "border-red-500" : ""
                }
              />
              <p className="text-sm text-muted-foreground">
                Nécessite une reconnexion
              </p>
            </FormField>

            <FormField
              label="Adresse e-mail"
              htmlFor="email"
              error={errors.email?.message || apiErrors.email}
              required
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    onChange: () => handleInputChange("email"),
                  })}
                  placeholder="votre@email.com"
                  className={`pl-10 ${
                    errors.email || apiErrors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
            </FormField>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  updateUser.isLoading ||
                  (!isDirty && !isSubmitting)
                }
              >
                {isSubmitting || updateUser.isLoading ? (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Modifier le mot de passe
          </CardTitle>
          <CardDescription>
            Changez votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            noValidate
            className="space-y-4"
          >
            <FormField
              label="Mot de passe actuel"
              htmlFor="currentPassword"
              error={
                passwordErrors.currentPassword?.message ||
                passwordApiErrors.currentPassword
              }
              required
            >
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...registerPassword("currentPassword", {
                    onChange: () =>
                      handlePasswordInputChange("currentPassword"),
                  })}
                  placeholder="Entrez votre mot de passe actuel"
                  className={`pl-10 pr-10 ${
                    passwordErrors.currentPassword ||
                    passwordApiErrors.currentPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField
              label="Nouveau mot de passe"
              htmlFor="newPassword"
              error={
                passwordErrors.newPassword?.message ||
                passwordApiErrors.newPassword
              }
              required
            >
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...registerPassword("newPassword", {
                    onChange: () => handlePasswordInputChange("newPassword"),
                  })}
                  placeholder="Entrez votre nouveau mot de passe"
                  className={`pl-10 pr-10 ${
                    passwordErrors.newPassword || passwordApiErrors.newPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField
              label="Confirmer le nouveau mot de passe"
              htmlFor="confirmPassword"
              error={
                passwordErrors.confirmPassword?.message ||
                passwordApiErrors.confirmPassword
              }
              required
            >
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerPassword("confirmPassword", {
                    onChange: () =>
                      handlePasswordInputChange("confirmPassword"),
                  })}
                  placeholder="Confirmez votre nouveau mot de passe"
                  className={`pl-10 pr-10 ${
                    passwordErrors.confirmPassword ||
                    passwordApiErrors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormField>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPasswordSubmitting || updateUser.isLoading}
              >
                {isPasswordSubmitting || updateUser.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Modification...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Modifier le mot de passe
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
