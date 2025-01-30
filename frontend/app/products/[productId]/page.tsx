import { Stack, Typography, Grid, Chip, Tooltip, Container } from "@mui/material";
import getProduct from "./get-product";
import Image from "next/image";
import { getProductImage } from "../product-image";
import Checkout from "@/app/checkout/checkout";

interface SingleProductProps {
  params: { productId: string };
}

export default async function SingleProduct({ params }: SingleProductProps) {
  const product = await getProduct(+params.productId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const uniqueSizes = [...new Set(product.variants?.map(v => v.size))];
  const uniqueColors = [...new Set(product.variants?.map(v => v.color))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        {/* Section Image */}
        <Grid item xs={12} md={6}>
          <div style={{ 
            position: 'relative',
            paddingTop: '100%', // Crée un carré responsive
            backgroundColor: '#f5f5f5',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {product.imageExists ? (
              <Image
                src={getProductImage(product.id)}
                fill
                style={{ objectFit: 'contain', padding: '1rem' }}
                alt={product.name}
                sizes="(max-width: 600px) 100vw, 50vw"
                priority
              />
            ) : (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#666'
              }}>
                <Typography>Image non disponible</Typography>
              </div>
            )}
          </div>
        </Grid>

        {/* Section Détails */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            {/* En-tête */}
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2
              }}
            >
              {product.name}
            </Typography>

            {/* Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: 'text.secondary'
              }}
            >
              {product.description || "Aucune description disponible"}
            </Typography>

            {/* Tailles */}
            {uniqueSizes.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Tailles disponibles
                </Typography>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uniqueSizes.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      sx={{ 
                        backgroundColor: 'primary.light', 
                        color: 'primary.contrastText',
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Couleurs */}
            {uniqueColors.length > 0 && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Couleurs disponibles
                </Typography>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uniqueColors.map((color, index) => (
                    <Tooltip key={index} title={color}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '2px solid #fff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}

            {/* Prix et Checkout */}
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  color: 'primary.main',
                  mb: 2
                }}
              >
                {formatPrice(product.price)}
              </Typography>
              <Checkout productId={product.id} />
            </div>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}