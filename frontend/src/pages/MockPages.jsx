import React, { useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  Activity, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Clock, CreditCard,
  Download, FileText, Filter, Headphones, History, Laptop, Medal, Mic, MoreHorizontal,
  Phone, PhoneCall, PhoneForwarded, Plus, Radio, Search, Settings, ShieldCheck,
  Smartphone, Star, Timer, Trash2, TrendingUp, UserPlus, Users, X,
} from 'lucide-react';

const blue = '#3B82F6';
const green = '#10B981';
const amber = '#F59E0B';
const red = '#EF4444';
const slate = '#64748B';
const pieColors = [blue, green, amber, red];

const users = [
  ['Aarav Rao', 'aarav@callyzer.app', 'Admin', 'Callyzer', 'Active'],
  ['Riya Mehta', 'riya@novasales.com', 'Business Owner', 'Nova Sales', 'Active'],
  ['Kabir Shah', 'kabir@novasales.com', 'Salesperson', 'Nova Sales', 'Active'],
  ['Naina Kapoor', 'naina@vertex.com', 'Salesperson', 'Vertex', 'Pending'],
  ['Dev Patel', 'dev@pulsecrm.com', 'Business Owner', 'Pulse CRM', 'Suspended'],
  ['Isha Jain', 'isha@novasales.com', 'Salesperson', 'Nova Sales', 'Active'],
];

const team = [
  ['Kabir Shah', 86, 72, 'Online'],
  ['Isha Jain', 74, 68, 'Online'],
  ['Manav Suri', 68, 61, 'On break'],
  ['Sara Khan', 59, 54, 'Offline'],
  ['Neel Roy', 51, 49, 'Online'],
];

const calls = [
  ['09:18 AM', 'Arjun Motors', '+91 98765 12340', '4m 12s', 'Connected'],
  ['10:05 AM', 'Luna Foods', '+91 98765 22340', '0m 18s', 'Not Answered'],
  ['11:42 AM', 'Vector Labs', '+91 98765 32340', '7m 31s', 'Connected'],
  ['01:16 PM', 'Bright Ware', '+91 98765 42340', '1m 02s', 'Busy'],
  ['03:44 PM', 'CloudMart', '+91 98765 52340', '5m 40s', 'Connected'],
];

const growth = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, users: 120 + i * 7 + Math.round(Math.sin(i / 2) * 18) }));
const weekCalls = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({ day, calls: [72, 84, 91, 78, 104, 66, 58][i], connected: [48, 59, 63, 51, 75, 39, 34][i] }));
const outcomes = [
  { name: 'Connected', value: 64 },
  { name: 'Not Answered', value: 18 },
  { name: 'Busy', value: 11 },
  { name: 'Failed', value: 7 },
];

function Page({ children }) {
  return <div className="page-motion space-y-6">{children}</div>;
}

function Card({ children, className = '' }) {
  return <section className={`cz-card ${className}`}>{children}</section>;
}

function Stat({ icon: Icon, label, value, trend = '+12%', color = blue }) {
  return (
    <Card className="stat-card">
      <div className="stat-icon" style={{ color, background: `${color}14` }}><Icon size={22} /></div>
      <span className="trend">{trend}</span>
      <strong className="mono">{value}</strong>
      <p>{label}</p>
    </Card>
  );
}

function Badge({ children }) {
  const key = String(children).toLowerCase();
  const cls = key.includes('active') || key.includes('connected') || key.includes('approved') || key.includes('online') ? 'good'
    : key.includes('pending') || key.includes('busy') || key.includes('break') ? 'warn'
      : key.includes('reject') || key.includes('failed') || key.includes('suspend') || key.includes('offline') ? 'bad' : 'info';
  return <span className={`cz-badge ${cls}`}>{children}</span>;
}

function SectionTitle({ title, action }) {
  return <div className="section-title"><h3>{title}</h3>{action}</div>;
}

function Table({ columns, rows, render }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} style={{ animationDelay: `${index * 45}ms` }}>
              {render ? render(row, index) : row.map((cell, i) => <td key={i}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartCard({ title, children }) {
  return <Card><SectionTitle title={title} /><div className="chart-box">{children}</div></Card>;
}

export function Register() {
  const [step, setStep] = useState(2);
  return (
    <main className="auth-shell">
      <section className="auth-card register">
        <div className="auth-brand"><span className="brand-mark"><PhoneCall /></span><div><h1>Create workspace</h1><p>Start your Callyzer trial in three quick steps.</p></div></div>
        <div className="steps">{['Profile', 'Business', 'Security'].map((s, i) => <button key={s} className={i <= step ? 'done' : ''} onClick={() => setStep(i)}>{i + 1}<span>{s}</span></button>)}</div>
        <div className="form-grid">
          {['Full name', 'Email address', 'Phone number', 'Business name', 'Password'].map((label) => <label className="field plain" key={label}><span>{label}</span><input type={label.includes('Password') ? 'password' : 'text'} placeholder={label} /></label>)}
          <label className="field plain"><span>Role</span><select><option>Business Owner</option><option>Admin</option><option>Salesperson</option></select></label>
        </div>
        <button className="primary-btn">Submit registration</button>
      </section>
    </main>
  );
}

export function AdminDashboard() {
  return (
    <Page>
      <div className="stats-grid"><Stat icon={Users} value="2,486" label="Total Users" /><Stat icon={Laptop} value="184" label="Active Businesses" color={green} /><Stat icon={Bell} value="23" label="Pending Approvals" color={amber} /><Stat icon={Phone} value="18,920" label="Total Calls Today" color={red} /></div>
      <div className="grid-2 wide-left">
        <ChartCard title="User growth: last 30 days"><ResponsiveContainer><LineChart data={growth}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="users" stroke={blue} strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></ChartCard>
        <Card><SectionTitle title="Recent activity" /><div className="activity-list">{['Nova Sales approved for Pro plan', 'Naina Kapoor requested access', 'Device sync completed for 18 users', 'Monthly report exported'].map((item, i) => <p key={item}><span>{i + 1}</span>{item}</p>)}</div><div className="quick-row"><button><UserPlus /> Invite</button><button><Download /> Export</button><button><Settings /> Configure</button></div></Card>
      </div>
    </Page>
  );
}

export function AdminUsers() {
  return (
    <Page>
      <Card><div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Search users, businesses, emails..." /></div><button><Filter size={17} /> Filter</button><button><Plus size={17} /> Add user</button></div><Table columns={['Name', 'Email', 'Role', 'Business', 'Status', 'Actions']} rows={users} render={(u) => <><td>{u[0]}</td><td>{u[1]}</td><td><Badge>{u[2]}</Badge></td><td>{u[3]}</td><td><Badge>{u[4]}</Badge></td><td><button className="icon-btn"><MoreHorizontal size={17} /></button><button className="icon-btn danger"><Trash2 size={17} /></button></td></>} /><div className="pagination"><button>Previous</button><span>Page 1 of 4</span><button>Next</button></div></Card>
    </Page>
  );
}

export function AdminApprovals() {
  const cards = ['Vertex Labs business verification', 'Naina Kapoor salesperson access', 'Pulse CRM Enterprise upgrade'];
  return <Page><div className="approval-grid">{cards.map((title) => <Card key={title} className="approval-card"><Badge>Pending</Badge><h3>{title}</h3><p>Submitted with identity documents, business details, and requested workspace permissions.</p><div><button className="success-btn"><Check size={16} /> Approve</button><button className="danger-btn"><X size={16} /> Reject</button></div></Card>)}</div></Page>;
}

export function AdminAttendance() {
  const rows = team.map((t, i) => [t[0], `09:${10 + i} AM`, `06:${20 + i} PM`, `${8 + i % 2}h ${10 + i}m`, i === 2 ? 'Late' : 'Present']);
  return <Page><div className="grid-2"><Card><SectionTitle title="May attendance calendar" /><div className="calendar-grid">{Array.from({ length: 35 }, (_, i) => <span className={i % 7 === 0 ? 'muted' : i % 5 === 0 ? 'warn' : 'good'} key={i}>{i + 1 <= 31 ? i + 1 : ''}</span>)}</div></Card><Card><SectionTitle title="Today's attendance" /><Table columns={['Employee', 'Check-in', 'Check-out', 'Hours', 'Status']} rows={rows} render={(r) => r.map((c, i) => <td key={i}>{i === 4 ? <Badge>{c}</Badge> : c}</td>)} /></Card></div></Page>;
}

export function AdminSettings() {
  return <Page><Card><div className="tabs">{['General', 'Notifications', 'Security', 'Integrations'].map((t, i) => <button className={i === 0 ? 'active' : ''} key={t}>{t}</button>)}</div><div className="settings-grid">{['Workspace name', 'Default timezone', 'Webhook URL', 'Session timeout'].map((label) => <label className="field plain" key={label}><span>{label}</span><input placeholder={label} /></label>)}</div>{['Email alerts', 'Approval reminders', 'Two-factor login', 'Slack integration'].map((t, i) => <div className="setting-row" key={t}><div><strong>{t}</strong><p>Keep this feature enabled for smoother operations.</p></div><button className={`toggle ${i !== 2 ? 'on' : ''}`}><span /></button></div>)}<button className="primary-btn small">Save settings</button></Card></Page>;
}

export function BusinessDashboard() {
  return (
    <Page>
      <div className="stats-grid"><Stat icon={Phone} value="624" label="Total Calls" /><Stat icon={PhoneForwarded} value="418" label="Connected Calls" color={green} /><Stat icon={Clock} value="4m 26s" label="Avg Duration" color={amber} /><Stat icon={CalendarDays} value="37" label="Follow-ups Pending" color={red} /></div>
      <div className="grid-2"><ChartCard title="Calls per day"><ResponsiveContainer><BarChart data={weekCalls}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="calls" fill={blue} radius={[8, 8, 0, 0]} /><Bar dataKey="connected" fill={green} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Call outcomes"><ResponsiveContainer><PieChart><Pie data={outcomes} dataKey="value" innerRadius={58} outerRadius={90} paddingAngle={4}>{outcomes.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard></div>
      <div className="grid-2"><Leaderboard compact /><CallLogs compact /></div>
    </Page>
  );
}

export function MyTeam() {
  return <Page><div className="page-actions"><button><UserPlus size={17} /> Invite member</button></div><div className="team-grid">{team.map((m) => <Card className="member-card" key={m[0]}><div className="avatar">{m[0][0]}</div><h3>{m[0]}</h3><Badge>{m[3]}</Badge><div className="member-stats"><span><b className="mono">{m[1]}</b> Calls</span><span><b className="mono">{m[2]}%</b> Connected</span></div></Card>)}</div><ChartCard title="Team performance comparison"><ResponsiveContainer><BarChart data={team.map((t) => ({ name: t[0].split(' ')[0], calls: t[1], connected: t[2] }))}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="calls" fill={blue} radius={[8, 8, 0, 0]} /><Bar dataKey="connected" fill={green} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></Page>;
}

export function Subscription() {
  return <Pricing embedded />;
}

export function SalespersonDashboard() {
  return <Page><div className="stats-grid"><Stat icon={Phone} value="58" label="My Calls Today" /><Stat icon={CheckCircle2} value="41" label="Connected" color={green} /><Stat icon={Bell} value="9" label="Pending Follow-ups" color={amber} /><Stat icon={TrendingUp} value="82%" label="Target %" color={red} /></div><div className="grid-2"><Card className="target-card"><SectionTitle title="Daily target" /><div className="ring">82%</div><p>58 of 70 calls completed. Strong pace for the day.</p></Card><Card><SectionTitle title="Follow-up reminders" />{['Call CloudMart at 4:30 PM', 'Send quote to Vector Labs', 'Retry Luna Foods tomorrow'].map((x) => <p className="reminder" key={x}><Bell size={16} />{x}</p>)}</Card></div><CallLogs compact /></Page>;
}

export function CallLogs({ compact = false }) {
  return <Page><Card><SectionTitle title={compact ? 'Recent call logs' : 'Call logs'} action={!compact && <button><Download size={17} /> Export CSV</button>} />{!compact && <div className="toolbar"><div className="search"><Search size={17} /><input placeholder="Filter by contact, number, outcome..." /></div><button><Filter size={17} /> Filters</button></div>}<Table columns={['Date', 'Contact', 'Number', 'Duration', 'Outcome', 'Recording']} rows={calls} render={(c) => <><td>{c[0]}</td><td>{c[1]}</td><td>{c[2]}</td><td>{c[3]}</td><td><Badge>{c[4]}</Badge></td><td><audio controls /></td></>} /></Card></Page>;
}

export function CallHistory() {
  return <Page><Card><SectionTitle title="Call history timeline" /><div className="search"><Search size={17} /><input placeholder="Search by contact name or number..." /></div><div className="timeline">{['Today', 'Yesterday', 'May 6, 2026'].map((day) => <div key={day}><h3>{day}</h3>{calls.slice(0, 3).map((c) => <details key={c[1]}><summary><PhoneCall size={16} /> {c[1]} <Badge>{c[4]}</Badge></summary><p>{c[2]} lasted {c[3]}. Notes: Interested, follow up scheduled.</p></details>)}</div>)}</div></Card></Page>;
}

export function LiveFeed() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((v) => v + 1), 1000); return () => clearInterval(id); }, []);
  return <Page><div className="live-grid">{team.slice(0, 4).map((m, i) => <Card className="live-card" key={m[0]}><span className="live-dot" /><h3>{m[0]}</h3><p>Calling {calls[i][1]}</p><strong className="mono">{String(Math.floor((tick + i * 20) / 60)).padStart(2, '0')}:{String((tick + i * 20) % 60).padStart(2, '0')}</strong><Badge>{i % 2 ? 'Prospecting' : 'Connected'}</Badge></Card>)}</div></Page>;
}

export function Leaderboard({ compact = false }) {
  const rows = team.map((t, i) => [i + 1, t[0], t[1], t[2], `${3 + i}m ${20 + i}s`, 98 - i * 7]);
  return <Card><SectionTitle title="Leaderboard" action={!compact && <div className="tabs mini"><button className="active">Today</button><button>This Week</button><button>This Month</button></div>} /><Table columns={['Rank', 'Salesperson', 'Calls', 'Connected %', 'Avg Duration', 'Score']} rows={rows} render={(r) => <><td>{r[0] <= 3 ? <Medal className={`medal m${r[0]}`} /> : `#${r[0]}`}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}%</td><td>{r[4]}</td><td><b>{r[5]}</b></td></>} /></Card>;
}

export function Reports() {
  return <Page><Card><div className="toolbar"><label className="field plain"><span>From</span><input type="date" /></label><label className="field plain"><span>To</span><input type="date" /></label><button><FileText size={17} /> Download PDF</button><button><Download size={17} /> CSV</button></div></Card><div className="stats-grid"><Stat icon={Activity} value="4,912" label="Call Volume" /><Stat icon={CheckCircle2} value="67%" label="Connect Rate" color={green} /><Stat icon={Timer} value="4m 02s" label="Avg Duration" color={amber} /><Stat icon={Star} value="91" label="Team Score" color={red} /></div><div className="grid-2"><ChartCard title="Call volume trend"><ResponsiveContainer><AreaChart data={weekCalls}><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="calls" stroke={blue} fill="#DBEAFE" /></AreaChart></ResponsiveContainer></ChartCard><ChartCard title="Team comparison"><ResponsiveContainer><BarChart data={team.map((t) => ({ name: t[0].split(' ')[0], score: t[2] }))}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="score" fill={blue} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard></div></Page>;
}

export function DeviceCallSync() {
  return <Page><div className="setup-grid">{[['Install app', Smartphone], ['Grant permissions', ShieldCheck], ['Sync automatically', Radio]].map(([t, Icon], i) => <Card className="setup-card" key={t}><span>{i + 1}</span><Icon size={28} /><h3>{t}</h3><p>Complete this step to keep call activity updated in Callyzer.</p></Card>)}</div><Card><SectionTitle title="Connected devices" /><Table columns={['Device', 'Owner', 'Last Sync', 'Status']} rows={[['Pixel 8 Pro', 'Kabir Shah', '2 mins ago', 'Synced'], ['iPhone 15', 'Isha Jain', '11 mins ago', 'Synced'], ['OnePlus 12', 'Manav Suri', '1 hour ago', 'Attention']]} render={(r) => r.map((c, i) => <td key={i}>{i === 3 ? <Badge>{c}</Badge> : c}</td>)} /></Card></Page>;
}

export function Pricing({ embedded = false }) {
  const plans = [['Basic', '$19', ['Call logs', 'Basic reports', '5 users']], ['Pro', '$49', ['Live feed', 'Advanced reports', '25 users']], ['Enterprise', 'Custom', ['SAML SSO', 'Priority support', 'Unlimited users']]];
  const content = <><section className="pricing-hero"><h1>Callyzer pricing</h1><p>Choose the plan that fits your sales motion.</p></section><div className="pricing-grid">{plans.map((p, i) => <Card className={i === 1 ? 'plan featured' : 'plan'} key={p[0]}><Badge>{i === 1 ? 'Recommended' : 'Current plan'}</Badge><h3>{p[0]}</h3><strong>{p[1]}</strong>{p[2].map((f) => <p key={f}><Check size={16} />{f}</p>)}<button className="primary-btn small">{i === 1 ? 'Upgrade' : 'Choose plan'}</button></Card>)}</div><Card><SectionTitle title="FAQ" />{['Can I switch plans?', 'Is there a free trial?', 'Do you support annual billing?'].map((q) => <details key={q}><summary>{q}<ChevronDown size={16} /></summary><p>Yes. Callyzer supports flexible plan changes and transparent billing.</p></details>)}</Card></>;
  return embedded ? <Page>{content}</Page> : <main className="public-page">{content}</main>;
}

export function Checkout() {
  return <main className="public-page checkout"><Card><SectionTitle title="Payment details" /><div className="settings-grid"><label className="field plain"><span>Card number</span><input placeholder="4242 4242 4242 4242" /></label><label className="field plain"><span>Expiry</span><input placeholder="MM/YY" /></label><label className="field plain"><span>CVV</span><input placeholder="123" /></label><label className="field plain"><span>Billing address</span><input placeholder="Street, city, country" /></label></div><p className="secure"><ShieldCheck size={17} /> Secure encrypted checkout</p><button className="primary-btn">Pay $49</button></Card><Card><SectionTitle title="Order summary" /><p>Pro plan</p><h2>$49 / month</h2><p>Includes 25 seats, advanced reports, live feed, and device sync.</p></Card></main>;
}

export function Pending() {
  return <main className="public-page pending"><Card><div className="empty-illustration"><Headphones size={54} /></div><h1>Your account is under review</h1><p>Our admin team is verifying your workspace. You will receive an email as soon as access is approved.</p><a href="mailto:support@callyzer.app">Contact support</a></Card></main>;
}
