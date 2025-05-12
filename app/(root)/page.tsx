import React from 'react'
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import {dummyCards} from "@/constants";

const Page = () => {
    return (
        <main className='wrapper page'>
            <Header subHeader='public library' title='all videos'/>
            <section className='video-grid'>
                {dummyCards.map(card => (
                    <VideoCard key={card.id} id={card.id} title={card.title} thumbnail={card.thumbnail}
                               createdAt={card.createdAt}
                               userImg={card.userImg} username={card.username} views={card.views}
                               visibility={card.visibility}
                               duration={card.duration}/>
                ))}
            </section>
        </main>
    )
}

export default Page