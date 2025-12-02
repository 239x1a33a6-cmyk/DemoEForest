import React, { useState, useEffect, useRef } from 'react';

interface TimelineSliderProps {
    startDate: string;
    endDate: string;
    currentDate: string;
    onChange: (date: string) => void;
    onPlayPause: (isPlaying: boolean) => void;
}

export default function TimelineSlider({ startDate, endDate, currentDate, onChange, onPlayPause }: TimelineSliderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Convert dates to timestamps for slider calculation
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    const currentTimestamp = new Date(currentDate).getTime();
    const totalDuration = endTimestamp - startTimestamp;

    // Initialize slider value based on current date
    useEffect(() => {
        const progress = ((currentTimestamp - startTimestamp) / totalDuration) * 100;
        setSliderValue(progress);
    }, [currentDate, startTimestamp, totalDuration]);

    // Handle play/pause
    const togglePlay = () => {
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);
        onPlayPause(newIsPlaying);

        if (newIsPlaying) {
            intervalRef.current = setInterval(() => {
                setSliderValue((prev) => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        onPlayPause(false);
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return 100;
                    }
                    const newValue = prev + 1; // Increment by 1%

                    // Calculate new date based on slider value
                    const newTime = startTimestamp + (newValue / 100) * totalDuration;
                    const newDate = new Date(newTime).toISOString().split('T')[0];
                    onChange(newDate);

                    return newValue;
                });
            }, 100); // Update every 100ms
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setSliderValue(value);

        const newTime = startTimestamp + (value / 100) * totalDuration;
        const newDate = new Date(newTime).toISOString().split('T')[0];
        onChange(newDate);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl">
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isPlaying ? <i className="ri-pause-line"></i> : <i className="ri-play-fill"></i>}
                </button>

                <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{startDate}</span>
                        <span className="font-bold text-blue-600 text-sm">{currentDate}</span>
                        <span>{endDate}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>
        </div>
    );
}
