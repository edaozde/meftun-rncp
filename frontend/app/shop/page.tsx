import Grid from "@mui/material/Grid";
import getProducts from "../products/actions/get-products";
import Product from "../products/product";
import { Container } from "@mui/material";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Container maxWidth="lg" sx={{ mt: "100px", mb: "50px" }}>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
