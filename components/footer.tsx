import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-20 bg-primary text-primary-foreground border-t border-accent/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1: Logo + Identitas Pemerintah Desa */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Klaten_Regency.svg" alt="Lambang Kabupaten Klaten" className="w-12 h-12" />
              <h3 className="font-bold text-lg text-accent">Pemerintah Desa Jambakan</h3>
            </div>
            <div className="text-sm space-y-1 opacity-95">
              <p>Jalan Utama Desa Jambakan RT.003</p>
              <p>Desa Jambakan, Kecamatan XXX, Kabupaten XXX</p>
              <p>Provinsi Jawa Tengah, 57xxx</p>
            </div>
          </div>

          {/* Kolom 2: Hubungi Kami */}
          <div>
            <h4 className="font-bold mb-4 text-accent">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:+6282100000000" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone size={16} />
                <span>0821-0000-0000</span>
              </a>
              <a href="mailto:info@desajambakan.id" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail size={16} />
                <span>info@desajambakan.id</span>
              </a>
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <MapPin size={16} />
                <span>Jambakan, Jawa Tengah</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Instagram size={20} className="cursor-pointer hover:text-accent transition-colors" />
                <Facebook size={20} className="cursor-pointer hover:text-accent transition-colors" />
              </div>
            </div>
          </div>

          {/* Kolom 3: Nomor Telepon Penting */}
          <div>
            <h4 className="font-bold mb-4 text-accent">Nomor Telepon Penting</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-accent transition-colors">Pak Kades Jambakan</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">Ambulan Desa</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4 dihapus sesuai permintaan */}
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/30 pt-8 text-center text-sm opacity-80">
          <p>&copy; {year} Powered by PT Digital Desa Indonesia</p>
        </div>
      </div>
    </footer>
  )
}
