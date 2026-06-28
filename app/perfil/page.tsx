"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function PerfilRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/perfil/dados"); // rediriciona para meus dados inicialmente
  }, [router]);

  return null;
}