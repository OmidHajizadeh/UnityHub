import { Link } from "react-router-dom";

import Logo from "/images/icon.svg";
import CommentIcon from "/icons/comment.svg";
import { Audit } from "@/types";
import { multiFormatDateString } from "@/lib/utils";
import FollowUserButton from "./FollowUserButton";

type AuditListProps = {
  audits: Audit[];
};

const AuditList = ({ audits }: AuditListProps) => {
  return audits.map((audit) => {
    return (
      <li
        key={audit.$id}
        className="rounded-lg p-3 bg-dark-4 flex items-center gap-3 w-full"
      >
        <Link
          to={`/profile/${audit.initiativeUserId}`}
          className="shrink-0 rounded-full relative"
        >
          <img
            src={
              audit.initiativeUserImageUrl || "/icons/profile-placeholder.svg"
            }
            className="rounded-full h-14 w-14 overflow-hidden"
            alt={audit.initiativeUserUsername}
          />
          {audit.auditType === "comment" && (
            <img
              src={CommentIcon}
              alt="comment"
              className="absolute -top-2 -start-0 w-5 h-5"
            />
          )}
        </Link>
        <div className="flex-between gap-3 grow">
          <div className="flex flex-col gap-1">
            <Link
              to={`/profile/${audit.initiativeUserId}`}
              className="shrink-0 rounded-full"
            >
              <small dir="ltr" className="text-light-3">
                @{audit.initiativeUserUsername}
              </small>
            </Link>
            <p dir="auto" className="whitespace-break-spaces text-right">
              {audit.message}
            </p>
            <small>
              <time className="text-light-4">
                {multiFormatDateString(audit.$createdAt)}
              </time>
            </small>
          </div>
          {audit.auditType === "like" || audit.auditType === "comment" ? (
            <Link className="shrink-0" to={`/posts/${audit.postId}`}>
              <img
                src={audit.postImageUrl}
                className="rounded-md h-20 w-20 object-cover"
                alt="تصویر پست"
              />
            </Link>
          ) : audit.auditType === "follow" ? (
            <FollowUserButton
              className="shad-button_primary px-4"
              targetUserId={audit.initiativeUserId}
            />
          ) : (
            <Link
              className="shrink-0"
              to={`/profile/${audit.initiativeUserId}`}
            >
              <img
                src={Logo}
                className="rounded-md me-3 h-14 w-14"
                alt={audit.initiativeUserUsername}
              />
            </Link>
          )}
        </div>
      </li>
    );
  });
};

export default AuditList;
