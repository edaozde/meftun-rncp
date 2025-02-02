"use client";

import { Button, Link, Stack, TextField, FormControlLabel, Checkbox } from "@mui/material";
import NextLink from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react";
import createUser from "./create-user";

export default function Signup() {
  const [state, formAction] = useFormState(createUser, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <form action={formAction} className="w-full max-w-xs">
      <Stack spacing={2}>
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          type="email"
          helperText={state.error}
          error={!!state.error}
        />
        <TextField
          name="password"
          label="Mot de passe"
          variant="outlined"
          type="password"
          helperText={state.error}
          error={!!state.error}
        />
        <FormControlLabel
          control={<Checkbox checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />} 
          label="J'accepte la politique de confidentialité"
        />
        <Button type="submit" variant="contained" disabled={!acceptedPrivacy}>
          S&apos;inscrire
        </Button>
        <Link component={NextLink} href="/auth/login" className="self-center">
          Se connecter
        </Link>
      </Stack>
    </form>
  );
}