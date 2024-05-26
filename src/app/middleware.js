import { NextResponse } from 'next/server';
import supabase from '@/utils/supabase/client';

export async function middleware(req) {
    const token = req.cookies['supabase-auth-token'];

    // Verificar si el token existe
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Obtener usuario desde el token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*'], // Proteger todas las rutas bajo /dashboard y /account
};
