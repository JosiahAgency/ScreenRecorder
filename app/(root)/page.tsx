import React from 'react'
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import {getAllVideos} from "@/lib/actions/video";
import EmptyState from "@/components/EmptyState";

const Page = async ({searchParams}: SearchParams) => {
    const {query, filter, page} = await searchParams;

    const {videos, pagination} = await getAllVideos(query, filter, Number(page) || 1)

    return (
        <main className='wrapper page'>
            <Header subHeader='public library' title='all videos'/>
            {videos?.length > 0 ? (
                <section className='video-grid'>
                    {videos.map(({videos, user}) => (
                        <VideoCard key={videos.id}
                                   {...videos}
                                   thumbnail={videos.thumbnailUrl}
                                   userImg={user?.image || ''}
                                   username={user?.name || 'Guest'}
                        />
                    ))}
                </section>
            ) : (
                <EmptyState icon='/assets/icons/video.svg' title='No Videos Found'
                            description='Try a different search'/>
            )}
        </main>
    )
}

export default Page