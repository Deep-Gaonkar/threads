import { ObjectId } from "mongoose";
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import React from "react";
import UserCard from "@/components/cards/UserCard";

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

  // fetch user
  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className="head-text">Search</h1>

      {/* Search bar */}

      <div className="mt-14 flex flex-col gap-9">
        {
          result.users.length === 0 ? (
            <p className="no-result">No Users</p>
          ) : (
            <React.Fragment>
              {
                result.users.map(person => (
                  <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType='User'
                  />
                ))
              }
            </React.Fragment>
          )
        }
      </div>
    </section>
  )
}

export default Page