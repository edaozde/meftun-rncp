"use client";

import { Button, Link, Stack, TextField, FormControlLabel, Checkbox } from "@mui/material";
import NextLink from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react";
import login from "./login";

export default function Login() {
  const [state, formAction] = useFormState(login, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <form action={formAction} className="w-full max-w-xs">
      <Stack spacing={2}>
        <TextField
          error={!!state.error}
          helperText={state.error}
          name="email"
          label="Email"
          variant="outlined"
          type="email"
        />
        <TextField
          error={!!state.error}
          helperText={state.error}
          name="password"
          label="Mot de passe"
          variant="outlined"
          type="password"
        />
        <FormControlLabel
          control={<Checkbox checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />} 
          label="J'accepte la politique de confidentialité"
        />
        <Button type="submit" variant="contained" disabled={!acceptedPrivacy}>
          Se connecter
        </Button>
        <Link component={NextLink} href="/auth/signup" className="self-center">
          S&apos;inscrire
        </Link>
      </Stack>
    </form>
  );
}
