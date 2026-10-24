import type { Metadata } from "next";
import { Space_Grotesk, Inter, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ayush Das — B.Tech CSE (AI/ML) Student & Developer",
  description:
    "Portfolio of Ayush Das — B.Tech Computer Science and Engineering (AI/ML) student at SRMIST, student developer, and technology enthusiast exploring AI/ML, computer vision, and software engineering.",
  keywords: [
    "Ayush Das",
    "Ayush Das SRMIST",
    "B.Tech CSE AI ML",
    "Student Developer",
    "AI ML Portfolio",
    "Computer Vision",
    "Agro Twin",
    "Lunar Align",
  ],
  authors: [{ name: "Ayush Das" }],
  openGraph: {
    title: "Ayush Das — B.Tech CSE (AI/ML) Student & Developer",
    description:
      "Student developer and technology enthusiast exploring AI/ML, computer vision, and software development at SRMIST.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Das — B.Tech CSE (AI/ML) Student & Developer",
    description:
      "Student developer and technology enthusiast exploring AI/ML, computer vision, and software development at SRMIST.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${poppins.variable} ${josefinSans.variable} antialiased`}
    >
      <body className="min-h-screen bg-void text-cloud overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
