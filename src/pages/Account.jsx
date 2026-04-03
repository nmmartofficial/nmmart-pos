import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { User, Phone, Mail, MapPin, Shield, CreditCard, LogOut, ArrowRight } from 'lucide-react';

const Account = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative h-64 bg-red-600 rounded-[3rem] shadow-2xl shadow-red-900/40 flex flex-col items-center justify-center text-white overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900/80 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-500">
            <User className="w-48 h-48" />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-black uppercase tracking-[0.2em] mb-2 drop-shadow-xl">NM MART</h2>
            <p className="text-red-200 text-sm font-bold uppercase tracking-widest opacity-80">Premium Retail OS Account</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative -mt-20 px-4 md:px-12 pb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl shadow-black/60 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Profile Sidebar */}
              <div className="w-full md:w-64 space-y-8 text-center md:text-left">
                <div className="relative mx-auto md:mx-0 w-32 h-32 md:w-40 md:h-40 bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-black ring-1 ring-white/10 group overflow-hidden">
                  <div className="absolute inset-0 bg-red-600 scale-0 group-hover:scale-100 transition-transform duration-500 opacity-20"></div>
                  <User className="w-16 h-16 md:w-20 md:h-20 text-red-500 relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Admin User</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Super Admin</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full py-3.5 text-xs font-bold" icon={Edit2}>Edit Profile</Button>
                  <Button variant="danger" className="w-full py-3.5 text-xs font-bold" icon={LogOut}>Logout Session</Button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="flex-1 space-y-12">
                {/* Contact Info */}
                <section className="space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Account Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-red-500/30 transition-all">
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mobile Number</p>
                        <p className="text-sm font-black text-slate-200">+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-red-500/30 transition-all">
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-black text-slate-200">admin@nmmart.com</p>
                      </div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-red-500/30 transition-all col-span-1 md:col-span-2">
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Store Address</p>
                        <p className="text-sm font-black text-slate-200">Main Market, Near Railway Station, Civil Lines, Raipur (CG)</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Settings & Security */}
                <section className="space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Settings & Security</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-red-500/30 transition-all text-left">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-800 text-slate-400 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
                          <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-all">Two-Factor Authentication</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button className="w-full flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-red-500/30 transition-all text-left">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-800 text-slate-400 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-all">Subscription Plan</span>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg shadow-red-900/40">Wholesale Pro</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Edit2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

export default Account;
