import { useState } from 'react';

const ROLES = ['agent', 'team_leader', 'manager', 'hr', 'finance'];
const ROLE_LABELS = { agent: 'Agent', team_leader: 'Team Leader', manager: 'Manager', hr: 'HR', finance: 'Finance' };

const PERMISSIONS = [
  { role: 'super_admin', pages: [true, true, true, true, true, true] },
  { role: 'admin', pages: [true, true, true, true, true, false] },
  { role: 'manager', pages: [true, true, true, true, false, false] },
  { role: 'team_leader', pages: [true, true, false, true, false, false] },
  { role: 'hr', pages: [true, false, true, false, false, false] },
  { role: 'finance', pages: [true, false, true, false, false, false] },
  { role: 'agent', pages: [true, true, false, false, false, false] },
];
const PAGE_NAMES = ['Dashboard', 'Call Logs', 'Reports', 'Admin Panel', 'Manage Users', 'Settings'];

const ROLE_COLORS = {
  super_admin: '#8B5CF6', admin: '#3B82F6', manager: '#6366F1',
  team_leader: '#0EA5E9', hr: '#F59E0B', finance: '#F97316', agent: '#10B981',
};

// ── Section Card ───────────────────────────────────────────
const Section = ({ title, desc, icon, children, accent = '#3B82F6' }) => (
  <div style={{
    background: '#fff', borderRadius: 20, overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9', marginBottom: 20,
  }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon}
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h2>
        {desc && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#94a3b8' }}>{desc}</p>}
      </div>
    </div>
    <div style={{ padding: '20px 24px' }}>{children}</div>
  </div>
);

// ── Toggle Switch ──────────────────────────────────────────
const Toggle = ({ checked, onChange, label, desc }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f8fafc' }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>}
    </div>
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: checked ? 'linear-gradient(135deg,#3B82F6,#6366F1)' : '#E2E8F0',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s',
      }} />
    </button>
  </div>
);

// ── Input Field ────────────────────────────────────────────
const Input = ({ label, desc, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
    {desc && <span style={{ fontSize: 12, color: '#94a3b8', marginTop: -4 }}>{desc}</span>}
    <input {...props} style={{
      border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 14px',
      fontSize: 14, outline: 'none', background: '#F8FAFC', color: '#1e293b',
      transition: 'all 0.15s',
    }}
      onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

const Select = ({ label, desc, options, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
    {desc && <span style={{ fontSize: 12, color: '#94a3b8' }}>{desc}</span>}
    <select {...props} style={{
      border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 14px',
      fontSize: 14, outline: 'none', background: '#F8FAFC', color: '#1e293b', cursor: 'pointer',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ── Toast ──────────────────────────────────────────────────
const Toast = ({ msg, ok }) => (
  <div style={{
    position: 'fixed', top: 24, right: 24, zIndex: 2000,
    padding: '14px 20px', borderRadius: 14,
    background: ok ? '#F0FDF4' : '#FEF2F2',
    border: `1px solid ${ok ? '#BBF7D0' : '#FCA5A5'}`,
    color: ok ? '#16A34A' : '#DC2626',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    fontSize: 14, fontWeight: 600,
    animation: 'toastIn 0.3s ease',
  }}>
    <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }`}</style>
    {ok ? '✅' : '❌'} {msg}
  </div>
);

// ── MAIN ───────────────────────────────────────────────────
export default function AdminSettings() {
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [general, setGeneral] = useState({
    siteName: 'Callyzer',
    supportEmail: 'support@callyzer.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    language: 'en',
  });

  const [security, setSecurity] = useState({
    allowSelfRegister: false,
    requireEmailVerify: false,
    sessionDays: '7',
    maxLoginAttempts: '5',
    twoFactorAdmin: false,
  });

  const [notifications, setNotifications] = useState({
    newUserAlert: true,
    loginAlerts: false,
    weeklyReport: true,
    inactiveUserAlert: false,
  });

  const [defaults, setDefaults] = useState({
    defaultRole: 'agent',
    autoActivate: true,
    requirePhone: false,
  });

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    showToast('Settings saved successfully!');
  };

  const TABS = [
    { id: 'general', label: '⚙️ General', },
    { id: 'security', label: '🔒 Security' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'permissions', label: '🛡️ Permissions' },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      <style>{`
        .tab-btn:hover { background: #f1f5f9 !important; }
        .tab-btn.active { background: linear-gradient(135deg,#3B82F6,#6366F1) !important; color: #fff !important; }
      `}</style>

      {toast && <Toast {...toast} />}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Settings</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Configure your Callyzer system preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#f8fafc', padding: 6, borderRadius: 14, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: activeTab === t.id ? '#fff' : '#64748b',
              background: activeTab === t.id ? 'linear-gradient(135deg,#3B82F6,#6366F1)' : 'transparent',
              transition: 'all 0.2s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GENERAL TAB ── */}
      {activeTab === 'general' && (
        <>
          <Section title="General Settings" desc="Basic system configuration" icon="⚙️">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="System Name" value={general.siteName} onChange={e => setGeneral({ ...general, siteName: e.target.value })} />
              <Input label="Support Email" type="email" value={general.supportEmail} onChange={e => setGeneral({ ...general, supportEmail: e.target.value })} />
              <Select label="Timezone" value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })}
                options={[{ value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' }, { value: 'UTC', label: 'UTC' }, { value: 'America/New_York', label: 'US/Eastern' }]} />
              <Select label="Date Format" value={general.dateFormat} onChange={e => setGeneral({ ...general, dateFormat: e.target.value })}
                options={[{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} />
            </div>
          </Section>

          <Section title="User Defaults" desc="Default settings for new user accounts" icon="👤" accent="#10B981">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Select label="Default Role" value={defaults.defaultRole} onChange={e => setDefaults({ ...defaults, defaultRole: e.target.value })}
                options={ROLES.map(r => ({ value: r, label: ROLE_LABELS[r] }))} />
            </div>
            <Toggle label="Auto-activate new accounts" desc="New users are active immediately without manual approval"
              checked={defaults.autoActivate} onChange={v => setDefaults({ ...defaults, autoActivate: v })} />
            <Toggle label="Require phone number" desc="Phone field is mandatory during registration"
              checked={defaults.requirePhone} onChange={v => setDefaults({ ...defaults, requirePhone: v })} />
          </Section>
        </>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === 'security' && (
        <Section title="Security Settings" desc="Login and access control configuration" icon="🔒" accent="#EF4444">
          <Toggle label="Allow self-registration" desc="Users can create their own accounts from the signup page"
            checked={security.allowSelfRegister} onChange={v => setSecurity({ ...security, allowSelfRegister: v })} />
          <Toggle label="Require email verification" desc="Users must verify email before accessing the system"
            checked={security.requireEmailVerify} onChange={v => setSecurity({ ...security, requireEmailVerify: v })} />
          <Toggle label="Two-factor for admins" desc="Require 2FA for admin and super_admin accounts"
            checked={security.twoFactorAdmin} onChange={v => setSecurity({ ...security, twoFactorAdmin: v })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <Input label="Session Duration (days)" type="number" min="1" max="30" value={security.sessionDays}
              onChange={e => setSecurity({ ...security, sessionDays: e.target.value })}
              desc="JWT token expiry duration" />
            <Input label="Max Login Attempts" type="number" min="3" max="10" value={security.maxLoginAttempts}
              onChange={e => setSecurity({ ...security, maxLoginAttempts: e.target.value })}
              desc="Account locks after this many failures" />
          </div>

          {/* Security Tips */}
          <div style={{ marginTop: 20, background: '#EFF6FF', borderRadius: 14, padding: '16px 18px', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 8 }}>🛡️ Security Recommendations</div>
            {[
              'Use strong JWT_SECRET in your .env file (min 32 characters)',
              'Enable email verification for production environments',
              'Set session duration to 1-3 days for sensitive data',
              'Regularly audit inactive accounts and deactivate them',
            ].map((tip, i) => (
              <div key={i} style={{ fontSize: 12, color: '#3B82F6', marginBottom: 4, display: 'flex', gap: 6 }}>
                <span>•</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <Section title="Notification Preferences" desc="Configure system email alerts and reports" icon="🔔" accent="#F59E0B">
          <Toggle label="New user registration alerts" desc="Get notified when a new user creates an account"
            checked={notifications.newUserAlert} onChange={v => setNotifications({ ...notifications, newUserAlert: v })} />
          <Toggle label="Failed login alerts" desc="Get notified on suspicious login attempts"
            checked={notifications.loginAlerts} onChange={v => setNotifications({ ...notifications, loginAlerts: v })} />
          <Toggle label="Weekly performance report" desc="Receive weekly summary of call analytics via email"
            checked={notifications.weeklyReport} onChange={v => setNotifications({ ...notifications, weeklyReport: v })} />
          <Toggle label="Inactive user alerts" desc="Notify when users haven't logged in for 30+ days"
            checked={notifications.inactiveUserAlert} onChange={v => setNotifications({ ...notifications, inactiveUserAlert: v })} />
          <div style={{ marginTop: 16 }}>
            <Input label="Alert Recipient Email" value={general.supportEmail}
              onChange={e => setGeneral({ ...general, supportEmail: e.target.value })}
              desc="All system alerts will be sent to this address" />
          </div>
        </Section>
      )}

      {/* ── PERMISSIONS TAB ── */}
      {activeTab === 'permissions' && (
        <Section title="Role Permission Matrix" desc="View access levels for each role across the system" icon="🛡️" accent="#8B5CF6">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</th>
                  {PAGE_NAMES.map(p => (
                    <th key={p} style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.4 }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(({ role, pages }, i) => (
                  <tr key={role} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc', borderRadius: 8 }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ROLE_COLORS[role] }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', textTransform: 'capitalize' }}>
                          {role.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    {pages.map((has, j) => (
                      <td key={j} style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {has
                          ? <span style={{ color: '#10B981', fontSize: 16, fontWeight: 700 }}>✓</span>
                          : <span style={{ color: '#E2E8F0', fontSize: 16 }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {Object.entries(ROLE_COLORS).map(([role, color]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: `${color}10`, borderRadius: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color, textTransform: 'capitalize' }}>{role.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Save Button */}
      {activeTab !== 'permissions' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <button style={{
            padding: '12px 24px', borderRadius: 14, border: '1.5px solid #E2E8F0',
            background: '#fff', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Discard Changes
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '12px 28px', borderRadius: 14, border: 'none',
            background: saving ? '#93C5FD' : 'linear-gradient(135deg,#3B82F6,#6366F1)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {saving ? (<><span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</>) : '💾 Save Settings'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
