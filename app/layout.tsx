import { inter } from "./ui/fonts";
import "./ui/global.css";

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" className={`${inter.className} antialiased`}>
         <body>
            {/* Esto es parte del layout completo */}
            {children}

            <footer className="py-10 flex justify-center items-center">Hecho con amor por la gente de vercel.</footer>
         </body>
      </html>
   );
}
