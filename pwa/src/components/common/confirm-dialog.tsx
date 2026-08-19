import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  cancelLabel?: string;
  actionLabel?: string;
  onConfirm: () => void;
};

/**
 * Reusable confirm dialog component
 * @example
 * function ConfirmDialogDemo(){
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<{
      title: string;
      description?: string;
      onConfirm: () => void;
      actionLabel?: string;
    } | null>(null);

    const handleDelete = async () => {
    setDialogData({
      title: `Delete article "${id}"?`,
      description: "Are you sure you want to delete this article?",
      actionLabel: "Delete",
      onConfirm: () => {
        deleteArticle.mutateAsync(id);
        setOpenConfirmDialog(false);
        router.push("/articles");
      },
    });
    setOpenConfirmDialog(true);
    };

    return (
    ...
    {openConfirmDialog && dialogData && (
        <ConfirmDialog
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          title={dialogData.title}
          description={dialogData.description}
          actionLabel={dialogData.actionLabel}
          onConfirm={dialogData.onConfirm}
        />
      )}
    ...
    );
   }
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = "Cancel",
  actionLabel = "Confirm",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
