
import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) throw new Error("No Api key")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendAppointmentUpdate = async (sender: string, to: string, subject: string, text: string, logo?: string) => {
  try {
    const htmlContent = logo
      ? `<div style="direction: rtl; text-align: right;">
           <p>${text}</p>
           <img src="${logo}" alt="Logo" style="max-width: 200px; height: auto;" />
         </div>`
      : `<div style="direction: rtl; text-align: right;">
           <p>${text}</p>
         </div>`;
    const msg = {
      to: to,
      from: sender,
      subject: subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
  } catch (error: any) {
    console.error("Error in sendAppointmentUpdate:", error.response.body);
  }
};



