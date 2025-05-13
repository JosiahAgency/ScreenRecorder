'use client'
import React, {ChangeEvent, useState} from 'react'
import FormField from "@/components/FormField";
import FileInput from "@/components/FileInput";
import {useFileInput} from "@/lib/hooks/useFileInput";
import {MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE} from "@/constants";

const Page = () => {
    const [isUploading, setIsUploading] = useState(false);
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
