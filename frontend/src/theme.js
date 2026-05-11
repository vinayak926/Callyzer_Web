// // src/theme.js
// // Website theme - matches the app's color system

// export const C = {
//     bg: '#F5F7FA',
//     surface: '#FFFFFF',
//     surfaceAlt: '#F0F2F7',
//     primary: '#4F6EF7',
//     primarySoft: '#EEF1FE',
//     primaryMid: '#C7D2FE',
//     primaryDark: '#3B56D4',
//     text: '#0F1729',
//     textSub: '#6B7A99',
//     textMuted: '#A9B4CC',
//     border: '#E8ECF4',
//     divider: '#F0F2F7',
//     green: '#17C964',
//     greenSoft: '#E8FBF0',
//     greenDark: '#0F9A4A',
//     red: '#F31260',
//     redSoft: '#FEE7EF',
//     amber: '#F5A524',
//     amberSoft: '#FFF4E0',
//     blue: '#006FEE',
//     blueSoft: '#E6F1FE',
//     purple: '#7828C8',
//     purpleSoft: '#F0E6FF',
// };

// export const ROLE_COLORS = {
//     super_admin:   { color: '#8B5CF6', soft: '#EDE9FE', label: 'Super Admin' },
//     business_user: { color: '#4F6EF7', soft: '#EEF1FE', label: 'Business User' },
//     salesperson:   { color: '#17C964', soft: '#E8FBF0', label: 'Salesperson' },
// };

// export default C;

// Refined Indigo / Violet SaaS theme — clean, premium, corporate.

export const C = {
    bg: '#F7F8FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F8',

    primary: '#6366F1',
    primarySoft: '#EEF0FF',
    primaryMid: '#C7CBFA',
    primaryDark: '#4549D9',

    accent: '#8B5CF6',
    accentSoft: '#F1ECFE',

    text: '#0B1220',
    textSub: '#5B6478',
    textMuted: '#9099AC',
    border: '#E7E9F0',
    divider: '#EFF1F6',

    green: '#16A34A',
    greenSoft: '#E7F8EE',
    greenDark: '#0E7B36',

    red: '#E11D48',
    redSoft: '#FDE8EE',

    amber: '#D97706',
    amberSoft: '#FEF3DA',

    blue: '#2563EB',
    blueSoft: '#E5EEFE',

    purple: '#8B5CF6',
    purpleSoft: '#F1ECFE',

    // Extra fields from new file (kept as is, no logic change)
    input: '#F4F2FB',
    primaryHover: '#6D28D9',
    primaryLight: '#8B5CF6',
    primary50: '#F5F3FF',
    primary100: '#EDE9FE',
    primary200: '#DDD6FE',
    primaryGlow: 'rgba(124, 58, 237, 0.25)',
    accentHover: '#0891B2',
    accentLight: '#22D3EE',
    accent50: '#ECFEFF',
    heading: '#1E1B4B',
    body: '#4B5563',
    subtle: '#9CA3AF',
    line: '#E5E7EB',
    lineStrong: '#D1D5DB',
    sidebar: '#0F0F24',
    sidebarHover: '#1A1A38',
    sidebarActive: 'rgba(124, 58, 237, 0.15)',
    sidebarText: '#9CA3AF',
    sidebarHeading: '#F9FAFB',
    sidebarBorder: '#1E1E38',
    success: '#10B981',
    successSoft: 'rgba(16, 185, 129, 0.10)',
    danger: '#EF4444',
    dangerSoft: 'rgba(239, 68, 68, 0.10)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245, 158, 11, 0.10)',
    info: '#3B82F6',
    infoSoft: 'rgba(59, 130, 246, 0.10)',
    shadowCard: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)',
    shadowElevated: '0 4px 20px rgba(0, 0, 0, 0.06)',
    shadowFloat: '0 8px 30px rgba(0, 0, 0, 0.08)',
    shadowGlow: '0 0 20px rgba(124, 58, 237, 0.15)',
    shadowGlowLg: '0 0 40px rgba(124, 58, 237, 0.25)',
};

export const ROLE_COLORS = {
    super_admin: { color: '#8B5CF6', soft: '#F1ECFE', label: 'Super Admin' },
    business_user: { color: '#6366F1', soft: '#EEF0FF', label: 'Business User' },
    salesperson: { color: '#16A34A', soft: '#E7F8EE', label: 'Salesperson' },
};

export default C;