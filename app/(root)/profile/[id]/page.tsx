import Image from "next/image";
import { ObjectId } from "mongoose";
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { profileTabs } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import ThreadsTab from "@/components/shared/ThreadsTab";

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

const Page = async ({ params }: { params: { id: string }}) => {
  const user = await currentUser()

  if (!user) return null

  const userInfo: IUserInfo = await fetchUser(params.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imageUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs default="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map(tab => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === 'Threads' && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map(tab => (
            <TabsContent key={`Content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Page