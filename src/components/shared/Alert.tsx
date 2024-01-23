import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Spinner from "@/components/loaders/Spinner";

type AlertProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
  children: React.ReactNode;
  isLoading: boolean;
};

export default function Alert({
  title,
  description,
  onConfirm,
  children,
  isLoading,
}: AlertProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmition(e: React.MouseEvent) {
    e.preventDefault();
    await onConfirm();
    setIsOpen(false);
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>کنسل</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={onSubmition}>
            <div className="flex-center gap-2">
              {isLoading && <Spinner size={20} />}
              تایید
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
