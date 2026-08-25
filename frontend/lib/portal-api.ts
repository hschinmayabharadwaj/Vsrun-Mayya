import { apiFetch } from './api';

export interface PortalConfig {
  siteName: string;
  siteTagline: string;
  department: string;
  prototypeNotice: string;
  contact: {
    tollFree: string;
    email: string;
    hours: string;
  };
  searchCategories: { value: string; label: string }[];
}

export interface Notice {
  id: string;
  text: string;
  link: string;
  linkLabel: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface HelplineEntry {
  number: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface Policy {
  id: string;
  title: string;
  summary: string;
  updated: string;
  category: string;
}

export interface Faq {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export interface ContentSection {
  title: string;
  body: string;
}

export function getPortalConfig() {
  return apiFetch<PortalConfig>('/api/portal/config');
}

export function getNotices() {
  return apiFetch<Notice[]>('/api/portal/notices');
}

export function getDirectoryNav() {
  return apiFetch<NavItem[]>('/api/portal/directory-nav');
}

export function getFooterLinks() {
  return apiFetch<NavItem[]>('/api/portal/footer-links');
}

export function getHelplines() {
  return apiFetch<{ emergency: HelplineEntry[]; other: HelplineEntry[] }>('/api/portal/helplines');
}

export function getPolicies() {
  return apiFetch<Policy[]>('/api/portal/policies');
}

export function getFaqs() {
  return apiFetch<Faq[]>('/api/portal/faqs');
}

export function getPrivacySections() {
  return apiFetch<ContentSection[]>('/api/portal/privacy');
}

export function getTermsSections() {
  return apiFetch<ContentSection[]>('/api/portal/terms');
}

export function getGrievanceCategories() {
  return apiFetch<string[]>('/api/portal/grievance-categories');
}
