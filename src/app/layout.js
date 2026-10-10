import "./globals.css";

export const metadata = {
  title: "ICONIC CLOTHS | Premium Streetwear Redefined",
  description: "More than just a T-Shirt. Premium streetwear for those who create their own path.",
  keywords: ["streetwear", "oversized tees", "graphic tees", "iconic cloths", "fashion", "luxury clothing"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#08080a] text-white antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
