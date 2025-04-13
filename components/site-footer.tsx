import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  Shop: [
    { name: "All Products", href: "/products" },
    { name: "Featured", href: "/featured" },
    { name: "New Arrivals", href: "/new" },
    { name: "Best Sellers", href: "/best-sellers" },
  ],
  "Customer Service": [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "FAQs", href: "/faqs" },
  ],
  About: [
    { name: "Our Story", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Press", href: "/press" },
    { name: "Careers", href: "/careers" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
]

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              <img src="footerLogo.png" alt="gossipgoods"/>
            </Link>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for premium products and exceptional shopping experience.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="text-gray-400 hover:text-white transition-colors">
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
