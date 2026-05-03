'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'

interface ImageCropperProps {
    imageSrc: string
    onCropComplete: (croppedImageBlob: Blob) => void
    onCancel: () => void
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return
                }
                resolve(blob)
            }, 'image/png')
        })
    }

    const handleSave = async () => {
        try {
            if (croppedAreaPixels) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
                onCropComplete(croppedImage)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Crop Profile Picture</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <div className="relative w-full h-80 bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        showGrid={false}
                        cropShape="round"
                    />
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(Number(e.target.value))
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Save & Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
