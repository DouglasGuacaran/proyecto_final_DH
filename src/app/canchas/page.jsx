'use client'
import Navbar from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [paises, setPaises] = useState(''); // Initialize paises as an array

  useEffect(() => {
    const getData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('countries').select();
      if (error) {
        console.error('Error fetching countries:', error.message);
      } else {
        setPaises(data);
      }
    };
    getData();
  }, []);

  return (
    <>
    
      <div className="text-sm sm:text-base md:text-lg lg:text-xl">
        Estamos en cancha
      </div>
      <Button variant="destructive" className="text-xl">
        Delete
      </Button>
      {paises.length > 0 ? (
        paises.map((pais) => <span key={pais.id}>{pais.name}</span>) // Using 'id' as key
      ) : (
        <span>No countries found.</span>
      )}
    </>
  );
}
