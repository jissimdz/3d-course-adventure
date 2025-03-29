
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 py-20">
        <div className="text-center">
          <div className="text-9xl font-bold text-brand-blue">404</div>
          <h1 className="mt-4 text-3xl font-semibold text-gray-800">Page Non Trouvée</h1>
          <p className="mt-2 text-xl text-gray-600">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild className="mt-8 bg-brand-blue hover:bg-brand-blue/90">
            <Link to="/">Retour à l'Accueil</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
