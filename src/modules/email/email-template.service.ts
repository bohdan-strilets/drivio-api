import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';

import { EmailTemplateContext } from './types/email.types';

@Injectable()
export class EmailTemplateService implements OnModuleInit {
  private readonly templatesDir: string;
  private layoutTemplate!: Handlebars.TemplateDelegate<EmailTemplateContext>;
  private layoutTextTemplate!: Handlebars.TemplateDelegate<EmailTemplateContext>;
  private readonly partialTemplates = new Map<
    string,
    Handlebars.TemplateDelegate<Record<string, unknown>>
  >();
  private readonly partialTextTemplates = new Map<
    string,
    Handlebars.TemplateDelegate<Record<string, unknown>>
  >();

  constructor() {
    this.templatesDir = this.resolveTemplatesDir();
  }

  private resolveTemplatesDir(): string {
    const candidates: string[] = [path.join(__dirname, 'templates')];
    const normalizedDir = __dirname.replace(/\\/g, '/');
    const isDistSrcLayout =
      normalizedDir.includes('/dist/') && normalizedDir.includes('/src/');
    if (isDistSrcLayout) {
      candidates.push(
        path.join(__dirname, '..', '..', '..', 'modules', 'email', 'templates'),
      );
      candidates.push(
        path.join(process.cwd(), 'dist', 'modules', 'email', 'templates'),
      );
    }
    for (const dir of candidates) {
      const htmlLayout = path.join(dir, 'html', 'layout.hbs');
      if (existsSync(htmlLayout)) {
        return dir;
      }
    }
    return candidates[0];
  }

  async onModuleInit(): Promise<void> {
    await this.loadTemplates();
  }

  private ensureInitialized(): void {
    if (!this.layoutTemplate) {
      throw new Error('Email templates not initialized');
    }
  }

  private async loadTemplates(): Promise<void> {
    const htmlDir = path.join(this.templatesDir, 'html');
    const textDir = path.join(this.templatesDir, 'text');

    const layoutPath = path.join(htmlDir, 'layout.hbs');
    const layoutSource = await fs.readFile(layoutPath, 'utf-8');
    this.layoutTemplate =
      Handlebars.compile<EmailTemplateContext>(layoutSource);

    const layoutTextPath = path.join(textDir, 'layout.hbs');
    const layoutTextSource = await fs.readFile(layoutTextPath, 'utf-8');
    this.layoutTextTemplate =
      Handlebars.compile<EmailTemplateContext>(layoutTextSource);

    const htmlPartialsDir = path.join(htmlDir, 'partials');
    const textPartialsDir = path.join(textDir, 'partials');

    const [htmlFiles, textFiles] = await Promise.all([
      fs.readdir(htmlPartialsDir),
      fs.readdir(textPartialsDir),
    ]);

    const loadPartials = async (
      dir: string,
      files: string[],
      map: Map<string, Handlebars.TemplateDelegate<Record<string, unknown>>>,
    ) => {
      const hbsFiles = files.filter((f) => f.endsWith('.hbs'));
      await Promise.all(
        hbsFiles.map(async (file) => {
          const name = file.replace(/\.hbs$/, '');
          const source = await fs.readFile(path.join(dir, file), 'utf-8');
          map.set(name, Handlebars.compile(source));
        }),
      );
    };

    await Promise.all([
      loadPartials(htmlPartialsDir, htmlFiles, this.partialTemplates),
      loadPartials(textPartialsDir, textFiles, this.partialTextTemplates),
    ]);
  }

  build(context: EmailTemplateContext): string {
    this.ensureInitialized();
    const defaults: EmailTemplateContext = {
      showHeader: true,
      showFooter: true,
      ...context,
    };
    return this.layoutTemplate(defaults);
  }

  buildFromPartial(
    partialName: string,
    partialData: Record<string, unknown>,
    layoutOptions: Pick<
      EmailTemplateContext,
      'title' | 'showHeader' | 'showFooter'
    >,
  ): string {
    this.ensureInitialized();
    const partialTemplate = this.partialTemplates.get(partialName);
    if (!partialTemplate) {
      throw new Error(`Email partial not found: ${partialName}`);
    }
    const body = partialTemplate(partialData);
    return this.build({
      ...layoutOptions,
      body,
    });
  }

  buildTextFromPartial(
    partialName: string,
    partialData: Record<string, unknown>,
    layoutOptions: Pick<EmailTemplateContext, 'title'>,
  ): string {
    this.ensureInitialized();
    const partialTemplate = this.partialTextTemplates.get(partialName);
    if (!partialTemplate) {
      throw new Error(`Email text partial not found: ${partialName}`);
    }
    const body = partialTemplate(partialData);
    return this.layoutTextTemplate({
      ...layoutOptions,
      body,
      showHeader: false,
      showFooter: false,
    });
  }
}
