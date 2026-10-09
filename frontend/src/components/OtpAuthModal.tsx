import React, { useState, useEffect } from 'react';
import { 
  X, Phone, ShieldCheck, CheckCircle2, 
  RefreshCw, LogOut, Info, ArrowRight
} from 'lucide-react';
import { UserSession } from '../types';
import { api } from '../services/api';

interface OtpAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
}

export const OtpAuthModal: React.FC<OtpAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onLogout,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = mobileNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.requestOtp(clean);
      setDevOtpCode(res.otp_preview || '123456');
      setStep('OTP');
      setCountdown(30);
    } catch {
      // Offline / fallback mode
      setDevOtpCode('123456');
      setStep('OTP');
      setCountdown(30);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpInput || otpInput.length < 4) {
      setErrorMsg('Please enter the received OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyOtp(mobileNumber, otpInput);
      onLoginSuccess(res.user);
      onClose();
    } catch {
      if (otpInput === '123456') {
        onLoginSuccess({
          name: `Patient (${mobileNumber.slice(-4)})`,
          mobile: mobileNumber,
          auth_mode: 'DEVELOPMENT_VERIFIED',
          blood_group: 'O+'
        });
        onClose();
      } else {
        setErrorMsg('Invalid OTP. In development mode, use 123456.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If Already Logged In */}
        {user ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {user.auth_mode}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">{user.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mobile: +91 {user.mobile}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600">
              Your Emergency Medical Passport and Hospital Queue are synchronized to this mobile number.
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Patient Account</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Patient Verification
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {step === 'PHONE' ? 'Patient OTP Login' : 'Enter Verification OTP'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {step === 'PHONE'
                  ? 'Access your saved medical passport and queue updates with secure mobile OTP.'
                  : `Enter the 6-digit code sent to +91 ${mobileNumber}.`}
              </p>
            </div>

            {/* Development Mode Notice Banner */}
            <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Development Mode Active:</strong> Live SMS credentials are unconfigured for hackathon safety. Test OTP is set to <strong>123456</strong>.
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {step === 'PHONE' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number (India)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full text-sm font-semibold pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-black py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Quick Auto-fill Button */}
                <button
                  type="button"
                  onClick={() => setOtpInput(devOtpCode || '123456')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 rounded-xl transition"
                >
                  ⚡ Auto-fill Dev Test OTP ({devOtpCode || '123456'})
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-sky-600 hover:underline font-semibold"
                  >
                    Change Number
                  </button>
                  <span>
                    Resend in {countdown}s
                  </span>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              Emergency calling (112 / 108) never requires an account.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
