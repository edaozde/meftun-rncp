import { Typography, Container, Box, Paper } from "@mui/material";

export default function LegalPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mentions Légales
        </Typography>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            1. Informations légales
          </Typography>
          <Typography paragraph>
            Ce site est édité par [Nom de votre entreprise], [forme juridique]
            au capital de [montant] euros, immatriculée au Registre du Commerce
            et des Sociétés de [ville] sous le numéro [numéro RCS].
          </Typography>
          <Typography paragraph>
            Siège social : [adresse complète]
            <br />
            Numéro de téléphone : [numéro]
            <br />
            Email : [email]
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            2. Directeur de la publication
          </Typography>
          <Typography paragraph>
            [Nom et prénom du directeur de la publication]
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            3. Hébergement
          </Typography>
          <Typography paragraph>
            Ce site est hébergé par [nom de l'hébergeur],
            <br />
            [adresse de l'hébergeur],
            <br />
            [téléphone de l'hébergeur]
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            4. Propriété intellectuelle
          </Typography>
          <Typography paragraph>
            L'ensemble de ce site relève de la législation française et
            internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les
            documents téléchargeables et les représentations iconographiques et
            photographiques.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            5. Protection des données personnelles
          </Typography>
          <Typography paragraph>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d'un droit d'accès, de rectification, de
            suppression et d'opposition aux données personnelles vous
            concernant. Pour exercer ces droits, vous pouvez nous contacter à
            l'adresse email suivante : [email de contact RGPD].
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            6. Cookies
          </Typography>
          <Typography paragraph>
            Ce site utilise des cookies pour améliorer l'expérience utilisateur.
            En continuant à naviguer sur ce site, vous acceptez leur
            utilisation. Pour plus d'informations sur l'utilisation des cookies,
            veuillez consulter notre politique de confidentialité.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            7. Loi applicable
          </Typography>
          <Typography paragraph>
            Les présentes mentions légales sont soumises au droit français. En
            cas de litige, les tribunaux français seront seuls compétents.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
