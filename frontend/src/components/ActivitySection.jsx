import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import images correctly as modules from your src assets folder
import issueImg from '../assets/other_civis_issuse.jpeg';
import riImg from '../assets/RI_image.jpeg';
import sliImg from '../assets/SLI_image.jpeg';
import wiImg from '../assets/WI.jpeg';
import issueImg2 from '../assets/other_civis_issuse_2.jpeg';
import issueImg3 from '../assets/other_civis_issuse_3.jpeg';
import issueImg4 from '../assets/other_civis_issuse_4.jpeg';

export default function ActivitySection({ t }) {
    const baseImages = [
        { url: issueImg, caption: '' },
        { url: riImg, caption: '' },
        { url: sliImg, caption: '' },
        { url: wiImg, caption: '' },
        { url: issueImg2, caption: '' },
        { url: issueImg3, caption: '' },
        { url: issueImg4, caption: '' }
    ];

    const activityImages = [baseImages[baseImages.length - 1], ...baseImages, baseImages[0]];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 4000);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (currentIndex === activityImages.length - 1) {
            const timeoutId = window.setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
                window.setTimeout(() => setIsTransitioning(true), 50);
            }, 500);

            return () => window.clearTimeout(timeoutId);
        }

        if (currentIndex === 0) {
            const timeoutId = window.setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(activityImages.length - 2);
                window.setTimeout(() => setIsTransitioning(true), 50);
            }, 500);

            return () => window.clearTimeout(timeoutId);
        }

        return undefined;
    }, [activityImages.length, currentIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <Grid item xs={12} md={6}>
            <Box
                sx={{
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                    border: '4px solid #ffffff',
                    outline: '1.5px solid rgba(2, 84, 70, 0.1)',
                    position: 'relative',
                    width: '100%',
                    backgroundColor: 'transparent',
                    '& .nav-arrow': {
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
                        transform: 'translateY(-50%) scale(0.9)',
                    },
                    '&:hover .nav-arrow': {
                        opacity: 1,
                        pointerEvents: 'auto',
                        transform: 'translateY(-50%) scale(1)',
                    },
                }}
            >
                {/* Sliding Track for Images */}
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                >
                    {activityImages.map((image, index) => (
                        <Box
                            key={`${image.url}-${index}`}
                            sx={{
                                minWidth: '100%',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <Box
                                component="img"
                                src={image.url}
                                alt={image.caption || `About activity ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center center',
                                    display: 'block',
                                    backgroundColor: 'transparent',
                                }}
                            />

                            {/* Dark Overlay with Caption */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    p: 5
                                }}
                            >
                                <Typography variant="h4" color="white" sx={{ fontFamily: '"Lora", serif', fontWeight: 'bold', lineHeight: 1.3 }}>
                                    {image.caption}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Left Arrow Button */}
                <IconButton
                    className="nav-arrow"
                    onClick={prevSlide}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 16,
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        zIndex: 2,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                    }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Right Arrow Button */}
                <IconButton
                    className="nav-arrow"
                    onClick={nextSlide}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 16,
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        zIndex: 2,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Grid>
    )
}