import { Suspense, useState } from "react";
import { Models } from "appwrite";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommentForm from "@/components/forms/Comment.form";

type CommentDialogProps = {
  comment?: Models.Document;
  action: "create" | "update";
  post: Models.Document;
  children: React.ReactNode;
};

function CommentDialog({
  action,
  comment,
  post,
  children,
}: CommentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">
            {action === "create" ? "افزودن کامنت" : "ویرایش کامنت"}
          </DialogTitle>
        </DialogHeader>
        {isOpen && (
          <Suspense
            fallback={
              <div className="animate-pulse bg-dark-2 rounded-xl h-36" />
            }
          >
            <CommentForm
              action={action}
              closeModal={closeModal}
              comment={comment}
              post={post}
            />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;