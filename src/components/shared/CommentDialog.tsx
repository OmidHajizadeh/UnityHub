import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Suspense, lazy, useState } from "react";
import Spinner from "../loaders/Spinner";
import { Models } from "appwrite";

const PostComment = lazy(() => import("../forms/PostComment"));

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
          <Suspense fallback={<Spinner />}>
            <PostComment
              action={action}
              closeModal={() => setIsOpen(false)}
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
