import React from 'react';
import { Box } from '@mui/material';

export default function RsrpLogo({ alt = 'RSRP Logo' }) {
    return (
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                marginRight: '10px',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                component="img"
                src="/RSRP_LOGO.jpeg"
                alt={alt}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.8)'
                }}
            />
        </Box>
    );
}