import type { Dict } from "./types";

export const bn: Dict = {
  brand: { tagline: "আপনার আকাশ, এই মুহূর্তে" },
  switcher: { en: "EN", bn: "বাংলা", aria: "ভাষা" },
  sections: {
    zoomOut: "পিছিয়ে দেখুন — পুরো আকাশ, দুই সৎ দৃষ্টিকোণ",
    todayDetail: "আজকের বিস্তারিত",
    moonPhases: "আসন্ন চাঁদের দশা",
  },
  dial: {
    centreHint: "আপনি কেন্দ্রে। কোণ = আপনার আকাশে দিক; বলয় = ক্রান্তিবৃত্ত বরাবর দূরত্ব।",
    helioUnavailable: "সূর্যকেন্দ্রিক তথ্য পাওয়া যায়নি",
    plotting: "অবস্থান আঁকা হচ্ছে…",
    ecliptic: "ক্রান্তিবৃত্ত",
    you: "আপনি",
    sun: "সূর্য",
  },
  status: { readingSky: "আপনার আকাশ পড়া হচ্ছে…", retrying: "আবার চেষ্টা হচ্ছে…" },
  errors: {
    moonPhases: "চাঁদের দশা পাওয়া যায়নি",
    calendar: "ক্যালেন্ডার পাওয়া যায়নি",
    sunPosition: "সূর্যের সরাসরি অবস্থান পাওয়া যায়নি",
  },
  footer: {
    dataNote: "তথ্য: Horizon + Orrery API · অবস্থান সরাসরি",
    local: "স্থানীয়",
    computedAt: "গণনা",
  },
  hero: { kicker: "আপনার আকাশ", sunriseE: "সূর্যোদয়", horizon: "দিগন্ত", sunsetW: "সূর্যাস্ত", ariaLabel: "আপনার আকাশ, এই মুহূর্তে" },
  compass: [
    "উত্তর", "উত্তর-উত্তরপূর্ব", "উত্তরপূর্ব", "পূর্ব-উত্তরপূর্ব",
    "পূর্ব", "পূর্ব-দক্ষিণপূর্ব", "দক্ষিণপূর্ব", "দক্ষিণ-দক্ষিণপূর্ব",
    "দক্ষিণ", "দক্ষিণ-দক্ষিণপশ্চিম", "দক্ষিণপশ্চিম", "পশ্চিম-দক্ষিণপশ্চিম",
    "পশ্চিম", "পশ্চিম-উত্তরপশ্চিম", "উত্তরপশ্চিম", "উত্তর-উত্তরপশ্চিম",
  ],
  compassAbbr: [
    "উ", "উউপূ", "উপূ", "পূউপূ", "পূ", "পূদপূ", "দপূ", "দদপূ",
    "দ", "দদপ", "দপ", "পদপ", "প", "পউপ", "উপ", "উউপ",
  ],
  rose: { n: "উ", e: "পূ", s: "দ", w: "প", zenith: "শীর্ষবিন্দু" },
  compassPill: {
    nowTracking: "এখন অনুসরণ", nextUp: "পরবর্তী:", theSun: "সূর্য", theMoon: "চাঁদ",
    theSky: "আকাশ", resting: "বিশ্রামে — দিগন্তের উপরে কিছু নেই", ariaPrefix: "আকাশ কম্পাস",
    lit: "আলোকিত", rises: "উঠবে", upDeg: "উপরে", below: "নিচে",
  },
  stat: { sunset: "সূর্যাস্ত", goldenHour: "সোনালি সময়", dayLength: "দিনের দৈর্ঘ্য", moonrise: "চাঁদোদয়", moon: "চাঁদ", up: "উপরে" },
  legend: {
    title: "এই মুহূর্তে আপনার আকাশে যা আছে", up: "উপরে", below: "নিচে",
    brand: "প্যারালাক্স", def: "= দৃষ্টিকোণ বদলালে যে সরণ ঘটে।", fromEarth: "পৃথিবী থেকে",
    rest: "দেখায় জিনিসগুলো আপনার আকাশে কোথায়; উপর থেকে দৃশ্য পুরো সৌরজগতের দিকে তাকায়। এরা মেলে না — আর সেটাই মূল কথা।",
  },
  cards: {
    sun: "সূর্য", twilight: "গোধূলি", moon: "চাঁদ",
    sunrise: "সূর্যোদয়", solarNoon: "সৌর মধ্যাহ্ন", sunset: "সূর্যাস্ত", goldenHour: "সোনালি সময়", dayLength: "দিনের দৈর্ঘ্য",
    civil: "বেসামরিক", nautical: "নৌ", astronomical: "জ্যোতির্বৈজ্ঞানিক", firstLight: "প্রথম আলো", lastLight: "শেষ আলো",
    distance: "দূরত্ব", position: "অবস্থান", upAlt: "উপরে · উচ্চতা", belowAz: "নিচে · দিগংশ", km: "কিমি",
  },
  moonGlyph: { lit: "আলোকিত", upAllDay: "সারাদিন উপরে", downAllDay: "সারাদিন নিচে", rise: "উদয়", set: "অস্ত", az: "দিগংশ", alt: "উচ্চতা" },
  bodyDetail: {
    eclipticLongitude: "ক্রান্তি দ্রাঘিমা", distance: "দূরত্ব", constellation: "নক্ষত্রমণ্ডল", magnitude: "উজ্জ্বলতা",
    phase: "দশা", altitude: "উচ্চতা", azimuth: "দিগংশ", close: "বন্ধ ✕",
  },
  moonPhasesLabels: { today: "আজ", inOneDay: "১ দিন পর", inDays: "{n} দিন পর" },
  calendar: { monthly: "মাসিক ক্যালেন্ডার", legendHint: "সূর্যোদয় ↑ · সূর্যাস্ত ↓ · চাঁদ", show: "দেখান", hide: "লুকান" },
  location: { change: "অবস্থান বদলান", search: "শহর খুঁজুন…", useMine: "আমার অবস্থান ব্যবহার করুন" },
  frame: {
    fromEarth: "পৃথিবী থেকে", fromAbove: "উপর থেকে",
    caption: "দুই সৎ দৃষ্টিকোণ — এরা মেলে না, আর সেটাই সঠিক পদার্থবিজ্ঞান।",
  },
  units: { hourLong: "ঘন্টা", minuteLong: "মিনিট" },
  bodies: {
    sun: "সূর্য", mercury: "বুধ", venus: "শুক্র", earth: "পৃথিবী", moon: "চাঁদ", mars: "মঙ্গল",
    jupiter: "বৃহস্পতি", saturn: "শনি", uranus: "ইউরেনাস", neptune: "নেপচুন", pluto: "প্লুটো",
  },
  moonPhases: {
    "New Moon": "অমাবস্যা", "Waxing Crescent": "বর্ধমান কাস্তে-চাঁদ", "First Quarter": "প্রথম চতুর্থাংশ",
    "Waxing Gibbous": "বর্ধমান গিব্বাস", "Full Moon": "পূর্ণিমা", "Waning Gibbous": "ক্ষয়িষ্ণু গিব্বাস",
    "Last Quarter": "শেষ চতুর্থাংশ", "Waning Crescent": "ক্ষয়িষ্ণু কাস্তে-চাঁদ",
  },
  weekdays: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"],
  months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
};
