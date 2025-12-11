/**
 * EmailService - Envio de emails do sistema
 * Usa Ethereal em desenvolvimento (não precisa de email real)
 * e SMTP configurável em produção
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;
let etherealAccount = null;

/**
 * Cria o transporter do nodemailer
 * Em dev usa Ethereal, em prod usa as configs do .env
 */
async function getTransporter() {
    if (transporter) return transporter;

    const isProduction = process.env.NODE_ENV === 'production';
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER;

    if (isProduction && hasSmtpConfig) {
        // Produção - usa SMTP real
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        console.log('[Email] Configurado com SMTP');
    } else {
        // Dev - Ethereal é muito bom pra testar sem email real
        // Gera uma conta fake que dá pra ver os emails num link
        etherealAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: etherealAccount.user,
                pass: etherealAccount.pass
            }
        });
        console.log('[Email] Usando Ethereal para testes');
    }

    return transporter;
}

/**
 * Envia o código 2FA por email
 */
export async function send2FACode(email, code, userName = 'Usuário') {
    try {
        const mailer = await getTransporter();

        // Template do email - tentamos deixar bonito mas simples
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #0f0c29, #302b63); border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #fff; margin: 0; font-size: 28px;">Geek Deals</h1>
                <p style="color: rgba(255,255,255,0.6); margin-top: 8px;">Verificação de Segurança</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; text-align: center;">
                <p style="color: rgba(255,255,255,0.8); margin: 0 0 20px 0;">
                    Olá ${userName}, use o código abaixo para confirmar seu login:
                </p>
                
                <div style="background: rgba(102, 126, 234, 0.3); border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <span style="font-size: 36px; font-weight: bold; color: #fff; letter-spacing: 8px;">${code}</span>
                </div>
                
                <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 20px 0 0 0;">
                    Esse código expira em 10 minutos.<br>
                    Se você não solicitou isso, pode ignorar este email.
                </p>
            </div>
            
            <p style="color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; margin-top: 25px;">
                Geek Deals - Unifacisa 2025
            </p>
        </div>
        `;

        const info = await mailer.sendMail({
            from: '"Geek Deals" <noreply@geekdeals.com>',
            to: email,
            subject: `${code} - Código de Verificação`,
            html: htmlContent
        });

        // Em dev mostra o link pra ver o email no Ethereal
        if (etherealAccount) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('═══════════════════════════════════════════════════════');
            console.log('[Email 2FA]');
            console.log(`   Para: ${email}`);
            console.log(`   Código: ${code}`);
            console.log(`   Ver email: ${previewUrl}`);
            console.log('═══════════════════════════════════════════════════════');
        } else {
            console.log(`[Email] Código enviado para ${email}`);
        }

        return info;

    } catch (error) {
        console.error('[Email] Erro ao enviar:', error.message);
        throw error;
    }
}
