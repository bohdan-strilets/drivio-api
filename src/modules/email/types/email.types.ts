export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailTemplateContext {
  title: string;
  body: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export type EmailTemplateName = string;
