import React from 'react'
import Header from "@/components/Header";
import {dummyCards} from "@/constants";
import VideoCard from "@/components/VideoCard";

const Page = async ({params}: ParamsWithSearch) => {
    const {id} = await params;

    return (
        <div className='wrapper page'>
            <Header subHeader='meanda@gmail.com' title='meanda' userImg='/assets/images/dummy.jpg'/>
            <section className='video-grid'>
                {dummyCards.map(card => (
                    <VideoCard key={card.id} id={card.id} title={card.title} thumbnail={card.thumbnail}
                               createdAt={card.createdAt}
                               userImg={card.userImg} username={card.username} views={card.views}
                               visibility={card.visibility}
                               duration={card.duration}/>
                ))}
            </section>

        </div>
    )
}
export default Page
