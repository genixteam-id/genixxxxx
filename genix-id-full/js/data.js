const ASSETS = "assets";
const WHATSAPP = "905527223847";

const HERO_WORDS = [
  "الذكاء الاصطناعي",
  "التصميم الجريء",
  "الإنتاج المرئي",
  "تجربة الويب",
  "الهوية البصرية"
];

const BRAND = {
  logo: `${ASSETS}/brand/logo.jpg`,
  heroPoster: `${ASSETS}/images/hero-banner.jpeg`,
  heroVideo: `${ASSETS}/videos/showreel-1.mp4`,
  visionImage: `${ASSETS}/images/ceo-character.png`
};

const SHOWREEL_VIDEOS = [
  { src: `${ASSETS}/videos/hero.mp4`, title: "عرض Genix ID الرئيسي" },
  { src: `${ASSETS}/videos/showreel-1.mp4`, title: "إنتاج مرئي ١" },
  { src: `${ASSETS}/videos/showreel-2.mp4`, title: "إنتاج مرئي ٢" },
  { src: `${ASSETS}/videos/showreel-3.mp4`, title: "إنتاج مرئي ٣" },
  { src: `${ASSETS}/videos/showreel-4.mp4`, title: "إنتاج مرئي ٤" },
  { src: `${ASSETS}/videos/showreel-5.mp4`, title: "إنتاج مرئي ٥" }
];

const SOLUTIONS = [
  {
    id: "web",
    title: "تطوير المنصات والمواقع",
    desc: "أنظمة ويب متكاملة، سريعة، وقابلة للتوسع تناسب احتياجات الشركات والمؤسسات.",
    image: `${ASSETS}/images/service-web.jpg`,
    waText: "أرغب في حجز خدمة تطوير المنصات والمواقع"
  },
  {
    id: "branding",
    title: "الهوية البصرية",
    desc: "تصميم هويات بصرية حديثة ومرتكزة على البيانات لتعزيز حضور علامتك التجارية.",
    image: `${ASSETS}/images/service-branding.jpg`,
    waText: "أرغب في حجز خدمة الهوية البصرية"
  },
  {
    id: "ai",
    title: "حلول الذكاء الاصطناعي",
    desc: "دمج نماذج الذكاء الاصطناعي التوليدي في عملياتك لزيادة الإنتاجية وتقليل التكاليف.",
    image: `${ASSETS}/images/service-ai.jpg`,
    waText: "أرغب في حجز خدمة حلول الذكاء الاصطناعي"
  },
  {
    id: "mobile",
    title: "تطبيقات الجوال المتقدمة",
    desc: "تطبيقات iOS و Android بأداء فائق وتجربة مستخدم لا تُضاهى.",
    image: `${ASSETS}/images/service-mobile.jpg`,
    waText: "أرغب في حجز خدمة تطوير تطبيقات الجوال"
  },
  {
    id: "bigdata",
    title: "تحليل البيانات الضخمة",
    desc: "تحويل البيانات الخام إلى رؤى استراتيجية ومؤشرات قابلة للتنفيذ.",
    image: `${ASSETS}/images/service-data.jpg`,
    waText: "أرغب في حجز خدمة تحليل البيانات الضخمة"
  },
  {
    id: "social",
    title: "إدارة حسابات التواصل الذكية",
    desc: "إدارة محتوى حساباتك التسويقية بخوارزميات الذكاء الاصطناعي لأقصى تفاعل.",
    image: `${ASSETS}/images/service-social.jpg`,
    waText: "أرغب في حجز خدمة إدارة المحتوى بالذكاء الاصطناعي"
  }
];

const PORTFOLIO = [
  {
    id: "premium",
    label: "باقات احترافية",
    cover: `${ASSETS}/images/portfolio-11.png`,
    images: [11, 12, 13, 14, 15, 16, 17, 18].map((n) => `${ASSETS}/images/portfolio-${n}.png`)
  },
  {
    id: "media",
    label: "إنتاج مرئي",
    cover: `${ASSETS}/images/services-promo.png`,
    videos: SHOWREEL_VIDEOS,
    images: [`${ASSETS}/images/services-promo.png`, `${ASSETS}/images/hero-banner.jpeg`]
  },
  {
    id: "branding",
    label: "هوية وويب",
    cover: `${ASSETS}/images/gallery-1.png`,
    images: [1, 2, 3, 4, 5, 6].map((n) => `${ASSETS}/images/gallery-${n}.png`)
  },
  {
    id: "general",
    label: "خدمات عامة",
    cover: `${ASSETS}/images/gallery-7.png`,
    images: [7, 8, 9, 10, 11, 12].map((n) => `${ASSETS}/images/gallery-${n}.png`)
  }
];

function waLink(text) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}