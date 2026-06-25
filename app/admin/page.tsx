"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona o fluxo automaticamente para a página de cidades
    router.replace("/admin/cidades");
  }, [router]);

  return null;
}