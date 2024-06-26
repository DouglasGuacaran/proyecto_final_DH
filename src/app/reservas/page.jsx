"use client";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

const Page = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const fetchUsuarioId = async () => {
      const supabase = createClient();
      const { data: authUser, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching authenticated user:", userError);
        return;
      }
      if (authUser && authUser.user && authUser.user.id) {
        const { data, error } = await supabase
          .from("Usuario")
          .select("id, Nombre, Telefono")
          .eq("uid", authUser.user.id)
          .single();
        if (error) {
          console.error("Error fetching usuario ID:", error);
        } else {
          setUsuarioId(data.id);
        }
      } else {
        console.error("User data is not in expected format:", authUser);
      }
    };

    fetchUsuarioId();
  }, []);

  useEffect(() => {
    if (!usuarioId) return;

    const fetchReservas = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("Reserva")
        .select("*")
        .eq("Usuario_id", usuarioId);
      if (error) {
        console.error("Error fetching reservas:", error);
      } else {
        const canchaPromises = data.map(async (reserva) => {
          const { data: canchaData, error: canchaError } = await supabase
            .from("Cancha")
            .select("Nombre, Localidad, Direccion")
            .eq("id", reserva.Cancha_id)
            .single();
          if (canchaError) {
            console.error("Error fetching cancha data:", canchaError);
            return { ...reserva, cancha: null };
          }
          return { ...reserva, cancha: canchaData };
        });

        const reservasConCancha = await Promise.all(canchaPromises);
        setReservas(reservasConCancha);
      }
    };

    fetchReservas();
  }, [usuarioId]);

  return (
    <>
      <Navbar />
      <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6 mt-14">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mis Reservas</h1>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-foreground"
            prefetch={false}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver atrás
          </Link>
        </div>
        <div className="grid gap-4">
          {reservas.map((reserva) => (
            <Card key={reserva.id}>
              <CardContent className="grid grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <h3 className="font-semibold">
                    {reserva.cancha?.Nombre ||
                      "Nombre de la cancha no disponible"}
                  </h3>
                  <p className="text-muted-foreground">
                    {reserva.cancha?.Direccion || "Dirección no disponible"}
                  </p>
                  <p className="text-muted-foreground">
                    {reserva.cancha?.Localidad || "Localidad no disponible"}
                  </p>
                  <p className="text-muted-foreground">
                    {new Date(reserva.Fecha_hora_inicio).toLocaleString(
                      "es-ES",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <Link
                  href="#"
                  className="text-primary hover:text-primary-foreground"
                  prefetch={false}
                >
                  Ver Detalles
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
