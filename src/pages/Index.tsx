import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles, Menu, X, User, LogOut, ShoppingBag, Settings, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryPreview from "@/components/home/CategoryPreview";
import VendorShowcase from "@/components/home/VendorShowcase";
import FAQSection from "@/components/home/FAQSection";
import SiteFooter from "@/components/home/SiteFooter";
import CitySelector from "@/components/CitySelector";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer login state
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Vendor login state
  const [vendorLoginOpen, setVendorLoginOpen] = useState(false);
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorOtp, setVendorOtp] = useState('');
  const [vendorOtpSent, setVendorOtpSent] = useState(false);
  const [vendorLoginLoading, setVendorLoginLoading] = useState(false);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('naapio_user'));
  const [isVendorLoggedInState, setIsVendorLoggedInState] = useState(!!localStorage.getItem('naapio_vendor'));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVendorMenu, setShowVendorMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const vendorMenuRef = useRef<HTMLDivElement>(null);

  const getUserData = () => {
    try {
      const raw = localStorage.getItem('naapio_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const getInitials = () => {
    const user = getUserData();
    if (user?.name && user.name !== 'Customer') return user.name.charAt(0).toUpperCase();
    if (user?.phone) return user.phone.slice(-2);
    return 'U';
  };

  const isVendorLoggedIn = () => !!localStorage.getItem('naapio_vendor');
  const getVendorInitials = () => {
    try {
      const v = JSON.parse(localStorage.getItem('naapio_vendor') || '{}');
      return v.name?.charAt(0)?.toUpperCase() || 'A';
    } catch { return 'A'; }
  };

  const handleLogout = () => {
    localStorage.removeItem('naapio_user');
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate('/');
    toast.info('Logged out successfully');
  };

  const handleVendorLogout = () => {
    localStorage.removeItem('naapio_vendor');
    setIsVendorLoggedInState(false);
    setShowVendorMenu(false);
    toast.info('Artisan logged out');
  };

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (vendorMenuRef.current && !vendorMenuRef.current.contains(e.target as Node)) {
        setShowVendorMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-open vendor login from ?vendor_login=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('vendor_login') === '1') {
      setVendorLoginOpen(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Customer Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end md:items-center justify-center">
          <div className="bg-card rounded-t-2xl md:rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 duration-300">
            <button onClick={() => { setLoginOpen(false); setLoginOtpSent(false); setLoginOtp(''); setLoginPhone(''); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-bold text-foreground mb-1">Welcome back to Naapio</h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">Enter your mobile number to find your orders</p>

            {!loginOtpSent ? (
              <div className="space-y-3">
                <Input value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="font-sans" />
                <Button variant="gold" className="w-full" disabled={loginLoading} onClick={() => {
                  if (loginPhone.trim()) {
                    setLoginLoading(true);
                    setTimeout(() => { setLoginOtpSent(true); setLoginLoading(false); }, 800);
                  }
                }}>{loginLoading ? 'Sending...' : 'Send OTP →'}</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input value={loginOtp} onChange={(e) => setLoginOtp(e.target.value)} placeholder="4-digit OTP" maxLength={4} className="font-sans" />
                <p className="text-xs text-muted-foreground font-sans">Demo mode — enter any 4 digits</p>
                <Button variant="gold" className="w-full" onClick={() => {
                  if (/^\d{4}$/.test(loginOtp)) {
                    const userData = {
                      phone: loginPhone,
                      name: 'Customer',
                      loggedInAt: new Date().toISOString(),
                    };
                    localStorage.setItem('naapio_user', JSON.stringify(userData));
                    setIsLoggedIn(true);
                    setLoginOpen(false); setLoginOtpSent(false); setLoginOtp(''); setLoginPhone('');
                    toast.success("Welcome back! 👋");
                    navigate('/dashboard');
                  } else { toast.error("Enter any 4 digits"); }
                }}>Verify →</Button>
                <button onClick={() => setLoginOtpSent(false)} className="text-xs text-muted-foreground hover:text-foreground font-sans">← Change number</button>
              </div>
            )}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-sans">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button onClick={() => { setLoginOpen(false); navigate('/start'); }} className="text-sm text-accent font-sans hover:underline w-full text-center">
              New to Naapio? Start your first order →
            </button>
          </div>
        </div>
      )}

      {/* Vendor Login Modal */}
      {vendorLoginOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end md:items-center justify-center">
          <div className="bg-card rounded-t-2xl md:rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 duration-300">
            <button onClick={() => { setVendorLoginOpen(false); setVendorOtpSent(false); setVendorOtp(''); setVendorPhone(''); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* Artisan badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-sans font-medium mb-4">
              ✂️ Artisan Portal
            </div>

            <h3 className="text-xl font-serif font-bold text-foreground mb-1">Welcome back, Artisan</h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">Enter your registered mobile to access your dashboard</p>

            {!vendorOtpSent ? (
              <div className="space-y-3">
                <Input value={vendorPhone} onChange={(e) => setVendorPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" className="font-sans" />
                <Button variant="gold" className="w-full" disabled={vendorLoginLoading} onClick={() => {
                  if (vendorPhone.trim()) {
                    setVendorLoginLoading(true);
                    setTimeout(() => { setVendorOtpSent(true); setVendorLoginLoading(false); }, 800);
                  }
                }}>{vendorLoginLoading ? 'Sending...' : 'Send OTP →'}</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input value={vendorOtp} onChange={(e) => setVendorOtp(e.target.value)} placeholder="4-digit OTP" maxLength={4} className="font-sans" />
                <p className="text-xs text-muted-foreground font-sans">Demo mode — enter any 4 digits</p>
                <Button variant="gold" className="w-full" onClick={() => {
                  if (/^\d{4}$/.test(vendorOtp)) {
                    localStorage.setItem('naapio_vendor', JSON.stringify({
                      phone: vendorPhone,
                      name: 'Artisan',
                      loggedInAt: new Date().toISOString(),
                      role: 'vendor',
                    }));
                    setIsVendorLoggedInState(true);
                    setVendorLoginOpen(false); setVendorOtpSent(false); setVendorOtp(''); setVendorPhone('');
                    toast.success("Welcome back! Your dashboard is loading 🧵");
                    navigate('/vendor');
                  } else { toast.error("Enter any 4 digits"); }
                }}>Verify →</Button>
                <button onClick={() => setVendorOtpSent(false)} className="text-xs text-muted-foreground hover:text-foreground font-sans">← Change number</button>
              </div>
            )}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-sans">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button onClick={() => { setVendorLoginOpen(false); navigate('/for-tailors'); }} className="text-sm text-accent font-sans hover:underline w-full text-center">
              New to Naapio? Apply as an artisan →
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">Naapio</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">{t('nav.howItWorks')}</a>
            <a href="/#categories" className="hover:text-foreground transition-colors">{t('nav.categories')}</a>
            <Link to="/for-tailors" className="hover:text-foreground transition-colors">{t('nav.forTailors')}</Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <CitySelector />
            <LanguageSelector />

            {/* Customer avatar/menu */}
            {isLoggedIn && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  {getInitials()}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-11 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors">
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </button>
                    <button onClick={() => { navigate('/dashboard/profile'); setShowUserMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button onClick={() => { navigate('/dashboard/settings'); setShowUserMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-destructive hover:bg-muted transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Vendor avatar/menu */}
            {isVendorLoggedInState && (
              <div className="relative" ref={vendorMenuRef}>
                <button
                  onClick={() => setShowVendorMenu(!showVendorMenu)}
                  className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  {getVendorInitials()}
                </button>
                {showVendorMenu && (
                  <div className="absolute right-0 top-11 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { navigate('/vendor'); setShowVendorMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors">
                      <Scissors className="w-4 h-4" /> My Vendor Dashboard
                    </button>
                    <button onClick={() => { navigate('/for-tailors'); setShowVendorMenu(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> Edit Profile
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button onClick={handleVendorLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-destructive hover:bg-muted transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login/CTA buttons when not logged in */}
            {!isLoggedIn && !isVendorLoggedInState && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)} className="text-sm">
                  Customer Login
                </Button>
                <button
                  onClick={() => setVendorLoginOpen(true)}
                  className="text-sm text-accent hover:text-accent/80 font-sans font-medium px-2 py-1 transition-colors"
                >
                  ✂️ Artisan Login
                </button>
                <Button variant="gold" size="sm" onClick={() => navigate("/start")} className="ml-2">
                  Start an Order
                </Button>
              </div>
            )}
            {/* Show remaining CTAs if only one role logged in */}
            {isLoggedIn && !isVendorLoggedInState && (
              <button
                onClick={() => setVendorLoginOpen(true)}
                className="text-xs text-accent hover:text-accent/80 font-sans font-medium px-2 py-1 transition-colors"
              >
                ✂️ Artisan Login
              </button>
            )}
            {!isLoggedIn && isVendorLoggedInState && (
              <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)} className="text-sm">
                Customer Login
              </Button>
            )}
          </div>
          {/* Mobile: avatar + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-xs"
              >
                {getInitials()}
              </button>
            )}
            {isVendorLoggedInState && (
              <button
                onClick={() => setShowVendorMenu(!showVendorMenu)}
                className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-sans font-bold text-xs"
              >
                {getVendorInitials()}
              </button>
            )}
            <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); document.body.style.overflow = !mobileMenuOpen ? 'hidden' : ''; }}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto flex flex-col">
            <div className="w-full mb-2"><CitySelector variant="mobile" /></div>
            <div className="w-full mb-2"><LanguageSelector variant="mobile" /></div>
            <div className="h-px bg-border my-2" />
            <a href="#how-it-works" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.howItWorks')}</a>
            <a href="/#categories" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.categories')}</a>
            <Link to="/for-tailors" className="flex items-center min-h-[48px] font-sans text-sm text-foreground py-2 border-l-2 border-transparent hover:border-accent pl-3" onClick={() => { setMobileMenuOpen(false); document.body.style.overflow = ''; }}>{t('nav.forTailors')}</Link>
            <div className="flex-1" />
            <div className="space-y-3 pt-3">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                    My Orders
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { navigate('/dashboard/profile'); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                    Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px] text-destructive">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                    Customer Login
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setVendorLoginOpen(true); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px] border-accent/40 text-accent">
                    ✂️ Artisan Login
                  </Button>
                  <Button variant="gold" size="sm" onClick={() => { navigate("/start"); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px]">
                    Start an Order →
                  </Button>
                </>
              )}
              {isVendorLoggedInState && (
                <>
                  <div className="h-px bg-border" />
                  <Button variant="ghost" size="sm" onClick={() => { navigate('/vendor'); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px] text-accent">
                    ✂️ Vendor Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { handleVendorLogout(); setMobileMenuOpen(false); document.body.style.overflow = ''; }} className="w-full justify-center min-h-[48px] text-destructive">
                    Artisan Log out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <HeroSection />
      <HowItWorks />
      <TrustSignals />
      <CategoryPreview />
      <VendorShowcase />

      {/* CTA Banner */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-primary-foreground mb-4">India's finest bespoke fashion, made for you.</h2>
          <p className="text-primary-foreground/70 font-sans text-lg mb-8 max-w-xl mx-auto">
            Join 500+ artisans and thousands of customers already on Naapio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="hero" onClick={() => navigate("/start")}>
              Start My Bespoke Order →
            </Button>
            <Button
              variant="outline"
              size="hero"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/for-tailors")}
            >
              Join as Artisan
            </Button>
          </div>
        </div>
      </section>

      <FAQSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
