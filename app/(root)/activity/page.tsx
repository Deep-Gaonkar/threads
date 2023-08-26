import { Fragment } from "react"

import { ObjectId } from "mongoose";
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { fetchUser, getActivity } from "@/lib/actions/user.actions"
import Link from "next/link";
import Image from "next/image";

interface IUserInfo {
  _id: ObjectId;
  id: string;
  __v: number;
  bio: string;
  communities: any[]; // Replace 'any' with the actual type for communities if available
  image: string;
  name: string;
  onboarded: boolean;
  threads: ObjectId[];
  username: string;
}

const Page = async () => {
  const user = await currentUser()
  if (!user) return null

  const userInfo: IUserInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  // get activity
  const activity = await getActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {
          activity.length > 0 ? (
            <Fragment>
              {
                activity.map(act => (
                  <Link
                    key={act._id}
                    href={`/thread/${act.parentId}`}
                  >
                    <article className="activity-card">
                      <Image
                        src={act.author.image}
                        alt="profile picture"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-small-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {act.author.name}
                        </span>{" "}
                        replied to your thread
                      </p>
                    </article>
                  </Link>
                ))
              }
            </Fragment>
          ) : (
            <p className="!text-base-regular text-light-3">No Activity Yet</p>
          )
        }
      </section>
    </section>
  )
}

export default Page