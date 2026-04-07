import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lock, PhoneCall } from 'lucide-react';

const LicenseGuard = ({ children }) => {
  const [licenseStatus, setLicenseStatus] = useState('CHECKING'); 
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const checkLicense = async () => {
      // 1. यूजर की जानकारी लें
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLicenseStatus('ACTIVE'); // अगर लॉगिन नहीं है तो गार्ड हटा दें ताकि लॉगिन पेज दिखे
        return;
      }

      // 2. Profiles टेबल से लाइसेंस चेक करें
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('license_valid_until, is_active')
        .eq('id', user.id)
        .single();

      if (profile) {
        const today = new Date();
        const expiry = new Date(profile.license_valid_until);
        
        // चेक करें: क्या तारीख निकल गई या एडमिन ने लॉक कर दिया?
        if (expiry < today || profile.is_active === false) {
          setLicenseStatus('LOCKED');
          setExpiryDate(profile.license_valid_until);
        } else {
          setLicenseStatus('ACTIVE');
        }
      } else {
        // अगर प्रोफाइल नहीं है (नया यूजर), तो उसे एक्सेस दें ताकि वो प्रोफाइल बना सके
        setLicenseStatus('ACTIVE');
      }
    };

    checkLicense();
  }, []);

  // जब तक चेक हो रहा है
  if (licenseStatus === 'CHECKING') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="font-black italic text-slate-400 uppercase tracking-widest">Verifying NM MART License...</p>
        </div>
      </div>
    );
  }

  // अगर लाइसेंस खत्म हो गया है (LOCK SCREEN)
  if (licenseStatus === 'LOCKED') {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[9999] flex items-center justify-center p-6 backdrop-blur-xl">
        <div className="bg-white p-10 rounded-[3rem] max-w-md w-full text-center shadow-2xl border-t-[12px] border-red-500">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={48} strokeWidth={3} />
          </div>
          
          <h1 className="text-4xl font-black italic uppercase text-slate-800 mb-2 tracking-tighter">Access Denied</h1>
          <p className="text-slate-500 font-bold mb-8 leading-tight">
            Aapka NM MART RETAIL OS license <span className="text-red-500">{expiryDate}</span> को समाप्त हो गया है।
          </p>

          <div className="space-y-4">
            <a 
              href="tel:+91XXXXXXXXXX" // यहाँ अपना नंबर डालें
              className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              <PhoneCall size={20} /> CONTACT FOR RENEWAL
            </a>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NM MART - RETAIL OS v5.0</p>
          </div>
        </div>
      </div>
    );
  }

  // अगर लाइसेंस OK है, तो ऐप दिखाओ
  return children;
};

export default LicenseGuard;