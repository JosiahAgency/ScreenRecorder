import {ChangeEvent, useRef, useState} from "react";

export const useFileInput = (maxSize: number) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('')
    const [duration, setDuration] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0]

            if (selectedFile.size > maxSize) {
                alert('File size is too large')
                return
            }

            if (previewUrl) URL.revokeObjectURL(previewUrl)

            setFile(selectedFile);

            const objUrl = URL.createObjectURL(selectedFile)

            setPreviewUrl(objUrl)

            if (selectedFile.type.startsWith('video')) {
                const video = document.createElement('video')

                video.preload = 'metadata'

                video.onloadeddata = () => {
                    if (isFinite(video.duration) && video.duration > 0) {
                        setDuration(Math.round(video.duration))
                    } else {
                        setDuration(0)
                    }

                    URL.revokeObjectURL(video.src)
                }

                video.src = objUrl
            }
        }
    }

    const resetFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)

        setFile(null)
        setPreviewUrl('')
        setDuration(0)

        if (inputRef.current) inputRef.current.value = ''
    }

    return {handleFileChange, resetFile, file, duration, previewUrl, inputRef}

};