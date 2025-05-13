'use client'

import React, {ChangeEvent, useEffect, useState} from 'react'
import FormField from "@/components/FormField";
import FileInput from "@/components/FileInput";
import {useFileInput} from "@/lib/hooks/useFileInput";
import {MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE} from "@/constants";
import {getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails} from "@/lib/actions/video";
import {useRouter} from "next/navigation";

const uploadFileToBunny = async (file: File, uploadUrl: string, accessKey: string): Promise<void> => {

    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            AccessKey: accessKey,
        },
        body: file,

    });

    if (!response.ok) {
        throw new Error('uploadFileTobunny function Error. Failed to upload file');
    }
}

const Page = () => {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'public',
    })
    const [error, setError] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target as HTMLInputElement;

        setFormData((prevState) => ({...prevState, [name]: value}))
    }

    const video = useFileInput(MAX_VIDEO_SIZE)

    useEffect(() => {
        if (video.duration !== null || 0) {
            setVideoDuration(video.duration)
        }
    }, [video.duration])

    const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        try {

            if (!video.file || !thumbnail.file) {
                setError('Please upload a video and a thumbnail')
                return
            }

            if (!formData.title || !formData.description) {
                setError('Please fill in all the fields')
                return
            }


            const {videoId, uploadUrl: videoUploadUrl, accessKey: videoAccessKey} = await getVideoUploadUrl()


            if (!videoUploadUrl || !videoAccessKey) {
                throw new Error('Error. Failed to get video upload credentials ')
            }


            await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey)


            const {
                uploadUrl: thumbnailUploadUrl,
                accessKey: thumbnailAccessKey,
                cdnUrl: thumbnailCdnUrl
            } = await getThumbnailUploadUrl(videoId)

            if (!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey) {
                throw new Error('Error. Failed to get video upload credentials ')
            }

            await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey)

            await saveVideoDetails({
                videoId,
                thumbnailUrl: thumbnailCdnUrl,
                ...formData,
                duration: videoDuration
            })

            router.push(`/video/${videoId}`)

        } catch (error) {
            console.log('Error submitting form', error)
        } finally {
            setIsUploading(false);
        }

    }

    return (
        <div className='wrapper-md upload-page'>
            <h1 className='capitalize'>upload a video</h1>
            {error && (
                <div className='error-field'>{error}</div>
            )}

            <form className='rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5' onSubmit={handleSubmit}>
                <FormField
                    id='title'
                    label='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear title"
                />
                <FormField
                    id='description'
                    label='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    as='textarea'
                />
                <FileInput
                    id='video'
                    label='video'
                    accept='video/*'
                    file={video.file}
                    previewUrl={video.previewUrl}
                    inputRef={video.inputRef}
                    onChange={video.handleFileChange}
                    onReset={video.resetFile}
                    type='video'/>
                <FileInput
                    id='thumbnail'
                    label='thumbnail'
                    accept='image/*'
                    file={thumbnail.file}
                    previewUrl={thumbnail.previewUrl}
                    inputRef={thumbnail.inputRef}
                    onChange={thumbnail.handleFileChange}
                    onReset={thumbnail.resetFile}
                    type='image'/>
                <FormField
                    id='visibility'
                    label='visibility'
                    value={formData.visibility}
                    onChange={handleInputChange}
                    as='select'
                    options={
                        [
                            {value: 'Public', label: 'Public'},
                            {value: 'Private', label: 'Private'},
                        ]
                    }/>
                <button className='submit-button' type='submit' disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload video'}
                </button>
            </form>
        </div>
    )
}
export default Page
