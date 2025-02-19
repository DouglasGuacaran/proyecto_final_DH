/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/uKAkilKdia5
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Arimo } from 'next/font/google'
import { Rubik } from 'next/font/google'

arimo({
  subsets: ['latin'],
  display: 'swap',
})

rubik({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function page() {
  return (
    (<div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis Reservas</h1>
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-foreground"
          prefetch={false}>
          <ArrowLeftIcon className="w-5 h-5" />
          Volver atrás
        </Link>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardContent className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <h3 className="font-semibold">Cancha de Fútbol Central</h3>
              <p className="text-muted-foreground">Av. Siempre Viva 123, Springfield</p>
              <p className="text-muted-foreground">Sábado, 15 de Julio de 2023 - 16:00 a 18:00</p>
            </div>
            <Link
              href="#"
              className="text-primary hover:text-primary-foreground"
              prefetch={false}>
              Ver Detalles
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <h3 className="font-semibold">Cancha de Fútbol Sur</h3>
              <p className="text-muted-foreground">Calle Falsa 456, Springfield</p>
              <p className="text-muted-foreground">Domingo, 16 de Julio de 2023 - 10:00 a 12:00</p>
            </div>
            <Link
              href="#"
              className="text-primary hover:text-primary-foreground"
              prefetch={false}>
              Ver Detalles
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <h3 className="font-semibold">Cancha de Fútbol Norte</h3>
              <p className="text-muted-foreground">Calle Siempre Viva 789, Springfield</p>
              <p className="text-muted-foreground">Sábado, 22 de Julio de 2023 - 14:00 a 16:00</p>
            </div>
            <Link
              href="#"
              className="text-primary hover:text-primary-foreground"
              prefetch={false}>
              Ver Detalles
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>)
  );
}

function ArrowLeftIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>)
  );
}
