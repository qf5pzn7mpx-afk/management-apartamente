import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function WhyChooseUsSection() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const cardsData = [
    { id: '01', title: 'Excellent Property Maintenance', text: 'Add paragraph text. Click "Edit Text" to update the font, size and more. To change and reuse text themes, go to Site Styles.' },
    { id: '02', title: 'Premium Location', text: 'Detalii despre poziționarea strategică a complexului rezidențial premium.' },
    { id: '03', title: 'Modern Facilities', text: 'Facilități de top și administrare inteligentă oferite rezidenților noștri.' }
  ];

  useGSAP(() => {
    const cards = cardsRef.current;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
      }
    });
    cards.forEach((card, index) => {
      if (index === 0) return;
      tl.to(cards[index - 1], { opacity: 0, y: -30, duration: 0.5 }, `card-${index}`);
      tl.fromTo(card, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, `card-${index}`);
      tl.to({}, { duration: 0.5 });
    });
  }, { scope: containerRef });

  return (
    <section className="why-choose-container" ref={containerRef}>
      <div className="background-overlay">
        <img src="/piscina.jpg" alt="Residential Complex" className="bg-image" />
      </div>
      <div className="cards-wrapper">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            className="info-card"
            ref={el => cardsRef.current[index] = el}
            style={{ zIndex: index + 1, opacity: index === 0 ? 1 : 0 }}
          >
            <span className="card-number">{card.id}</span>
            <h2 className="card-title">{card.title}</h2>
            <p className="card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlatformSection() {
  const features = [
    {
      number: '01',
      title: 'Tenant Documents',
      description: 'Upload, sign and manage all your rental agreements and personal documents securely in one place.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="platform-icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Invoice Management',
      description: 'Track rent payments, utility bills and all invoices automatically. Never miss a payment deadline again.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="platform-icon">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="2" y1="9" x2="22" y2="9" />
          <line x1="8" y1="3" x2="8" y2="9" />
          <line x1="16" y1="3" x2="16" y2="9" />
          <line x1="6" y1="14" x2="10" y2="14" />
          <line x1="6" y1="18" x2="10" y2="18" />
          <line x1="14" y1="14" x2="18" y2="14" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Maintenance Requests',
      description: 'Report issues, track repair progress and communicate directly with your property manager in real time.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="platform-icon">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    }
  ];

  return (
    <section className="platform-section">
      <div className="platform-header">
        <h2 className="titlu-principal" style={{ fontSize: '38px' }}>YOUR TENANT PLATFORM</h2>
        <p className="paragraf-stil" style={{ fontSize: '16px', color: '#666', marginTop: '12px' }}>
          Everything you need, accessible from one dashboard.
        </p>
      </div>
      <div className="platform-grid">
        {features.map((f) => (
          <div className="platform-card" key={f.number}>
            <div className="platform-card-top">
              {f.icon}
              <span className="platform-number">{f.number}</span>
            </div>
            <h3 className="platform-title">{f.title}</h3>
            <p className="platform-text">{f.description}</p>
            <Link to={f.number === '01' ? '/tenant-documents' : '/login'} className="platform-cta">Access Now →</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function PropertiesSection() {
  const [lightbox, setLightbox] = React.useState(null);

  const properties = [
    { img: '/poza1.jpg', address: '456 Elm Avenue, Los Angeles, CA' },
    { img: '/poza2.jpg', address: '128 Oak Street, Miami, FL' },
    { img: '/poza3.jpg', address: '74 Maple Drive, New York, NY' },
    { img: '/poza4.jpg', address: '310 Cedar Lane, Austin, TX' },
    { img: '/poza5.jpg', address: '89 Birch Boulevard, Chicago, IL' },
    { img: '/poza6.jpg', address: '512 Willow Court, Seattle, WA' },
  ];

  return (
    <section className="properties-section">
      <h2 className="titlu-principal" style={{ fontSize: '38px' }}>OUR PROPERTIES</h2>
      <div className="properties-grid">
        {properties.map((p, i) => (
          <div className="property-img-wrapper" key={i} onClick={() => setLightbox(i)}>
            <img src={p.img} alt={p.address} className="property-img" />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <button className="lightbox-arrow left" onClick={() => setLightbox((lightbox - 1 + properties.length) % properties.length)}>‹</button>
            <img src={properties[lightbox].img} alt={properties[lightbox].address} className="lightbox-img" />
            <div className="lightbox-info">
              <p className="lightbox-address">{properties[lightbox].address}</p>
            </div>
            <button className="lightbox-arrow right" onClick={() => setLightbox((lightbox + 1) % properties.length)}>›</button>
          </div>
        </div>
      )}
    </section>
  );
}

function OfferSection() {
  return (
    <section className="offer-section">
      <div className="offer-banner">
        <h2 className="offer-title">First Month is On Us</h2>
        <p className="offer-subtitle">Unlock extra value, enjoy complimentary services and upgrades</p>
        <a href="#contact" className="offer-link">Start Your Free Trial Today</a>
      </div>
      <div className="offer-cards">
        <div className="offer-card">
          <svg className="offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="3" width="5" height="18" />
            <rect x="9" y="3" width="5" height="18" />
            <rect x="16" y="3" width="6" height="18" />
          </svg>
          <p className="offer-card-text">Risk-free trial</p>
        </div>
        <div className="offer-card">
          <svg className="offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <p className="offer-card-text">We'll find your perfect tenant</p>
        </div>
        <div className="offer-card">
          <svg className="offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
          <p className="offer-card-text">No upfront costs</p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = React.useState(0);
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [testimonials, setTestimonials] = React.useState([
    { quote: "Working with this team has been an absolute pleasure. Our property has never been better managed, and our tenants are always happy.", author: "Ramsey Amir, NY" },
    { quote: "They handled everything from tenant placement to maintenance without us lifting a finger. Truly a stress-free experience.", author: "Jessica Moore, CA" },
    { quote: "Professional, responsive, and trustworthy. I wouldn't trust anyone else with my properties.", author: "Daniel Carter, TX" },
  ]);

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) return;
    const newTestimonial = { quote: message, author: name };
    setTestimonials(prev => [...prev, newTestimonial]);
    setCurrent(testimonials.length);
    setName('');
    setMessage('');
    setShowForm(false);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header-row">
        <h2 className="titlu-principal testimonials-heading">WHAT OUR CLIENTS SAY</h2>
        <button className="testimonials-add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ Leave a Review'}
        </button>
      </div>

      {showForm && (
        <div className="testimonials-form">
          <input
            className="testimonials-input"
            placeholder="Your name and city (ex: John Smith, NY)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <textarea
            className="testimonials-textarea"
            placeholder="Share your experience..."
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="testimonials-submit-btn" onClick={handleSubmit}>
            Submit Review
          </button>
        </div>
      )}

      <div className="testimonials-card">
        <button className="testimonials-arrow left" onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}>‹</button>
        <div className="testimonials-body">
          <p className="testimonials-quote">"{testimonials[current].quote}"</p>
          <div className="testimonials-divider" />
          <p className="testimonials-author">{testimonials[current].author}</p>
        </div>
        <button className="testimonials-arrow right" onClick={() => setCurrent((current + 1) % testimonials.length)}>›</button>
      </div>
    </section>
  );
}

function ContactSection() {
  const titleRef = React.useRef(null);

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://management-apartamente-api.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Mesajul a fost trimis cu succes!");
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        alert("A apărut o eroare la trimitere. Verifică toate câmpurile.");
      }
    } catch (error) {
      console.error("Eroare de conexiune:", error);
      alert("Eroare de conexiune cu serverul.");
    }
  };

  useGSAP(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      }
    );
  }, { scope: titleRef });

  return (
    <section className="contact-section" id="contact">
      <div className="contact-left">
        <h2 className="titlu-principal contact-title" ref={titleRef}>LET'S GET STARTED</h2>
        <img src="/conectare.jpg" alt="Contact" className="contact-img" />
      </div>
      <div className="contact-form-box">
        <h3 className="contact-form-title">Don't Wait, Reach Out Now</h3>
        <form onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <div className="contact-field">
              <label className="contact-label">First name *</label>
              <input className="contact-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label">Last name *</label>
              <input className="contact-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label">Email *</label>
              <input className="contact-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label">Phone</label>
              <input className="contact-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="contact-field contact-field-full">
              <label className="contact-label">Message *</label>
              <textarea className="contact-input contact-textarea" rows={4} name="message" value={formData.message} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="contact-submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer-new">
      <div className="footer-logo-col">
        <span className="footer-logo">EIF</span>
      </div>
      <div className="footer-links-col">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
        <a href="#">Accessibility Statement</a>
      </div>
      <div className="footer-social-col">
        <a href="#">LinkedIn</a>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
      </div>
      <div className="footer-copy-col">
        <p>© 2026 by EIF.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <div className="site-wrapper">

      <header className="site-header">
        <div className="logo">
          <span className="paragraf-stil" style={{ fontWeight: 'bold' }}>EIF</span>
        </div>
        <nav className="main-menu">
          <ul>
            <li><a href="#servicii" className="paragraf-stil" style={{ fontSize: '16px', textDecoration: 'none' }}>Services</a></li>
            <li><a href="#why-choose-us" className="paragraf-stil" style={{ fontSize: '16px', textDecoration: 'none' }}>Benefits</a></li>
            <li><a href="#testimonials" className="paragraf-stil" style={{ fontSize: '16px', textDecoration: 'none' }}>Testimonials</a></li>
          </ul>
        </nav>
        <div className="header-contact">
          <a href="#contact" className="paragraf-stil" style={{ fontSize: '16px', textDecoration: 'none' }}>Contact Us</a>
        </div>
      </header>

      <main className="container-centrat">

        <div className="hero-grid-wrapper">
          <div className="hero-text-block">
            <h1 className="titlu-principal">
              PROPERTY MANAGEMENT<br />YOU CAN TRUST
            </h1>
            <p className="paragraf-stil" style={{ marginTop: '20px', marginBottom: '30px', color: '#1d1d1b' }}>
              Your property, our priority.<br />
              Get your home managed today.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: '#1d1d1b',
                  color: '#f9fafa',
                  padding: '12px 35px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Începe acum
              </motion.button>
            </Link>
          </div>
          <div className="hero-image-block">
            <img src="/cladire.jpg" alt="Management Apartamente Premium" />
          </div>
        </div>

        <section id="servicii" className="services-section">
          <h2 className="titlu-principal" style={{ fontSize: '38px', letterSpacing: '0.5px' }}>
            OUR SERVICES
          </h2>
          <div className="services-grid">
            <div className="service-card border-r border-b">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" />
                  <line x1="8" y1="2" x2="8" y2="22" />
                  <line x1="16" y1="2" x2="16" y2="22" />
                  <line x1="2" y1="8" x2="22" y2="8" />
                  <line x1="2" y1="16" x2="22" y2="16" />
                </svg>
              </div>
              <h3 className="service-title-text">Tenant Placement</h3>
            </div>
            <div className="service-card border-r border-b">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                  <line x1="2" y1="22" x2="22" y2="2" />
                </svg>
              </div>
              <h3 className="service-title-text">Rent Collection</h3>
            </div>
            <div className="service-card border-b">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <path d="M2 22h20V14h-6.6V7.3H8.6V2H2z" />
                  <line x1="8.6" y1="7.3" x2="22" y2="7.3" />
                  <line x1="15.4" y1="14" x2="15.4" y2="2" />
                </svg>
              </div>
              <h3 className="service-title-text">Property Maintenance</h3>
            </div>
            <div className="service-card border-r">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="service-title-text">Financial Reporting</h3>
            </div>
            <div className="service-card border-r">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" />
                  <line x1="2" y1="22" x2="22" y2="2" />
                </svg>
              </div>
              <h3 className="service-title-text">Legal Compliance</h3>
            </div>
            <div className="service-card">
              <div className="icon-container">
                <svg className="icon-geom" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 1 22 12v10H12a10 10 0 0 1-10-10B10 10 0 0 1 12 2z" />
                  <line x1="12" y1="12" x2="22" y2="12" />
                  <line x1="12" y1="12" x2="12" y2="22" />
                </svg>
              </div>
              <h3 className="service-title-text">Lease Renewal<br />Management</h3>
            </div>
          </div>
        </section>

        <PlatformSection />

        <div id="why-choose-us">
          <WhyChooseUsSection />
        </div>

        <PropertiesSection />
        <OfferSection />

        <div id="testimonials">
          <TestimonialsSection />
        </div>

        <ContactSection />

      </main>

      <SiteFooter />

    </div>
  );
}