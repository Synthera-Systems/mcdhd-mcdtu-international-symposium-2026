"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function VenuePage() {
    const mapLink = "https://maps.app.goo.gl/oPrpjk8Gwcw1LveE6";
    const attractions = [
      {
        title: "Kaziranga National Park",
        subtitle: "A UNESCO World Heritage Site",
        description: "Just a scenic journey from the campus, Kaziranga offers an unparalleled glimpse into the wild. Famous for harboring two-thirds of the world's great one-horned rhinoceroses, its sprawling marshlands and tall elephant grass provide thrilling safari experiences.",
        image: "/images/kaziranga.png",
        orientation: "left",
        number: "01"
      },
      {
        title: "Agnigarh",
        subtitle: "The Fortress of Fire",
        description: "Overlooking the majestic Brahmaputra river, this ancient hillock is steeped in Hindu mythology. Legend says it was built to isolate Princess Usha, offering today's visitors panoramic views of the city and a walk through ancient romance.",
        image: "/images/agnigarh.png",
        orientation: "right",
        number: "02"
      },
      {
        title: "Nameri National Park",
        subtitle: "The Foothill Haven",
        description: "Nestled in the lush foothills of the Eastern Himalayas along the Jia Bhoroli river. A pristine haven for wildlife and bird watchers, offering scenic guided jungle treks and thrilling river rafting just a short drive away.",
        image: "/images/nameri.png",
        orientation: "left",
        number: "03"
      },
      {
        title: "Mahabhairab Temple",
        subtitle: "Ancient Spiritual Retreat",
        description: "An ancient Shiva temple situated atop a small hillock in the heart of the city. Originally established by the mythical King Bana, it offers a serene spiritual retreat with magnificent traditional architecture and deep mythological roots.",
        image: "/images/mahabhairab.png",
        orientation: "right",
        number: "04"
      },
      {
        title: "Chitralekha Udyan",
        subtitle: "Historic Sculptural Ruins",
        description: "A beautifully landscaped park featuring a mesmerizing horseshoe-shaped lake and ancient sculptural ruins dating back to the 9th century. A perfect evening stroll to soak in the historical ambiance of Assam.",
        image: "/images/colepark.png",
        orientation: "left",
        number: "05"
      },
      {
        title: "Panimur Falls",
        subtitle: "The Niagara of Assam",
        description: "Where the Kopili River cascades over dramatic rock formations, creating a breathtaking white-water spectacle. A pristine natural getaway renowned for its picturesque scenery, roaring rapids, and serene riverbanks.",
        image: "/images/panimur.png",
        orientation: "right",
        number: "06"
      },
      {
        title: "Majuli Island",
        subtitle: "World's Largest River Island",
        description: "Nurtured by the Brahmaputra, Majuli is the heartland of Neo-Vaishnavite culture. Home to centuries-old Satras, traditional mask-making artisans, and vibrant tribal villages, it offers an idyllic glimpse into Assam's soul.",
        image: "/images/majuli.png",
        orientation: "left",
        number: "07"
      },
      {
        title: "Historic Sivasagar",
        subtitle: "The Royal Ahom Heritage",
        description: "Step into the grand legacy of the Ahom Kingdom. Highlights include the iconic Rang Ghar—Asia's oldest surviving amphitheater—the multi-tiered Kareng Ghar palace, and the massive man-made Sivasagar Tank.",
        image: "/images/sivasagar.png",
        orientation: "right",
        number: "08"
      }
    ];

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface pb-20">
      
      {/* Header */}
      <section className="relative w-full pt-12 pb-12 sm:pt-20 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
        <motion.div 
          className="max-w-350 mx-auto relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Text Content Side */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="max-w-2xl">
              <motion.p variants={fadeUp} className="text-secondary font-inter font-bold tracking-[0.15em] text-xs uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-secondary"></span>
                The Venue
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-playfair font-black text-primary leading-tight tracking-tight mb-6">
                Council Hall, <br /> <span className="text-secondary">Tezpur University.</span>
              </motion.h1>
              
              <motion.div variants={fadeUp} className="max-w-md pb-2">
                <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed border-l-2 border-primary/20 pl-4 mb-8">
                  Discover the cultural capital of Assam. The symposium will be hosted in the prestigious Council Hall, situated amidst the lush, serene, and historically vibrant campus of Tezpur University.
                </p>
                
                {/* Premium Address Card */}
                <div className="relative overflow-hidden flex items-center gap-5 p-6 bg-gradient-to-br from-white to-surface-dim/10 rounded-2xl border border-surface-dim/40 shadow-[0_8px_30px_rgba(0,33,71,0.04)] hover:shadow-[0_8px_30px_rgba(0,33,71,0.08)] transition-all duration-300 group">
                {/* Decorative subtle background shape */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                
                {/* Elevated Icon Container */}
                <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-surface-dim/20 flex items-center justify-center text-secondary shrink-0 transition-colors group-hover:text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                
                <div>
                    <h4 className="font-playfair font-bold text-lg sm:text-xl text-primary mb-1">Council Hall</h4>
                    <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
                    Tezpur University Campus,<br />
                    Napaam, Tezpur, Assam 784028
                    </p>
                </div>
                </div>
              </motion.div>
            <a 
                href={mapLink}
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-24 sm:h-56 rounded-xl overflow-hidden mt-2 sm:mt-4 shadow-xl border-8 border-[#FDFBF7] opacity-80 hover:opacity-100 transition-all duration-300 relative group bg-[#1a1a1a]"
                >
                <Image 
                    src="/map_preview.png"
                    alt="Map to Tezpur University"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors flex items-start justify-start p-2 sm:p-4 ">
                    <div className="bg-black/90 border border-white/10 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-[9px] sm:text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Open in Maps
                    </div>
                </div>
            </a>
            </div>
          </div>

          {/* Image Side - Editorial Composition */}
          <motion.div variants={fadeUp} className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-180 mt-8 lg:mt-0">
            
            {/* Image 1: Main Venue (Council Hall) - Back Right */}
            <div className="absolute top-0 right-0 w-3/4 h-[60%] rounded-2xl overflow-hidden shadow-2xl z-10 group border-4 border-[#FDFBF7]">
              <Image 
                src="/images/council-hall.png" 
                alt="Tezpur University Council Hall"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center -z-10">
                 <span className="font-inter text-primary/30 uppercase tracking-widest text-[10px]">Image 1 Pending</span>
              </div>
            </div>

            {/* Image 2: Campus (Tezpur University) - Front Left Overlapping */}
            <div className="absolute bottom-0 left-0 w-2/3 h-[55%] rounded-2xl overflow-hidden shadow-xl z-20 group border-8 border-[#FDFBF7]">
              <Image 
                src="/images/tezpur-university.png" 
                alt="Tezpur University Campus"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center -z-10">
                 <span className="font-inter text-primary/40 uppercase tracking-widest text-[10px]">Image 2 Pending</span>
              </div>
              {/* Subtle Label for the front image */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <span className="font-inter text-[10px] font-bold tracking-widest uppercase text-primary">Tezpur Univ. Campus</span>
              </div>
            </div>
            
            {/* Decorative Ambient Blurs */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-secondary/15 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>

        </motion.div>
      </section>

      {/* How to Reach - Light, Readable Variant */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-surface-dim/10 border-y border-surface-dim/20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
        >
          {/* Left Column - Sticky Header */}
          <motion.div variants={fadeRight} className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">How to Reach</h2>
            <div className="w-16 h-1 bg-secondary mb-5"></div>
            <p className="font-inter text-xs text-on-surface-variant tracking-widest uppercase leading-relaxed mb-4">
              Comprehensive Travel Logistics
            </p>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed hidden lg:block border-l-2 border-primary/20 pl-4">
              Situated in the historic city of Tezpur, the university campus is easily accessible via major transport hubs across Northeast India.
            </p>
          </motion.div>
          
          {/* Right Column - Detailed Breakdown */}
          <motion.div variants={fadeUp} className="lg:w-2/3 flex flex-col gap-8 sm:gap-10">
            
            {/* By Air */}
            <div className="flex gap-4 sm:gap-6 group bg-white p-6 sm:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,33,71,0.06)]">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-xl sm:text-2xl text-primary mb-3">By Air</h3>
                <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  <strong className="text-primary">Lokpriya Gopinath Bordoloi International Airport (Guwahati)</strong> is the primary gateway, located approximately <span className="text-secondary font-medium">175 km</span> away. It offers excellent connectivity to all major Indian cities. Alternatively, <strong className="text-primary">Itanagar Airport (Hollongi)</strong> is <span className="text-secondary font-medium">130 km</span> away.
                </p>
              </div>
            </div>

            {/* By Train */}
            <div className="flex gap-4 sm:gap-6 group bg-white p-6 sm:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,33,71,0.06)]">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-xl sm:text-2xl text-primary mb-3">By Train</h3>
                <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  The nearest major railhead is <strong className="text-primary">Guwahati Railway Station</strong>. From there, you can take a connecting local passenger train directly to <strong className="text-primary">Dekargaon Railway Station</strong> (located just outside Tezpur), or simply opt for road transport for the final leg.
                </p>
              </div>
            </div>

            {/* By Road */}
            <div className="flex gap-4 sm:gap-6 group bg-white p-6 sm:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,33,71,0.06)]">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-xl sm:text-2xl text-primary mb-3">By Road</h3>
                <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Tezpur is beautifully connected via National Highway 15. Frequent <strong className="text-primary">ASTC buses</strong> and private Volvos operate daily from Guwahati ISBT. Private taxis are also readily available for a scenic, comfortable 4-hour drive directly to the university gates.
                </p>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </section>

      {/* Attractions */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="mb-16 text-center md:text-left">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-3">Explore the Environs</h2>
            <p className="font-inter text-sm sm:text-base text-on-surface-variant max-w-xl">
              Extend your stay and immerse yourself in the rich heritage and diverse wildlife surrounding the region.
            </p>
          </div>

          <div className="space-y-20 sm:space-y-28">
            {attractions.map((place, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className={`flex flex-col ${place.orientation === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center group`}
              >
                
                {/* Image Block */}
                <motion.div variants={fadeUp} className="w-full md:w-1/2 relative">
                  <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] w-full overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={place.image}
                      alt={place.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    {/* Fallback Overlay */}
                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center -z-10">
                      <span className="font-inter text-primary/30 uppercase tracking-widest text-xs">Image Pending</span>
                    </div>
                  </div>
                  {/* Decorative Number Overlay - Fixed Visibility */}
                <div className={`absolute -top-6 sm:-top-10 ${place.orientation === 'left' ? '-left-4 sm:-left-8' : '-right-4 sm:-right-8'} z-10 pointer-events-none flex items-center justify-center`}>
                {/* Soft ambient glow to separate the number from busy/light images */}
                <div className="absolute w-full h-full bg-white/70 blur-2xl rounded-full -z-10 scale-150"></div>
                
                {/* Number with heavier drop shadow and subtle stroke for definition */}
                <span className="relative font-playfair text-6xl sm:text-8xl lg:text-[120px] font-black text-white leading-none select-none drop-shadow-[0_4px_12px_rgba(0,33,71,0.15)] [-webkit-text-stroke:1px_rgba(0,33,71,0.1)]">
                    {place.number}
                </span>
                </div>
                </motion.div>

                {/* Text Block */}
                <motion.div variants={fadeUp} className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className={`flex flex-col ${place.orientation === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                    <span className="font-inter text-secondary font-semibold tracking-wider text-xs uppercase mb-3">
                      {place.subtitle}
                    </span>
                    <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4 leading-tight">
                      {place.title}
                    </h3>
                    <div className={`w-10 h-px bg-primary/20 mb-5 ${place.orientation === 'right' ? 'md:ml-auto' : ''}`}></div>
                    <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
                      {place.description}
                    </p>
                  </div>
                </motion.div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}