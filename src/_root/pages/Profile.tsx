import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { Suspense, lazy } from "react";

import LikeIcon from "/icons/like.svg";
import EditIcon from "/icons/edit.svg";
import PostsIcon from "/icons/posts.svg";
import SavedIcon from "/icons/bookmark.svg";
import UserStats from "@/components/shared/UserStats";
import GridPostList from "@/components/shared/GridPostList";
import ProfileFallback from "@/components/suspense-fallbacks/ProfileFallback";
import FollowUserButton from "@/components/shared/FollowUserButton";
import SmallPostsFallback from "@/components/suspense-fallbacks/SmallPostsFallback";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/hooks/tanstack-query/queries";

const InteractedPosts = lazy(() => import("./InteractedPosts"));

const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  const {
    data: user,
    isError: isCurrentUserMissing,
    isLoading: isLoadingCurrentUser,
  } = useGetCurrentUser();
  const {
    data: thisUser,
    isError: hasVisitedUserError,
    isLoading: isLoadingVisitedUser,
  } = useGetUserById(id || "");

  if (isLoadingCurrentUser || isLoadingVisitedUser) return <ProfileFallback />;

  if (
    hasVisitedUserError ||
    isCurrentUserMissing ||
    !id ||
    !user ||
    !thisUser
  ) {
    return (
      <div className="profile-container">
        <p>کاربر مورد نظر یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{thisUser.name} صفحه</title>
      </Helmet>
      <div className="profile-container">
        <div className="profile-inner_container">
          <div className="flex-start grow gap-4">
            <img
              src={thisUser.imageUrl || "/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
            />
            <div className="flex flex-col flex-1 justify-between gap-6 md:mt-2">
              <div className="flex flex-col w-full">
                <h1 className="text-start h3-bold md:h1-semibold w-full">
                  {thisUser.name}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-start">
                  {thisUser.username}@
                </p>
              </div>
              <div className="flex-start gap-4 lg:gap-8 items-center flex-wrap z-20">
                <UserStats value={thisUser.posts.length} label="پست" />
                <UserStats
                  value={thisUser.followings.length}
                  label="دنبال شونده"
                />
                <UserStats
                  value={thisUser.followers.length}
                  label="دنبال کننده"
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            {user.$id === thisUser.$id ? (
              <Link
                to="/update-profile"
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.$id !== thisUser.$id && "hidden"
                }`}
              >
                <img src={EditIcon} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">
                  ویرایش پروفایل
                </p>
              </Link>
            ) : (
              <FollowUserButton
                className="shad-button_primary px-8"
                targetUserId={id}
              />
            )}
          </div>
        </div>

        {thisUser.bio && (
          <p className="whitespace-break-spaces text-start w-full mt-4 md:mt-0 small-medium md:base-medium">
            {thisUser.bio}
          </p>
        )}

        <div className="flex lg:hidden w-full justify-center md:justify-end">
          {user.$id === thisUser.$id ? (
            <Link
              to="/update-profile"
              className={`h-12 w-full lg:w-auto bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                user.$id !== thisUser.$id && "hidden"
              }`}
            >
              <img src={EditIcon} alt="edit" width={20} height={20} />
              <p className="flex whitespace-nowrap small-medium">
                ویرایش پروفایل
              </p>
            </Link>
          ) : (
            <FollowUserButton
              className="shad-button_primary w-full lg:w-auto px-8"
              targetUserId={id}
            />
          )}
        </div>

        {thisUser.$id === user.$id ? (
          <div className="flex-center gap-3 my-4 w-full">
            <Link
              to={`/profile/${id}`}
              className={`profile-tab rounded-lg ${
                pathname === `/profile/${id}` && "!bg-dark-3"
              }`}
            >
              <img src={PostsIcon} alt="posts" width={20} height={20} />
              <span className="hidden lg:inline">پست های من</span>
            </Link>
            <Link
              to={`/profile/${id}/liked-posts`}
              className={`profile-tab rounded-lg ${
                pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
              }`}
            >
              <img src={LikeIcon} alt="like" width={20} height={20} />
              <span className="hidden lg:inline">لایک شده ها</span>
            </Link>
            <Link
              to={`/profile/${id}/saved-posts`}
              className={`profile-tab rounded-lg ${
                pathname === `/profile/${id}/saved-posts` && "!bg-dark-3"
              }`}
            >
              <img src={SavedIcon} alt="like" width={20} height={20} />
              <span className="hidden lg:inline">ذخیره شده ها</span>
            </Link>
          </div>
        ) : (
          <hr className="border border-dark-4/80 w-full hidden lg:block" />
        )}

        <Routes>
          <Route
            index
            element={
              thisUser.posts.length === 0 ? (
                <p className="text-light-4 text-center w-full mt-10">
                  {thisUser.$id === user.$id
                    ? "شما هیچ پستی آپلود نکرده اید"
                    : "هیچ پستی برای نمایش پیدا نشد"}
                </p>
              ) : (
                <GridPostList
                  posts={thisUser.posts}
                  showUser={false}
                  showStats={false}
                />
              )
            }
          />
          {thisUser.$id === user.$id && (
            <>
              <Route
                path="/liked-posts"
                element={
                  <Suspense fallback={<SmallPostsFallback count={6} />}>
                    <InteractedPosts
                      type="liked"
                      title="پست های لایک شده"
                      noResultText="شما هیچ پستی را لایک نکرده اید"
                    />
                  </Suspense>
                }
              />
              <Route
                path="/saved-posts"
                element={
                  <Suspense fallback={<SmallPostsFallback count={6} />}>
                    <InteractedPosts
                      type="saved"
                      title="پست های ذخیره شده"
                      noResultText="شما هیچ پستی را ذخیره نکرده اید"
                    />
                  </Suspense>
                }
              />
            </>
          )}
        </Routes>
        <Outlet />
      </div>
    </>
  );
};

export default Profile;
