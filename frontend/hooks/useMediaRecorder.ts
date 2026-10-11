import { useState, useCallback, useRef, useEffect } from 'react';

export type RecorderStatus = 'idle' | 'recording' | 'stopped';

export interface UseMediaRecorderResult {
  status: RecorderStatus;
  isRecording: boolean;
  mediaBlobUrl: string | null;
  mediaBlob: Blob | null;
  previewStream: MediaStream | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearMedia: () => void;
}

export const useMediaRecorder = ({ audio = true, video = false } = {}): UseMediaRecorderResult => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio, 
        video: video ? { width: 1280, height: 720 } : false 
      });
      setPreviewStream(stream);
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: video ? 'video/webm' : 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaBlob(blob);
        setMediaBlobUrl(url);
        
        // Stop all tracks to release hardware
        stream.getTracks().forEach(track => track.stop());
        setPreviewStream(null);
        setStatus('stopped');
      };

      recorder.start();
      setStatus('recording');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setStatus('idle');
    }
  }, [audio, video]);

  const clearMedia = useCallback(() => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
    }
    setMediaBlob(null);
    setMediaBlobUrl(null);
    setStatus('idle');
  }, [mediaBlobUrl]);

  useEffect(() => {
    return () => {
        if (previewStream) {
            previewStream.getTracks().forEach(track => track.stop());
        }
        if (mediaBlobUrl) {
            URL.revokeObjectURL(mediaBlobUrl);
        }
    };
  }, [previewStream, mediaBlobUrl]);

  return {
    status,
    isRecording: status === 'recording',
    mediaBlobUrl,
    mediaBlob,
    previewStream,
    startRecording,
    stopRecording,
    clearMedia
  };
};

export default useMediaRecorder;