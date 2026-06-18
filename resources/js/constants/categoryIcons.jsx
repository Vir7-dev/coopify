import React from "react";
import {
  FaBox, FaUtensils, FaCoffee, FaPills, FaPencilAlt,
  FaTshirt, FaAppleAlt, FaHamburger, FaBreadSlice, FaCookie,
  FaIceCream, FaLeaf, FaCarrot, FaFish, FaDrumstickBite,
  FaWineGlass, FaGlassWhiskey, FaMugHot, FaCapsules, FaSyringe,
  FaHeartbeat, FaFirstAid, FaBandAid, FaGlasses, FaPen,
  FaRuler, FaBook, FaBookOpen, FaClipboard, FaStar,
  FaShoppingBag, FaTag, FaGift, FaStore,
} from "react-icons/fa";

export const ICON_LIST = [
  { name: "FaUtensils", comp: FaUtensils, label: "Alat Makan" },
  { name: "FaHamburger", comp: FaHamburger, label: "Burger" },
  { name: "FaDrumstickBite", comp: FaDrumstickBite, label: "Ayam" },
  { name: "FaBreadSlice", comp: FaBreadSlice, label: "Roti" },
  { name: "FaCookie", comp: FaCookie, label: "Snack" },
  { name: "FaIceCream", comp: FaIceCream, label: "Dessert" },
  { name: "FaAppleAlt", comp: FaAppleAlt, label: "Buah" },
  { name: "FaCarrot", comp: FaCarrot, label: "Sayur" },
  { name: "FaLeaf", comp: FaLeaf, label: "Organik" },
  { name: "FaFish", comp: FaFish, label: "Seafood" },
  { name: "FaCoffee", comp: FaCoffee, label: "Kopi" },
  { name: "FaMugHot", comp: FaMugHot, label: "Teh" },
  { name: "FaGlassWhiskey", comp: FaGlassWhiskey, label: "Minuman" },
  { name: "FaWineGlass", comp: FaWineGlass, label: "Jus" },
  { name: "FaPills", comp: FaPills, label: "Obat" },
  { name: "FaCapsules", comp: FaCapsules, label: "Suplemen" },
  { name: "FaSyringe", comp: FaSyringe, label: "Medis" },
  { name: "FaHeartbeat", comp: FaHeartbeat, label: "Kesehatan" },
  { name: "FaFirstAid", comp: FaFirstAid, label: "P3K" },
  { name: "FaBandAid", comp: FaBandAid, label: "Perawatan" },
  { name: "FaPencilAlt", comp: FaPencilAlt, label: "Pensil" },
  { name: "FaPen", comp: FaPen, label: "Pena" },
  { name: "FaRuler", comp: FaRuler, label: "Penggaris" },
  { name: "FaBook", comp: FaBook, label: "Buku" },
  { name: "FaBookOpen", comp: FaBookOpen, label: "Buku Buka" },
  { name: "FaClipboard", comp: FaClipboard, label: "Clipboard" },
  { name: "FaGlasses", comp: FaGlasses, label: "Kacamata" },
  { name: "FaTshirt", comp: FaTshirt, label: "Almamater" },
  { name: "FaTag", comp: FaTag, label: "Label" },
  { name: "FaGift", comp: FaGift, label: "Hadiah" },
  { name: "FaShoppingBag", comp: FaShoppingBag, label: "Belanja" },
  { name: "FaStore", comp: FaStore, label: "Toko" },
  { name: "FaStar", comp: FaStar, label: "Bintang" },
  { name: "FaBox", comp: FaBox, label: "Kotak" },
];

export function suggestIcon(nama) {
  const n = nama.toLowerCase();

  if (n.includes("makan") || n.includes("nasi") || n.includes("lauk")) return "FaUtensils";
  if (n.includes("minum") || n.includes("drink") || n.includes("air")) return "FaGlassWhiskey";
  if (n.includes("kopi")) return "FaCoffee";
  if (n.includes("teh")) return "FaMugHot";
  if (n.includes("jus")) return "FaWineGlass";
  if (n.includes("snack") || n.includes("cemilan")) return "FaCookie";
  if (n.includes("obat")) return "FaPills";
  if (n.includes("kesehatan")) return "FaHeartbeat";
  if (n.includes("buku")) return "FaBook";
  if (n.includes("buah")) return "FaAppleAlt";
  if (n.includes("sayur")) return "FaCarrot";
  return "FaBox";
}

export function DynIcon({ name, size = 14, className = "" }) {
  if (!name || typeof name !== "string") return <FaBox size={size} className={className} />;
  const found = ICON_LIST.find((i) => i.name === name);
  if (!found) return <FaBox size={size} className={className} />;
  const Comp = found.comp;
  return <Comp size={size} className={className} />;
}