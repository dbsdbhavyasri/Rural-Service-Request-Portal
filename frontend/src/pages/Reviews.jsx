import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Rating, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { ThumbUp as ThumbUpIcon, Send as SendIcon } from '@mui/icons-material';
import API from '../services/api';

export default function Reviews({ t }) {
  const defaultReviews = [
    {
      name: 'Ramesh K.',
      role: t.roleWard3,
      text: t.reviewRamesh,
      rating: 5
    },
    {
      name: 'Lalitha D.',
      role: t.roleColony,
      text: t.reviewLalitha,
      rating: 5
    },
    {
      name: 'Srinivas R.',
      role: t.roleInspector,
      text: t.reviewSrinivas,
      rating: 4
    },
    {
      name: 'Koteswara Rao',
      role: t.roleWard1,
      text: t.reviewKoteswara,
      rating: 5
    },
    {
      name: 'M. Padmaja',
      role: t.roleTeacher,
      text: t.reviewPadmaja,
      rating: 5
    }
  ];
  const [reviews, setReviews] = useState(defaultReviews);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await API.get('/reviews');
        if (response.data.length > 0) setReviews(response.data);
      } catch (error) {
        console.error('Unable to load reviews', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim() || text.trim().length > 500) {
      setMessage({ type: 'error', text: t.reviewTextError });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await API.post('/reviews', { rating, text: text.trim() });
      setReviews((currentReviews) => [response.data, ...currentReviews]);
      setText('');
      setRating(5);
      setMessage({ type: 'success', text: t.reviewSubmitted });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t.reviewSubmitFailed });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          color="primary.main"
          sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Lora", serif' }}
        >
          {t.testimonials}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {t.reviewsSubtitle}
        </Typography>
      </Box>

      {/* Ratings stats highlight */}
      <Card
        variant="outlined"
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 4,
          border: '1.5px solid rgba(2, 84, 70, 0.08)',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(244, 247, 245, 0.5) 100%)'
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h2" color="primary.main" sx={{ fontWeight: 800, fontFamily: '"Lora", serif' }}>
              4.8 / 5
            </Typography>
            <Rating value={4.8} precision={0.1} readOnly sx={{ color: 'secondary.main', my: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {t.avgRating}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ borderLeft: { sm: '1px solid rgba(0,0,0,0.08)' }, borderRight: { sm: '1px solid rgba(0,0,0,0.08)' } }}>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, fontFamily: '"Lora", serif' }}>
              92%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t.resolutionRate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, fontFamily: '"Lora", serif' }}>
              3 Days
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t.avgResponseTime}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Card component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 4, mb: 6, borderRadius: 4 }}>
        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold', mb: 1, fontFamily: '"Lora", serif' }}>
          {t.writeReview}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t.writeReviewSubtitle}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend" variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>{t.yourRating}</Typography>
          <Rating value={rating} onChange={(_, value) => value && setRating(value)} size="large" sx={{ color: 'secondary.main' }} />
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          label={t.yourReview}
          placeholder={t.reviewPlaceholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${text.length}/500`}
        />
        {message.text && <Alert severity={message.type} sx={{ mt: 2, borderRadius: 2 }}>{message.text}</Alert>}
        <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={submitting} sx={{ mt: 2, alignSelf: 'flex-start' }}>
          {submitting ? t.submittingReview : t.submitReview}
        </Button>
      </Card>

      {/* Reviews Grid */}
      <Grid container spacing={4}>
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
        {!loading && reviews.map((review, idx) => (
          <Grid item xs={12} md={6} lg={4} key={review.id || idx} sx={{ width: '100%' }}>
            <Card sx={{ height: '100%', p: 3.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Rating value={review.rating} size="small" readOnly sx={{ color: 'secondary.main' }} />
                  <ThumbUpIcon sx={{ color: 'secondary.light', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic', mb: 3.5, lineHeight: 1.6 }}>
                  "{review.text}"
                </Typography>
              </CardContent>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {review.name || review.authorName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.role || t.citizen}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
