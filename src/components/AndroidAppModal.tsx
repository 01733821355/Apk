import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Share2, 
  ExternalLink, 
  Check, 
  Copy, 
  X, 
  Sparkles,
  Layers,
  Globe,
  ArrowRight
} from 'lucide-react';
import type { Language } from '../types';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AndroidAppModal = ({ isOpen, onClose, language }: AndroidAppModalProps) => {
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert(language === 'bn' 
        ? 'আপনার ফোনের ক্রোম (Chrome) ব্রাউজারের উপরে ডানদিকের তিনটি ডটে (⋮) চাপ দিয়ে "Add to Home screen" বা "Install app" এ ক্লিক করুন।'
        : 'Open Chrome menu (⋮) on your mobile device and tap "Add to Home screen" or "Install app".'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {language === 'bn' ? 'অ্যান্ড্রয়েড মোবাইল অ্যাপ ও APK' : 'Android Mobile App & APK'}
              </h3>
              <p className="text-xs text-emerald-100">
                {language === 'bn' ? 'ফোনে সরাসরি ইনস্টল করুন বা APK বানান' : 'Install on phone or generate APK'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-slate-700 dark:text-slate-300 text-xs sm:text-sm">

          {/* Option 1: Instant Install (PWA) */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                <Sparkles className="w-3 h-3" />
                {language === 'bn' ? 'পদ্ধতি ১: কোনো APK ছাড়াই সরাসরি ইনস্টল (সবচেয়ে সহজ)' : 'Option 1: Direct Instant Install (Recommended)'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {language === 'bn' 
                ? 'এই সিস্টেমটি পূর্ণাঙ্গ Progressive Web App (PWA) হিসেবে সাজানো আছে। আপনার অ্যান্ড্রয়েড ফোনে ক্রোম ব্রাউজার থেকে ১-ক্লিকেই হোমস্ক্রিনে আসল অ্যাপের মতো ইনস্টল হয়ে যাবে।'
                : 'This app is a full PWA. You can install it on your Android phone immediately without downloading heavy APKs.'}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={handleInstallPWA}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {language === 'bn' ? 'হোমস্ক্রিনে ইনস্টল করুন' : 'Install to Home Screen'}
              </button>
              {isInstalled && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {language === 'bn' ? 'ইতিমধ্যে ইনস্টল করা আছে' : 'Already installed'}
                </span>
              )}
            </div>
          </div>

          {/* Option 2: Turn into APK File */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white">
              <Layers className="w-3 h-3" />
              {language === 'bn' ? 'পদ্ধতি ২: আসল APK ফাইল বানানোর নিয়ম' : 'Option 2: Generate Real .APK File'}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'আপনি যদি বন্ধুদের সাথে শেয়ার করার জন্য বা গুগল প্লে স্টোরে দেওয়ার জন্য .apk ফাইল চান, তবে নিচের ৩টি ধাপ অনুসরণ করুন:'
                : 'If you need a standalone .apk file to share or publish, follow these 3 quick steps:'}
            </p>

            <ol className="space-y-2 list-decimal list-inside text-xs text-slate-600 dark:text-slate-300">
              <li>
                <strong className="text-slate-800 dark:text-white">
                  {language === 'bn' ? 'আপনার অ্যাপ লিংক কপি করুন:' : 'Copy your app link:'}
                </strong>
                <div className="flex items-center gap-2 mt-1.5">
                  <input 
                    type="text" 
                    readOnly 
                    value={appUrl} 
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-slate-700 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>
              </li>

              <li className="pt-1">
                <strong className="text-slate-800 dark:text-white">
                  {language === 'bn' ? 'PWABuilder (Microsoft-এর ফ্রি টুল) এ যান:' : 'Visit PWABuilder (Free Microsoft tool):'}
                </strong>
                <div className="mt-1">
                  <a 
                    href="https://www.pwabuilder.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold underline"
                  >
                    <span>pwabuilder.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>

              <li className="pt-1">
                <span className="text-slate-700 dark:text-slate-200">
                  {language === 'bn' 
                    ? 'সেখানে আপনার কপি করা লিংকটি পেস্ট করে "Start" চাপুন, এরপর "Package for Android" এ ক্লিক করলেই সাথে সাথে তৈরি হয়ে যাবে আপনার .apk বা .aab ফাইল!'
                    : 'Paste your copied link there, click "Start", and then click "Package for Android" to download your ready-to-install .apk!'}
                </span>
              </li>
            </ol>
          </div>

          {/* Quick instructions on Chrome Mobile */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
            💡 <strong>{language === 'bn' ? 'টিপস:' : 'Tip:'}</strong>{' '}
            {language === 'bn'
              ? 'মোবাইল ক্রোম ব্রাউজারে সাইটটি ওপেন করে মেনু (৩ ডট) থেকে "Install app" চাপলে কোনো ঝামেলা ছাড়াই এটি একদম অরিজিনাল অ্যাপের মতো স্পিডে চলে ও অফলাইনেও কাজ করে।'
              : 'Opening this site in mobile Chrome and tapping "Install app" from the menu runs it with native speed and offline caching without any APK hassle.'}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
