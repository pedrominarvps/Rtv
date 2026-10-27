import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RukaTvLogo } from '../components/RukaTvLogo';
import { updatePageSeo } from '../utils/seo';
import { useTranslation } from '../context/LanguageContext';
import { ShieldCheck, FileText, CreditCard, Scale, HelpCircle, ChevronLeft } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'sales' | 'legal' | 'support';

export const LegalPage: React.FC = () => {
  const { tab = 'privacy' } = useParams<{ tab: LegalTab }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activeTab: LegalTab = ['privacy', 'terms', 'sales', 'legal', 'support'].includes(tab)
    ? tab
    : 'privacy';

  const tabs: { id: LegalTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'privacy', label: t('footer.privacy'), icon: ShieldCheck },
    { id: 'terms', label: t('footer.terms'), icon: FileText },
    { id: 'sales', label: t('footer.sales'), icon: CreditCard },
    { id: 'legal', label: t('footer.legal'), icon: Scale },
    { id: 'support', label: t('footer.support'), icon: HelpCircle },
  ];

  const titles: Record<LegalTab, string> = {
    privacy: t('footer.privacy'),
    terms: t('footer.terms'),
    sales: t('footer.sales'),
    legal: t('footer.legal'),
    support: t('footer.support'),
  };

  useEffect(() => {
    updatePageSeo({
      title: `${titles[activeTab]} · Legal`,
      description: `Official ${titles[activeTab]} documentation and guidelines for RukaTV+.`,
      url: window.location.href,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 select-none animate-fadeIn space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold text-white/80 hover:text-white transition-all shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('detail.backHome')}</span>
        </button>
      </div>

      {/* Header Lockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-purple-400">
            <span>RukaTV+</span>
            <span>·</span>
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {titles[activeTab]}
          </h1>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
          <RukaTvLogo className="h-6 w-auto" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <Link
              key={t.id}
              to={`/legal/${t.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'glass-pill text-white/70 hover:text-white hover:bg-white/15'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Legal Content Card */}
      <div className="bg-zinc-950/80 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl text-white/80 leading-relaxed space-y-6 text-sm">
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Privacy Policy</h2>
              <p className="text-xs text-white/40 mt-1">Effective Date: October 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">1. Data Protection & Confidentiality</h3>
              <p>
                At RukaTV+, your privacy is fundamental. We do not sell, rent, or monetize your personal data or viewing habits. All user watchlist queues, watch history, and device preferences are stored strictly in client-side secure local storage.
              </p>

              <h3 className="text-base font-semibold text-white">2. IPTV Credentials & Security</h3>
              <p>
                Your Xtream Codes credentials (server URL, username, and password) are processed directly between your client browser and the media distribution endpoint. No third-party servers harvest or store your private access tokens.
              </p>

              <h3 className="text-base font-semibold text-white">3. Streaming Telemetry</h3>
              <p>
                Diagnostic telemetry is restricted to local playback performance, such as adaptive bitrate switching and buffer health, ensuring uninterrupted 4K UHD and Dolby Atmos delivery.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Terms of Use</h2>
              <p className="text-xs text-white/40 mt-1">Effective Date: October 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">1. Acceptance of Terms</h3>
              <p>
                By accessing and using RukaTV+, you agree to abide by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
              </p>

              <h3 className="text-base font-semibold text-white">2. Streaming License & Content Availability</h3>
              <p>
                RukaTV+ grants a personal, non-exclusive, non-transferable license to stream media content for personal, non-commercial entertainment. Content resolution (4K, HDR, Dolby Vision) depends on source stream availability and client device capabilities.
              </p>

              <h3 className="text-base font-semibold text-white">3. Acceptable Use</h3>
              <p>
                Users agree not to redistribute, broadcast publicly, or reverse-engineer stream delivery protocols without authorization from respective rights holders.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Sales & Subscription Policy</h2>
              <p className="text-xs text-white/40 mt-1">Effective Date: October 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">1. Subscription Plans</h3>
              <p>
                Access to RukaTV+ and TV Season live broadcast feeds is provided through subscription tiers configured by your account provider. Fees are billed at the beginning of each billing cycle.
              </p>

              <h3 className="text-base font-semibold text-white">2. Simultaneous Connections</h3>
              <p>
                Depending on your active plan, you can stream across web, desktop, and mobile devices simultaneously. Exceeding allowed stream limits may cause temporary connection errors.
              </p>

              <h3 className="text-base font-semibold text-white">3. Cancellation & Renewals</h3>
              <p>
                Subscriptions renew automatically unless cancelled prior to the end of the billing period. Service remains active until the end of the paid period.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Legal & Trademarks</h2>
              <p className="text-xs text-white/40 mt-1">Effective Date: October 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">1. Intellectual Property</h3>
              <p>
                The Ruka emblem, RukaTV name, vector logotype, custom UI design system, and interface code are property of RukaTV Inc. All rights reserved.
              </p>

              <h3 className="text-base font-semibold text-white">2. Third-Party Trademarks & Content</h3>
              <p>
                Apple TV, tv+, Dolby Vision, Dolby Atmos, and respective studio titles are trademarks of their respective owners. Channel logos, audio feeds, and television broadcasts remain the property of their broadcast networks.
              </p>

              <h3 className="text-base font-semibold text-white">3. Limitation of Liability</h3>
              <p>
                RukaTV+ is provided "as is" without warranty of continuous uninterrupted availability. Transmission speeds and stream uptime are managed by external distribution servers.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Support & Troubleshooting Center</h2>
              <p className="text-xs text-white/40 mt-1">Need assistance? Here is how to get help:</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="font-semibold text-white text-sm">Keyboard Shortcuts</h3>
                <ul className="text-xs space-y-1 text-white/70 list-disc list-inside">
                  <li><strong className="text-white">Space / Click:</strong> Play / Pause video</li>
                  <li><strong className="text-white">Left / Right Arrows:</strong> Seek 10 seconds backward or forward</li>
                  <li><strong className="text-white">Escape:</strong> Exit video player or modal</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="font-semibold text-white text-sm">Playback Diagnostics</h3>
                <p className="text-xs text-white/70">
                  If a movie or live stream stalls, use the <strong className="text-white">"Source / Mirror Switcher"</strong> button in the player HUD to connect to alternative CDN mirrors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="font-semibold text-white text-sm">Server Configuration</h3>
                <p className="text-xs text-white/70">
                  Verify Xtream credentials in your environment variables: <code className="bg-black/50 px-2 py-0.5 rounded text-purple-300 font-mono text-[11px]">VITE_XTREAM_SERVER</code>, <code className="bg-black/50 px-2 py-0.5 rounded text-purple-300 font-mono text-[11px]">VITE_XTREAM_USER</code>, and <code className="bg-black/50 px-2 py-0.5 rounded text-purple-300 font-mono text-[11px]">VITE_XTREAM_PASS</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
