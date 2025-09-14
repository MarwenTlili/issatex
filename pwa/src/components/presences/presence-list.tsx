"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Plus, Users, AlertCircle } from "lucide-react"
import { PresenceCard } from "./presence-card"
import { PresenceFilters } from "./presence-filters"
import { PresenceForm } from "./presence-form"
import { usePresences, useCreatePresence, useUpdatePresence, useDeletePresence } from "@/hooks/use-presences"
import type {
  Presence,
  PresenceFilters as PresenceFiltersType,
  CreatePresenceData,
  UpdatePresenceData,
} from "@/types/resources/Presence"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function PresenceList() {
  const [filters, setFilters] = useState<PresenceFiltersType>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPresence, setEditingPresence] = useState<Presence | null>(null)
  const [deletingPresenceId, setDeletingPresenceId] = useState<number | null>(null)

  const { data: presencesData, isLoading, error } = usePresences(filters)
  const createPresenceMutation = useCreatePresence()
  const updatePresenceMutation = useUpdatePresence()
  const deletePresenceMutation = useDeletePresence()

  const presences = presencesData?.["member"] || []
  const totalItems = presencesData?.["totalItems"] || 0

  const handleCreatePresence = async (data: CreatePresenceData | UpdatePresenceData) => {
    try {
      await createPresenceMutation.mutateAsync(data as CreatePresenceData)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating presence:", error)
    }
  }

  const handleUpdatePresence = async (data: UpdatePresenceData) => {
    if (!editingPresence) return

    try {
      await updatePresenceMutation.mutateAsync({
        id: editingPresence.id,
        data,
      })
      setEditingPresence(null)
    } catch (error) {
      console.error("Error updating presence:", error)
    }
  }

  const handleDeletePresence = async () => {
    if (!deletingPresenceId) return

    try {
      await deletePresenceMutation.mutateAsync(deletingPresenceId)
      setDeletingPresenceId(null)
    } catch (error) {
      console.error("Error deleting presence:", error)
    }
  }

  const resetFilters = () => {
    setFilters({})
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-muted-foreground">Erreur lors du chargement des présences</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des présences</h1>
          <p className="text-muted-foreground">
            Gérez les présences des employés ({totalItems} présence{totalItems !== 1 ? "s" : ""})
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle présence
        </Button>
      </div>

      {/* Filters */}
      <PresenceFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : presences.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune présence trouvée</h3>
              <p className="text-muted-foreground mb-4">Commencez par créer une nouvelle présence</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une présence
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presences.map((presence) => (
            <PresenceCard
              key={presence.id}
              presence={presence}
              onEdit={setEditingPresence}
              onDelete={setDeletingPresenceId}
              isLoading={updatePresenceMutation.isLoading || deletePresenceMutation.isLoading}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle présence</DialogTitle>
          </DialogHeader>
          <PresenceForm
            onSubmit={handleCreatePresence}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createPresenceMutation.isLoading}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPresence} onOpenChange={() => setEditingPresence(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la présence</DialogTitle>
          </DialogHeader>
          {editingPresence && (
            <PresenceForm
              initialData={editingPresence}
              onSubmit={handleUpdatePresence}
              onCancel={() => setEditingPresence(null)}
              isLoading={updatePresenceMutation.isLoading}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPresenceId} onOpenChange={() => setDeletingPresenceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette présence ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePresence}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
