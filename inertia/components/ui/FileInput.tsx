import { PhotoIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useId, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface IFileInput {
  name: string
  label: string
  required?: boolean
  error?: string
  onFileChange?: (file: File | null) => void
}

export function FileInput(props: IFileInput) {
  const id = useId()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | undefined>(props.error)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (inputRef.current) {
        const list = new DataTransfer()
        acceptedFiles.map((file) => list.items.add(file))
        inputRef.current.files = list.files

        setSelectedFiles(acceptedFiles)
        setError(undefined)
        props.onFileChange?.(acceptedFiles[0] ?? null)
      }
    },
    [props.onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, inputRef } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
  })

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {props.label}
        {props.required && <span className="ml-1 text-sm text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
            id={id}
            name={props.name}
            type="file"
            className="sr-only"
          />
          <div
            className={`flex max-w-lg items-center justify-center gap-6 rounded-lg border-2 px-10 py-8 transition-all ${
              isDragReject
                ? 'scale-95 border-solid border-red-600 bg-red-500/50'
                : isDragActive
                  ? 'scale-105 border-solid border-green-600 bg-green-500/50'
                  : error
                    ? 'border-dashed border-red-400 bg-red-100'
                    : 'border-dashed border-slate-400 bg-white'
            }`}
          >
            <PhotoIcon
              className={`h-12 w-12 ${
                isDragReject
                  ? 'text-red-800'
                  : isDragActive
                    ? 'text-green-800'
                    : 'text-slate-400'
              }`}
              aria-hidden
            />
            <div className="relative w-full">
              {isDragReject ? (
                <p className="font-medium text-red-800">File not acceptable</p>
              ) : isDragActive ? (
                <p className="font-medium text-green-800">Drop the file!</p>
              ) : (
                <>
                  <div className="flex text-sm text-slate-600">
                    <label
                      htmlFor={id}
                      className="relative z-0 cursor-pointer rounded-md font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-700"
                    >
                      <span>Upload an image</span>
                    </label>
                    <p className="hidden pl-1 sm:inline">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
                  {selectedFiles.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm font-medium text-slate-700">Selected Image</p>
                      <ul className="text-xs text-slate-600">
                        {selectedFiles.map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {error && (
          <div className="pt-1 text-sm text-red-700" id={`${id}-error`}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
