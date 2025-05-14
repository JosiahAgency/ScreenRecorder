import React from 'react'
import {getVideoById} from "@/lib/actions/video";
import {redirect} from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import VideoDetailHeader from "@/components/VideoDetailHeader";

const Page = async ({params}: Params) => {
    const {videoId} = await params;

    const {user, videos} = await getVideoById(videoId)

    if (!videos) {
        redirect('/404')
    }

    return (
        <main className='wrapper page'>
            <VideoDetailHeader {...videos} userImg={user?.image} username={user?.name} ownerId={videos.userId}/>
            <section className='video-details'>
                <div className='content'>
                    <VideoPlayer videoId={videos.videoId}/>
                </div>
            </section>
        </main>
    )
}
export default Page
