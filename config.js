/*
 * Site settings — the only file you need to edit before deploying.
 */
window.ETMENI_CONFIG = {
  // Public URL where this page will live (used in share messages, social post, QR).
  campaignUrl: "https://landing.pinkoctober.tonystark-webmaster.com/",

  // Safety Map site.
  safetyMapUrl: "https://pinkoctober.tonystark-webmaster.com/",

  // Anonymous survey statistics (Supabase). The publishable key is meant to be
  // public: row-level security only lets visitors add a response, never read.
  surveyApiUrl: "https://otyyvuqpluycwwdayvzr.supabase.co/rest/v1/survey_responses",
  surveyApiKey: "sb_publishable_dXkFh1_MVEe6IiJCPVg4Aw_MkyA-a9r",

  // Contact form → email, via FormSubmit (free, no key, no backend).
  // First message sent from the live site triggers an "Activate Form" email to this
  // inbox — click it once. After activation FormSubmit also emails you a random
  // alias (e.g. "a1b2c3..."); paste it here instead to hide the address from scrapers.
  contactEmail: "bha.palestine@gmail.com",

  // Subject line of the emails the association receives.
  emailSubject: "رسالة جديدة من صفحة حملة اطمنتي عليها",

  // Shown if sending fails, so nobody is left without a way to reach you.
  fallbackEmail: "bha.palestine@gmail.com"
};
